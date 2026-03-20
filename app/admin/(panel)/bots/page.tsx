export const dynamic = "force-dynamic";

import {
  getGymBotLeads,
  getGymBotMetrics,
  getRuizRuizLeads,
  getRuizRuizStats,
  type GymBotLead,
  type RuizRuizLead,
} from "@/lib/bot-client";
import { StatCard } from "../../components/StatCard";
import { LeadStatusSelect } from "../../components/LeadStatusSelect";

function formatUnixDate(ts: number | null | undefined): string {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

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
  const style = tempStyles[key] ?? "bg-slate-700 text-slate-400 border border-slate-600";
  const label = tempLabels[key] ?? temperature;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}

export default async function BotsPage() {
  const [gymLeads, gymMetrics, ruizLeads, ruizStats] = await Promise.all([
    getGymBotLeads(),
    getGymBotMetrics(),
    getRuizRuizLeads(),
    getRuizRuizStats(),
  ]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Bots WhatsApp</h1>
        <p className="text-slate-500 text-sm mt-1">
          Leads capturados por los bots activos
        </p>
      </div>

      {/* GymBot section */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
          GymBot Ludus
          {gymMetrics?.gym_name && (
            <span className="ml-2 normal-case text-slate-600">
              — {gymMetrics.gym_name}
            </span>
          )}
        </h2>

        {gymMetrics ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Leads Hoy"
              value={gymMetrics.today_leads}
              color="slate"
            />
            <StatCard
              label="Critical"
              value={gymMetrics.critical}
              color="red"
            />
            <StatCard
              label="Hot"
              value={gymMetrics.hot}
              color="red"
            />
            <StatCard
              label="Warm"
              value={gymMetrics.warm}
              color="yellow"
            />
            <StatCard
              label="Cool"
              value={gymMetrics.cool}
              color="cyan"
            />
            <StatCard
              label="Cold"
              value={gymMetrics.cold}
              color="slate"
            />
            <StatCard
              label="Conv %"
              value={`${Math.round(gymMetrics.conversion_rate * 100)}%`}
              color="cyan"
            />
          </div>
        ) : (
          <UnavailableCard name="GymBot Ludus" className="mb-6" />
        )}

        {gymLeads ? (
          gymLeads.length === 0 ? (
            <EmptyState message="Sin leads registrados aún." />
          ) : (
            <LeadsTable>
              <thead>
                <tr className="border-b border-slate-700">
                  <Th>Teléfono</Th>
                  <Th>Nombre</Th>
                  <Th>Plan</Th>
                  <Th>Score</Th>
                  <Th>Temperatura</Th>
                  <Th>Estado</Th>
                  <Th>Última interacción</Th>
                  <Th>Fecha</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {gymLeads.map((lead: GymBotLead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <Td mono>{lead.telefono ?? "—"}</Td>
                    <Td>{lead.nombre ?? "—"}</Td>
                    <Td dimmed>{lead.plan_interes ?? "—"}</Td>
                    <Td>{lead.score}</Td>
                    <td className="py-3 px-4">
                      <TempBadge temperature={lead.temperature} />
                    </td>
                    <td className="py-3 px-4">
                      <LeadStatusSelect
                        bot="gymbot"
                        id={lead.id}
                        current={lead.estado}
                      />
                    </td>
                    <Td dimmed>{formatUnixDate(lead.last_interaction)}</Td>
                    <Td dimmed>{formatUnixDate(lead.created_at)}</Td>
                  </tr>
                ))}
              </tbody>
            </LeadsTable>
          )
        ) : (
          <UnavailableCard name="GymBot Ludus" />
        )}
      </section>

      {/* Ruiz & Ruiz section */}
      <section>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Ruiz &amp; Ruiz
        </h2>

        {ruizStats ? (
          <div className="flex flex-wrap gap-4 mb-6">
            <StatCard label="Total" value={ruizStats.total} color="slate" />
            <StatCard label="Nuevo" value={ruizStats.nuevo} color="cyan" />
            <StatCard label="Contactado" value={ruizStats.contactado} color="cyan" />
            <StatCard label="Cerrado" value={ruizStats.cerrado} color="cyan" />
            <StatCard label="Urgentes" value={ruizStats.urgentes} color="red" />
            <StatCard label="Hoy" value={ruizStats.hoy} color="yellow" />
          </div>
        ) : (
          <UnavailableCard name="Ruiz &amp; Ruiz" className="mb-6" />
        )}

        {ruizLeads ? (
          ruizLeads.length === 0 ? (
            <EmptyState message="Sin leads registrados aún." />
          ) : (
            <LeadsTable>
              <thead>
                <tr className="border-b border-slate-700">
                  <Th>Teléfono</Th>
                  <Th>Nombre</Th>
                  <Th>Servicio</Th>
                  <Th>Score</Th>
                  <Th>Estado</Th>
                  <Th>Urgente</Th>
                  <Th>Fecha</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {ruizLeads.map((lead: RuizRuizLead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <Td mono>{lead.telefono ?? "—"}</Td>
                    <Td>{lead.nombre ?? "—"}</Td>
                    <Td dimmed>{lead.servicio ?? "—"}</Td>
                    <Td>{lead.score}</Td>
                    <td className="py-3 px-4">
                      <LeadStatusSelect
                        bot="ruizruiz"
                        id={lead.id}
                        current={lead.estado}
                      />
                    </td>
                    <td className="py-3 px-4">
                      {lead.urgencia === 1 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-red-500/15 text-red-400 border-red-500/25">
                          Si
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">No</span>
                      )}
                    </td>
                    <Td dimmed>{formatUnixDate(lead.created_at)}</Td>
                  </tr>
                ))}
              </tbody>
            </LeadsTable>
          )
        ) : (
          <UnavailableCard name="Ruiz &amp; Ruiz" />
        )}
      </section>
    </div>
  );
}

/* ---- Sub-components ---- */

function LeadsTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left py-3 px-4 text-slate-400 font-medium text-xs uppercase tracking-wider">
      {children}
    </th>
  );
}

function Td({
  children,
  mono,
  dimmed,
}: {
  children: React.ReactNode;
  mono?: boolean;
  dimmed?: boolean;
}) {
  return (
    <td
      className={`py-3 px-4 ${
        dimmed
          ? "text-slate-500 text-xs max-w-[200px] truncate"
          : mono
            ? "text-slate-300 font-mono text-xs"
            : "text-slate-300"
      }`}
    >
      {children}
    </td>
  );
}

function UnavailableCard({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5 flex items-center gap-3 ${className}`}
    >
      <span className="text-yellow-400 text-lg">&#9888;</span>
      <div>
        <p className="text-yellow-400 font-medium text-sm">{name} no disponible</p>
        <p className="text-slate-500 text-xs mt-0.5">
          El bot no respondió a tiempo. Verifica Railway.
        </p>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-10 text-center">
      <p className="text-slate-600 text-sm">{message}</p>
    </div>
  );
}
