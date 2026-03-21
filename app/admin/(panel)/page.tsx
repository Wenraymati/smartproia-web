export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  BarChart2,
  Target,
  MessageSquare,
  QrCode,
  KeyRound,
  Server,
  ClipboardList,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react";
import { getRedis } from "@/lib/redis";
import { getAuditLog, type AuditEntry } from "@/lib/audit";
import {
  getGymBotHealth,
  getRuizRuizHealth,
  type BotHealthResponse,
} from "@/lib/bot-client";
import { StatusDot } from "../components/StatusDot";
import { TestSignalButton } from "../components/TestSignalButton";
import { WaReconnectBanner } from "../components/WaReconnectBanner";

function botStatus(health: BotHealthResponse | null): "online" | "offline" {
  return health?.status === "ok" ? "online" : "offline";
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

function actionColor(action: string): string {
  if (action.startsWith("lead.")) return "text-cyan-400";
  if (action.startsWith("signal.")) return "text-amber-400";
  if (action.startsWith("wa.")) return "text-green-400";
  return "text-slate-400";
}

async function getDashboardData() {
  const redis = getRedis();
  const todayKey = new Date().toISOString().slice(0, 10);

  const safeGet = async <T,>(key: string): Promise<T | null> => {
    try {
      return await redis.get<T>(key);
    } catch {
      return null;
    }
  };

  const safeLlen = async (key: string): Promise<number> => {
    try {
      return await redis.llen(key);
    } catch {
      return 0;
    }
  };

  const safeAudit = async (): Promise<AuditEntry[]> => {
    try {
      return await getAuditLog(5);
    } catch {
      return [];
    }
  };

  const safeBotHealth = async (
    fn: () => Promise<BotHealthResponse | null>,
  ): Promise<BotHealthResponse | null> => {
    try {
      return await fn();
    } catch {
      return null;
    }
  };

  const getCotizarLeadsToday = async (): Promise<number> => {
    try {
      const ids = await redis.lrange<string>("cotizar:leads", 0, 49);
      if (!ids.length) return 0;
      const items = await Promise.all(
        ids.map((id) =>
          redis.get<{ createdAt: string }>(`cotizar:lead:${id}`),
        ),
      );
      return items.filter((l) => l?.createdAt?.startsWith(todayKey)).length;
    } catch {
      return 0;
    }
  };

  const [
    gymHealth,
    ruizHealth,
    landingVisitsToday,
    cotizarVisitsToday,
    totalCotizarLeads,
    cotizarLeadsToday,
    recentAudit,
  ] = await Promise.all([
    safeBotHealth(getGymBotHealth),
    safeBotHealth(getRuizRuizHealth),
    safeGet<number>(`track:landing:visit:${todayKey}`),
    safeGet<number>(`track:cotizar:visit:${todayKey}`),
    safeLlen("cotizar:leads"),
    getCotizarLeadsToday(),
    safeAudit(),
  ]);

  return {
    gymStatus: botStatus(gymHealth),
    ruizStatus: botStatus(ruizHealth),
    landingVisitsToday: landingVisitsToday ?? 0,
    cotizarVisitsToday: cotizarVisitsToday ?? 0,
    totalCotizarLeads,
    cotizarLeadsToday,
    lastAuditTs: recentAudit[0]?.ts ?? null,
    recentAudit,
  };
}

const NAV_SECTIONS = [
  {
    href: "/admin/funnel",
    icon: BarChart2,
    title: "Funnel",
    description: "Visitas, CTAs y conversión del cotizador",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    href: "/admin/cotizar-leads",
    icon: Target,
    title: "Leads Cotizador",
    description: "Prospectos que completaron el wizard",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    href: "/admin/bots",
    icon: MessageSquare,
    title: "Leads WhatsApp",
    description: "Ruiz & Ruiz y GymBot leads",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    href: "/admin/infra",
    icon: Server,
    title: "Infraestructura",
    description: "Health checks de servicios y bots",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    href: "/admin/qr",
    icon: QrCode,
    title: "QR WhatsApp",
    description: "Código QR para vincular dispositivos",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    href: "/admin/credentials",
    icon: KeyRound,
    title: "Credenciales",
    description: "Vault con accesos a los 11 servicios",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    href: "/admin/audit",
    icon: ClipboardList,
    title: "Auditoría",
    description: "Registro de acciones administrativas",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
] as const;

export default async function AdminDashboard() {
  const today = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const {
    gymStatus,
    ruizStatus,
    landingVisitsToday,
    cotizarVisitsToday,
    totalCotizarLeads,
    cotizarLeadsToday,
    lastAuditTs,
    recentAudit,
  } = await getDashboardData();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <LayoutDashboard className="w-5 h-5 text-slate-500" />
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
        <p className="text-slate-500 text-sm capitalize">{today}</p>
      </div>

      <WaReconnectBanner />

      {/* 1. Status Cards */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Estado general
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/admin/cotizar-leads"
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 text-center transition-colors group"
          >
            <p className="text-2xl font-black text-green-400">
              {cotizarLeadsToday}
            </p>
            <p className="text-slate-500 text-xs mt-1">Leads hoy</p>
            <p className="text-slate-700 text-[10px] mt-0.5 group-hover:text-slate-500 transition-colors">
              cotizador
            </p>
          </Link>
          <Link
            href="/admin/cotizar-leads"
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 text-center transition-colors group"
          >
            <p className="text-2xl font-black text-white">
              {totalCotizarLeads}
            </p>
            <p className="text-slate-500 text-xs mt-1">Total leads</p>
            <p className="text-slate-700 text-[10px] mt-0.5 group-hover:text-slate-500 transition-colors">
              acumulado
            </p>
          </Link>
          <Link
            href="/admin/infra"
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 text-center transition-colors"
          >
            <div className="flex items-center justify-center mb-1">
              <StatusDot status={ruizStatus} />
            </div>
            <p
              className={`text-sm font-bold ${ruizStatus === "online" ? "text-green-400" : "text-red-400"}`}
            >
              {ruizStatus === "online" ? "Conectado" : "Revisar"}
            </p>
            <p className="text-slate-500 text-xs mt-1">Ruiz &amp; Ruiz</p>
          </Link>
          <Link
            href="/admin/infra"
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 text-center transition-colors"
          >
            <div className="flex items-center justify-center mb-1">
              <StatusDot status={gymStatus} />
            </div>
            <p
              className={`text-sm font-bold ${gymStatus === "online" ? "text-green-400" : "text-red-400"}`}
            >
              {gymStatus === "online" ? "Conectado" : "Revisar"}
            </p>
            <p className="text-slate-500 text-xs mt-1">GymBot Ludus</p>
          </Link>
          <Link
            href="/admin/funnel"
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 text-center transition-colors group"
          >
            <p className="text-2xl font-black text-blue-400">
              {landingVisitsToday}
            </p>
            <p className="text-slate-500 text-xs mt-1">Visitas hoy</p>
            <p className="text-slate-700 text-[10px] mt-0.5 group-hover:text-slate-500 transition-colors">
              cotizar: {cotizarVisitsToday}
            </p>
          </Link>
          <Link
            href="/admin/audit"
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 text-center transition-colors group"
          >
            <p className="text-sm font-bold text-slate-300">
              {lastAuditTs ? timeAgo(lastAuditTs) : "—"}
            </p>
            <p className="text-slate-500 text-xs mt-1">Último audit</p>
            <p className="text-slate-700 text-[10px] mt-0.5 group-hover:text-slate-500 transition-colors">
              {lastAuditTs
                ? new Date(lastAuditTs).toLocaleTimeString("es-CL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "sin eventos"}
            </p>
          </Link>
        </div>
      </section>

      {/* 2. Quick Navigation Grid */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Secciones
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {NAV_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col gap-3 transition-colors group"
              >
                <div
                  className={`w-9 h-9 rounded-lg ${section.bg} border ${section.border} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-4 h-4 ${section.color}`} />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold group-hover:text-slate-200 transition-colors">
                    {section.title}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-snug">
                    {section.description}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-500 transition-colors self-end mt-auto" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Recent Activity Feed */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Actividad reciente
          </h2>
          <Link
            href="/admin/audit"
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Ver todo →
          </Link>
        </div>
        {recentAudit.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <p className="text-slate-500 text-sm">Sin actividad registrada</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
            {recentAudit.map((entry: AuditEntry, i: number) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 hover:bg-slate-800/40 transition-colors"
              >
                <span
                  className={`font-mono text-xs font-semibold shrink-0 mt-0.5 ${actionColor(entry.action)}`}
                >
                  {entry.action}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-300 text-xs truncate">
                    {entry.detail}
                  </p>
                  {entry.target && (
                    <p className="text-slate-600 text-[10px] font-mono mt-0.5 truncate">
                      {entry.target}
                    </p>
                  )}
                </div>
                <span className="text-slate-600 text-[10px] shrink-0 whitespace-nowrap">
                  {timeAgo(entry.ts)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Quick Actions */}
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Acciones rápidas
        </h2>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <p className="text-white text-sm font-medium mb-0.5">
                Pipeline de señales
              </p>
              <p className="text-slate-500 text-xs">
                Escribe una señal de prueba en Redis para verificar el pipeline
                LiveSignal
              </p>
            </div>
            <div className="sm:ml-auto">
              <TestSignalButton />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
