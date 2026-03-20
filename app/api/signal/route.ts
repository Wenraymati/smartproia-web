import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export const dynamic = "force-dynamic";

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
