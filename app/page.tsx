'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Bot, LineChart, Bell, Zap,
  CheckCircle2, MessageCircle, Star,
} from 'lucide-react';

import { Counter } from './components/Counter';
import { Badge } from './components/Badge';
import { Btn } from './components/Btn';
import { LiveSignal } from './components/LiveSignal';
import { PriceCard } from './components/PriceCard';
import { FAQ } from './components/FAQ';
import { MobileNav } from './components/MobileNav';
import { StickyCTA } from './components/StickyCTA';
import { LeadModal } from './components/LeadModal';

const MP_BASIC = '/api/checkout?plan=basico';
const MP_PRO   = '/api/checkout?plan=pro';
const WA_BOT       = 'https://wa.me/56962326907?text=Hola%2C%20quiero%20cotizar%20un%20bot%20propio%20SmartProIA';
const WA_FREE      = 'https://wa.me/56962326907?text=Hola%2C%20quiero%20probar%20SmartProIA%20gratis%207%20dias';

const testimonials = [
  { name: 'Carlos M.', role: 'Trader independiente', text: 'Antes perdía tiempo mirando el mercado cada mañana. Ahora leo la señal a las 6 AM y ya sé qué hacer.', stars: 5 },
  { name: 'Valentina R.', role: 'Inversora particular', text: 'Lo que más me gusta es que cuando dice NO-GO, realmente no entro. Mi capital está más protegido.', stars: 5 },
  { name: 'Rodrigo A.', role: 'Crypto enthusiast', text: 'Contraté el bot propio. En 3 días estaba funcionando en mi VPS. El soporte fue excelente.', stars: 5 },
];

