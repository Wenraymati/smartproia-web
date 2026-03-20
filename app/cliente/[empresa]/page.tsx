export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { generateSessionToken } from "@/lib/auth";
import {
  getGymBotLeads,
  getGymBotMetrics,
  getGymBotHealth,
  getRuizRuizLeads,
  getRuizRuizStats,
  getRuizRuizHealth,
  type GymBotLead,
  type GymBotMetrics,
  type BotHealthResponse,
  type RuizRuizLead,
  type RuizRuizStats,
} from "@/lib/bot-client";

// ---- Config ----------------------------------------------------------------

const VALID_EMPRESAS = ["ludus", "ruizruiz"] as const;
type ValidEmpresa = (typeof VALID_EMPRESAS)[number];

const EMPRESA_NAMES: Record<ValidEmpresa, string> = {
  ludus: "Ludus Estacion",
  ruizruiz: "Ruiz & Ruiz Consultores",
};

const TOKEN_MAP: Record<ValidEmpresa, string | undefined> = {
  ludus: process.env.LUDUS_CLIENT_TOKEN,
  ruizruiz: process.env.RUIZRUIZ_CLIENT_TOKEN,
};

// ---- Session validation ----------------------------------------------------

function isValidClientSession(cookie: string, envToken: string): boolean {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 86400000);
  const todayToken = generateSessionToken(envToken, now);
  const yesterdayToken = generateSessionToken(envToken, yesterday);
  return cookie === todayToken || cookie === yesterdayToken;
}

// ---- Helpers ----------------------------------------------------------------

