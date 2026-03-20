import { NextRequest, NextResponse } from "next/server";
import { isValidSession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function PATCH(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE_NAME)?.value ?? "";
  if (!isValidSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bot, id, estado, notas } = (await req.json()) as {
    bot: "gymbot" | "ruizruiz";
    id: number;
    estado: string;
    notas?: string;
  };

  const botUrl =
    bot === "gymbot" ? process.env.GYMBOT_URL : process.env.RUIZRUIZ_URL;
  const botToken =
    bot === "gymbot"
      ? process.env.GYMBOT_DASHBOARD_TOKEN
      : process.env.RUIZRUIZ_DASHBOARD_TOKEN;

  if (!botUrl || !botToken) {
    return NextResponse.json({ error: "Bot not configured" }, { status: 503 });
  }

  const res = await fetch(`${botUrl}/api/leads/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-dashboard-token": botToken,
    },
    body: JSON.stringify({ estado, notas }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Bot error" }, { status: res.status });
  }

  await logAudit({
    action: "lead.status_update",
    target: `${bot}:lead:${id}`,
    detail: `Estado → ${estado}`,
    ip: req.headers.get("x-forwarded-for") ?? "unknown",
    ts: Date.now(),
  });

  return NextResponse.json({ ok: true });
}
