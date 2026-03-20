"use client";
import { useState } from "react";

export type FieldType = "text" | "password" | "url";

export interface ResolvedField {
  label: string;
  type: FieldType;
  value: string | null;
}

export interface ResolvedService {
  name: string;
  group: string;
  fields: ResolvedField[];
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="min-h-[44px] px-3 text-xs text-slate-400 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50 rounded-lg transition-colors"
      title="Copiar"
    >
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

function FieldRow({ field }: { field: ResolvedField }) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = field.type === "password";
  const isUrl = field.type === "url";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-800 last:border-0">
      <div className="w-36 shrink-0">
        <span className="text-xs text-slate-500 uppercase tracking-wider">
          {field.label}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        {field.value === null ? (
          <span className="text-xs font-medium text-amber-400">
            No configurado
          </span>
        ) : isPassword && !revealed ? (
          <span className="text-sm text-slate-400 font-mono tracking-widest select-none">
            ●●●●●●●●
          </span>
        ) : isUrl ? (
          <a
            href={field.value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cyan-400 hover:underline truncate block"
          >
            {field.value}
          </a>
        ) : (
          <span className="text-sm text-slate-200 font-mono break-all">
            {field.value}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isPassword && field.value !== null && (
          <button
            onClick={() => setRevealed((r) => !r)}
            className="min-h-[44px] px-3 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors"
          >
            {revealed ? "Ocultar" : "Revelar"}
          </button>
        )}
        {field.value !== null && <CopyButton value={field.value} />}
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: ResolvedService }) {
  const configured = service.fields.filter((f) => f.value !== null).length;
  const total = service.fields.length;

  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-800/30">
        <span className="font-semibold text-slate-100 text-sm">
          {service.name}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            configured === total
              ? "bg-green-500/10 text-green-400"
              : configured === 0
                ? "bg-red-500/10 text-red-400"
                : "bg-amber-500/10 text-amber-400"
          }`}
        >
          {configured}/{total}
        </span>
      </div>
      <div className="px-5">
        {service.fields.map((field, i) => (
          <FieldRow key={i} field={field} />
        ))}
      </div>
    </div>
  );
}

export function CredentialsVault({ services }: { services: ResolvedService[] }) {
  const groups = Array.from(new Set(services.map((s) => s.group)));

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group}>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
            {group}
          </h2>
          <div className="space-y-3">
            {services
              .filter((s) => s.group === group)
              .map((service, i) => (
                <ServiceCard key={i} service={service} />
              ))}
          </div>
        </div>
      ))}

      <div className="mt-8 p-4 rounded-xl border border-slate-700/30 bg-slate-800/20">
        <p className="text-xs text-slate-500">
          <span className="text-slate-400 font-medium">
            Agregar nuevas credenciales:
          </span>{" "}
          Añade variables <span className="font-mono text-slate-400">CRED_*</span> en{" "}
          <span className="font-mono text-slate-400">
            Vercel Dashboard &rarr; Settings &rarr; Environment Variables
          </span>
          , luego redeploy.
        </p>
      </div>
    </div>
  );
}
