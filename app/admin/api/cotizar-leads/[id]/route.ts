import { NextRequest, NextResponse } from "next/server";
import { isValidSession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getRedis } from "@/lib/redis";
import { logAudit } from "@/lib/audit";

const ALLOWED_STATUSES = ["nuevo", "contactado", "cerrado", "descartado"] as const;
type LeadStatus = (typeof ALLOWED_STATUSES)[number];

interface CotizarLeadStored {
  id: string;
  name?: string;
  phone?: string;
  industry: string;
  volume: string;
  features: string[];
  plan: string;
  setup: string;
  monthly: string;
  createdAt: string;
  status?: LeadStatus;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = req.cookies.get(SESSION_COOKIE_NAME)?.value ?? "";
  if (!isValidSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  let status: LeadStatus;
  try {
    const body = (await req.json()) as { status?: string };
    if (!body.status || !(ALLOWED_STATUSES as readonly string[]).includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }
    status = body.status as LeadStatus;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const redis = getRedis();
  const key = `cotizar:lead:${id}`;

  const existing = await redis.get<CotizarLeadStored>(key);
  if (!existing) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const updated: CotizarLeadStored = { ...existing, status };

  // Preserve the existing TTL — keepTtl: true prevents resetting the 30-day expiry
  await redis.set(key, JSON.stringify(updated), { keepTtl: true });

  await logAudit({
    action: "cotizar_lead.status_update",
    target: `cotizar:lead:${id}`,
    detail: `Status → ${status}`,
    ip: req.headers.get("x-forwarded-for") ?? "unknown",
    ts: Date.now(),
  });

  return NextResponse.json({ ok: true, id, status });
}
