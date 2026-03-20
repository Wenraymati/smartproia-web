export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSecret } from "@/lib/auth";
import { getRedis } from "@/lib/redis";

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
