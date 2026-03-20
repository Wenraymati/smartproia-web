export const dynamic = "force-dynamic";

import { getRedis } from "@/lib/redis";

interface FunnelStep {
  key: string;
  label: string;
  icon: string;
}

const STEPS: FunnelStep[] = [
  { key: "cotizar:visit",    label: "Visitas a /cotizar",    icon: "👁️" },
  { key: "cotizar:step2",    label: "Completó rubro",        icon: "1️⃣" },
  { key: "cotizar:step3",    label: "Completó volumen",      icon: "2️⃣" },
  { key: "cotizar:complete", label: "Vio cotización",        icon: "✅" },
  { key: "cotizar:cta_wa",   label: "Click WA (cotizar)",   icon: "💬" },
  { key: "cotizar:cta_mp",   label: "Click pago (cotizar)", icon: "💳" },
];

async function getFunnelData() {
  const redis = getRedis();
  const today = new Date().toISOString().slice(0, 10);

  const [totals, todays] = await Promise.all([
    Promise.all(STEPS.map((s) => redis.get<number>(`track:${s.key}`) ?? 0)),
    Promise.all(STEPS.map((s) => redis.get<number>(`track:${s.key}:${today}`) ?? 0)),
  ]);

  return STEPS.map((step, i) => ({
    ...step,
    total: (totals[i] as number | null) ?? 0,
    today: (todays[i] as number | null) ?? 0,
  }));
}

export default async function FunnelPage() {
  const steps = await getFunnelData();
  const visits = steps[0].total;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Funnel de Cotización</h1>
        <p className="text-slate-500 text-sm mt-1">
          Conversión desde visita a /cotizar hasta contacto real
        </p>
      </div>

      {/* Funnel steps */}
      <div className="space-y-3 mb-10">
        {steps.map((step, i) => {
          const pct = visits > 0 ? Math.round((step.total / visits) * 100) : 0;
          const dropPct =
            i > 0 && steps[i - 1].total > 0
              ? 100 - Math.round((step.total / steps[i - 1].total) * 100)
              : null;

          return (
            <div
              key={step.key}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{step.icon}</span>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm">{step.label}</p>
                    <p className="text-slate-600 text-xs font-mono">{step.key}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0 text-right">
                  <div>
                    <p className="text-white font-bold text-lg">{step.total}</p>
                    <p className="text-slate-600 text-xs">total</p>
                  </div>
                  <div>
                    <p className="text-cyan-400 font-bold text-lg">{step.today}</p>
                    <p className="text-slate-600 text-xs">hoy</p>
                  </div>
                  <div className="w-16 text-right">
                    <p className="text-green-400 font-bold text-lg">{pct}%</p>
                    <p className="text-slate-600 text-xs">del total</p>
                  </div>
                </div>
              </div>

              {/* Bar */}
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full transition-all"
                  style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
                />
              </div>

              {/* Drop-off between steps */}
              {dropPct !== null && dropPct > 0 && (
                <p className="text-xs text-red-400/70 mt-2">
                  ↓ {dropPct}% abandona en este paso
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary card */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Resumen
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SummaryItem
            label="Visitas totales"
            value={visits}
            color="text-white"
          />
          <SummaryItem
            label="Llegaron al resultado"
            value={steps[3].total}
            color="text-green-400"
          />
          <SummaryItem
            label="Clicks en WA"
            value={steps[4].total}
            color="text-yellow-400"
          />
          <SummaryItem
            label="Conv. visita→WA"
            value={visits > 0 ? `${Math.round((steps[4].total / visits) * 100)}%` : "—"}
            color="text-cyan-400"
          />
        </div>
      </div>

      {visits === 0 && (
        <div className="mt-6 bg-slate-800/30 border border-slate-700 rounded-xl p-5 text-center">
          <p className="text-slate-400 text-sm">
            Sin datos aún. Los eventos empezarán a aparecer cuando lleguen visitas a{" "}
            <span className="text-white font-mono">/cotizar</span>.
          </p>
        </div>
      )}
    </div>
  );
}

function SummaryItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-slate-500 text-xs mt-1">{label}</p>
    </div>
  );
}
