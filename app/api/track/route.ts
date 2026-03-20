export const dynamic = "force-dynamic";

import { type NextRequest } from "next/server";
import { getRedis } from "@/lib/redis";

const ALLOWED_EVENTS = new Set([
  "cotizar:visit",
  "cotizar:step2",
  "cotizar:step3",
  "cotizar:complete",
  "cotizar:cta_wa",
  "cotizar:cta_mp",
  "landing:cta_demo",
  "landing:cta_cotizar",
]);

export async function POST(req: NextRequest) {
  let event: string;
  try {
    const body = (await req.json()) as { event?: unknown };
    event = typeof body.event === "string" ? body.event : "";
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!ALLOWED_EVENTS.has(event)) {
    return Response.json({ error: "Unknown event" }, { status: 400 });
  }

  const redis = getRedis();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  await Promise.all([
    redis.incr(`track:${event}`),
    redis.incr(`track:${event}:${today}`),
  ]);

  return Response.json({ ok: true });
}
