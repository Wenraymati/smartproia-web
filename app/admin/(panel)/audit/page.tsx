export const dynamic = "force-dynamic";

import { getAuditLog, type AuditEntry } from "@/lib/audit";

function actionColor(action: string): string {
  if (action.startsWith("lead.")) {
    return "text-cyan-400";
  }
  if (action.startsWith("signal.")) {
    return "text-amber-400";
  }
  if (action.startsWith("wa.")) {
    return "text-green-400";
  }
  return "text-slate-400";
}

export default async function AuditPage() {
  const entries: AuditEntry[] = await getAuditLog(200);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <p className="text-slate-500 text-sm mt-1">
          Registro de acciones administrativas (ultimas 200 entradas)
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-10 text-center">
          <p className="text-slate-400 text-sm">
            Sin actividad registrada aun
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Accion
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Objetivo
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Detalle
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Hora
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {entries.map((entry, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`font-mono text-xs ${actionColor(entry.action)}`}
                    >
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-400">
                      {entry.target}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 max-w-xs truncate">
                    {entry.detail}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-500">
                      {entry.ip}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(entry.ts).toLocaleString("es-CL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
