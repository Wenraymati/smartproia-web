export const dynamic = "force-dynamic";

import { type NextRequest } from "next/server";
import { getRedis } from "@/lib/redis";

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const TG_CHAT = process.env.TELEGRAM_ADMIN_CHAT_ID ?? process.env.TELEGRAM_CHANNEL_ID ?? "";
const RESEND_KEY = process.env.RESEND_API_KEY ?? "";

interface CotizarLeadBody {
  name?: string;
  phone?: string;
  industry: string;
  volume: string;
  features: string[];
  plan: string;
  setup: string;
  monthly: string;
}

async function sendTelegram(text: string) {
  if (!TG_TOKEN || !TG_CHAT) return;
  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: "HTML" }),
    signal: AbortSignal.timeout(5000),
  }).catch(() => {});
}

async function sendEmail(lead: CotizarLeadBody, id: string) {
  if (!RESEND_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_KEY}`,
    },
    body: JSON.stringify({
      from: "SmartProIA <hola@smartproia.com>",
      to: ["hola@smartproia.com"],
      subject: `🤖 ${lead.name ? lead.name + ' cotizó' : 'Nuevo prospecto cotizó'} — Plan ${lead.plan}`,
      html: `
        <h2>Nuevo prospecto completó el cotizador</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td><strong>ID</strong></td><td>${id}</td></tr>
          ${lead.name ? `<tr><td><strong>Nombre</strong></td><td>${lead.name}</td></tr>` : ''}
          ${lead.phone ? `<tr><td><strong>Teléfono/WA</strong></td><td><a href="https://wa.me/${lead.phone.replace(/\D/g, '')}">${lead.phone}</a></td></tr>` : ''}
          <tr><td><strong>Rubro</strong></td><td>${lead.industry}</td></tr>
          <tr><td><strong>Volumen</strong></td><td>${lead.volume}</td></tr>
          <tr><td><strong>Funciones</strong></td><td>${lead.features.join(", ") || "—"}</td></tr>
          <tr><td><strong>Plan recomendado</strong></td><td>${lead.plan} — ${lead.setup} setup + ${lead.monthly}/mes</td></tr>
        </table>
        <p>Respondé rápido — está activo ahora en <a href="https://smartproia.com/cotizar">smartproia.com/cotizar</a></p>
      `,
    }),
    signal: AbortSignal.timeout(8000),
  }).catch(() => {});
}

export async function POST(req: NextRequest) {
  let body: CotizarLeadBody;
  try {
    body = (await req.json()) as CotizarLeadBody;
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const { industry, volume, features, plan, setup, monthly } = body;
  if (!industry || !volume || !plan) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const redis = getRedis();

  /* Save to Redis with 30-day TTL */
  const leadData = { ...body, id, createdAt: new Date().toISOString() };
  await Promise.all([
    redis.set(`cotizar:lead:${id}`, JSON.stringify(leadData), { ex: 86400 * 30 }),
    redis.lpush("cotizar:leads", id),
  ]);

  /* Notify in parallel — fire-and-forget */
  const tgMsg =
    `🎯 <b>Nuevo prospecto en cotizador</b>\n\n` +
    (body.name ? `<b>Nombre:</b> ${body.name}\n` : '') +
    (body.phone ? `<b>Teléfono:</b> ${body.phone}\n` : '') +
    `<b>Rubro:</b> ${industry}\n` +
    `<b>Volumen:</b> ${volume}\n` +
    `<b>Funciones:</b> ${features.join(", ") || "—"}\n` +
    `<b>Plan:</b> ${plan} (${setup} + ${monthly}/mes)\n\n` +
    (body.phone
      ? `Contactar: <a href="https://wa.me/${body.phone.replace(/\D/g, '')}">WhatsApp</a>`
      : `Respondé rápido en <a href="https://wa.me/56962326907">WhatsApp</a>`);

  await Promise.all([
    sendTelegram(tgMsg),
    sendEmail(body, id),
  ]);

  return Response.json({ ok: true, id });
}
