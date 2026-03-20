import { createHash, timingSafeEqual } from "crypto";

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE = 86400; // 24h in seconds

export function isValidAdminSecret(provided: string | null | undefined): boolean {
  const expected = process.env.ADMIN_SECRET;
  if (!expected || !provided) return false;
  try {
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function dateString(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function generateSessionToken(secret: string, date: Date): string {
  return createHash("sha256")
    .update(`${secret}:${dateString(date)}`)
    .digest("hex");
}

export function isValidSession(cookie: string): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const now = new Date();
  const yesterday = new Date(now.getTime() - 86400000);
  const today = generateSessionToken(secret, now);
  const prev = generateSessionToken(secret, yesterday);
  return cookie === today || cookie === prev;
}
