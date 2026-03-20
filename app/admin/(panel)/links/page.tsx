export const dynamic = "force-dynamic";

interface LinkItem {
  label: string;
  href: string;
  description?: string;
}

interface LinkCategory {
  title: string;
  icon: string;
  links: LinkItem[];
}

const categories: LinkCategory[] = [
  {
    title: "Produccion",
    icon: "◈",
    links: [
      {
        label: "SmartProIA Web",
        href: "https://smartproia.com",
        description: "Sitio principal en produccion",
      },
      {
        label: "Dashboard Usuarios",
        href: "https://smartproia.com/dashboard",
        description: "Panel de suscriptores",
      },
      {
        label: "Infra Admin",
        href: "/admin/infra",
        description: "Estado de servicios",
      },
    ],
  },
  {
    title: "Bots Railway",
    icon: "◎",
    links: [
      {
        label: "GymBot — Railway",
        href: "https://railway.app/project",
        description: "Wenraymati/gymbot",
      },
      {
        label: "Ruiz & Ruiz — Railway",
        href: "https://railway.app/project",
        description: "Wenraymati/ruizruiz-bot",
      },
    ],
  },
  {
    title: "VPS",
    icon: "⬡",
    links: [
      {
        label: "Chatwoot",
        href: "https://chatwoot.smartproia.com",
        description: "CRM conversaciones",
      },
      {
        label: "Evolution API",
        href: "https://api.smartproia.com",
        description: "API WhatsApp",
      },
      {
        label: "Monitor HTTP",
        href: "http://187.77.243.217:8766",
        description: "Dashboard VPS :8766",
      },
      {
        label: "Hostinger Panel",
        href: "https://hpanel.hostinger.com",
        description: "Control VPS 187.77.243.217",
      },
    ],
  },
  {
    title: "Repositorios",
    icon: "⊞",
    links: [
      {
        label: "smartproia-web",
        href: "https://github.com/Wenraymati/smartproia-web",
        description: "Next.js · Vercel",
      },
      {
        label: "gymbot",
        href: "https://github.com/Wenraymati/gymbot",
        description: "Bot GymBot Ludus",
      },
      {
        label: "ruizruiz-bot",
        href: "https://github.com/Wenraymati/ruizruiz-bot",
        description: "Bot Ruiz & Ruiz",
      },
    ],
  },
  {
    title: "Canales",
    icon: "⊙",
    links: [
      {
        label: "WhatsApp Soporte",
        href: "https://wa.me/56962326907",
        description: "+56 9 6232 6907",
      },
      {
        label: "Telegram VIP",
        href: "https://t.me/c/3809856981/1",
        description: "Canal senales VIP",
      },
    ],
  },
];

export default function LinksPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Links Rapidos</h1>
        <p className="text-slate-500 text-sm mt-1">
          Accesos directos a paneles, servicios y herramientas
        </p>
      </div>

      {/* Grid of categories */}
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
      <div className="flex items-center gap-2 mb-4">
        <span className="text-slate-400 text-base">{category.icon}</span>
        <h2 className="text-white font-semibold text-sm">{category.title}</h2>
      </div>
      <ul className="space-y-0.5">
        {category.links.map((link) => (
          <li key={link.href + link.label}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex items-center gap-2 text-sm py-2 px-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors group"
            >
              <span className="flex-1 min-w-0">
                <span className="block truncate">{link.label}</span>
                {link.description && (
                  <span className="block text-xs text-slate-600 group-hover:text-slate-500 truncate mt-0.5">
                    {link.description}
                  </span>
                )}
              </span>
              {link.href.startsWith("http") && (
                <span className="shrink-0 text-slate-600 group-hover:text-cyan-500 transition-colors">
                  ↗
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
