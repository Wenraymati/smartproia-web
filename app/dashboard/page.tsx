import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-4xl mb-4">&#9881;&#65039;</div>
        <h1 className="text-xl font-bold text-white mb-2">
          Dashboard en mantenimiento
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Esta sección está temporalmente fuera de servicio mientras actualizamos
          nuestros servicios.
        </p>
        <Link
          href="/"
          className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
