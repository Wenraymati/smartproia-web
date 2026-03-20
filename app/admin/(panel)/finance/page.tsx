export const dynamic = "force-dynamic";

interface CostEntry {
  name: string;
  category: "Herramientas Dev" | "Infraestructura" | "APIs" | "Dominios";
  monthlyUSD: number;
  billingPeriod: "monthly" | "annual" | "usage";
  status: "active" | "free" | "paused" | "broken";
  note: string;
  url?: string;
}

function cents(envKey: string, defaultVal: number): number {
  const v = parseFloat(process.env[envKey] ?? String(defaultVal));
  return isNaN(v) ? defaultVal : v;
}

const COSTS: CostEntry[] = [
  // Herramientas Dev
  {
    name: "Claude Code (Anthropic)",
    category: "Herramientas Dev",
    monthlyUSD: cents("FINANCE_CLAUDE_CODE", 120),
    billingPeriod: "usage",
    status: "active",
    note: "Director estratégico + subagents + implementación. Costo principal del stack.",
    url: "https://console.anthropic.com",
  },
  {
    name: "DeepSeek",
    category: "Herramientas Dev",
    monthlyUSD: cents("FINANCE_DEEPSEEK", 5),
    billingPeriod: "usage",
    status: "active",
    note: "Fallback económico para Clawd. Pay-per-use.",
    url: "https://platform.deepseek.com",
  },
  {
    name: "Brave Search API",
    category: "Herramientas Dev",
    monthlyUSD: cents("FINANCE_BRAVE", 3),
    billingPeriod: "monthly",
    status: "active",
    note: "Web search en Clawd. Verificar uso real vs. alternativas gratuitas.",
    url: "https://api.search.brave.com",
  },
  {
    name: "Grok xAI",
    category: "Herramientas Dev",
    monthlyUSD: 0,
    billingPeriod: "usage",
    status: "broken",
    note: "Key expirada desde 2026-03-09. Limpiar config si no se va a renovar.",
  },
  // Infraestructura
  {
    name: "VPS Hostinger KVM 1",
    category: "Infraestructura",
    monthlyUSD: cents("FINANCE_VPS", 6),
    billingPeriod: "monthly",
    status: "active",
    note: "187.77.243.217 — Evolution API, Chatwoot, Uptime Kuma, PostgreSQL, Redis.",
    url: "https://hpanel.hostinger.com",
  },
  {
    name: "Railway",
    category: "Infraestructura",
    monthlyUSD: cents("FINANCE_RAILWAY", 5),
    billingPeriod: "monthly",
    status: "active",
    note: "ruizruiz-bot (activo) + gymbot (en pausa). Starter plan compartido.",
    url: "https://railway.app",
  },
  {
    name: "Vercel",
    category: "Infraestructura",
    monthlyUSD: 0,
    billingPeriod: "monthly",
    status: "free",
    note: "Hobby plan. smartproia.com — suficiente para tráfico actual.",
    url: "https://vercel.com",
  },
  {
    name: "Upstash Redis",
    category: "Infraestructura",
    monthlyUSD: 0,
    billingPeriod: "monthly",
    status: "free",
    note: "Free tier: 10K comandos/día. Usado para señales y audit log.",
    url: "https://console.upstash.com",
  },
  // Dominios
  {
    name: "Dominio smartproia.com",
    category: "Dominios",
    monthlyUSD: cents("FINANCE_DOMAIN_ANNUAL", 15) / 12,
    billingPeriod: "annual",
    status: "active",
    note: `Renovación anual $${cents("FINANCE_DOMAIN_ANNUAL", 15)} USD/año. Hostinger.`,
    url: "https://hpanel.hostinger.com",
  },
  // APIs
  {
    name: "Resend",
    category: "APIs",
    monthlyUSD: 0,
    billingPeriod: "monthly",
    status: "free",
    note: "Free tier: 3K emails/mes. Bienvenida y transaccionales.",
    url: "https://resend.com",
  },
  {
    name: "MercadoPago",
    category: "APIs",
    monthlyUSD: 0,
    billingPeriod: "usage",
    status: "active",
    note: "~5% comisión por transacción exitosa. Sin costo fijo mensual.",
    url: "https://www.mercadopago.com.ar",
  },
];

const CATEGORIES = [
  "Herramientas Dev",
  "Infraestructura",
  "APIs",
  "Dominios",
] as const;

type Category = (typeof CATEGORIES)[number];

const BILLING_LABELS: Record<CostEntry["billingPeriod"], string> = {
  monthly: "mensual",
  annual: "anual",
  usage: "por uso",
};

const STATUS_DOT: Record<CostEntry["status"], string> = {
  active: "bg-cyan-400",
  free: "bg-green-400",
  paused: "bg-slate-500",
  broken: "bg-red-500 animate-pulse",
};

