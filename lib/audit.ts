import { getRedis } from "./redis";

export interface AuditEntry {
  action: string; // e.g. "lead.status_update", "signal.test", "lead.view"
  target: string; // e.g. "gymbot:lead:42", "ruizruiz:lead:7"
  detail: string; // human-readable description
  ip: string;
  ts: number; // Unix timestamp ms
}

const AUDIT_KEY = "admin:audit:log";
const MAX_ENTRIES = 10_000;

export async function logAudit(entry: AuditEntry): Promise<void> {
  const redis = getRedis();
  await redis.lpush(AUDIT_KEY, JSON.stringify(entry));
  await redis.ltrim(AUDIT_KEY, 0, MAX_ENTRIES - 1);
}

export async function getAuditLog(
  limit = 100,
  offset = 0,
): Promise<AuditEntry[]> {
  const redis = getRedis();
  const items = await redis.lrange(AUDIT_KEY, offset, offset + limit - 1);
  return (items as string[])
    .map((item) => {
      try {
        return JSON.parse(item) as AuditEntry;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as AuditEntry[];
}
