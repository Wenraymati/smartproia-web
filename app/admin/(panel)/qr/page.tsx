"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const INSTANCES = [
  { key: "gymbot-ludus", label: "GymBot — Ludus Estacion" },
  { key: "ruizruiz", label: "Ruiz & Ruiz Consultores" },
] as const;

type InstanceKey = (typeof INSTANCES)[number]["key"];

const REFRESH_INTERVAL = 55;

interface QRData {
  base64: string | null;
  state: string;
  loading: boolean;
  error: string | null;
  countdown: number;
}

interface QRApiResponse {
  base64?: string | null;
  state?: string;
  error?: string;
}

export default function QRPage() {
  const [data, setData] = useState<Record<InstanceKey, QRData>>(() => {
    const initial: Partial<Record<InstanceKey, QRData>> = {};
    for (const inst of INSTANCES) {
      initial[inst.key] = {
        base64: null,
        state: "unknown",
        loading: true,
        error: null,
        countdown: REFRESH_INTERVAL,
      };
    }
    return initial as Record<InstanceKey, QRData>;
  });

  const timers = useRef<Partial<Record<InstanceKey, ReturnType<typeof setInterval>>>>({});

  const fetchQR = useCallback(async (instance: InstanceKey) => {
    setData((prev) => ({
      ...prev,
      [instance]: { ...prev[instance], loading: true, error: null },
    }));

    const existing = timers.current[instance];
    if (existing !== undefined) {
      clearInterval(existing);
    }

    try {
      const res = await fetch(`/admin/api/qr/${instance}`);
      const json = (await res.json()) as QRApiResponse;

      if (!res.ok) {
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }

      setData((prev) => ({
        ...prev,
        [instance]: {
          base64: json.base64 ?? null,
          state: json.state ?? "unknown",
          loading: false,
          error: null,
          countdown: REFRESH_INTERVAL,
        },
      }));
    } catch (err) {
      setData((prev) => ({
        ...prev,
        [instance]: {
          ...prev[instance],
          loading: false,
          error: err instanceof Error ? err.message : "Error",
          state: "error",
          countdown: REFRESH_INTERVAL,
        },
      }));
    }

    let seconds = REFRESH_INTERVAL;
    timers.current[instance] = setInterval(() => {
      seconds--;
      setData((prev) => ({
        ...prev,
        [instance]: { ...prev[instance], countdown: seconds },
      }));
      if (seconds <= 0) {
        const t = timers.current[instance];
        if (t !== undefined) clearInterval(t);
        void fetchQR(instance);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    INSTANCES.forEach((i) => {
      void fetchQR(i.key);
    });
    return () => {
      for (const t of Object.values(timers.current)) {
        if (t !== undefined) clearInterval(t);
      }
    };
  }, [fetchQR]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">QR WhatsApp</h1>
      <p className="text-slate-400 text-sm mb-8">
        Escanear con WhatsApp &rsaquo; Dispositivos vinculados. El QR expira en ~60s.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        {INSTANCES.map((inst) => {
          const d = data[inst.key];
          const isOpen = d.state === "open";
          const isConnecting =
            d.state === "connecting" || d.state === "qrcode";
          const urgent = d.countdown <= 10;

          return (
            <div
              key={inst.key}
              className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col items-center gap-4"
            >
              <div className="text-center">
                <p className="font-semibold text-white">{inst.label}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  {inst.key}
                </p>
              </div>

              {/* Status badge */}
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border uppercase tracking-wide ${
                  isOpen
                    ? "bg-green-900/40 text-green-400 border-green-500/50"
                    : isConnecting
                      ? "bg-amber-900/40 text-amber-400 border-amber-500/50"
                      : "bg-slate-800 text-slate-400 border-slate-600"
                }`}
              >
                {d.state}
              </span>

              {/* QR container */}
              <div className="w-52 h-52 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                {d.loading ? (
                  <span className="text-slate-400 text-sm">Cargando...</span>
                ) : d.error ? (
                  <span className="text-red-500 text-xs text-center p-3">
                    {d.error}
                  </span>
                ) : d.base64 ? (
                  <img
                    src={`data:image/png;base64,${d.base64.replace(/^data:image\/[a-z]+;base64,/, "")}`}
                    alt={`QR ${inst.key}`}
                    className="w-full h-full object-contain"
                  />
                ) : isOpen ? (
                  <span className="text-green-600 text-sm font-medium text-center px-4">
                    Conectado
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs text-center px-4">
                    QR no disponible
                  </span>
                )}
              </div>

              {/* Countdown */}
              {!d.loading && (
                <p
                  className={`text-xs ${urgent ? "text-red-400" : "text-slate-500"}`}
                >
                  {isOpen ? "Verificando en " : "Refresh en "}
                  <span className="font-bold tabular-nums">{d.countdown}</span>s
                </p>
              )}

              {/* Refresh button */}
              <button
                onClick={() => {
                  void fetchQR(inst.key);
                }}
                disabled={d.loading}
                className="w-full py-2 text-sm font-semibold border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-900/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {d.loading ? "Cargando..." : "Refresh QR"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-slate-600 text-xs mt-8">
        Auto-refresh cada {REFRESH_INTERVAL}s. El proxy mantiene la apikey segura.
      </p>
    </div>
  );
}