function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function CategoryBar({
  category,
  total,
  categoryTotal,
}: {
  category: string;
  total: number;
  categoryTotal: number;
}) {
  const pct = total > 0 ? Math.round((categoryTotal / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-500 w-8 text-right">{pct}%</span>
    </div>
  );
}

export default function FinancePage() {
  const totalMonthly = COSTS.reduce((sum, c) => sum + c.monthlyUSD, 0);
  const domainAnnual = cents("FINANCE_DOMAIN_ANNUAL", 15);
  const totalAnnual = totalMonthly * 12 + domainAnnual;

  const categorySums = CATEGORIES.reduce<Record<Category, number>>(
    (acc, cat) => {
      acc[cat] = COSTS.filter((c) => c.category === cat).reduce(
        (s, c) => s + c.monthlyUSD,
        0
      );
      return acc;
    },
    {
      "Herramientas Dev": 0,
      Infraestructura: 0,
      APIs: 0,
      Dominios: 0,
    }
  );

  const brokenServices = COSTS.filter((c) => c.status === "broken");

  return (
    <div className="min-h-screen bg-[#030712] text-white px-4 py-8 md:px-8 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Control Financiero
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Costos reales del stack — actualizado 2026-03-20
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <p className="text-xs text-slate-500 mb-1">Total mensual</p>
          <p className="text-xl font-bold text-cyan-400 font-mono">
            {formatUSD(totalMonthly)}
          </p>
          <p className="text-xs text-slate-600 mt-1">USD / mes</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
          <p className="text-xs text-slate-500 mb-1">Total anual est.</p>
          <p className="text-xl font-bold text-slate-300 font-mono">
            {formatUSD(totalAnnual)}
          </p>
          <p className="text-xs text-slate-600 mt-1">USD / año</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-900/5 p-4">
          <p className="text-xs text-slate-500 mb-1">Herramientas Dev</p>
          <p className="text-xl font-bold text-amber-400 font-mono">
            {formatUSD(categorySums["Herramientas Dev"])}
          </p>
          <p className="text-xs text-slate-600 mt-1">USD / mes</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
          <p className="text-xs text-slate-500 mb-1">Infraestructura</p>
          <p className="text-xl font-bold text-slate-300 font-mono">
            {formatUSD(categorySums["Infraestructura"])}
          </p>
          <p className="text-xs text-slate-600 mt-1">USD / mes</p>
        </div>
      </div>

      {/* Alerts */}
      {brokenServices.length > 0 && (
        <div className="space-y-3 mb-8">
          {brokenServices.map((c) => (
            <div
              key={c.name}
              className="rounded-lg border border-red-500/30 bg-red-900/10 p-4 flex items-start gap-3"
            >
              <span className="text-red-400 mt-0.5 shrink-0">&#9888;</span>
              <div>
                <p className="text-red-400 font-medium text-sm">
                  {c.name} — Servicio roto
                </p>
                <p className="text-slate-400 text-sm mt-1">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cost breakdown by category */}
      <div className="space-y-8 mb-10">
        {CATEGORIES.map((cat) => {
          const entries = COSTS.filter((c) => c.category === cat);
          if (entries.length === 0) return null;
          return (
            <div key={cat}>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                {cat}
              </p>
              <CategoryBar
                category={cat}
                total={totalMonthly}
                categoryTotal={categorySums[cat]}
              />
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                {entries.map((entry, idx) => (
                  <div
                    key={entry.name}
                    className={`flex items-start gap-3 px-4 py-3 ${
                      idx !== entries.length - 1
                        ? "border-b border-slate-800/60"
                        : ""
                    }`}
                  >
                    {/* Status dot */}
                    <span
                      className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[entry.status]}`}
                    />
                    {/* Name + note */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {entry.url ? (
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-white hover:text-cyan-400 transition-colors"
                          >
                            {entry.name}
                          </a>
                        ) : (
                          <span className="text-sm font-medium text-white">
                            {entry.name}
                          </span>
                        )}
                        {/* Billing badge */}
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700/50">
                          {BILLING_LABELS[entry.billingPeriod]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug truncate max-w-xl">
                        {entry.note}
                      </p>
                    </div>
                    {/* Amount */}
                    <div className="shrink-0 text-right">
                      {entry.status === "broken" ? (
                        <span className="text-sm font-mono text-slate-600">
                          —
                        </span>
                      ) : entry.monthlyUSD === 0 ? (
                        <span className="text-sm font-mono text-green-400">
                          Gratis
                        </span>
                      ) : (
                        <span className="text-sm font-mono text-white">
                          {formatUSD(entry.monthlyUSD)}
                          <span className="text-slate-600 text-xs">/mes</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Optimization recommendations */}
      <section className="mt-8 space-y-3">
        <h2 className="text-base font-semibold text-white mb-3">
          Análisis de costos
        </h2>

        {/* Claude Code dominance */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-900/10 p-4">
          <p className="text-amber-400 font-medium text-sm">
            Claude Code representa el ~86% del gasto total
          </p>
          <p className="text-slate-400 text-sm mt-1">
            $120 de $139/mes. Estrategia: usar Haiku para tasks simples, Sonnet
            solo para implementación compleja. El routing automático en
            model-selector.js ya está configurado.
          </p>
        </div>

        {/* No duplicates */}
        <div className="rounded-lg border border-green-500/30 bg-green-900/10 p-4">
          <p className="text-green-400 font-medium text-sm">
            Sin servicios duplicados detectados
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Cada servicio tiene un rol único. VPS cubre Evolution API + bases de
            datos. Railway cubre bots con auto-deploy. Vercel cubre frontend.
            Stack eficiente.
          </p>
        </div>

        {/* Railway optimization */}
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-900/10 p-4">
          <p className="text-cyan-400 font-medium text-sm">
            Oportunidad: Railway → VPS ($5/mes ahorro)
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Con un solo bot activo (ruizruiz), Railway Starter cuesta $5/mes.
            Mover a VPS como contenedor Docker ahorraría esto. Trade-off: perder
            auto-deploy desde GitHub. Recomendado con 3+ clientes activos.
          </p>
        </div>

        {/* Brave Search */}
        <div className="rounded-lg border border-slate-600/50 bg-slate-800/30 p-4">
          <p className="text-slate-300 font-medium text-sm">
            Brave Search — verificar uso real ($3/mes)
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Revisar logs de Clawd para confirmar frecuencia de uso. Si se usa
            poco, alternativa gratuita: DuckDuckGo API (sin límite para uso
            personal).
          </p>
        </div>

        <p className="text-slate-600 text-xs mt-4">
          Para actualizar costos: Vercel Dashboard → Environment Variables →
          FINANCE_*
        </p>
      </section>
    </div>
  );
}
