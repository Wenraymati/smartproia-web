export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isValidSession, SESSION_COOKIE_NAME } from "@/lib/auth";

const EVO_URL =
  process.env.EVOLUTION_API_URL ?? "https://api.smartproia.com";
const EVO_KEY =
  process.env.EVOLUTION_API_KEY ?? "smartproia-evo-2026";

const VALID_INSTANCES = ["gymbot-ludus", "ruizruiz"] as const;
type ValidInstance = (typeof VALID_INSTANCES)[number];

interface QRResponse {
  base64?: string;
  qrcode?: { base64?: string };
  qr?: string;
  instance?: { state?: string };
  state?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ instance: string }> }
) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? "";
  if (!isValidSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { instance } = await params;
  if (!VALID_INSTANCES.includes(instance as ValidInstance)) {
    return NextResponse.json({ error: "Invalid instance" }, { status: 400 });
  }

  try {
    const res = await fetch(`${EVO_URL}/instance/connect/${instance}`, {
      headers: { apikey: EVO_KEY },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream ${res.status}` },
        { status: 502 }
      );
    }

    const data = (await res.json()) as QRResponse;
    const base64 =
      data.base64 ?? data.qrcode?.base64 ?? data.qr ?? null;
    const state = data.instance?.state ?? data.state ?? "unknown";

    return NextResponse.json({ base64, state });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
