export const dynamic = "force-dynamic";

import type { NextRequest } from "next/server";
import { isValidSession, SESSION_COOKIE_NAME } from "@/lib/auth";

const EVO_URL =
  process.env.EVOLUTION_API_URL ?? "https://api.smartproia.com";
const EVO_KEY =
  process.env.EVOLUTION_API_KEY ?? "smartproia-evo-2026";

const INSTANCES = ["gymbot-ludus", "ruizruiz"];

interface InstanceState {
  instance: string;
  state: string; // "open" | "connecting" | "close" | "refused"
}

interface EvoConnectionStateResponse {
  instance?: {
    state?: string;
  };
}

export async function GET(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? "";
  if (!isValidSession(session)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: InstanceState[] = await Promise.all(
    INSTANCES.map(async (name): Promise<InstanceState> => {
      try {
        const res = await fetch(
          `${EVO_URL}/instance/connectionState/${name}`,
          {
            headers: { apikey: EVO_KEY },
            signal: AbortSignal.timeout(5000),
            cache: "no-store",
          },
        );
        if (!res.ok) return { instance: name, state: "unknown" };
        const data = (await res.json()) as EvoConnectionStateResponse;
        return {
          instance: name,
          state: data?.instance?.state ?? "unknown",
        };
      } catch {
        return { instance: name, state: "error" };
      }
    }),
  );

  return Response.json(results);
}
