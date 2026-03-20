export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { generateSessionToken, SESSION_MAX_AGE } from "@/lib/auth";

const TOKEN_MAP: Record<string, string | undefined> = {
  ludus: process.env.LUDUS_CLIENT_TOKEN,
  ruizruiz: process.env.RUIZRUIZ_CLIENT_TOKEN,
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ empresa: string }> }
) {
  const { empresa } = await params;
  const envToken = TOKEN_MAP[empresa]?.trim();

  if (!envToken) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const provided = formData.get("token")?.toString() ?? "";

  if (provided !== envToken) {
    return NextResponse.redirect(
      new URL(`/cliente/${empresa}?error=1`, request.url)
    );
  }

  const now = new Date();
  const sessionValue = generateSessionToken(envToken, now);

  const response = NextResponse.redirect(
    new URL(`/cliente/${empresa}`, request.url)
  );
  response.cookies.set(`client_session_${empresa}`, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: `/cliente/${empresa}`,
  });
  return response;
}
