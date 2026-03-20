import { NextRequest, NextResponse } from "next/server";
import {
  isValidAdminSecret,
  generateSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { secret } = await req.json();
  if (!isValidAdminSecret(secret)) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  const token = generateSessionToken(secret, new Date());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
