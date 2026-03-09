import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Redis } from "@upstash/redis";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID!;

async function createTelegramInviteLink(): Promise<string> {
  const expireDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

  const res = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/createChatInviteLink`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL_ID,
        expire_date: expireDate,
        member_limit: 1,
        name: "SmartProIA acceso",
      }),
    }
  );

  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram API error: ${data.description}`);
  return data.result.invite_link as string;
}

async function sendWelcomeEmail(
  to: string,
  name: string,
  plan: string,
  inviteLink: string
) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY!;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;color:#ffffff;font-family:Inter,sans-serif;padding:40px 20px;max-width:600px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:32px;">
    <span style="font-size:28px;font-weight:700;">SmartPro<span style="color:#06b6d4;">IA</span></span>
  </div>

  <h1 style="font-size:24px;font-weight:700;margin-bottom:8px;">
    ¡Bienvenido al canal ${plan}! 🎉
  </h1>
  <p style="color:#a0a0a0;margin-bottom:32px;">
    Hola${name ? " " + name : ""}, tu pago fue confirmado. Ya puedes unirte al canal privado de Telegram.
  </p>

  <div style="background:#111;border:1px solid #1e2a3a;border-radius:12px;padding:24px;margin-bottom:32px;">
    <p style="font-size:14px;color:#a0a0a0;margin:0 0 12px 0;">Tu enlace de acceso (uso único, válido 7 días):</p>
    <a href="${inviteLink}"
       style="display:inline-block;background:#06b6d4;color:#000;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:16px;">
      Unirme al canal →
    </a>
    <p style="font-size:12px;color:#555;margin:16px 0 0 0;">
      Este enlace es de un solo uso. No lo compartas.
    </p>
  </div>

  <div style="border-top:1px solid #1e1e1e;padding-top:24px;font-size:12px;color:#555;">
    <p>Las señales llegan todos los días a las <strong style="color:#a0a0a0;">6:00 AM hora Chile</strong>.</p>
    <p>¿Preguntas? Escríbenos a <a href="mailto:hola@smartproia.com" style="color:#06b6d4;">hola@smartproia.com</a></p>
    <p style="margin-top:16px;">© 2026 SmartProIA · Las señales son análisis automatizados, no constituyen asesoría financiera.</p>
  </div>
</body>
</html>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "SmartProIA <hola@smartproia.com>",
      to: [to],
      subject: `¡Tu acceso al canal SmartProIA ${plan} está listo!`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
}

function detectPlan(amountTotal: number, currency: string): string {
  // CLP es zero-decimal en Stripe (14223 = $14.223 CLP)
  // USD es cents (1500 = $15.00 USD)
  if (currency === "clp") {
    return amountTotal <= 18000 ? "Básico" : "PRO";
  }
  // USD cents
  if (amountTotal <= 1800) return "Básico";
  return "PRO";
}

async function saveSubscriber(
  email: string,
  name: string,
  plan: string,
  subscriptionId: string,
  customerId: string,
  amountTotal: number,
  currency: string,
  inviteLink: string
) {
  const subscriber = {
    email,
    name,
    plan,
    subscriptionId,
    customerId,
    amount: amountTotal,
    currency: currency.toUpperCase(),
    inviteLink,
    joinedAt: new Date().toISOString(),
    status: "active",
  };
  await redis.set(`subscriber:${email}`, JSON.stringify(subscriber));
  await redis.sadd("subscribers", email);
  console.log(`💾 Saved subscriber: ${email}`);
}

async function processNewSubscriber(
  email: string,
  name: string,
  amountTotal: number,
  currency: string,
  eventType: string,
  subscriptionId: string,
  customerId: string
) {
  const plan = detectPlan(amountTotal, currency);
  console.log(`[${eventType}] Processing ${email}, plan: ${plan}, amount: ${amountTotal} ${currency.toUpperCase()}`);
  const inviteLink = await createTelegramInviteLink();
  await sendWelcomeEmail(email, name, plan, inviteLink);
  await saveSubscriber(email, name, plan, subscriptionId, customerId, amountTotal, currency, inviteLink);
  console.log(`✅ Done: ${email} → ${plan} → ${inviteLink}`);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    // Nuevo checkout completado (pago inicial)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email;
      const name = session.customer_details?.name ?? "";
      const amountTotal = session.amount_total ?? 0;
      const currency = session.currency ?? "usd";

      if (!email) {
        console.error("No customer email in session", session.id);
        return NextResponse.json({ error: "No email" }, { status: 400 });
      }

      await processNewSubscriber(email, name, amountTotal, currency, event.type, session.subscription as string ?? "", session.customer as string ?? "");
    }

    // Renovación mensual de suscripción
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      // Solo procesar renovaciones (no el primer pago, que ya maneja checkout.session.completed)
      if (invoice.billing_reason === "subscription_cycle") {
        const email = invoice.customer_email;
        const name = (invoice.customer_name as string) ?? "";
        const amountTotal = invoice.amount_paid ?? 0;
        const currency = invoice.currency ?? "usd";

        if (!email) {
          console.error("No customer email in invoice", invoice.id);
          return NextResponse.json({ error: "No email" }, { status: 400 });
        }

        await processNewSubscriber(email, name, amountTotal, currency, event.type, (invoice as any).subscription ?? "", invoice.customer as string ?? "");
      }
    }
  } catch (err) {
    console.error("Error processing webhook:", err);
    // Retornamos 500 para que Stripe reintente
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
