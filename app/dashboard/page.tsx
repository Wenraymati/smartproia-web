export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Redis } from "@upstash/redis";

async function getData(secret: string | undefined) {
  if (!secret || secret !== process.env.ADMIN_SECRET) return null;

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const emails = (await redis.smembers("subscribers")) as string[];
  const leadsRaw = (await redis.smembers("leads")) as string[];
  const leads = leadsRaw.length;

  if (!emails.length) {
    return { total: 0, subscribers: [] as any[], byPlan: {}, recent: 0, leads };
  }

  const pipeline = redis.pipeline();
  for (const email of emails) pipeline.get(`subscriber:${email}`);
  const results = await pipeline.exec();

  const subscribers = results
    .map((r) => (typeof r === "string" ? JSON.parse(r) : r))
    .filter(Boolean)
    .sort((a: any, b: any) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());

  const byPlan: Record<string, number> = {};
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let recent = 0;

  for (const s of subscribers) {
    byPlan[s.plan] = (byPlan[s.plan] || 0) + 1;
    if (new Date(s.joinedAt).getTime() > sevenDaysAgo) recent++;
  }

  return { total: subscribers.length, subscribers, byPlan, recent, leads };
}

export default async function Dashboard(props: {
  searchParams: Promise<{ secret?: string }>;
}) {
  const searchParams = await props.searchParams;
  const data = await getData(searchParams?.secret);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 font-mono text-lg mb-2">401 — Unauthorized</div>
          <div className="text-slate-600 text-sm">Agrega ?secret=ADMIN_SECRET a la URL</div>
        </div>
      </div>
    );
  }

  const { total, subscribers, byPlan, recent, leads } = data;

  const mrr = ((byPlan["Básico"] || 0) * 15) + ((byPlan["PRO"] || 0) * 25);

  const stats = [
    { label: "MRR (USD)", value: `$${mrr}`, color: "text-green-400" },
    { label: "Total suscriptores", value: total, color: "text-cyan-400" },
    { label: "Plan Básico ($15)", value: byPlan["Básico"] || 0, color: "text-slate-300" },
    { label: "Plan PRO ($25)", value: byPlan["PRO"] || 0, color: "text-cyan-400" },
    { label: "Leads capturados", value: leads, color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white">
            SmartPro<span className="text-cyan-400">IA</span> · Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">Panel de administración</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-slate-500 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-white">Suscriptores ({total})</h2>
            <span className="text-xs text-slate-600 font-mono">
              curl /api/subscribers -H "x-admin-secret: {searchParams?.secret}"
            </span>
          </div>
          {total === 0 ? (
            <div className="px-6 py-16 text-center text-slate-600">
              Sin suscriptores aún. El webhook de Mercado Pago guardará aquí cuando haya pagos.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-6 py-3">Email</th>
                    <th className="text-left px-6 py-3">Nombre</th>
                    <th className="text-left px-6 py-3">Plan</th>
                    <th className="text-left px-6 py-3">Fecha</th>
                    <th className="text-left px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s: any, i: number) => (
                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-300 font-mono text-xs">{s.email}</td>
                      <td className="px-6 py-4 text-slate-400">{s.name || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          s.plan === "PRO"
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}>
                          {s.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(s.joinedAt).toLocaleDateString("es-CL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium ${
                          s.status === "active" ? "text-green-400" : "text-red-400"
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-slate-700 text-xs">
          © 2026 SmartProIA · Dashboard privado
        </div>
      </div>
    </div>
  );
}
