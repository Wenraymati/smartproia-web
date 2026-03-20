"use client";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";

interface SearchableItem {
  nombre?: string | null;
  telefono?: string | null;
}

export function useLeadSearch<T extends SearchableItem>(items: T[] | null) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!items || !query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.nombre?.toLowerCase().includes(q) ||
        item.telefono?.toLowerCase().includes(q),
    );
  }, [items, query]);

  return { query, setQuery, filtered };
}

export function LeadSearchInput({
  value,
  onChange,
  placeholder = "Buscar por nombre o teléfono...",
  count,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-colors"
        />
      </div>
      {count !== undefined && (
        <span className="text-xs text-slate-600">
          {count} resultado{count !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
