export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
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
const MP_TEST_ACCESS_TOKEN = process.env.MERCADOPAGO_TEST_ACCESS_TOKEN;
const MP_WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET;
const MP_TEST_WEBHOOK_SECRET = process.env.MERCADOPAGO_TEST_WEBHOOK_SECRET;

function checkSignature(req: NextRequest): boolean {
  const xSignature = req.headers.get("x-signature");
  if (!xSignature || (!MP_WEBHOOK_SECRET && !MP_TEST_WEBHOOK_SECRET)) return true;
  const xRequestId = req.headers.get("x-request-id");
  const dataId = new URL(req.url).searchParams.get("data.id");
  const parts = Object.fromEntries(xSignature.split(",").map(p => {
    const idx = p.indexOf("=");
    return [p.slice(0, idx), p.slice(idx + 1)];
  }));
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;
  const manifest = `id:${dataId ?? ""};request-id:${xRequestId ?? ""};ts:${ts};`;
  const prodOk = MP_WEBHOOK_SECRET
    ? createHmac("sha256", MP_WEBHOOK_SECRET).update(manifest).digest("hex") === v1
    : false;
  const testOk = MP_TEST_WEBHOOK_SECRET
    ? createHmac("sha256", MP_TEST_WEBHOOK_SECRET).update(manifest).digest("hex") === v1
    : false;
  if (!prodOk && !testOk) {
    console.error("[webhook] Invalid webhook signature - rejecting request");
    return false;
  }
  return true;
}

async function getMPPayment(paymentId: string) {
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
  });
  if (res.ok) return res.json();
  if (MP_TEST_ACCESS_TOKEN) {
    const testRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_TEST_ACCESS_TOKEN}` },
    });
    if (testRes.ok) return testRes.json();
  }
  return null;
}

async function getMPSubscription(preapprovalId: string) {
  const res = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
    headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
  });
  if (!res.ok) return null;
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

interface CartaJob {
  email: string;
  resultado: string;
  ocr: string;
  timestamp: string;
}

async function sendCartaSiiEmail(to: string, resultado: string) {
  const resultadoHtml = resultado
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "</p><p style=\"margin:0 0 16px 0;\">")
    .replace(/\n/g, "<br>");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;color:#ffffff;font-family:Inter,sans-serif;padding:40px 20px;max-width:600px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:32px;">
    <span style="font-size:28px;font-weight:700;">SmartPro<span style="color:#06b6d4;">IA</span></span>
  </div>
  <h1 style="font-size:22px;font-weight:700;margin-bottom:8px;">Tu Carta del SII Decodificada</h1>
  <p style="color:#a0a0a0;margin-bottom:32px;">
    Aquí está el análisis completo de tu documento tributario.
  </p>
  <div style="background:#111;border:1px solid #1e2a3a;border-radius:12px;padding:24px;margin-bottom:32px;">
    <p style="margin:0 0 16px 0;">${resultadoHtml}</p>
  </div>
  <div style="background:#0f1f2e;border:1px solid #1e3a4a;border-radius:8px;padding:16px;margin-bottom:32px;">
    <p style="font-size:13px;color:#a0a0a0;margin:0;">
      <strong style="color:#06b6d4;">Tip:</strong> Guarda este email para futuras referencias.
      Si tienes otra carta del SII, puedes analizarla en
      <a href="https://smartproia.com/carta-sii" style="color:#06b6d4;">smartproia.com/carta-sii</a>
    </p>
  </div>
  <div style="border-top:1px solid #1e1e1e;padding-top:24px;font-size:12px;color:#555;">
    <p>¿Preguntas? Escríbenos a <a href="mailto:hola@smartproia.com" style="color:#06b6d4;">hola@smartproia.com</a></p>
    <p style="margin-top:16px;">© 2026 SmartProIA · Este análisis es orientativo, no constituye asesoría legal ni tributaria.</p>
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
      subject: "Tu análisis de carta SII está listo — SmartProIA",
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend error (carta-sii): ${await res.text()}`);
}

async function processCartaSiiPayment(paymentId: string, externalRef: string) {
  const redis = getRedis();

  // Deduplication
  const dedupKey = `processed:carta:${paymentId}`;
  const already = await redis.get(dedupKey);
  if (already) {
    console.log(`[carta-sii] Already processed payment ${paymentId}, skipping`);
    return;
  }
  await redis.set(dedupKey, "1", { ex: 60 * 60 * 24 * 30 });

  // Extract jobId from external_reference (format: "carta:{jobId}")
  const jobId = externalRef.slice("carta:".length);
  const jobRaw = await redis.get(`carta:${jobId}`);

  if (!jobRaw) {
    console.error(`[carta-sii] Job not found in Redis: carta:${jobId}`);
    return;
  }

  const job = (typeof jobRaw === "string" ? JSON.parse(jobRaw) : jobRaw) as CartaJob;

  // Send email with full resultado
  await sendCartaSiiEmail(job.email, job.resultado);

  // Mark as paid (24h TTL — result page validity)
  await redis.set(`carta:${jobId}:paid`, "true", { ex: 86400 });

  console.log(`[carta-sii] Delivered result for job ${jobId} to ${job.email}`);
}

async function processNewSubscriber(
  email: string, name: string, amount: number,
  currency: string, eventType: string, subscriptionId: string
) {
  const redis = getRedis();

  // Deduplication: skip if already processed
  const key = `processed:${subscriptionId}`;
  const already = await redis.get(key);
  if (already) {
    console.log(`[${eventType}] Already processed ${subscriptionId}, skipping`);
    return;
  }
  await redis.set(key, "1", { ex: 60 * 60 * 24 * 30 }); // 30 days

  const plan = detectPlan(amount, currency);
  console.log(`[${eventType}] Processing ${email}, plan: ${plan}, amount: ${amount} ${currency}`);
  const inviteLink = await createTelegramInviteLink();
  await sendWelcomeEmail(email, name, plan, inviteLink);
  await saveSubscriber(email, name, plan, subscriptionId, amount, currency, inviteLink);
  await notifyAdmin(plan, email, amount, currency);
  console.log(`✅ Done: ${email} → ${plan}`);
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  if (!checkSignature(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: { type?: string; action?: string; data?: { id?: string } };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { type, data } = body;

  try {
    // Pago único (Checkout Pro)
    if (type === "payment" && data?.id) {
      const payment = await getMPPayment(data.id);

      if (!payment || payment.status !== "approved") {
        return NextResponse.json({ received: true, skipped: payment?.status ?? "not_found" });
      }

      const externalRef: string = payment.external_reference ?? "";

      // Carta SII one-time payment
      if (externalRef.startsWith("carta:")) {
        await processCartaSiiPayment(String(data.id), externalRef);
        return NextResponse.json({ received: true });
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

      if (!sub || sub.status !== "authorized") {
        return NextResponse.json({ received: true, skipped: sub?.status ?? "not_found" });
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
