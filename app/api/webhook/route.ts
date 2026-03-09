export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID!;
const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN!;

async function getMPPayment(paymentId: string) {
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`MP API error: ${res.status}`);
  return res.json();
}

async function getMPSubscription(preapprovalId: string) {
  const res = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
    headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`MP API error: ${res.status}`);
  return res.json();
}

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

async function sendWelcomeEmail(to: string, name: string, plan: string, inviteLink: string) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;color:#ffffff;font-family:Inter,sans-serif;padding:40px 20px;max-width:600px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:32px;">
    <span style="font-size:28px;font-weight:700;">SmartPro<span style="color:#06b6d4;">IA</span></span>
  </div>
  <h1 style="font-size:24px;font-weight:700;margin-bottom:8px;">¡Bienvenido al canal ${plan}! 🎉</h1>
  <p style="color:#a0a0a0;margin-bottom:32px;">
    Hola${name ? " " + name : ""}, tu pago fue confirmado. Ya puedes unirte al canal privado de Telegram.
  </p>
  <div style="background:#111;border:1px solid #1e2a3a;border-radius:12px;padding:24px;margin-bottom:32px;">
    <p style="font-size:14px;color:#a0a0a0;margin:0 0 12px 0;">Tu enlace de acceso (uso único, válido 7 días):</p>
    <a href="${inviteLink}"
       style="display:inline-block;background:#06b6d4;color:#000;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:16px;">
      Unirme al canal →
    </a>
    <p style="font-size:12px;color:#555;margin:16px 0 0 0;">Este enlace es de un solo uso. No lo compartas.</p>
  </div>
  <div style="border-top:1px solid #1e1e1e;padding-top:24px;font-size:12px;color:#555;">
    <p>Las señales llegan todos los días a las <strong style="color:#a0a0a0;">6:00 AM hora Chile</strong>.</p>
    <p>¿Preguntas? Escríbenos a <a href="mailto:hola@smartproia.com" style="color:#06b6d4;">hola@smartproia.com</a></p>
    <p style="margin-top:16px;">© 2026 SmartProIA · Las señales son análisis automatizados, no constituyen asesoría financiera.</p>
  </div>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "SmartProIA <hola@smartproia.com>",
      to: [to],
      subject: `¡Tu acceso al canal SmartProIA ${plan} está listo!`,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend error: ${await res.text()}`);
}

function detectPlan(amount: number, currency: string): string {
  if (currency === "CLP") return amount <= 18000 ? "Básico" : "PRO";
  return amount <= 18 ? "Básico" : "PRO";
}

async function saveSubscriber(
  email: string, name: string, plan: string,
  subscriptionId: string, amount: number, currency: string, inviteLink: string
) {
  const redis = getRedis();
  const subscriber = {
    email, name, plan, subscriptionId,
    amount, currency: currency.toUpperCase(),
    inviteLink, joinedAt: new Date().toISOString(), status: "active",
  };
  await redis.set(`subscriber:${email}`, JSON.stringify(subscriber));
  await redis.sadd("subscribers", email);
  console.log(`💾 Saved subscriber: ${email}`);
}

async function notifyAdmin(plan: string, email: string, amount: number, currency: string) {
  try {
    const adminChatId = "1641358693";
    const msg = `🎉 *Nuevo suscriptor SmartProIA*\n\n📧 ${email}\n📦 Plan: *${plan}*\n💰 ${amount} ${currency.toUpperCase()}\n⏰ ${new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" })}`;
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: adminChatId, text: msg, parse_mode: "Markdown" }),
    });
  } catch (e) {
    console.error("Admin notification failed:", e);
  }
}

async function processNewSubscriber(
  email: string, name: string, amount: number,
  currency: string, eventType: string, subscriptionId: string
) {
  const plan = detectPlan(amount, currency);
  console.log(`[${eventType}] Processing ${email}, plan: ${plan}, amount: ${amount} ${currency}`);
  const inviteLink = await createTelegramInviteLink();
  await sendWelcomeEmail(email, name, plan, inviteLink);
  await saveSubscriber(email, name, plan, subscriptionId, amount, currency, inviteLink);
  await notifyAdmin(plan, email, amount, currency);
  console.log(`✅ Done: ${email} → ${plan} → ${inviteLink}`);
}

export async function POST(req: NextRequest) {
  let body: { type?: string; action?: string; data?: { id?: string } };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { type, data } = body;

  try {
    // Pago único (Checkout Pro)
    if (type === "payment" && data?.id) {
      const payment = await getMPPayment(data.id);

      if (payment.status !== "approved") {
        return NextResponse.json({ received: true, skipped: payment.status });
      }

      const email = payment.payer?.email;
      if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

      const name = [payment.payer?.first_name, payment.payer?.last_name]
        .filter(Boolean).join(" ");
      const amount = payment.transaction_amount ?? 0;
      const currency = payment.currency_id ?? "CLP";

      await processNewSubscriber(email, name, amount, currency, type, String(data.id));
    }

    // Suscripción mensual (preapproval)
    if (type === "subscription_preapproval" && data?.id) {
      const sub = await getMPSubscription(data.id);

      if (sub.status !== "authorized") {
        return NextResponse.json({ received: true, skipped: sub.status });
      }

      const email = sub.payer_email;
      if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

      const amount = sub.auto_recurring?.transaction_amount ?? 0;
      const currency = sub.auto_recurring?.currency_id ?? "CLP";

      await processNewSubscriber(email, "", amount, currency, type, String(data.id));
    }
  } catch (err) {
    console.error("Error processing webhook:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
