export const dynamic = "force-dynamic";

import { getRedis } from "@/lib/redis";
import { getGymBotMetrics, getRuizRuizStats } from "@/lib/bot-client";

export interface PublicStats {
  totalLeads: number;
  botsActive: number;
  msgsAutomated: number;
  cachedAt: string;
}

const CACHE_KEY = "stats:public";
const CACHE_TTL = 1800; // 30 min

export async function GET() {
  const redis = getRedis();

  /* Try cache first */
  const cached = await redis.get<PublicStats>(CACHE_KEY);
  if (cached) {
    return Response.json(cached, {
      headers: { "Cache-Control": "public, s-maxage=1800" },
    });
  }

  /* Fetch from bots in parallel */
  const [gymMetrics, ruizStats] = await Promise.all([
    getGymBotMetrics(),
    getRuizRuizStats(),
  ]);

  const gymLeads =
    (gymMetrics?.critical ?? 0) +
    (gymMetrics?.hot ?? 0) +
    (gymMetrics?.warm ?? 0) +
    (gymMetrics?.cool ?? 0) +
    (gymMetrics?.cold ?? 0);

  const ruizLeads = ruizStats?.total ?? 0;
  const totalLeads = gymLeads + ruizLeads;

  /* Estimate messages automated: avg 12 msgs per conversation */
  const msgsAutomated = Math.max(totalLeads * 12, 500);

  const stats: PublicStats = {
    totalLeads,
    botsActive: 2,
    msgsAutomated,
    cachedAt: new Date().toISOString(),
  };

  await redis.set(CACHE_KEY, stats, { ex: CACHE_TTL });

  return Response.json(stats, {
    headers: { "Cache-Control": "public, s-maxage=1800" },
  });
}
