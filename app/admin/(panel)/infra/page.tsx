export const dynamic = "force-dynamic";

import { StatusDot } from "../../components/StatusDot";

interface ServiceResult {
  name: string;
  label: string;
  status: "online" | "offline";
  ms: number;
}

async function checkService(
  name: string,
  label: string,
  url: string,
  headers?: Record<string, string>
): Promise<ServiceResult> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers,
      next: { revalidate: 0 },
    });
    clearTimeout(timer);
    const ms = Date.now() - start;
    // 200 or 404 both indicate the server is alive
    const alive = res.ok || res.status === 404 || res.status === 401 || res.status === 403;
    return { name, label, status: alive ? "online" : "offline", ms };
  } catch {
    return { name, label, status: "offline", ms: Date.now() - start };
  }
}

export default async function InfraPage() {
  const gymUrl = process.env.GYMBOT_URL ?? "";
  const ruizUrl = process.env.RUIZRUIZ_URL ?? "";
  const dashToken = process.env.GYMBOT_DASHBOARD_TOKEN ?? "";
  const ruizToken = process.env.RUIZRUIZ_DASHBOARD_TOKEN ?? "";

  const now = new Date().toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const services = await Promise.all([
    checkService(
      "SmartProIA Web",
      "smartproia.com",
      "https://smartproia.com"
    ),
    checkService(
      "Evolution API",
      "api.smartproia.com",
      "https://api.smartproia.com/"
    ),
    checkService(
      "GymBot",
      gymUrl.replace(/^https?:\/\//, "") || "gymbot (no configurado)",
      gymUrl ? `${gymUrl}/health` : "http://localhost:0/health",
      gymUrl ? { "x-dashboard-token": dashToken } : {}
    ),
    checkService(
      "Ruiz & Ruiz Bot",
      ruizUrl.replace(/^https?:\/\//, "") || "ruizruiz (no configurado)",
      ruizUrl ? `${ruizUrl}/health` : "http://localhost:0/health",
      ruizUrl ? { "x-dashboard-token": ruizToken } : {}
    ),
  ]);

  const onlineCount = services.filter((s) => s.status === "online").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Infraestructura</h1>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-slate-500 text-sm">Estado en tiempo real</p>
          <span className="text-slate-700 text-sm">·</span>
          <p className="text-slate-500 text-sm font-mono">{now}</p>
          <span className="text-slate-700 text-sm">·</span>
          <p className="text-slate-500 text-sm">
            {onlineCount}/{services.length} servicios activos
          </p>
        </div>
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((svc) => (
          <ServiceCard key={svc.name} service={svc} />
        ))}
      </div>

      {/* Summary bar */}
      <div className="mt-6 bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex gap-1">
            {services.map((svc) => (
              <div
                key={svc.name}
                className={`h-1.5 flex-1 rounded-full ${
                  svc.status === "online" ? "bg-green-400" : "bg-red-400"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-slate-500 text-xs shrink-0">
          Avg {Math.round(services.reduce((a, s) => a + s.ms, 0) / services.length)}ms
        </p>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: ServiceResult }) {
  const latencyColor =
    service.ms < 300
      ? "text-green-400"
      : service.ms < 1000
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex items-start gap-4">
      <div className="mt-0.5">
        <StatusDot status={service.status} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-white font-medium text-sm">{service.name}</p>
          <span className={`font-mono text-xs font-semibold ${latencyColor}`}>
            {service.status === "online" ? `${service.ms}ms` : "timeout"}
          </span>
        </div>
        <p className="text-slate-500 text-xs mt-0.5 truncate">{service.label}</p>
        <div className="mt-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
              service.status === "online"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {service.status === "online" ? "Operativo" : "Sin respuesta"}
          </span>
        </div>
      </div>
    </div>
  );
}
