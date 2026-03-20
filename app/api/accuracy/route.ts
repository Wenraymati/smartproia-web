import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export const revalidate = 3600; // refresh hourly

export interface AccuracyStats {
  total: number;
  go: number;
  caution: number;
  nogo: number;
  successRate: number; // % of GO signals where market went up next day
  updatedAt: string;
}

export async function GET() {
  try {
    const redis = getRedis();
    const cached = await redis.get("accuracy:stats");
    if (cached) {
      return NextResponse.json(cached);
    }
  } catch { /* fallback */ }

  // Default placeholder until Clawd pushes real accuracy data
  const fallback: AccuracyStats = {
    total: 0,
    go: 0,
    caution: 0,
    nogo: 0,
    successRate: 0,
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json(fallback);
}