export default function SmartProIA() {
  const [leadModal, setLeadModal] = useState(false);
  const openLead = () => setLeadModal(true);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans antialiased selection:bg-cyan-500/20">
      <LeadModal open={leadModal} onClose={() => setLeadModal(false)} redirectUrl={WA_FREE} />
      <StickyCTA onOpen={openLead} />

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-black tracking-tight text-white">
            SmartPro<span className="text-cyan-400">IA</span>
          </div>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#producto" className="hover:text-white transition-colors">Producto</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
            <a href="#servicios" className="hover:text-white transition-colors">Servicios</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Btn onClick={openLead} className="text-sm px-4 py-2">
              Probar gratis <ArrowRight className="w-3.5 h-3.5" />
            </Btn>
          </div>
          {/* Mobile hamburger */}
          <MobileNav onCtaClick={openLead} waFree={WA_FREE} />
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-6">
                <Badge>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Bot activo · Operando desde Chile 🇨🇱
                </Badge>
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                Señales Crypto<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  con IA real.
                </span><br />
                Cada mañana.
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                A las <strong className="text-white">6:00 AM</strong> un bot autónomo analiza BTC, ETH y SOL con 10+ variables y te envía una señal directa al canal Telegram:{' '}
                <strong className="text-cyan-400">GO · CAUTION · NO-GO.</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <Btn onClick={openLead} className="text-base px-7 py-3.5">
                  7 días gratis <ArrowRight className="w-4 h-4" />
                </Btn>
                <Btn href="#producto" variant="outline" className="text-base px-7 py-3.5">
                  Ver cómo funciona
                </Btn>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-800">
                {[
                  { n: 10, s: '+', label: 'Variables' },
                  { n: 7, s: '/7', label: 'Días activo' },
                  { n: 3, s: '', label: 'Mercados' },
                  { n: 200, s: '+', label: 'Suscriptores' },
                ].map((st, i) => (
                  <div key={i}>
                    <div className="text-3xl font-black text-white">
                      <Counter to={st.n} suffix={st.s} />
                    </div>
                    <div className="text-xs text-slate-600 uppercase tracking-widest mt-1">{st.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Live signal */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <LiveSignal />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <div className="border-y border-slate-800/60 bg-slate-900/20 py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
          {['Sin acceso a tu cuenta', '100% autónomo 24/7', 'Señal diaria a las 6 AM', 'Cancela cuando quieras', 'Hecho en Chile'].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500/60" />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* ── CÓMO FUNCIONA ── */}
      <section id="producto" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge>Cómo funciona</Badge>
            <h2 className="text-4xl font-black text-white mt-4 mb-4">Sin complicaciones. Sin emociones.</h2>
            <p className="text-slate-400 max-w-lg mx-auto">El bot hace el trabajo. Tú recibes la conclusión.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              {
                step: '01', title: 'Recopila datos',
                desc: 'Funding rate, Long/Short ratio, Open Interest, Fear & Greed, volumen, RSI, MACD, noticias y más.',
                icon: Bot, color: 'text-blue-400', bg: 'bg-blue-500/8',
              },
              {
                step: '02', title: 'Analiza con IA',
                desc: 'Clasifica 10+ variables y genera un score de confluencia. Prioriza NO-GO ante señales mixtas.',
                icon: LineChart, color: 'text-cyan-400', bg: 'bg-cyan-500/8',
              },
              {
                step: '03', title: 'Señal al canal',
                desc: 'Exactamente a las 6:00 AM publica la señal GO / CAUTION / NO-GO en el canal Telegram privado.',
                icon: Bell, color: 'text-green-400', bg: 'bg-green-500/8',
              },
            ].map((s, i) => (
              <div key={i} className="relative bg-slate-900/50 border border-slate-800 rounded-2xl p-7 hover:border-slate-700 transition-colors">
                <div className="text-xs font-mono text-slate-700 mb-4">{s.step}</div>
                <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-5`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Signal types */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { signal: 'GO', emoji: '🟢', color: 'border-green-500/40 bg-green-950/20', text: 'text-green-400', desc: 'Confluencia alta en múltiples variables. Condiciones favorables para operar con gestión de riesgo.' },
              { signal: 'CAUTION', emoji: '🟡', color: 'border-yellow-500/40 bg-yellow-950/20', text: 'text-yellow-400', desc: 'Señales mixtas. Reducir tamaño de posición o esperar mayor claridad antes de entrar.' },
              { signal: 'NO-GO', emoji: '🔴', color: 'border-red-500/40 bg-red-950/20', text: 'text-red-400', desc: 'Señal débil o mercado adverso. La mejor decisión es no operar. Capital preservado.' },
            ].map((s, i) => (
              <div key={i} className={`border rounded-2xl p-6 ${s.color}`}>
                <div className={`text-2xl font-black mb-2 ${s.text}`}>{s.emoji} {s.signal}</div>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ── */}
      <section id="precios" className="py-28 px-6 bg-slate-900/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge>Planes</Badge>
            <h2 className="text-4xl font-black text-white mt-4 mb-4">Elige tu plan</h2>
            <p className="text-slate-400">Sin contratos. Cancela cuando quieras.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <PriceCard
              title="Canal Básico"
              price="$15"
              sub=" USD/mes"
              features={[
                'Señal diaria GO / NO-GO a las 6 AM',
                'Análisis BTC completo',
                'Fear & Greed + Noticias filtradas',
                'Canal Telegram privado',
                '7 días de prueba gratis',
              ]}
              cta="Suscribirme Básico"
              href={MP_BASIC}
            />
            <PriceCard
              title="Canal PRO"
              price="$25"
              sub=" USD/mes"
              highlight={true}
              features={[
                'Todo del plan Básico',
                'BTC + ETH + SOL análisis completo',
                'Alertas en tiempo real',
                'Análisis profundo los domingos',
                'Soporte directo Telegram',
              ]}
              cta="Suscribirme PRO"
              href={MP_PRO}
            />
            <PriceCard
              title="Bot Propio"
              price="$300"
              sub=" USD único"
              features={[
                'El mismo sistema en tu PC / VPS',
                'Bot Telegram personalizado',
                'Task Scheduler automatizado',
                'Parámetros configurables',
                '1 mes de soporte incluido',
              ]}
              cta="Cotizar"
              href={WA_BOT}
            />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge>Testimonios</Badge>
            <h2 className="text-4xl font-black text-white mt-4">Lo que dicen los usuarios</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex mb-3">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-slate-600 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICIOS FREELANCE ── */}
      <section id="servicios" className="py-28 px-6 bg-slate-900/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge>Servicios a medida</Badge>
            <h2 className="text-4xl font-black text-white mt-4 mb-4">¿Necesitas automatizar algo?</h2>
            <p className="text-slate-400 max-w-lg mx-auto">Construimos bots, agentes IA y sistemas de automatización desde cero para tu negocio.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { price: '$150', title: 'Bot Telegram', desc: 'Responde preguntas, ejecuta comandos y envía reportes automáticos.', time: '2-3 días' },
              { price: '$300', title: 'Sistema de señales', desc: 'El mismo sistema crypto que usamos. Pretrade + señales + Telegram.', time: '3-5 días' },
              { price: '$500', title: 'Agente IA autónomo', desc: 'Asistente con memoria, skills propios, acceso a APIs externas.', time: '1-2 semanas' },
              { price: 'A convenir', title: 'Automatización negocios', desc: 'Scraping, reportes, dashboards, integración de sistemas.', time: 'Cotización gratis' },
            ].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-colors"
              >
                <div className="text-2xl font-black text-cyan-400 mb-1">{s.price}</div>
                <h3 className="font-bold text-white text-sm mb-2">{s.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">{s.desc}</p>
                <div className="text-xs text-slate-700 border-t border-slate-800 pt-3">⏱ {s.time}</div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Btn href={WA_BOT} variant="outline">
              <MessageCircle className="w-4 h-4" /> Consultar por WhatsApp
            </Btn>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-28 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <Badge>FAQ</Badge>
            <h2 className="text-4xl font-black text-white mt-4">Preguntas frecuentes</h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-14">
              <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-4xl font-black text-white mb-4">Empieza hoy. Sin pagar.</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                7 días gratis para probar el sistema. Si no te convence, no pagas nada.
              </p>
              <Btn onClick={openLead} className="mx-auto text-lg px-8 py-4">
                Quiero probarlo gratis <ArrowRight className="w-5 h-5" />
              </Btn>
              <p className="text-slate-700 text-xs mt-6">Sin tarjeta de crédito · Sin compromiso · Cancela cuando quieras</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-900 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="text-xl font-black text-white tracking-tight mb-1">
                SmartPro<span className="text-cyan-400">IA</span>
              </div>
              <div className="text-xs text-slate-600">smartproia.com · hola@smartproia.com</div>
            </div>
            <div className="flex gap-6 text-xs text-slate-600">
              <a href="#producto" className="hover:text-slate-400 transition-colors">Producto</a>
              <a href="#precios" className="hover:text-slate-400 transition-colors">Precios</a>
              <a href="#servicios" className="hover:text-slate-400 transition-colors">Servicios</a>
              <a href="#faq" className="hover:text-slate-400 transition-colors">FAQ</a>
              <a href={WA_BOT} target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">Contacto</a>
            </div>
          </div>
          <div className="border-t border-slate-900 mt-8 pt-6 flex flex-col md:flex-row gap-2 justify-between text-xs text-slate-700">
            <span>🇨🇱 Hecho en Chile con IA autónoma · © 2026 SmartProIA</span>
            <span>Las señales son análisis automatizados, no constituyen asesoría financiera.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
