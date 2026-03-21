import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, ArrowRight, Clock, Users, TrendingUp, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Caso de éxito: Ruiz & Ruiz Abogados — SmartProIA',
  description: 'Cómo Ruiz & Ruiz Abogados automatizó la atención de WhatsApp con IA y dejó de perder consultas. Bot activo desde 2025.',
  openGraph: {
    title: 'Ruiz & Ruiz Abogados automatiza WhatsApp con SmartProIA',
    description: 'El estudio jurídico eliminó el tiempo perdido respondiendo consultas básicas y ahora su equipo se enfoca en los casos.',
    url: 'https://smartproia.com/casos/ruizruiz',
  },
};

const WA_CONTACT = 'https://wa.me/56962326907?text=Vi%20el%20caso%20de%20Ruiz%20%26%20Ruiz%20y%20quiero%20lo%20mismo%20para%20mi%20negocio';

const stats = [
  { icon: Users, value: '7+', label: 'Leads capturados', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { icon: Clock, value: '24/7', label: 'Atención sin parar', color: 'text-green-400', bg: 'bg-green-500/10' },
  { icon: TrendingUp, value: '100%', label: 'Consultas respondidas', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { icon: Shield, value: '0', label: 'Leads perdidos por demora', color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const timeline = [
  {
    phase: 'Semana 1',
    title: 'Diagnóstico y configuración',
    desc: 'Relevamos los tipos de consultas más frecuentes: honorarios, áreas de práctica, urgencias, agendamiento de reuniones. Diseñamos los flujos del bot.',
  },
  {
    phase: 'Semana 1',
    title: 'Conexión WhatsApp Business',
    desc: 'Conectamos el número oficial del estudio a la API de WhatsApp Business vía Evolution API, con panel Chatwoot para el equipo.',
  },
  {
    phase: 'Semana 2',
    title: 'Testing y ajustes',
    desc: 'El equipo probó el bot internamente, ajustamos respuestas, agregamos contexto específico del estudio y definimos cuándo derivar al abogado.',
  },
  {
    phase: 'Go live',
    title: 'Bot activo en producción',
    desc: 'El bot empezó a atender consultas reales. El equipo solo recibe notificaciones cuando hay urgencia o cierre inminente.',
  },
];

export default function CasoRuizRuizPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans antialiased">
      {/* Navbar */}
      <header className="border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="text-xl font-black tracking-tight text-white">
          SmartPro<span className="text-green-400">IA</span>
        </Link>
        <a
          href={WA_CONTACT}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl px-4 py-2 text-sm transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5" /> Quiero lo mismo
        </a>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Bot activo · En producción
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] mb-6">
            Cómo{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              Ruiz & Ruiz Abogados
            </span>{' '}
            dejó de perder consultas por WhatsApp
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed">
            El estudio jurídico automatizó la atención inicial de WhatsApp con IA. Hoy su equipo se
            enfoca en los casos importantes, no en responder preguntas básicas a las 11 de la noche.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {stats.map((s, i) => (
            <div key={i} className={`${s.bg} border border-slate-800 rounded-2xl p-5 text-center`}>
              <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-3`} />
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Context */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-white mb-4">El problema</h2>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 text-slate-400 leading-relaxed">
            <p>
              Ruiz & Ruiz es un estudio jurídico en Santiago que recibe consultas por WhatsApp
              todos los días — muchas de ellas fuera de horario de oficina. Antes del bot, cada
              mensaje entrante requería que alguien del equipo revisara, evaluara y respondiera.
            </p>
            <p>
              El resultado: <strong className="text-white">leads perdidos porque nadie respondía a las 10PM</strong>,
              tiempo valioso del equipo consumido en responder preguntas repetitivas como
              &quot;¿cuánto cobran?&quot; o &quot;¿atienden casos de divorcio?&quot;, y cero visibilidad de cuántas
              consultas llegaban ni en qué estado estaban.
            </p>
          </div>
        </section>

        {/* Solution */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-white mb-4">La solución</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Implementamos un bot de WhatsApp con IA entrenado en los servicios y flujos del
            estudio. El bot atiende 24/7, califica el tipo de consulta, responde preguntas
            frecuentes y agenda reuniones — derivando al abogado solo cuando hay interés real.
          </p>

          <div className="space-y-4">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-slate-800 mt-2" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-xs text-slate-600 font-mono mb-1">{t.phase}</p>
                  <p className="text-white font-bold mb-1">{t.title}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What the bot does */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-white mb-6">Qué hace el bot hoy</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Responde consultas de honorarios y áreas de práctica',
              'Califica si la consulta es urgente o puede esperar',
              'Agenda reuniones con el abogado disponible',
              'Captura nombre, teléfono y tipo de caso',
              'Deriva a humano cuando detecta urgencia real',
              'Opera 24/7, incluso fines de semana y feriados',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-900/40 border border-slate-800 rounded-xl p-4">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="mb-14">
          <div className="bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-700 rounded-2xl p-8">
            <div className="text-4xl text-green-400/40 font-serif mb-4">&ldquo;</div>
            <p className="text-xl text-white font-medium leading-relaxed mb-6">
              El bot atiende consultas de honorarios y agenda reuniones automáticamente. Ahora
              mi equipo se enfoca en los casos, no en responder WhatsApp.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
                R
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Ruiz & Ruiz Abogados</p>
                <p className="text-slate-500 text-xs">Estudio jurídico, Santiago de Chile</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            ¿Querés lo mismo para tu negocio?
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Setup en 7 días. Sin contratos. El bot se paga solo con los leads que recupera.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={WA_CONTACT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl px-7 py-4 transition-all shadow-lg shadow-green-500/20"
            >
              <MessageCircle className="w-4 h-4" /> Hablar por WhatsApp
            </a>
            <Link
              href="/cotizar"
              className="inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-green-500 text-slate-300 hover:text-green-400 font-semibold rounded-xl px-7 py-4 transition-all"
            >
              Cotizar en 2 minutos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer minimal */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-slate-600 text-sm mt-16">
        <Link href="/" className="hover:text-white transition-colors">SmartProIA</Link>
        {' · '}
        <Link href="/casos/ruizruiz" className="hover:text-white transition-colors">Casos de éxito</Link>
        {' · '}
        <Link href="/cotizar" className="hover:text-white transition-colors">Cotizar</Link>
      </footer>
    </div>
  );
}
