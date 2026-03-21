export const dynamic = "force-dynamic";

import { getRedis } from "@/lib/redis";
import type { CotizarLead } from "@/lib/types/cotizar";
import { CotizarLeadsClient } from "./CotizarLeadsClient";

const VOLUME_LABELS: Record<string, string> = {
  bajo: "Bajo (<50/día)",
  medio: "Medio (50-200/día)",
  alto: "Alto (>200/día)",
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

export { VOLUME_LABELS };

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
            <a
              href="https://smartproia.com/cotizar"
              className="text-cyan-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              smartproia.com/cotizar
            </a>
          </p>
        </div>
      ) : (
        <CotizarLeadsClient leads={leads} volumeLabels={VOLUME_LABELS} />
      )}
    </div>
  );
}
