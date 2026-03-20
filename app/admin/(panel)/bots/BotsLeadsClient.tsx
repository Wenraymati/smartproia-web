"use client";
import { useState, useMemo } from "react";
import { LeadSearchInput } from "../../components/LeadsSearch";

interface SearchableItem {
  nombre?: string | null;
  telefono?: string | null;
}

export function BotsLeadsClient<T extends SearchableItem>({
  leads,
  renderTable,
  placeholder,
}: {
  leads: T[] | null;
  renderTable: (filtered: T[]) => React.ReactNode;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!leads) return leads;
    if (!query.trim()) return leads;
    const q = query.toLowerCase();
    return leads.filter(
      (l) =>
        l.nombre?.toLowerCase().includes(q) ||
        l.telefono?.toLowerCase().includes(q),
    );
  }, [leads, query]);

  if (!leads) return null;

  return (
    <div>
      <div className="mb-4">
        <LeadSearchInput
          value={query}
          onChange={setQuery}
          placeholder={placeholder ?? "Buscar por nombre o teléfono..."}
          count={query.trim() ? (filtered?.length ?? 0) : undefined}
        />
      </div>
      {renderTable(filtered ?? [])}
    </div>
  );
}
