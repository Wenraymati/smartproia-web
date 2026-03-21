export const dynamic = "force-dynamic";

import { getRedis } from "@/lib/redis";

interface FunnelStep {
  key: string;
  label: string;
  icon: string;
}

const LANDING_STEPS: FunnelStep[] = [
  { key: "landing:cta_demo",    label: "Click demo WA (hero)",  icon: "🟢" },
  { key: "landing:cta_cotizar", label: "Click cotizar (hero)",  icon: "🔵" },
];

const STEPS: FunnelStep[] = [
  { key: "cotizar:visit",    label: "Visitas a /cotizar",    icon: "👁️" },
  { key: "cotizar:step2",    label: "Completó rubro",        icon: "1️⃣" },
  { key: "cotizar:step3",    label: "Completó volumen",      icon: "2️⃣" },
  { key: "cotizar:complete", label: "Vio cotización",        icon: "✅" },
  { key: "cotizar:cta_wa",   label: "Click WA (cotizar)",   icon: "💬" },
  { key: "cotizar:cta_mp",   label: "Click pago (cotizar)", icon: "💳" },
];

async function getStepData(stepList: FunnelStep[]) {
  const redis = getRedis();
  const today = new Date().toISOString().slice(0, 10);
  const [totals, todays] = await Promise.all([
    Promise.all(stepList.map((s) => redis.get<number>(`track:${s.key}`))),
    Promise.all(stepList.map((s) => redis.get<number>(`track:${s.key}:${today}`))),
  ]);
  return stepList.map((step, i) => ({
    ...step,
    total: (totals[i] as number | null) ?? 0,
    today: (todays[i] as number | null) ?? 0,
  }));
}

async function getFunnelData() {
  const [landing, cotizar] = await Promise.all([
    getStepData(LANDING_STEPS),
    getStepData(STEPS),
  ]);
  return { landing, cotizar };
}

export default async function FunnelPage() {
  const { landing, cotizar } = await getFunnelData();
  const visits = cotizar[0].total;
  const totalDemoClicks = landing[0].total;
  const totalCotizarClicks = landing[1].total;
  const totalWaContacts = cotizar[4].total;
  const allContacts = totalDemoClicks + totalWaContacts;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Funnel de Conversión</h1>
        <p className="text-slate-500 text-sm mt-1">
          Desde landing hasta contacto real
        </p>
      </div>

      {/* Landing CTAs */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Landing page
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {landing.map((step) => (
            <div key={step.key} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <span className="text-2xl">{step.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{step.label}</p>
                <p className="text-slate-600 text-xs font-mono">{step.key}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-white font-bold text-xl">{step.total}</p>
                <p className="text-cyan-400 text-xs">hoy: {step.today}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cotizar funnel */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Embudo /cotizar
        </h2>
        <div className="space-y-3">
          {cotizar.map((step, i) => {
            const pct = visits > 0 ? Math.round((step.total / visits) * 100) : 0;
            const dropPct =
              i > 0 && cotizar[i - 1].total > 0
                ? 100 - Math.round((step.total / cotizar[i - 1].total) * 100)
                : null;

            return (
              <div key={step.key} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg shrink-0">{step.icon}</span>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm">{step.label}</p>
                      <p className="text-slate-600 text-xs font-mono">{step.key}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 shrink-0">
                    <div className="text-right">
                      <p className="text-white font-bold">{step.total}</p>
                      <p className="text-slate-600 text-xs">total</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-bold">{step.today}</p>
                      <p className="text-slate-600 text-xs">hoy</p>
                    </div>
                    <div className="text-right w-12">
                      <p className="text-green-400 font-bold">{pct}%</p>
                      <p className="text-slate-600 text-xs">conv.</p>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"
                    style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%` }}
                  />
                </div>
                {dropPct !== null && dropPct > 0 && (
                  <p className="text-xs text-red-400/60 mt-1.5">↓ {dropPct}% abandona aquí</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Summary */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Resumen global</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SummaryItem label="Clicks demo WA" value={totalDemoClicks} color="text-green-400" />
          <SummaryItem label="Clicks cotizar" value={totalCotizarClicks} color="text-blue-400" />
          <SummaryItem label="Visitas formulario" value={visits} color="text-white" />
          <SummaryItem
            label="Contactos totales"
            value={allContacts}
            color="text-yellow-400"
          />
        </div>
      </div>

      {visits === 0 && totalDemoClicks === 0 && (
        <div className="mt-6 bg-slate-800/30 border border-slate-700 rounded-xl p-5 text-center">
          <p className="text-slate-400 text-sm">
            Sin datos aún. Los eventos aparecerán a medida que lleguen visitas.
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
