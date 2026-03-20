export const dynamic = "force-dynamic";

interface ServiceItem {
  name: string;
  url: string;
  description: string;
  auth: string;
  credential: string;
  adminOnly: boolean;
}

interface Layer {
  title: string;
  color: "cyan" | "violet" | "blue" | "amber";
  services: ServiceItem[];
}

const layers: Layer[] = [
  {
    title: "VPS — 187.77.243.217",
    color: "cyan",
    services: [
      {
        name: "Evolution API",
        url: "https://api.smartproia.com",
        description:
          "Gateway WhatsApp — crea instancias, envía mensajes, gestiona webhooks",
        auth: "API Key en header `apikey`",
        credential: "Variable: EVOLUTION_API_KEY en VPS .env",
        adminOnly: true,
      },
      {
        name: "Chatwoot",
        url: "https://chat.smartproia.com",
        description:
          "Inbox de soporte — conversaciones, agentes, bandejas de entrada",
        auth: "Usuario + contraseña (cuenta Chatwoot)",
        credential: "Cuenta admin creada en primer acceso",
        adminOnly: false,
      },
      {
        name: "Evolution Manager",
        url: "https://manager.smartproia.com",
        description:
          "GUI para gestionar instancias de Evolution API (QR, estado, config)",
        auth: "API Key de Evolution",
        credential: "Variable: EVOLUTION_API_KEY en VPS .env",
        adminOnly: true,
      },
      {
        name: "Uptime Kuma",
        url: "https://uptime.smartproia.com",
        description:
          "Monitoreo 24/7 — estado de todos los servicios, alertas Telegram",
        auth: "Admin user (creado en primer acceso)",
        credential: "Cuenta admin creada en primer acceso en Uptime Kuma",
        adminOnly: true,
      },
    ],
  },
  {
    title: "Railway — Bots",
    color: "violet",
    services: [
      {
        name: "GymBot Ludus",
        url: "https://illustrious-gentleness-production-66f1.up.railway.app",
        description:
          "Bot WhatsApp para gimnasio — calificación de leads, dashboard",
        auth: "Header x-dashboard-token",
        credential: "Variable: GYMBOT_DASHBOARD_TOKEN en Vercel + Railway",
        adminOnly: true,
      },
      {
        name: "Ruiz & Ruiz Bot",
        url: "https://ruizruiz-bot-production.up.railway.app",
        description:
          "Bot WhatsApp para estudio contable — leads, calificación, dashboard",
        auth: "Header x-dashboard-token",
        credential: "Variable: RUIZRUIZ_DASHBOARD_TOKEN en Vercel + Railway",
        adminOnly: true,
      },
      {
        name: "Railway Dashboard",
        url: "https://railway.com",
        description:
          "Panel de gestión de deployments, logs, variables de entorno",
        auth: "Login cuenta Railway (Wenraymati)",
        credential: "Cuenta personal railway.com",
        adminOnly: true,
      },
    ],
  },
  {
    title: "Vercel — Web",
    color: "blue",
    services: [
      {
        name: "SmartProIA Web",
        url: "https://smartproia.com",
        description:
          "Sitio web principal — landing, suscripciones, señales",
        auth: "Auto-deploy desde GitHub master",
        credential: "GitHub: Wenraymati/smartproia-web",
        adminOnly: false,
      },
      {
        name: "Admin Panel",
        url: "https://smartproia.com/admin",
        description:
          "Panel de administración centralizado (este panel)",
        auth: "Clave ADMIN_SECRET + cookie de sesión",
        credential: "Variable: ADMIN_SECRET en Vercel",
        adminOnly: true,
      },
      {
        name: "Vercel Dashboard",
        url: "https://vercel.com/smartproias-projects/smartproia-web",
        description:
          "Deployments, logs, variables de entorno de la web",
        auth: "Login cuenta Vercel",
        credential: "Cuenta personal vercel.com",
        adminOnly: true,
      },
    ],
  },
  {
    title: "APIs Externas",
    color: "amber",
    services: [
      {
        name: "Upstash Redis",
        url: "https://console.upstash.com",
        description:
          "Base de datos Redis para señales, suscriptores, caché",
        auth: "Token REST",
        credential:
          "Variables: UPSTASH_REDIS_REST_URL + TOKEN en Vercel",
        adminOnly: true,
      },
      {
        name: "Mercado Pago",
        url: "https://www.mercadopago.com.ar/developers",
        description:
          "Procesamiento de pagos para suscripciones SmartProIA",
        auth: "Access Token",
        credential: "Variable: MERCADOPAGO_ACCESS_TOKEN en Vercel",
        adminOnly: true,
      },
      {
        name: "Resend Email",
        url: "https://resend.com",
        description:
          "Envío de emails transaccionales (bienvenida, notificaciones)",
        auth: "API Key",
        credential: "Variable: RESEND_API_KEY en Vercel",
        adminOnly: true,
      },
      {
        name: "GitHub",
        url: "https://github.com/Wenraymati",
        description:
          "Repositorios de código fuente de todos los proyectos",
        auth: "Login cuenta GitHub",
        credential: "Cuenta personal: Wenraymati",
        adminOnly: true,
      },
    ],
  },
];

const layerAccent: Record<Layer["color"], string> = {
  cyan: "border-cyan-500/30",
  violet: "border-violet-500/30",
  blue: "border-blue-500/30",
  amber: "border-amber-500/30",
};

const layerDot: Record<Layer["color"], string> = {
  cyan: "bg-cyan-400",
  violet: "bg-violet-400",
  blue: "bg-blue-400",
  amber: "bg-amber-400",
};

const linkColor: Record<Layer["color"], string> = {
  cyan: "text-cyan-400 hover:text-cyan-300",
  violet: "text-violet-400 hover:text-violet-300",
  blue: "text-blue-400 hover:text-blue-300",
  amber: "text-amber-400 hover:text-amber-300",
};

export default function VaultPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Accesos</h1>
        <p className="text-slate-400 text-sm mt-1">
          Guía centralizada de credenciales y puntos de acceso del sistema
        </p>
      </div>

      <div className="mb-6 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl">
        <p className="text-xs text-slate-500">
          <span className="text-slate-400 font-medium">Nota de seguridad: </span>
          Esta página muestra solo el nombre de las variables de entorno, nunca sus
          valores. Los secretos reales están en Vercel Dashboard y en el archivo{" "}
          <span className="font-mono text-slate-400">.env</span> del VPS.
        </p>
      </div>

      {layers.map((layer) => (
        <div
          key={layer.title}
          className={`bg-slate-900 border ${layerAccent[layer.color]} rounded-xl overflow-hidden mb-6`}
        >
          <div className="px-5 py-3 border-b border-slate-700/60 bg-slate-800/50 flex items-center gap-2.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${layerDot[layer.color]}`} />
            <h2 className="text-sm font-semibold text-slate-200">{layer.title}</h2>
            <span className="ml-auto text-xs text-slate-600">
              {layer.services.length} servicio{layer.services.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {layer.services.map((service) => (
              <div
                key={service.name}
                className="px-5 py-4 flex items-start gap-4 hover:bg-slate-800/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-medium transition-colors ${linkColor[layer.color]}`}
                    >
                      {service.name} ↗
                    </a>
                    {service.adminOnly && (
                      <span className="text-xs px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded">
                        solo admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-1.5">{service.description}</p>
                  <p className="text-xs text-slate-500">
                    <span className="text-slate-600">Auth:</span> {service.auth}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 font-mono">
                    {service.credential}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
