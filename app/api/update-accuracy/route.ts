import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { Redis } from "@upstash/redis";

function isValidAdminSecret(provided: string | null): boolean {
  const expected = process.env.ADMIN_SECRET;
  if (!expected || !provided) return false;
  try {
    const a = Buffer.from(provided, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch { return false; }
}

export const dynamic = "force-dynamic";

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("x-admin-secret");
  if (!isValidAdminSecret(authHeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const redis = getRedis();
  await redis.set("accuracy:stats", JSON.stringify(body), { ex: 86400 * 7 });
  return NextResponse.json({ ok: true });
}
