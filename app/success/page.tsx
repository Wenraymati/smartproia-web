import Link from "next/link";

export const metadata = {
  title: "¡Tu bot está en camino! — SmartProIA",
  description:
    "Recibimos tu pago. El proceso de implementación de tu bot de WhatsApp comienza ahora.",
  robots: "noindex",
};

const steps = [
  {
    icon: "✅",
    label: "Pago confirmado",
    desc: "Tu pago fue procesado exitosamente.",
    done: true,
  },
  {
    icon: "📋",
    label: "Revisamos tu solicitud",
    desc: "Hoy mismo nuestro equipo revisa los detalles de tu negocio.",
    done: false,
  },
  {
    icon: "🔧",
    label: "Configuramos tu bot",
    desc: "Diseñamos los flujos y configuramos el bot para tu negocio. Tarda 1–2 días hábiles.",
    done: false,
  },
  {
    icon: "🧪",
    label: "Testing interno",
    desc: "Probamos cada flujo antes del lanzamiento. Día 3.",
    done: false,
  },
  {
    icon: "🚀",
    label: "Bot activo en tu WhatsApp",
    desc: "Tu bot entra en producción y empieza a atender clientes. Día 3–4.",
    done: false,
  },
];

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Check icon */}
        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-white mb-3">
          ¡Tu bot está en camino! 🤖
        </h1>
        <p className="text-slate-400 mb-10 text-lg">
          Recibimos tu pago. Ahora arranca el proceso de implementación.
        </p>

        {/* Steps */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-left mb-8 space-y-5">
          <h2 className="text-white font-bold text-lg mb-4">
            Proceso de implementación:
          </h2>
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm border ${
                  step.done
                    ? "bg-green-500/20 border-green-500/40 text-green-400"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                {i + 1}
              </div>
              <div className="pt-1">
                <div className="flex items-center gap-2">
                  <span>{step.icon}</span>
                  <span
                    className={`font-semibold ${step.done ? "text-green-400" : "text-white"}`}
                  >
                    {step.label}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5 mb-8 text-sm text-slate-400 leading-relaxed">
          <p>
            <strong className="text-slate-300">¿Dudas?</strong> Escríbenos:{" "}
            <a
              href="mailto:contacto@smartproia.com"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              contacto@smartproia.com
            </a>{" "}
            o WhatsApp{" "}
            <a
              href="https://wa.me/56962326907"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              +56962326907
            </a>
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl px-6 py-3 transition-colors text-sm"
        >
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
