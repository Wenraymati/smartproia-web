export const dynamic = "force-dynamic";

import { getRedis } from "@/lib/redis";

interface CotizarLead {
  id: string;
  name?: string;
  phone?: string;
  industry: string;
  volume: string;
  features: string[];
  plan: string;
  setup: string;
  monthly: string;
  createdAt: string;
}

const VOLUME_LABELS: Record<string, string> = {
  bajo: "Bajo (<50/día)",
  medio: "Medio (50-200/día)",
  alto: "Alto (>200/día)",
};

const planColor: Record<string, string> = {
  "Bot Básico": "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  "Bot Propio": "text-green-400 bg-green-500/10 border-green-500/20",
  "Bot DCA": "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

async function getLeads(): Promise<CotizarLead[]> {
  const redis = getRedis();
  const ids = await redis.lrange<string>("cotizar:leads", 0, 49); // Last 50
  if (!ids.length) return [];

  const raw = await Promise.all(
    ids.map((id) => redis.get<CotizarLead>(`cotizar:lead:${id}`))
  );
  return raw.filter((l): l is CotizarLead => l !== null);
}

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

export default async function CotizarLeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Leads del Cotizador</h1>
        <p className="text-slate-500 text-sm mt-1">
          Prospectos que completaron el wizard — últimos 50
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
          <p className="text-slate-500">Aún no hay prospectos registrados.</p>
          <p className="text-slate-600 text-xs mt-1">
            Aparecerán cuando alguien complete el cotizador en{" "}
            <a href="https://smartproia.com/cotizar" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">
              smartproia.com/cotizar
            </a>
          </p>
        </div>
      ) : (
        <>
          {/* Summary bar */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-white">{leads.length}</p>
              <p className="text-slate-500 text-xs mt-1">Total prospectos</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-green-400">
                {leads.filter((l) => l.plan === "Bot Propio").length}
              </p>
              <p className="text-slate-500 text-xs mt-1">Bot Propio</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-cyan-400">
                {leads.filter((l) => l.volume === "alto").length}
              </p>
              <p className="text-slate-500 text-xs mt-1">Vol. alto</p>
            </div>
          </div>

          {/* Leads list */}
          <div className="space-y-3">
            {leads.map((lead) => {
              const colorClass = planColor[lead.plan] ?? "text-slate-300 bg-slate-800 border-slate-700";
              return (
                <div
                  key={lead.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colorClass}`}>
                        {lead.plan}
                      </span>
                      {lead.name ? (
                        <span className="text-white font-medium text-sm">{lead.name}</span>
                      ) : (
                        <span className="text-white font-medium text-sm">{lead.industry}</span>
                      )}
                      {lead.phone && (
                        <a
                          href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 text-xs transition-colors"
                        >
                          {lead.phone} ↗
                        </a>
                      )}
                    </div>
                    <span className="text-slate-600 text-xs shrink-0">{timeAgo(lead.createdAt)}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {lead.name && (
                      <div>
                        <p className="text-slate-600 mb-0.5">Rubro</p>
                        <p className="text-slate-300">{lead.industry}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-slate-600 mb-0.5">Volumen</p>
                      <p className="text-slate-300">{VOLUME_LABELS[lead.volume] ?? lead.volume}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-0.5">Setup</p>
                      <p className="text-slate-300">${lead.setup} USD</p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-0.5">Mensual</p>
                      <p className="text-slate-300">${lead.monthly} USD/mes</p>
                    </div>
                    <div>
                      <p className="text-slate-600 mb-0.5">Funciones</p>
                      <p className="text-slate-300 truncate">
                        {lead.features.length > 0 ? lead.features.join(", ") : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <p className="text-slate-700 text-xs font-mono">{lead.id}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
