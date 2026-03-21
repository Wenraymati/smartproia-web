"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { CotizarLeadStatus } from "@/lib/types/cotizar";
import { COTIZAR_LEAD_STATUSES } from "@/lib/types/cotizar";

const STATUS_STYLES: Record<CotizarLeadStatus, string> = {
  nuevo:       "text-cyan-400   bg-cyan-500/10   border-cyan-500/30",
  contactado:  "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  cerrado:     "text-green-400  bg-green-500/10  border-green-500/30",
  descartado:  "text-slate-400  bg-slate-700/30  border-slate-600/30",
};

const STATUS_LABELS: Record<CotizarLeadStatus, string> = {
  nuevo:      "Nuevo",
  contactado: "Contactado",
  cerrado:    "Cerrado",
  descartado: "Descartado",
};

interface LeadStatusBadgeProps {
  id: string;
  current: CotizarLeadStatus;
}

export function LeadStatusBadge({ id, current }: LeadStatusBadgeProps) {
  const [status, setStatus] = useState<CotizarLeadStatus>(current);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleSelect(next: CotizarLeadStatus) {
    if (next === status || loading) return;
    setOpen(false);
    setLoading(true);
    const prev = status;
    setStatus(next); // optimistic update
    try {
      const res = await fetch(`/admin/api/cotizar-leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        setStatus(prev); // revert on error
      } else {
        router.refresh();
      }
    } catch {
      setStatus(prev);
    } finally {
      setLoading(false);
    }
  }

  const badgeClass = STATUS_STYLES[status] ?? STATUS_STYLES.nuevo;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        onClick={() => !loading && setOpen((v) => !v)}
        disabled={loading}
        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border transition-opacity cursor-pointer select-none disabled:opacity-50 ${badgeClass}`}
        aria-label={`Estado: ${STATUS_LABELS[status]}. Haz clic para cambiar.`}
      >
        {STATUS_LABELS[status]}
        {loading ? (
          <span className="ml-0.5 inline-block w-2 h-2 rounded-full border border-current border-t-transparent animate-spin" />
        ) : (
          <svg
            className="w-2.5 h-2.5 opacity-60"
            fill="none"
            viewBox="0 0 10 6"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 min-w-[130px] bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1">
          {COTIZAR_LEAD_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleSelect(s)}
              className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors hover:bg-slate-800 ${
                s === status ? "opacity-50 cursor-default" : "cursor-pointer"
              } ${STATUS_STYLES[s].split(" ")[0]}`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
