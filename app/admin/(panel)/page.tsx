export const dynamic = "force-dynamic";

import {
  getGymBotHealth,
  getRuizRuizHealth,
  getGymBotMetrics,
  getRuizRuizStats,
  type BotHealthResponse,
  type GymBotMetrics,
  type RuizRuizStats,
} from "@/lib/bot-client";
import Link from "next/link";
import { getRedis } from "@/lib/redis";
import { StatusDot } from "../components/StatusDot";
import { TestSignalButton } from "../components/TestSignalButton";
import { WaReconnectBanner } from "../components/WaReconnectBanner";

function botStatus(health: BotHealthResponse | null): "online" | "offline" {
  return health?.status === "ok" ? "online" : "offline";
}

export default async function AdminDashboard() {
  const today = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const redis = getRedis();
  const todayKey = new Date().toISOString().slice(0, 10);

  const [gymHealth, ruizHealth, gymMetrics, ruizStats, landingVisits, demoClicks, cotizarVisits, waContacts, totalCotizarLeads] =
    await Promise.all([
      getGymBotHealth(),
      getRuizRuizHealth(),
      getGymBotMetrics(),
      getRuizRuizStats(),
      redis.get<number>(`track:landing:visit:${todayKey}`),
      redis.get<number>(`track:landing:cta_demo:${todayKey}`),
      redis.get<number>(`track:cotizar:visit:${todayKey}`),
      redis.get<number>(`track:cotizar:cta_wa:${todayKey}`),
      redis.llen("cotizar:leads"),
    ]);

  const gymOnline = botStatus(gymHealth);
  const ruizOnline = botStatus(ruizHealth);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1 capitalize">{today}</p>
      </div>

      {/* WhatsApp reconnect alert banner */}
      <WaReconnectBanner />

      {/* Funnel hoy */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Funnel hoy
          </h2>
          <Link href="/admin/funnel" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            Ver completo →
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Visitas", value: landingVisits ?? 0, color: "text-slate-300" },
            { label: "Demo WA", value: demoClicks ?? 0, color: "text-green-400" },
            { label: "Cotizaron", value: cotizarVisits ?? 0, color: "text-blue-400" },
            { label: "WA contactos", value: waContacts ?? 0, color: "text-yellow-400" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cotizar Leads */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Leads cotizador
          </h2>
          <Link href="/admin/cotizar-leads" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            Ver todos →
          </Link>
        </div>
        <Link href="/admin/cotizar-leads" className="block bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-green-400">{totalCotizarLeads ?? 0}</p>
              <p className="text-slate-500 text-sm mt-1">Prospectos que cotizaron</p>
            </div>
            <span className="text-slate-600 group-hover:text-slate-400 transition-colors text-2xl">🎯</span>
          </div>
        </Link>
      </section>

      {/* Acciones Rapidas section */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Acciones Rapidas
        </h2>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <p className="text-white text-sm font-medium mb-0.5">
                Pipeline de senales
              </p>
              <p className="text-slate-500 text-xs">
                Escribe una senal de prueba en Redis para verificar el pipeline
                LiveSignal
              </p>
            </div>
            <div className="sm:ml-auto">
              <TestSignalButton />
            </div>
          </div>
        </div>
      </section>

      {/* Bots section */}
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Bots WhatsApp
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* GymBot card */}
          <BotCard
            name="GymBot Ludus"
            status={gymOnline}
            metrics={gymMetrics}
          />

          {/* Ruiz & Ruiz card */}
          <RuizCard
            name="Ruiz & Ruiz"
            status={ruizOnline}
            stats={ruizStats}
          />
        </div>
      </section>
    </div>
  );
}

function BotCard({
  name,
  status,
  metrics,
}: {
  name: string;
  status: "online" | "offline";
  metrics: GymBotMetrics | null;
}) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <StatusDot status={status} />
          <div>
            <p className="text-white font-semibold text-sm">{name}</p>
            {metrics?.gym_name && (
              <p className="text-slate-500 text-xs">{metrics.gym_name}</p>
            )}
          </div>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
            status === "online"
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {status}
        </span>
      </div>

      {metrics ? (
        <div className="grid grid-cols-4 gap-3 mt-4">
          <MetricPill label="Hoy" value={metrics.today_leads} color="slate" />
          <MetricPill label="Critical" value={metrics.critical} color="red" />
          <MetricPill label="Hot" value={metrics.hot} color="red" />
          <MetricPill label="Warm" value={metrics.warm} color="yellow" />
          <MetricPill label="Cool" value={metrics.cool} color="cyan" />
          <MetricPill label="Cold" value={metrics.cold} color="slate" />
          <MetricPill
            label="Conv %"
            value={Math.round(metrics.conversion_rate * 100)}
            color="cyan"
          />
        </div>
      ) : (
        <p className="text-slate-600 text-xs mt-4">Metricas no disponibles</p>
      )}
    </div>
  );
}

function RuizCard({
  name,
  status,
  stats,
}: {
  name: string;
  status: "online" | "offline";
  stats: RuizRuizStats | null;
}) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <StatusDot status={status} />
          <div>
            <p className="text-white font-semibold text-sm">{name}</p>
            <p className="text-slate-500 text-xs">
              {status === "online" ? "Activo" : "Sin respuesta"}
            </p>
          </div>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
            status === "online"
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {status}
        </span>
      </div>

      {stats ? (
        <div className="flex flex-wrap gap-3 mt-4">
          <MetricPill label="Total" value={stats.total} color="slate" />
          <MetricPill label="Nuevo" value={stats.nuevo} color="cyan" />
          <MetricPill label="Contactado" value={stats.contactado} color="cyan" />
          <MetricPill label="Cerrado" value={stats.cerrado} color="cyan" />
          <MetricPill label="Urgentes" value={stats.urgentes} color="red" />
          <MetricPill label="Hoy" value={stats.hoy} color="yellow" />
        </div>
      ) : (
        <p className="text-slate-600 text-xs mt-4">Stats no disponibles</p>
      )}
    </div>
  );
}

const pillColors = {
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  slate: "bg-slate-800 text-slate-300 border-slate-700",
};

function MetricPill({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: keyof typeof pillColors;
}) {
  return (
    <div
      className={`flex-1 min-w-[60px] rounded-lg border px-3 py-2 text-center ${pillColors[color]}`}
    >
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs opacity-70">{label}</p>
    </div>
  );
}
