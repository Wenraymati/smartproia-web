import Link from "next/link";

export const metadata = {
  title: "¡Pago exitoso! Bienvenido a SmartProIA",
  description: "Tu suscripción fue procesada. Revisa tu correo para acceder al canal.",
  robots: "noindex",
};

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const plan = searchParams?.plan || "Canal";

  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">

        {/* Check icon */}
        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-white mb-3">
          ¡Bienvenido a SmartPro<span className="text-cyan-400">IA</span>!
        </h1>
        <p className="text-slate-400 mb-10 text-lg">
          Tu pago fue procesado exitosamente.
        </p>

        {/* Steps */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-left mb-8 space-y-6">
          <h2 className="text-white font-bold text-lg mb-2">Próximos pasos:</h2>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400 font-bold text-sm">1</div>
            <div>
              <div className="text-white font-semibold">Revisa tu correo</div>
              <div className="text-slate-400 text-sm mt-1">
                Te enviamos un email con el <strong className="text-cyan-400">link de acceso al canal Telegram</strong> en los próximos minutos.
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400 font-bold text-sm">2</div>
            <div>
              <div className="text-white font-semibold">Únete al canal privado</div>
              <div className="text-slate-400 text-sm mt-1">
                El canal <strong className="text-white">@SmartProIAVIP</strong> publica señales crypto a las <strong className="text-cyan-400">6:00 AM</strong> cada día hábil con análisis BTC, ETH y SOL.
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400 font-bold text-sm">3</div>
            <div>
              <div className="text-white font-semibold">Activa notificaciones</div>
              <div className="text-slate-400 text-sm mt-1">
                En Telegram, silencia el canal si quieres leer a tu ritmo, o activa las notificaciones para no perderte ninguna señal.
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5 mb-8 text-sm text-slate-400">
          ¿No recibiste el email?{" "}
          <a
            href="https://wa.me/56962326907"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Escríbenos por WhatsApp
          </a>{" "}
          y te enviamos el acceso de inmediato.
        </div>

        <Link
          href="/"
          className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
        >
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
