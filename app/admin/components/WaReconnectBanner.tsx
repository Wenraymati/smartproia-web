"use client";

import { useEffect, useState } from "react";

interface InstanceState {
  instance: string;
  state: string;
}

const QR_BASE = "https://api.smartproia.com/instance/connect";

const INSTANCE_LABELS: Record<string, string> = {
  "gymbot-ludus": "GymBot - Ludus",
  ruizruiz: "Ruiz & Ruiz",
};

export function WaReconnectBanner() {
  const [alerts, setAlerts] = useState<InstanceState[]>([]);

  async function check() {
    try {
      const res = await fetch("/admin/api/whatsapp-health");
      if (!res.ok) return;
      const data = (await res.json()) as InstanceState[];
      setAlerts(data.filter((d) => d.state !== "open"));
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    setTimeout(() => void check(), 0);
    const id = setInterval(() => void check(), 60_000);
    return () => clearInterval(id);
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-red-500/50 bg-red-950/40 p-4">
      <p className="text-sm font-semibold text-red-400 mb-2">
        WhatsApp desconectado
      </p>
      <ul className="space-y-1">
        {alerts.map((a) => (
          <li
            key={a.instance}
            className="flex items-center gap-3 text-sm text-slate-300"
          >
            <span>{INSTANCE_LABELS[a.instance] ?? a.instance}</span>
            <span className="text-slate-500">({a.state})</span>
            <a
              href={`${QR_BASE}/${a.instance}`}
              target="_blank"
              rel="noreferrer"
              className="ml-auto text-xs text-cyan-400 hover:text-cyan-300 underline"
            >
              Reconectar QR →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
