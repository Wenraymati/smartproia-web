"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const GYM_ESTADOS = ["nuevo", "contactado", "ganado", "perdido"] as const;
const RUIZ_ESTADOS = ["nuevo", "contactado", "cerrado", "perdido"] as const;

const colorMap: Record<string, string> = {
  nuevo: "text-cyan-400",
  contactado: "text-blue-400",
  ganado: "text-green-400",
  cerrado: "text-green-400",
  perdido: "text-red-400",
};

export function LeadStatusSelect({
  bot,
  id,
  current,
}: {
  bot: "gymbot" | "ruizruiz";
  id: number;
  current: string;
}) {
  const [estado, setEstado] = useState(current);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const opciones = bot === "gymbot" ? GYM_ESTADOS : RUIZ_ESTADOS;

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nuevo = e.target.value;
    setLoading(true);
    setEstado(nuevo);
    try {
      await fetch("/admin/api/bots/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bot, id, estado: nuevo }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={estado}
      onChange={handleChange}
      disabled={loading}
      className={`bg-transparent border-0 text-sm font-medium cursor-pointer focus:outline-none disabled:opacity-50 ${colorMap[estado] ?? "text-slate-300"}`}
    >
      {opciones.map((o) => (
        <option key={o} value={o} className="bg-slate-900 text-slate-200">
          {o}
        </option>
      ))}
    </select>
  );
}
