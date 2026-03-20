import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 p-4">
      {children}
    </div>
  );
}
