export const dynamic = "force-dynamic";

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

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-admin-secret");
  if (!isValidAdminSecret(auth)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();
  const emails = await redis.smembers("subscribers");
  if (!emails || emails.length === 0) {
    return NextResponse.json({ total: 0, subscribers: [] });
  }

  const pipeline = redis.pipeline();
  for (const email of emails) {
    pipeline.get(`subscriber:${email}`);
  }
  const results = await pipeline.exec();

  const subscribers = results
    .map((r) => (typeof r === "string" ? JSON.parse(r) : r))
    .filter(Boolean)
    .sort((a: any, b: any) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());

  const byPlan = subscribers.reduce((acc: any, s: any) => {
    acc[s.plan] = (acc[s.plan] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    total: subscribers.length,
    byPlan,
    subscribers,
  });
}
