import Link from "next/link";
import { CheckCircle2, X, MessageCircle } from "lucide-react";
import { Badge } from "../components/Badge";

export const metadata = {
  title: "Precios — SmartProIA Bots WhatsApp",
  description:
    "Planes claros para automatizar WhatsApp en tu negocio. Setup único + mantenimiento mensual. Sin contratos de permanencia.",
};

const WA_CONTACT =
  "https://wa.me/56962326907?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20planes";

const plans = [
  {
    name: "Basic",
    setup: "$250",
    monthly: "$60",
    tagline: "Para negocios que están comenzando a automatizar",
    highlight: false,
    features: [
      "Hasta 500 mensajes/mes",
      "1 número WhatsApp Business",
      "Hasta 5 flujos de conversación",
      "Dashboard Chatwoot para tu equipo",
      "Reporte mensual de conversaciones",
      "Soporte por email",
      "Setup en 7 días hábiles",
    ],
    cta: "Empezar con Basic",
  },
  {
    name: "Standard",
    setup: "$350",
    monthly: "$90",
    tagline: "El más elegido por negocios con flujo constante de consultas",
    highlight: true,
    features: [
      "Mensajes ilimitados",
      "1 número WhatsApp Business",
      "Flujos ilimitados",
      "Dashboard Chatwoot + múltiples agentes",
      "Reporte semanal detallado",
      "Soporte por WhatsApp",
      "Ajustes mensuales incluidos",
      "Setup en 7 días hábiles",
    ],
    cta: "Empezar con Standard",
  },
  {
    name: "Premium",
    setup: "$500",
    monthly: "$150",
    tagline: "Para empresas con operación compleja o múltiples sucursales",
    highlight: false,
    features: [
      "Todo lo de Standard",
      "Múltiples números WhatsApp",
      "Bot multiagente con escalado",
      "Integraciones con CRM o sistemas propios",
      "Gestor dedicado de cuenta",
      "Reportes personalizados",
      "SLA de respuesta prioritario",
      "Setup en 5 días hábiles",
    ],
    cta: "Empezar con Premium",
  },
];

const featureRows = [
  { label: "Mensajes/mes", basic: "Hasta 500", standard: "Ilimitados", premium: "Ilimitados" },
  { label: "Números WhatsApp", basic: "1", standard: "1", premium: "Múltiples" },
  { label: "Flujos de conversación", basic: "Hasta 5", standard: "Ilimitados", premium: "Ilimitados" },
  { label: "Dashboard Chatwoot", basic: true, standard: true, premium: true },
  { label: "Reportes", basic: "Mensual", standard: "Semanal", premium: "Personalizado" },
  { label: "Soporte", basic: "Email", standard: "WhatsApp", premium: "Prioritario + gestor" },
  { label: "Integraciones CRM", basic: false, standard: false, premium: true },
  { label: "Bot multiagente", basic: false, standard: false, premium: true },
  { label: "Ajustes mensuales", basic: false, standard: true, premium: true },
  { label: "Setup en días hábiles", basic: "7 días", standard: "7 días", premium: "5 días" },
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
    q: "¿Puedo cambiar de plan?",
    a: "Sí, en cualquier momento. El cambio aplica al próximo período de facturación. Si subís de plan, la diferencia se prorratea.",
  },
  {
    q: "¿Los precios son en USD o en pesos?",
    a: "Los precios están en USD. Podemos cotizar en pesos chilenos o argentinos según el caso. Consulta por WhatsApp.",
  },
  {
    q: "¿Hay prueba gratuita?",
    a: "No ofrecemos trial, pero sí una demo gratuita de 30 minutos donde te mostramos el bot funcionando con un ejemplo real para tu negocio. Sin compromiso.",
  },
];

function CheckOrX({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-slate-300">{value}</span>;
  }
  return value ? (
    <CheckCircle2 className="w-4 h-4 text-green-400 mx-auto" />
  ) : (
    <X className="w-4 h-4 text-slate-700 mx-auto" />
  );
}

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

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge>Planes y precios</Badge>
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

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? "bg-gradient-to-b from-green-950/40 to-slate-900 border-2 border-green-500/50 shadow-xl shadow-green-500/10"
                  : "bg-slate-900/60 border border-slate-800"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-slate-950 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wide">
                    Más popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-bold text-white mb-1">{plan.name}</h2>
                <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                  {plan.tagline}
                </p>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-3xl font-black ${plan.highlight ? "text-green-400" : "text-white"}`}
                    >
                      {plan.setup}
                    </span>
                    <span className="text-slate-500 text-sm">setup único</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-slate-300">
                      {plan.monthly}
                    </span>
                    <span className="text-slate-500 text-sm">/mes</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-slate-400"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-green-400" : "text-slate-600"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={WA_CONTACT}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 font-bold rounded-xl px-6 py-3 transition-all text-sm ${
                  plan.highlight
                    ? "bg-green-500 hover:bg-green-400 text-slate-950 shadow-lg shadow-green-500/20"
                    : "border border-slate-700 text-slate-300 hover:border-green-500 hover:text-green-400 bg-transparent"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div className="mb-20">
          <h2 className="text-2xl font-black text-white text-center mb-8">
            Comparación de planes
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/30">
                    <th className="text-left py-4 px-6 text-slate-400 font-medium text-xs uppercase tracking-wider w-1/2">
                      Característica
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan.name}
                        className={`py-4 px-4 text-center text-xs font-bold uppercase tracking-wider ${
                          plan.highlight ? "text-green-400" : "text-slate-400"
                        }`}
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {featureRows.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 px-6 text-slate-300 text-sm">
                        {row.label}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <CheckOrX value={row.basic} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <CheckOrX value={row.standard} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <CheckOrX value={row.premium} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-20">
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
