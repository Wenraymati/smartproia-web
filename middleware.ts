import { NextRequest, NextResponse } from "next/server";

async function sha256Hex(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function dateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function isValidSession(cookie: string): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !cookie) return false;
  const now = new Date();
  const yesterday = new Date(now.getTime() - 86400000);
  const [today, prev] = await Promise.all([
    sha256Hex(`${secret}:${dateString(now)}`),
    sha256Hex(`${secret}:${dateString(yesterday)}`),
  ]);
  return cookie === today || cookie === prev;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/api/")
  ) {
    return NextResponse.next();
  }
  const sessionCookie = req.cookies.get("admin_session")?.value ?? "";
  const valid = await isValidSession(sessionCookie);
  if (!valid) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
