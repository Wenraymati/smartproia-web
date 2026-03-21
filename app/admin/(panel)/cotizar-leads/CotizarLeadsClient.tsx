"use client";

import { useState } from "react";
import type { CotizarLead, CotizarLeadStatus } from "@/lib/types/cotizar";
import { LeadStatusBadge } from "@/app/admin/components/LeadStatusBadge";

const planColor: Record<string, string> = {
  "Bot Básico": "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  "Bot Propio": "text-green-400 bg-green-500/10 border-green-500/20",
  "Bot DCA":    "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

type FilterTab = "todos" | CotizarLeadStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "todos",      label: "Todos" },
  { key: "nuevo",      label: "Nuevos" },
  { key: "contactado", label: "Contactados" },
  { key: "cerrado",    label: "Cerrados" },
  { key: "descartado", label: "Descartados" },
];

function timeAgo(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

interface CotizarLeadsClientProps {
  leads: CotizarLead[];
  volumeLabels: Record<string, string>;
}

export function CotizarLeadsClient({ leads, volumeLabels }: CotizarLeadsClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("todos");

  const filtered =
    activeFilter === "todos"
      ? leads
      : leads.filter((l) => (l.status ?? "nuevo") === activeFilter);

  const countByStatus = (key: FilterTab) =>
    key === "todos"
      ? leads.length
      : leads.filter((l) => (l.status ?? "nuevo") === key).length;

  return (
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

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {FILTER_TABS.map(({ key, label }) => {
          const count = countByStatus(key);
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                isActive
                  ? "bg-slate-700 border-slate-500 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
              }`}
            >
              {label}
              <span
                className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-slate-500 text-white" : "bg-slate-800 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Leads list */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-500 text-sm">No hay prospectos en este estado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => {
            const colorClass =
              planColor[lead.plan] ?? "text-slate-300 bg-slate-800 border-slate-700";
            const leadStatus: CotizarLeadStatus = lead.status ?? "nuevo";
            return (
              <div
                key={lead.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Plan badge */}
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colorClass}`}
                    >
                      {lead.plan}
                    </span>

                    {/* Status badge (interactive) */}
                    <LeadStatusBadge id={lead.id} current={leadStatus} />

                    {lead.name ? (
                      <span className="text-white font-medium text-sm">{lead.name}</span>
                    ) : (
                      <span className="text-white font-medium text-sm">{lead.industry}</span>
                    )}
                    {lead.phone && (
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 text-xs transition-colors"
                      >
                        {lead.phone} ↗
                      </a>
                    )}
                  </div>
                  <span className="text-slate-600 text-xs shrink-0">
                    {timeAgo(lead.createdAt)}
                  </span>
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
                    <p className="text-slate-300">
                      {volumeLabels[lead.volume] ?? lead.volume}
                    </p>
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
      )}
    </>
  );
}
