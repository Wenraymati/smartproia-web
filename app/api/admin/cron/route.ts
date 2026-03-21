import { NextRequest, NextResponse } from "next/server";
import { isValidSession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getRedis } from "@/lib/redis";

interface CronRunResult {
  ts: number;
  status: "ok" | "error";
  message: string;
}

export interface CronTask {
  id: string;
  name: string;
  description: string;
  schedule: string;
  scheduleHuman: string;
  enabled: boolean;
  lastRun: CronRunResult | null;
  endpoint: string;
}

const CRON_DEFINITIONS = [
  {
    id: "bot-health",
    name: "Health check bots",
    description: "Verifica estado bots y alerta si hay desconexión",
    schedule: "0 8 * * *",
    scheduleHuman: "Diario 8AM",
    endpoint: "/api/cron/bot-health",
  },
  {
    id: "daily-brief",
    name: "Resumen diario",
    description: "Envía resumen de leads y estado del stack a Telegram",
    schedule: "0 11 * * *",
    scheduleHuman: "Diario 11AM UTC (8AM Chile)",
    endpoint: "/api/cron/daily-brief",
  },
] as const;

type CronId = (typeof CRON_DEFINITIONS)[number]["id"];

function verifyAuth(req: NextRequest): boolean {
  const session = req.cookies.get(SESSION_COOKIE_NAME)?.value ?? "";
  return isValidSession(session);
}

export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();

  const tasks: CronTask[] = await Promise.all(
    CRON_DEFINITIONS.map(async (def) => {
      const [enabledRaw, lastRunRaw] = await Promise.all([
        redis.get<boolean>(`cron:${def.id}:enabled`).catch(() => null),
        redis.get<string>(`cron:${def.id}:lastRun`).catch(() => null),
      ]);

      const enabled = enabledRaw === false ? false : true;

      let lastRun: CronRunResult | null = null;
      if (lastRunRaw) {
        try {
          lastRun =
            typeof lastRunRaw === "string"
              ? (JSON.parse(lastRunRaw) as CronRunResult)
              : (lastRunRaw as CronRunResult);
        } catch {
          lastRun = null;
        }
      }

      return {
        id: def.id,
        name: def.name,
        description: def.description,
        schedule: def.schedule,
        scheduleHuman: def.scheduleHuman,
        enabled,
        lastRun,
        endpoint: def.endpoint,
      };
    }),
  );

  return NextResponse.json(tasks);
}

interface PostBody {
  id: string;
  action: "toggle" | "run";
}

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  if (!verifyAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, action } = body;

  const validIds: string[] = CRON_DEFINITIONS.map((d) => d.id);
  if (!validIds.includes(id)) {
    return NextResponse.json({ error: "Unknown cron id" }, { status: 400 });
  }

  if (action !== "toggle" && action !== "run") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const redis = getRedis();
  const cronId = id as CronId;

  if (action === "toggle") {
    const current = await redis
      .get<boolean>(`cron:${cronId}:enabled`)
      .catch(() => null);
    const currentEnabled = current === false ? false : true;
    const nextEnabled = !currentEnabled;
    await redis.set(`cron:${cronId}:enabled`, nextEnabled, { ex: 2592000 }); // 30 days
    return NextResponse.json({ ok: true, enabled: nextEnabled });
  }

  /* action === "run" — trigger the cron endpoint manually */
  const def = CRON_DEFINITIONS.find((d) => d.id === cronId);
  if (!def) {
    return NextResponse.json({ error: "Cron not found" }, { status: 404 });
  }

  const cronSecret = process.env.CRON_SECRET ?? "";
  const baseUrl = getBaseUrl();

  try {
    const cronRes = await fetch(`${baseUrl}${def.endpoint}`, {
      headers: {
        Authorization: `Bearer ${cronSecret}`,
      },
      signal: AbortSignal.timeout(30000),
    });

    const result = (await cronRes.json()) as Record<string, unknown>;
    return NextResponse.json({ ok: cronRes.ok, result });
  } catch (err) {
    console.error(`[admin/cron] Manual run failed for ${cronId}:`, err);
    return NextResponse.json(
      {
        error: "Cron run failed",
        detail: err instanceof Error ? err.message : "Unknown",
      },
      { status: 500 },
    );
  }
}
