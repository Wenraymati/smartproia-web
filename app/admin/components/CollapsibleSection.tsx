"use client";
import { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  subtitle: string;
  statusColor: "green" | "amber" | "red" | "gray";
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const dotColors: Record<CollapsibleSectionProps["statusColor"], string> = {
  green: "bg-green-400",
  amber: "bg-amber-400 animate-pulse",
  red: "bg-red-400 animate-pulse",
  gray: "bg-slate-500",
};

export function CollapsibleSection({
  title,
  subtitle,
  statusColor,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border border-slate-700/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-slate-800/50 hover:bg-slate-800 transition-colors text-left"
        aria-expanded={open}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColors[statusColor]}`}
        />
        <span className="font-semibold text-white flex-1">{title}</span>
        <span className="text-slate-400 text-sm mr-3">{subtitle}</span>
        <span
          className={`text-slate-400 transition-transform duration-200 select-none ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="px-5 py-5 border-t border-slate-700/50 bg-[#030712]/50">
          {children}
        </div>
      )}
    </section>
  );
}
