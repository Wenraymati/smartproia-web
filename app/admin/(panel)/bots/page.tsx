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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const tempStyles: Record<GymBotLead["temperature"], string> = {
  hot: "bg-red-500/15 text-red-400 border border-red-500/25",
  warm: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
  cold: "bg-slate-700 text-slate-400 border border-slate-600",
};

const tempLabels: Record<GymBotLead["temperature"], string> = {
  hot: "Hot",
  warm: "Warm",
  cold: "Cold",
};

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
        </h2>

        {gymMetrics ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Leads"
              value={gymMetrics.totalLeads}
              color="slate"
            />
            <StatCard
              label="Hot"
              value={gymMetrics.hotLeads}
              color="red"
            />
            <StatCard
              label="Warm"
              value={gymMetrics.warmLeads}
              color="yellow"
            />
            <StatCard
              label="Cold"
              value={gymMetrics.coldLeads}
              color="slate"
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
                  <Th>Temperatura</Th>
                  <Th>Último mensaje</Th>
                  <Th>Fecha</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {gymLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <Td mono>{lead.phone}</Td>
                    <Td>{lead.name ?? "—"}</Td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tempStyles[lead.temperature]}`}
                      >
                        {tempLabels[lead.temperature]}
                      </span>
                    </td>
                    <Td dimmed>{lead.lastMessage ?? "—"}</Td>
                    <Td dimmed>{formatDate(lead.createdAt)}</Td>
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
            <StatCard
              label="Total Leads"
              value={ruizStats.totalLeads}
              color="slate"
            />
            {Object.entries(ruizStats.byEstado).map(([estado, count]) => (
              <StatCard
                key={estado}
                label={estado}
                value={count}
                color="cyan"
              />
            ))}
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
                  <Th>Estado</Th>
                  <Th>Último mensaje</Th>
                  <Th>Fecha</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {ruizLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <Td mono>{lead.phone}</Td>
                    <Td>{lead.name ?? "—"}</Td>
                    <td className="py-3 px-4">
                      <EstadoBadge estado={lead.estado} />
                    </td>
                    <Td dimmed>{lead.lastMessage ?? "—"}</Td>
                    <Td dimmed>{formatDate(lead.createdAt)}</Td>
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

function EstadoBadge({ estado }: { estado: string }) {
  const lower = estado.toLowerCase();
  const colorClass =
    lower === "nuevo"
      ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/25"
      : lower === "contactado"
        ? "bg-blue-500/15 text-blue-400 border-blue-500/25"
        : lower === "convertido"
          ? "bg-green-500/15 text-green-400 border-green-500/25"
          : lower === "perdido"
            ? "bg-red-500/15 text-red-400 border-red-500/25"
            : "bg-slate-700 text-slate-400 border-slate-600";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
    >
      {estado}
    </span>
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
      <span className="text-yellow-400 text-lg">⚠</span>
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
