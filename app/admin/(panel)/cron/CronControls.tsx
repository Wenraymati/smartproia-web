"use client";

import { useState, useTransition } from "react";

interface ToggleProps {
  id: string;
  initialEnabled: boolean;
}

export function CronToggle({ id, initialEnabled }: ToggleProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/cron", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, action: "toggle" }),
        });
        if (res.ok) {
          const data = (await res.json()) as { ok: boolean; enabled: boolean };
          setEnabled(data.enabled);
        }
      } catch {
        // silent — UI stays at previous state
      }
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      aria-label={enabled ? "Deshabilitar cron" : "Habilitar cron"}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:opacity-50 ${
        enabled ? "bg-cyan-500" : "bg-slate-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

interface RunButtonProps {
  id: string;
}

type RunStatus = "idle" | "running" | "success" | "error";

export function CronRunButton({ id }: RunButtonProps) {
  const [status, setStatus] = useState<RunStatus>("idle");
  const [message, setMessage] = useState<string>("");

  async function handleRun() {
    setStatus("running");
    setMessage("");
    try {
      const res = await fetch("/api/admin/cron", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "run" }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        result?: { message?: string };
        error?: string;
      };
      if (res.ok && data.ok) {
        setStatus("success");
        setMessage(data.result?.message ?? "Completado");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Error al ejecutar");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Error de red");
    }
    setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleRun}
        disabled={status === "running"}
        className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "running" ? "Ejecutando..." : "Correr ahora"}
      </button>
      {status === "success" && (
        <span className="text-xs text-green-400 truncate max-w-[160px]">
          ✓ {message}
        </span>
      )}
      {status === "error" && (
        <span className="text-xs text-red-400 truncate max-w-[160px]">
          ✗ {message}
        </span>
      )}
    </div>
  );
}
