export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { getRedis } from "@/lib/redis";

const EVO_URL = process.env.EVOLUTION_API_URL ?? "https://api.smartproia.com";
const EVO_KEY = process.env.EVOLUTION_API_KEY ?? "";
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const TG_CHAT = process.env.TELEGRAM_ADMIN_CHAT_ID ?? process.env.TELEGRAM_CHANNEL_ID ?? "";
const CRON_SECRET = process.env.CRON_SECRET ?? "";

const INSTANCES = ["ruizruiz", "gymbot-ludus"] as const;
type Instance = (typeof INSTANCES)[number];

interface EvoConnectionStateResponse {
  instance?: { state?: string };
}

async function getInstanceState(name: Instance): Promise<string> {
  try {
    const res = await fetch(
      `${EVO_URL}/instance/connectionState/${name}`,
      {
        headers: { apikey: EVO_KEY },
        signal: AbortSignal.timeout(6000),
        cache: "no-store",
      }
    );
    if (!res.ok) return "unknown";
    const data = (await res.json()) as EvoConnectionStateResponse;
    return data?.instance?.state ?? "unknown";
  } catch {
    return "error";
  }
}

async function sendTelegramAlert(text: string): Promise<void> {
  if (!TG_TOKEN || !TG_CHAT) return;
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TG_CHAT,
        text,
        parse_mode: "HTML",
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error("[bot-health] Telegram alert failed:", err);
  }
}

export async function GET(req: NextRequest) {
  /* Verify this is a legitimate Vercel cron call */
  const authHeader = req.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();
  const results: Record<string, { state: string; prev: string | null; alerted: boolean }> = {};

  for (const name of INSTANCES) {
    const state = await getInstanceState(name);
    const redisKey = `bot:health:${name}`;
    const prev = await redis.get<string>(redisKey);

    /* Persist current state with 2h TTL */
    await redis.set(redisKey, state, { ex: 7200 });

    let alerted = false;

    /* Alert only on transition to non-open state */
    if (state !== "open" && prev !== state) {
      const label = name === "ruizruiz" ? "Ruiz & Ruiz" : "GymBot";
      const msg =
        `⚠️ <b>SmartProIA Alert</b>\n\n` +
        `Bot <b>${label}</b> está <b>${state}</b>.\n` +
        `Anterior: ${prev ?? "desconocido"}\n\n` +
        `Revisá <a href="https://smartproia.com/admin/infra">el panel de infra</a> para reconectar.`;
      await sendTelegramAlert(msg);
      alerted = true;
    }

    /* Recovery alert: back to open after being down */
    if (state === "open" && prev && prev !== "open") {
      const label = name === "ruizruiz" ? "Ruiz & Ruiz" : "GymBot";
      const msg =
        `✅ <b>SmartProIA — Bot recuperado</b>\n\n` +
        `<b>${label}</b> volvió a estar <b>conectado</b>.`;
      await sendTelegramAlert(msg);
      alerted = true;
    }

    results[name] = { state, prev, alerted };
  }

  return Response.json({
    ok: true,
    checkedAt: new Date().toISOString(),
    instances: results,
  });
}
