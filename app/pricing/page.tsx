import Link from "next/link";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { Badge } from "../components/Badge";

export const metadata = {
  title: "Precios — SmartProIA Bots WhatsApp",
  description:
    "Plan claro para automatizar WhatsApp en tu negocio. $499 setup + $99/mes. Sin contratos de permanencia.",
};

const WA_CONTACT =
  "https://wa.me/56962326907?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20planes";

const PLAN_FEATURES = [
  "24/7 atención automática",
  "IA con contexto de tu negocio",
  "Calificación de leads automática",
  "Dashboard Chatwoot incluido",
  "Alertas para casos urgentes",
  "Sin límite de conversaciones",
  "Setup en 7 días",
  "1er mes gratis",
];

const pricingFaqs = [
  {
    q: "¿El setup es un pago único?",
    a: "Sí, se paga una vez al contratar. El mantenimiento mensual cubre actualizaciones, soporte y hosting del bot. No hay costos ocultos.",
  },
  {
    q: "¿Qué pasa si quiero cancelar?",
    a: "Puedes cancelar con 30 días de aviso. El bot permanece activo hasta el fin del período pagado. Sin penalizaciones ni permanencia mínima.",
  },
  {
    q: "¿Los precios son en USD o en pesos?",
    a: "Los precios están en USD. Podemos cotizar en pesos chilenos o argentinos según el caso. Consulta por WhatsApp.",
  },
  {
    q: "¿Hay prueba gratuita?",
    a: "No ofrecemos trial, pero sí una demo gratuita de 30 minutos donde te mostramos el bot funcionando con un ejemplo real para tu negocio. Sin compromiso.",
  },
  {
    q: "¿Qué incluye el primer mes gratis?",
    a: "Al contratar, el primer mes de mantenimiento no se cobra. Solo pagas el setup inicial de $499 USD y arrancás.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans antialiased">
      {/* Navbar */}
      <header className="border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-black tracking-tight text-white">
          SmartPro<span className="text-green-400">IA</span>
        </Link>
        <a
          href={WA_CONTACT}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl px-4 py-2 text-sm transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5" /> Consultar por WhatsApp
        </a>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge>Plan y precio</Badge>
          <h1 className="text-5xl font-black text-white mt-6 mb-4">
            Inversión clara.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              Sin sorpresas.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Setup único + mantenimiento mensual. Sin contratos de permanencia.
            Cancelás cuando quieras.
          </p>
        </div>

        {/* Single pricing card */}
        <div className="relative bg-gradient-to-b from-green-950/40 to-slate-900 border-2 border-green-500/50 rounded-2xl p-10 shadow-xl shadow-green-500/10 mb-20">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="bg-green-500 text-slate-950 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wide">
              1er mes gratis
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
            {/* Left: name + price */}
            <div className="flex-1">
              <h2 className="text-2xl font-black text-green-400 mb-2">Bot WhatsApp IA</h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-sm">
                Todo lo que necesitás para automatizar la atención de tu negocio desde el día uno.
              </p>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-black text-white">$499</span>
                <span className="text-slate-400 text-sm">USD setup único</span>
              </div>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-3xl font-bold text-green-400">$99</span>
                <span className="text-slate-500 text-sm">USD/mes</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/cotizar"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl px-6 py-3 transition-all shadow-lg shadow-green-500/20 text-sm"
                >
                  <ArrowRight className="w-4 h-4" /> Cotizar ahora
                </Link>
                <a
                  href={WA_CONTACT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-slate-700 text-slate-300 hover:border-green-500 hover:text-green-400 font-semibold rounded-xl px-6 py-3 transition-all text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Hablar por WhatsApp
                </a>
              </div>
            </div>

            {/* Right: features */}
            <ul className="space-y-3 sm:min-w-[220px]">
              {PLAN_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <h2 className="text-2xl font-black text-white text-center mb-8">
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {pricingFaqs.map((faq, i) => (
              <div
                key={i}
                className="border border-slate-800 rounded-xl bg-slate-900/40 p-5"
              >
                <p className="text-white font-semibold text-sm mb-2">{faq.q}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="relative inline-block w-full max-w-lg">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-10">
              <MessageCircle className="w-10 h-10 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-3">
                ¿Preguntas? Hablemos.
              </h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                En 30 minutos te hacemos una demo del bot con un ejemplo real
                para tu negocio.
              </p>
              <a
                href={WA_CONTACT}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl px-7 py-3.5 transition-all shadow-lg shadow-green-500/20"
              >
                <MessageCircle className="w-4 h-4" /> Hablar por WhatsApp
              </a>
              <p className="text-slate-700 text-xs mt-4">
                Sin compromiso · Respondemos en menos de 2 horas
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-700 mt-10">
        <Link href="/" className="hover:text-slate-400 transition-colors">
          SmartProIA
        </Link>{" "}
        · smartproia.com · © 2026
      </footer>
    </div>
  );
}
