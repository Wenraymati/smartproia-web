import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("x-admin-secret");
  if (authHeader !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const redis = getRedis();
  await redis.set("accuracy:stats", JSON.stringify(body), { ex: 86400 * 7 });
  return NextResponse.json({ ok: true });
}
