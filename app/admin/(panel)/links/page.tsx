export const dynamic = "force-dynamic";

interface LinkItem {
  label: string;
  href: string;
  description: string;
  requiresAuth?: boolean;
}

interface LinkCategory {
  title: string;
  subtitle?: string;
  adminOnly: boolean;
  links: LinkItem[];
}

const categories: LinkCategory[] = [
  {
    title: "Admin — VPS",
    subtitle: "Solo acceso administrador",
    adminOnly: true,
    links: [
      {
        label: "Evolution Manager",
        href: "https://manager.smartproia.com",
        description: "GUI para instancias WhatsApp — QR, estado, webhooks",
      },
      {
        label: "Uptime Kuma",
        href: "https://uptime.smartproia.com",
        description: "Monitoreo 24/7 de todos los servicios",
      },
      {
        label: "Chatwoot (Admin)",
        href: "https://chat.smartproia.com",
        description:
          "Inbox de soporte — configurar cuentas, inboxes, agentes",
      },
      {
        label: "Evolution API Docs",
        href: "https://api.smartproia.com/api/v1/swagger",
        description: "Documentacion de la API (Swagger UI)",
      },
    ],
  },
  {
    title: "Admin — Deployments",
    subtitle: "Gestión de código e infraestructura",
    adminOnly: true,
    links: [
      {
        label: "Vercel — smartproia-web",
        href: "https://vercel.com/smartproias-projects/smartproia-web",
        description: "Deployments, logs, env vars de la web",
      },
      {
        label: "Railway — GymBot",
        href: "https://railway.com",
        description: "Logs, deploys y variables del gymbot-ludus",
        requiresAuth: true,
      },
      {
        label: "Railway — Ruiz & Ruiz",
        href: "https://railway.com",
        description: "Logs, deploys y variables del ruizruiz-bot",
        requiresAuth: true,
      },
      {
        label: "GitHub — Organizacion",
        href: "https://github.com/Wenraymati",
        description: "Repositorios de todos los proyectos",
      },
    ],
  },
  {
    title: "Cliente — Acceso público",
    subtitle: "Links que se entregan al cliente",
    adminOnly: false,
    links: [
      {
        label: "Chatwoot — Inbox",
        href: "https://chat.smartproia.com",
        description:
          "El cliente accede aquí para ver conversaciones de WhatsApp",
      },
      {
        label: "SmartProIA Web",
        href: "https://smartproia.com",
        description: "Sitio web principal",
      },
    ],
  },
  {
    title: "APIs Externas",
    subtitle: "Servicios de terceros",
    adminOnly: true,
    links: [
      {
        label: "Upstash Console",
        href: "https://console.upstash.com",
        description: "Redis — señales, suscriptores, caché",
      },
      {
        label: "Resend Dashboard",
        href: "https://resend.com",
        description: "Emails transaccionales y métricas de entrega",
      },
      {
        label: "Mercado Pago",
        href: "https://www.mercadopago.com.ar/developers",
        description: "Pagos, suscripciones y webhooks",
      },
    ],
  },
  {
    title: "WhatsApp & Canales",
    adminOnly: false,
    links: [
      {
        label: "WhatsApp Soporte",
        href: "https://wa.me/56962326907",
        description: "Linea de soporte directo SmartProIA",
      },
      {
        label: "Telegram VIP",
        href: "https://t.me/c/3809856981/1",
        description: "Canal de señales VIP (suscriptores)",
      },
    ],
  },
];

export default function LinksPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Links</h1>
        <p className="text-slate-500 text-sm mt-1">
          Accesos directos a paneles, servicios y herramientas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((category) => (
          <CategoryCard key={category.title} category={category} />
        ))}
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: LinkCategory }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <h2 className="text-white font-semibold text-sm">{category.title}</h2>
          {category.subtitle && (
            <p className="text-slate-600 text-xs mt-0.5">{category.subtitle}</p>
          )}
        </div>
        {category.adminOnly && (
          <span className="shrink-0 text-xs px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded">
            admin
          </span>
        )}
      </div>
      <ul className="space-y-0.5">
        {category.links.map((link) => (
          <li key={link.href + link.label}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="flex items-center gap-2 text-sm py-2 px-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors group"
            >
              <span className="flex-1 min-w-0">
                <span className="block truncate">{link.label}</span>
                <span className="block text-xs text-slate-600 group-hover:text-slate-500 truncate mt-0.5">
                  {link.description}
                </span>
              </span>
              {link.requiresAuth && (
                <span className="shrink-0 text-xs text-yellow-600 border border-yellow-700/40 bg-yellow-500/5 rounded px-1.5 py-0.5 font-medium">
                  auth
                </span>
              )}
              {link.href.startsWith("http") && (
                <span className="shrink-0 text-slate-600 group-hover:text-cyan-500 transition-colors">
                  &#8599;
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