function formatUnixDate(ts: number | null | undefined): string {
  if (!ts) return "\u2014";
  return new Date(ts * 1000).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function truncate(text: string | null, maxLen: number): string {
  if (!text) return "";
  return text.length > maxLen ? text.slice(0, maxLen) + "\u2026" : text;
}

// ---- Badge components -------------------------------------------------------

type TempKey = "critical" | "hot" | "warm" | "cool" | "cold";

const tempStyles: Record<TempKey, string> = {
  critical: "bg-purple-500/15 text-purple-400 border border-purple-500/25",
  hot: "bg-red-500/15 text-red-400 border border-red-500/25",
  warm: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
  cool: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  cold: "bg-slate-700 text-slate-400 border border-slate-600",
};

const tempLabels: Record<TempKey, string> = {
  critical: "Critical",
  hot: "Hot",
  warm: "Warm",
  cool: "Cool",
  cold: "Cold",
};

function TempBadge({ temperature }: { temperature: string }) {
  const key = temperature.toLowerCase() as TempKey;
  const style =
    tempStyles[key] ?? "bg-slate-700 text-slate-400 border border-slate-600";
  const label = tempLabels[key] ?? temperature;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}

const estadoStyles: Record<string, string> = {
  nuevo: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25",
  contactado: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  calificado: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
  cerrado: "bg-green-500/15 text-green-400 border border-green-500/25",
  perdido: "bg-slate-700 text-slate-400 border border-slate-600",
};

function EstadoBadge({ estado }: { estado: string }) {
  const style =
    estadoStyles[estado.toLowerCase()] ??
    "bg-slate-700 text-slate-400 border border-slate-600";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${style}`}
    >
      {estado}
    </span>
  );
}

// ---- Bot status pill --------------------------------------------------------

function BotStatusPill({ health }: { health: BotHealthResponse | null }) {
  if (!health) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-400 border border-slate-600">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        Desconocido
      </span>
    );
  }
  if (health.status === "ok") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/25">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Online
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/25">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
      Offline
    </span>
  );
}

// ---- Stat card --------------------------------------------------------------

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-black ${accent ? "text-green-400" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

// ---- Stats sections --------------------------------------------------------

function RuizRuizStatsSection({
  stats,
  health,
}: {
  stats: RuizRuizStats | null;
  health: BotHealthResponse | null;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
          Estado del bot
        </p>
        <BotStatusPill health={health} />
      </div>
      {stats ? (
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total leads" value={stats.total} />
          <StatCard label="Leads hoy" value={stats.hoy} accent={stats.hoy > 0} />
          <StatCard label="Esta semana" value={stats.nuevo} />
          <StatCard label="Urgentes" value={stats.urgentes} accent={stats.urgentes > 0} />
        </div>
      ) : (
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 text-yellow-400 text-xs">
          No se pudieron cargar las estadísticas del bot.
        </div>
      )}
    </div>
  );
}

function LudusStatsSection({
  metrics,
  health,
  totalLeads,
}: {
  metrics: GymBotMetrics | null;
  health: BotHealthResponse | null;
  totalLeads: number;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
          Estado del bot
        </p>
        <BotStatusPill health={health} />
      </div>
      {metrics ? (
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total leads" value={totalLeads} />
          <StatCard label="Leads hoy" value={metrics.today_leads} accent={metrics.today_leads > 0} />
          <StatCard label="Hot leads" value={metrics.hot + metrics.critical} accent={(metrics.hot + metrics.critical) > 0} />
          <StatCard label="Conversión" value={`${metrics.conversion_rate}%`} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total leads" value={totalLeads} />
          <div className="col-span-1 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 flex items-center">
            <p className="text-yellow-400 text-xs">Métricas no disponibles</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Lead cards ------------------------------------------------------------

function GymLeadCard({ lead }: { lead: GymBotLead }) {
  const nombre = lead.nombre ?? "Contacto sin nombre";
  const notas = truncate(lead.notas, 100);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
      {/* Name + estado */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-white font-semibold text-base leading-snug">
          {nombre}
        </p>
        <EstadoBadge estado={lead.estado} />
      </div>

      {/* Phone */}
      {lead.telefono && (
        <a
          href={`tel:${lead.telefono}`}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors min-h-[44px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span className="font-mono text-sm">{lead.telefono}</span>
        </a>
      )}

      {/* Badges row */}
      <div className="flex flex-wrap gap-2">
        <TempBadge temperature={lead.temperature} />
        {lead.plan_interes && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 border border-slate-700">
            {lead.plan_interes}
          </span>
        )}
        {lead.goal && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-400 border border-slate-700">
            {lead.goal}
          </span>
        )}
      </div>

      {/* Notes */}
      {notas && (
        <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-800 pt-2">
          {notas}
        </p>
      )}

      {/* Date */}
      <p className="text-slate-600 text-xs">
        {formatUnixDate(lead.created_at)}
      </p>
    </div>
  );
}

function RuizLeadCard({ lead }: { lead: RuizRuizLead }) {
  const nombre = lead.nombre ?? "Contacto sin nombre";
  const notas = truncate(lead.notas, 100);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
      {/* Name + estado */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-white font-semibold text-base leading-snug">
          {nombre}
        </p>
        <EstadoBadge estado={lead.estado} />
      </div>

      {/* Phone */}
      {lead.telefono && (
        <a
          href={`tel:${lead.telefono}`}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors min-h-[44px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span className="font-mono text-sm">{lead.telefono}</span>
        </a>
      )}

      {/* Urgencia + servicio + tamanio */}
      <div className="flex flex-wrap gap-2">
        {lead.urgencia === 1 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/25">
            Urgente
          </span>
        )}
        {lead.servicio && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 border border-slate-700">
            {lead.servicio}
          </span>
        )}
        {lead.tamano_empresa && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-400 border border-slate-700">
            {lead.tamano_empresa}
          </span>
        )}
      </div>

      {/* Notes */}
      {notas && (
        <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-800 pt-2">
          {notas}
        </p>
      )}

      {/* Date */}
      <p className="text-slate-600 text-xs">
        {formatUnixDate(lead.created_at)}
      </p>
    </div>
  );
}

// ---- Login form ------------------------------------------------------------

function LoginForm({
  empresa,
  empresaNombre,
  hasError,
}: {
  empresa: string;
  empresaNombre: string;
  hasError: boolean;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center -m-4 bg-[#030712]">
      <div className="w-full max-w-sm mx-auto p-8 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl">
        <h1 className="text-xl font-bold text-white mb-1">{empresaNombre}</h1>
        <p className="text-slate-400 text-sm mb-8">Portal de Leads</p>
        <form method="POST" action={`/cliente/${empresa}/api/login`}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="token"
                className="block text-sm text-slate-300 mb-1"
              >
                Token de acceso
              </label>
              <input
                id="token"
                name="token"
                type="password"
                required
                autoFocus
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[44px]"
                placeholder="Token de acceso"
              />
            </div>
            {hasError && (
              <p className="text-red-400 text-sm">
                Token incorrecto. Intenta de nuevo.
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg transition-colors min-h-[44px]"
            >
              Ingresar
            </button>
          </div>
        </form>
        <p className="text-slate-600 text-xs text-center mt-8">
          Powered by SmartProIA
        </p>
      </div>
    </div>
  );
}

// ---- Leads view header -----------------------------------------------------

function LeadsHeader({
  empresa,
  empresaNombre,
  totalLeads,
}: {
  empresa: string;
  empresaNombre: string;
  totalLeads: number;
}) {
  return (
    <header className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-white">{empresaNombre}</h1>
        <p className="text-slate-400 text-sm">Portal de Leads</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg whitespace-nowrap">
          {totalLeads} lead{totalLeads !== 1 ? "s" : ""}
        </span>
        <form method="POST" action={`/cliente/${empresa}/api/logout`}>
          <button
            type="submit"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors min-h-[44px] px-2"
          >
            Cerrar sesion
          </button>
        </form>
      </div>
    </header>
  );
}

// ---- Empty / Unavailable states --------------------------------------------

function UnavailableCard({ name }: { name: string }) {
  return (
    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5 flex items-center gap-3">
      <span className="text-yellow-400 text-lg">&#9888;</span>
      <div>
        <p className="text-yellow-400 font-medium text-sm">
          {name} no disponible
        </p>
        <p className="text-slate-500 text-xs mt-0.5">
          No se pudo conectar al servicio. Intenta mas tarde.
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-10 text-center">
      <p className="text-slate-600 text-sm">Sin leads registrados aun.</p>
    </div>
  );
}

// ---- Refresh hint ----------------------------------------------------------

function RefreshHint() {
  return (
    <p className="text-slate-700 text-xs text-center mt-2 mb-6">
      Recarga la página para ver datos actualizados.
    </p>
  );
}

// ---- Page ------------------------------------------------------------------

export default async function ClientePortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ empresa: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { empresa } = await params;
  const { error } = await searchParams;

  // 404 for unknown empresas
  if (!VALID_EMPRESAS.includes(empresa as ValidEmpresa)) {
    notFound();
  }

  const validEmpresa = empresa as ValidEmpresa;
  const empresaNombre = EMPRESA_NAMES[validEmpresa];
  const envToken = TOKEN_MAP[validEmpresa];
  const hasError = error === "1";

  // No token configured — treat as not found
  if (!envToken) {
    notFound();
  }

  // Validate session cookie
  const cookieStore = await cookies();
  const cookieName = `client_session_${empresa}`;
  const sessionCookie = cookieStore.get(cookieName)?.value ?? "";
  const authenticated = sessionCookie
    ? isValidClientSession(sessionCookie, envToken)
    : false;

  if (!authenticated) {
    return (
      <LoginForm
        empresa={empresa}
        empresaNombre={empresaNombre}
        hasError={hasError}
      />
    );
  }

  // Fetch data based on empresa
  if (validEmpresa === "ludus") {
    const [leads, metrics, health] = await Promise.all([
      getGymBotLeads(),
      getGymBotMetrics(),
      getGymBotHealth(),
    ]);

    return (
      <div className="max-w-lg mx-auto">
        <LeadsHeader
          empresa={empresa}
          empresaNombre={empresaNombre}
          totalLeads={leads?.length ?? 0}
        />

        {/* Stats section */}
        <LudusStatsSection
          metrics={metrics}
          health={health}
          totalLeads={leads?.length ?? 0}
        />
        <RefreshHint />

        {/* Divider */}
        <div className="border-t border-slate-800 mb-6" />

        {/* Leads list */}
        {!leads ? (
          <UnavailableCard name={empresaNombre} />
        ) : leads.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <GymLeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        )}

        <p className="text-slate-700 text-xs text-center mt-8">
          SmartProIA
        </p>
      </div>
    );
  }

  // ruizruiz
  const [leads, stats, health] = await Promise.all([
    getRuizRuizLeads(),
    getRuizRuizStats(),
    getRuizRuizHealth(),
  ]);

  return (
    <div className="max-w-lg mx-auto">
      <LeadsHeader
        empresa={empresa}
        empresaNombre={empresaNombre}
        totalLeads={leads?.length ?? 0}
      />

      {/* Stats section */}
      <RuizRuizStatsSection stats={stats} health={health} />
      <RefreshHint />

      {/* Divider */}
      <div className="border-t border-slate-800 mb-6" />

      {/* Leads list */}
      {!leads ? (
        <UnavailableCard name={empresaNombre} />
      ) : leads.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <RuizLeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}

      <p className="text-slate-700 text-xs text-center mt-8">
        SmartProIA
      </p>
    </div>
  );
}
