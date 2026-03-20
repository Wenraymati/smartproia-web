import { NextRequest, NextResponse } from "next/server";
import { isValidSession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getRedis } from "@/lib/redis";
import { logAudit } from "@/lib/audit";
import type { SignalData } from "@/app/api/update-signal/route";

export async function POST(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE_NAME)?.value ?? "";
  if (!isValidSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const testSignal: SignalData = {
    ts: new Date().toISOString(),
    symbol: "BTC",
    price: 94200,
    change24h: 1.8,
    goNoGo: "GO",
    direction: "LONG",
    confluencia: "ALTA",
    score: 82,
    fearGreed: 68,
    fearGreedLabel: "Greed",
    news: [
      "[TEST] Bitcoin supera resistencia clave en $94k",
      "[TEST] Volumen institucional en máximos históricos",
      "[TEST] ETF BTC registra entradas netas positivas",
    ],
    reasoning:
      "[SEÑAL DE PRUEBA] Esta señal fue generada manualmente desde el panel de administración para verificar el pipeline. No operar con base en esta señal.",
  };

  try {
    const redis = getRedis();
    // Mirror exactly what update-signal/route.ts does: key "signal:latest" with 24h TTL
    await redis.set("signal:latest", JSON.stringify(testSignal), { ex: 86400 });
    await redis.lpush("signal:history", JSON.stringify(testSignal));
    await redis.ltrim("signal:history", 0, 29);

    await logAudit({
      action: "signal.test",
      target: "redis:signal:latest",
      detail: "Señal de prueba enviada",
      ip: req.headers.get("x-forwarded-for") ?? "unknown",
      ts: Date.now(),
    });

    return NextResponse.json({ ok: true, signal: testSignal });
  } catch (e) {
    console.error("Redis error:", e);
    return NextResponse.json({ error: "Storage error" }, { status: 500 });
  }
}
