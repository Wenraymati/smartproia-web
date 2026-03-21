"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "◈" },
  { href: "/admin/finance", label: "Finanzas", icon: "💰" },
  { href: "/admin/empresas", label: "Empresas", icon: "◫" },
  { href: "/admin/bots", label: "Leads", icon: "◎" },
  { href: "/admin/funnel", label: "Funnel", icon: "📊" },
  { href: "/admin/cotizar-leads", label: "Cotizar Leads", icon: "🎯" },
  { href: "/admin/infra", label: "Infra", icon: "⬡" },
  { href: "/admin/qr", label: "QR WhatsApp", icon: "▣" },
  { href: "/admin/vault", label: "Accesos", icon: "⊛" },
  { href: "/admin/credentials", label: "Credenciales", icon: "🔐" },
  { href: "/admin/links", label: "Links", icon: "⊞" },
  { href: "/admin/cron", label: "Cron Jobs", icon: "⏱" },
  { href: "/admin/audit", label: "Auditoría", icon: "📋" },
];

// The 5 primary items shown in the mobile bottom bar
const mobileNavItems = [
  { href: "/admin", label: "Dashboard", icon: "🏠" },
  { href: "/admin/finance", label: "Finanzas", icon: "💰" },
  { href: "/admin/bots", label: "Leads", icon: "👥" },
  { href: "/admin/infra", label: "Infra", icon: "🖥️" },
  { href: "/admin/qr", label: "QR", icon: "📱" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/admin/api/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="hidden md:flex w-56 shrink-0 bg-slate-900 border-r border-slate-800 flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-slate-800">
        <p className="text-white font-bold text-sm">SmartProIA</p>
        <p className="text-slate-500 text-xs">Admin Panel</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <span>⊗</span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/admin/api/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50">
      <div className="flex items-center">
        {mobileNavItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 px-1 text-center transition-colors ${
                active ? "text-cyan-400" : "text-slate-400"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-[10px] leading-tight">{item.label}</span>
            </Link>
          );
        })}
        {/* Logout icon on the right */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 py-2 px-3 text-slate-500 hover:text-red-400 transition-colors"
          aria-label="Cerrar sesión"
        >
          <span className="text-lg leading-none">⊗</span>
          <span className="text-[10px] leading-tight">Salir</span>
        </button>
      </div>
    </nav>
  );
}
