export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { getRedis } from "@/lib/redis";
import { getGymBotHealth, getRuizRuizHealth } from "@/lib/bot-client";

const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const TG_CHAT =
  process.env.TELEGRAM_ADMIN_CHAT_ID ?? process.env.TELEGRAM_CHANNEL_ID ?? "";
const CRON_SECRET = process.env.CRON_SECRET ?? "";

interface CronRunResult {
  ts: number;
  status: "ok" | "error";
  message: string;
}

async function sendTelegramMessage(text: string): Promise<void> {
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
    console.error("[daily-brief] Telegram send failed:", err);
  }
}

async function getCotizarLeadsToday(
  redis: ReturnType<typeof getRedis>,
): Promise<number> {
  try {
    const todayKey = new Date().toISOString().slice(0, 10);
    const ids = await redis.lrange<string>("cotizar:leads", 0, 49);
    if (!ids.length) return 0;
    const items = await Promise.all(
      ids.map((id) =>
        redis.get<{ createdAt: string }>(`cotizar:lead:${id}`),
      ),
    );
    return items.filter((l) => l?.createdAt?.startsWith(todayKey)).length;
  } catch {
    return 0;
  }
}

async function getCotizarLeadsTotal(
  redis: ReturnType<typeof getRedis>,
): Promise<number> {
  try {
    return await redis.llen("cotizar:leads");
  } catch {
    return 0;
  }
}

export async function GET(req: NextRequest) {
  /* Verify this is a legitimate Vercel cron call */
  const authHeader = req.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();

  /* Check if this cron is enabled in Redis */
  const enabled = await redis.get<boolean>("cron:daily-brief:enabled");
  if (enabled === false) {
    return Response.json({ ok: true, message: "Cron disabled — skipped" });
  }

  const runResult: CronRunResult = {
    ts: Date.now(),
    status: "ok",
    message: "",
  };

  try {
    const [leadsToday, leadsTotal, ruizHealth, gymHealth] = await Promise.all([
      getCotizarLeadsToday(redis),
      getCotizarLeadsTotal(redis),
      getRuizRuizHealth().catch(() => null),
      getGymBotHealth().catch(() => null),
    ]);

    const ruizStatus = ruizHealth?.status === "ok" ? "Conectado" : "Revisar";
    const gymStatus = gymHealth?.status === "ok" ? "Conectado" : "Revisar";

    const fecha = new Date().toLocaleDateString("es-CL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const mensaje =
      `📊 <b>Resumen diario SmartProIA</b>\n\n` +
      `🎯 Leads cotizador hoy: ${leadsToday}\n` +
      `📦 Total leads: ${leadsTotal}\n` +
      `🤖 Ruiz &amp; Ruiz: ${ruizStatus}\n` +
      `🏋️ GymBot Ludus: ${gymStatus}\n\n` +
      `📅 ${fecha}`;

    await sendTelegramMessage(mensaje);

    runResult.message = `Resumen enviado — ${leadsToday} leads hoy, ${leadsTotal} total`;
  } catch (err) {
    runResult.status = "error";
    runResult.message =
      err instanceof Error ? err.message : "Unknown error";
    console.error("[daily-brief] Error:", err);
  }

  /* Persist run result */
  try {
    const pipeline = redis.pipeline();
    pipeline.set("cron:daily-brief:lastRun", JSON.stringify(runResult), {
      ex: 604800, // 7 days TTL
    });
    pipeline.lpush("cron:daily-brief:log", JSON.stringify(runResult));
    pipeline.ltrim("cron:daily-brief:log", 0, 9);
    await pipeline.exec();
  } catch (err) {
    console.error("[daily-brief] Failed to persist run result:", err);
  }

  return Response.json({ ok: runResult.status === "ok", message: runResult.message });
}
