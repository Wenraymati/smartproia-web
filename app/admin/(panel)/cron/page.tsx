export const dynamic = "force-dynamic";

import { Clock, Calendar, CheckCircle2, XCircle, Timer } from "lucide-react";
import { getRedis } from "@/lib/redis";
import { CronToggle, CronRunButton } from "./CronControls";

interface CronRunResult {
  ts: number;
  status: "ok" | "error";
  message: string;
}

interface CronTaskData {
  id: string;
  name: string;
  description: string;
  schedule: string;
  scheduleHuman: string;
  enabled: boolean;
  lastRun: CronRunResult | null;
  endpoint: string;
}

const CRON_DEFINITIONS: Omit<CronTaskData, "enabled" | "lastRun">[] = [
  {
    id: "bot-health",
    name: "Health check bots",
    description: "Verifica estado bots y alerta si hay desconexión",
    schedule: "0 8 * * *",
    scheduleHuman: "Diario 8AM UTC",
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
];

async function getCronData(): Promise<CronTaskData[]> {
  const redis = getRedis();

  return Promise.all(
    CRON_DEFINITIONS.map(async (def) => {
      const [enabledRaw, lastRunRaw] = await Promise.allSettled([
        redis.get<boolean>(`cron:${def.id}:enabled`),
        redis.get<string | CronRunResult>(`cron:${def.id}:lastRun`),
      ]);

      const enabledVal =
        enabledRaw.status === "fulfilled" ? enabledRaw.value : null;
      const enabled = enabledVal === false ? false : true;

      let lastRun: CronRunResult | null = null;
      if (lastRunRaw.status === "fulfilled" && lastRunRaw.value) {
        const raw = lastRunRaw.value;
        try {
          lastRun =
            typeof raw === "string"
              ? (JSON.parse(raw) as CronRunResult)
              : (raw as CronRunResult);
        } catch {
          lastRun = null;
        }
      }

      return { ...def, enabled, lastRun };
    }),
  );
}

function timeAgo(ts: number): string {
  const ms = Date.now() - ts;
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

export default async function CronPage() {
  const tasks = await getCronData();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Timer className="w-5 h-5 text-slate-500" />
          <h1 className="text-2xl font-bold text-white">Cron Jobs</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Gestión de tareas programadas — habilitar, deshabilitar y ejecutar manualmente
        </p>
      </div>

      {/* Cron Cards */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-white font-semibold text-sm">
                    {task.name}
                  </h2>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      task.enabled
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    }`}
                  >
                    {task.enabled ? "Activo" : "Desactivado"}
                  </span>
                </div>
                <p className="text-slate-500 text-xs leading-snug">
                  {task.description}
                </p>
              </div>
              {/* Toggle */}
              <CronToggle id={task.id} initialEnabled={task.enabled} />
            </div>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>{task.scheduleHuman}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 text-xs font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{task.schedule}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 text-xs font-mono">
                <span className="text-slate-700">→</span>
                <span>{task.endpoint}</span>
              </div>
            </div>

            {/* Last Run */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                {task.lastRun ? (
                  <>
                    {task.lastRun.status === "ok" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <div>
                      <p className="text-xs text-slate-300 leading-tight">
                        {task.lastRun.message}
                      </p>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        {timeAgo(task.lastRun.ts)} &mdash;{" "}
                        {new Date(task.lastRun.ts).toLocaleString("es-CL", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-600 italic">
                    Sin ejecuciones registradas
                  </p>
                )}
              </div>
              <CronRunButton id={task.id} />
            </div>
          </div>
        ))}
      </div>

      {/* Info note */}
      <p className="mt-6 text-xs text-slate-700 text-center">
        Los crons se ejecutan automáticamente via Vercel Cron. &quot;Correr ahora&quot; los dispara manualmente con el mismo token.
      </p>
    </div>
  );
}
