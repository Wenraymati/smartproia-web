import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export async function GET() {
  try {
    const redis = getRedis();
    const signal = await redis.get("signal:latest");
    if (signal) {
      return NextResponse.json(signal, {
        headers: { "Cache-Control": "no-store" },
      });
    }
  } catch {
    // Redis unavailable — return null so client shows placeholder
  }
  return NextResponse.json(null);
}
