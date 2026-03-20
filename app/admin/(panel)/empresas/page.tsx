export const dynamic = "force-dynamic";

interface Empresa {
  slug: string;
  nombre: string;
  tipo: string;
  bot: string;
  estado: "demo" | "activo" | "inactivo";
  contacto: string;
  email: string;
  leads: number;
  description: string;
}

const empresas: Empresa[] = [
  {
    slug: "gymbot-ludus",
    nombre: "Ludus Estación",
    tipo: "Gimnasio",
    bot: "GymBot Ludus",
    estado: "demo",
    contacto: "Pendiente",
    email: "Pendiente",
    leads: 0,
    description: "Demo activo. Sin QR de WhatsApp vinculado aún.",
  },
  {
    slug: "ruiz-ruiz",
    nombre: "Ruiz & Ruiz Consultores",
    tipo: "Estudio Contable",
    bot: "Ruiz & Ruiz Bot",
    estado: "demo",
    contacto: "Pendiente",
    email: "Pendiente",
    leads: 7,
    description: "Demo activo. QR vinculado, recibiendo leads reales.",
  },
];

const estadoBadge: Record<Empresa["estado"], string> = {
  demo: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  activo: "bg-green-500/10 text-green-400 border border-green-500/20",
  inactivo: "bg-slate-700 text-slate-400",
};

export default function EmpresasPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Empresas</h1>
          <p className="text-slate-400 text-sm mt-1">
            Clientes con bots WhatsApp activos
          </p>
        </div>
        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg">
          {empresas.length} empresa{empresas.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-4">
        {empresas.map((e) => (
          <div
            key={e.slug}
            className="bg-slate-900 border border-slate-700 rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-white font-semibold">{e.nombre}</h2>
                <p className="text-slate-500 text-sm">{e.tipo}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${estadoBadge[e.estado]}`}
              >
                {e.estado}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Bot</p>
                <p className="text-sm text-slate-300">{e.bot}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Contacto</p>
                <p className="text-sm text-slate-300">{e.contacto}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Email</p>
                <p className="text-sm text-slate-300">{e.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Leads</p>
                <p className="text-sm font-semibold text-cyan-400">{e.leads}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 border-t border-slate-800 pt-3">
              {e.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
        <p className="text-xs text-slate-500">
          <span className="text-slate-400 font-medium">Proximos pasos: </span>
          Agregar datos definitivos de contacto, vincular QR de gymbot-ludus,
          habilitar notificaciones por email.
        </p>
      </div>
    </div>
  );
}
