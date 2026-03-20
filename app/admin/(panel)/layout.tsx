import { Sidebar, MobileNav } from "../components/Sidebar";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 md:p-8 pb-20 md:pb-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
