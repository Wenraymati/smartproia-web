import { NextRequest, NextResponse } from "next/server";
import { isValidAdminSecret } from "@/lib/auth";
import { getRedis } from "@/lib/redis";

export const dynamic = "force-dynamic";

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
