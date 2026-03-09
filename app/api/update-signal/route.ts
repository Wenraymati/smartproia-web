import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export interface SignalData {
  ts: string;           // ISO timestamp
  symbol: string;       // BTC
  price: number;
  change24h: number;
  goNoGo: string;       // GO | CAUTION | NO-GO
  direction: string;    // LONG | SHORT | NEUTRAL
  confluencia: string;  // ALTA | MEDIA | BAJA
  score: number;
  fearGreed: number;
  fearGreedLabel: string;
  news: string[];       // top 3 headlines
  reasoning?: string;   // optional AI explanation
}

export async function POST(req: NextRequest) {
  // Auth via ADMIN_SECRET header or query param
  const authHeader = req.headers.get("x-admin-secret");
  const expected = process.env.ADMIN_SECRET;
  if (!expected || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SignalData;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate required fields
  if (!body.symbol || !body.goNoGo || !body.price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  body.ts = new Date().toISOString();

  try {
    const redis = getRedis();
    // Store latest signal (24h TTL as safety net)
    await redis.set("signal:latest", JSON.stringify(body), { ex: 86400 });
    // Also keep history (last 30)
    await redis.lpush("signal:history", JSON.stringify(body));
    await redis.ltrim("signal:history", 0, 29);
    return NextResponse.json({ ok: true, ts: body.ts });
  } catch (e) {
    console.error("Redis error:", e);
    return NextResponse.json({ error: "Storage error" }, { status: 500 });
  }
}
