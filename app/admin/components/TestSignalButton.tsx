"use client";
import { useState } from "react";

export function TestSignalButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/admin/api/signal-test", { method: "POST" });
      const data = await res.json() as { error?: string };
      setResult(res.ok ? "Senal enviada" : "Error: " + (data.error ?? "desconocido"));
    } catch {
      setResult("Error de red");
    } finally {
      setLoading(false);
      setTimeout(() => setResult(null), 3000);
    }
  }

  const isSuccess = result !== null && !result.startsWith("Error");

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
        result === null || loading
          ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
          : isSuccess
            ? "bg-green-500/10 border-green-500/30 text-green-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
      }`}
    >
      {loading ? "Enviando..." : result ?? "Enviar senal de prueba"}
    </button>
  );
}
