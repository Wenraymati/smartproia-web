'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Bot, LineChart, Bell, Zap, Shield, CheckCircle2,
  MessageCircle, TrendingUp, TrendingDown, Minus, Star, ChevronDown
} from 'lucide-react';

const WA_LINK = "https://wa.me/56962326907?text=Hola%2C%20quiero%20suscribirme%20al%20plan%20PRO%20de%20SmartProIA";
const WA_BOT  = "https://wa.me/56962326907?text=Hola%2C%20quiero%20cotizar%20un%20bot%20propio%20SmartProIA";
const WA_FREE = "https://wa.me/56962326907?text=Hola%2C%20quiero%20probar%20SmartProIA%20gratis%207%20dias";

// Animated counter
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const step = to / 40;
    let cur = 0;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(cur));
    }, 30);
    return () => clearInterval(timer);
  }, [to]);
  return <>{count}{suffix}</>;
}

// Pill badge
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
    {children}
  </span>
);

// CTA Button
const Btn = ({ children, href, variant = 'primary', className = '' }: any) => {
  const base = "inline-flex items-center gap-2 font-semibold rounded-xl px-6 py-3 transition-all duration-200 cursor-pointer";
  const styles = {
    primary: "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5",
    outline: "border border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 bg-transparent",
    ghost: "text-slate-400 hover:text-white bg-transparent",
  };
  const cls = `${base} ${styles[variant as keyof typeof styles]} ${className}`;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  return <button className={cls}>{children}</button>;
};

// Live signal mockup
const LiveSignal = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(v => v + 1), 3000); return () => clearInterval(t); }, []);
  const prices = ['$67,240', '$67,185', '$67,310', '$67,060'];
  const price = prices[tick % prices.length];

  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-purple-500/30 rounded-2xl blur-xl" />
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-800/60 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-400">SmartProIA · Live Signal</span>
          </div>
          <span className="text-xs text-slate-600 font-mono">06:00 AM</span>
        </div>

        <div className="p-5 space-y-4 font-mono text-sm">
          {/* BTC price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-orange-400 font-bold">₿</span>
              <span className="text-slate-300">BTC/USDT</span>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">{price}</div>
              <div className="text-red-400 text-xs">↓ -1.6% 24h</div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800" />

          {/* Signal */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/60 rounded-xl p-3">
              <div className="text-slate-500 text-xs mb-1">Señal</div>
              <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                CAUTION
              </div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3">
              <div className="text-slate-500 text-xs mb-1">Dirección</div>
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <Minus className="w-3 h-3" />
                NEUTRAL
              </div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3">
              <div className="text-slate-500 text-xs mb-1">Confluencia</div>
              <div className="text-yellow-400 font-bold">BAJA</div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3">
              <div className="text-slate-500 text-xs mb-1">Fear & Greed</div>
              <div className="text-red-400 font-bold">12 🔴</div>
            </div>
          </div>

          {/* News */}
          <div className="border-t border-slate-800 pt-3 space-y-1.5">
            <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">Noticias Crypto</div>
            <div className="text-slate-400 text-xs">📰 USDC supera a Tether en capitalización</div>
            <div className="text-slate-400 text-xs">📰 Bitcoin baja 1.4% en volumen reducido</div>
          </div>

          {/* Recommendation */}
          <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-3">
            <div className="text-red-400 text-xs font-bold">🚫 Señal débil. Preservar capital.</div>
          </div>

          <div className="text-slate-700 text-xs text-center">— SmartProIA Bot · Análisis autónomo 24/7</div>
        </div>
      </div>
    </div>
  );
};

// Pricing card
const PriceCard = ({ title, price, sub, features, cta, href, highlight = false }: any) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`relative rounded-2xl p-8 flex flex-col ${
      highlight
        ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-2 border-cyan-500/60 shadow-xl shadow-cyan-500/10'
        : 'bg-slate-900/60 border border-slate-800'
    }`}
  >
    {highlight && (
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
        <span className="bg-cyan-500 text-slate-950 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wide">
          Más popular
        </span>
      </div>
    )}
    <div className="mb-6">
      <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
      <div className="flex items-end gap-1">
        <span className={`text-4xl font-black ${highlight ? 'text-cyan-400' : 'text-white'}`}>{price}</span>
        {sub && <span className="text-slate-500 text-sm mb-1">{sub}</span>}
      </div>
    </div>
    <ul className="space-y-3 mb-8 flex-1">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${highlight ? 'text-cyan-400' : 'text-slate-600'}`} />
          {f}
        </li>
      ))}
    </ul>
    <Btn href={href} variant={highlight ? 'primary' : 'outline'} className="w-full justify-center">
      {cta} <ArrowRight className="w-4 h-4" />
    </Btn>
  </motion.div>
);

// FAQ
const faqs = [
  { q: '¿Necesito saber de trading para usar esto?', a: 'No. La señal es clara: GO (entra), CAUTION (precaución) o NO-GO (no entres). Con eso basta.' },
  { q: '¿El bot tiene acceso a mi cuenta?', a: 'Nunca. Solo analiza el mercado y envía señales. Tú decides si operas o no.' },
  { q: '¿Cuándo llegan las señales?', a: 'Todos los días a las 6:00 AM hora Chile, directo al canal Telegram privado.' },
  { q: '¿Puedo cancelar cuando quiera?', a: 'Sí. Sin contratos, sin permanencia mínima. Cancelas en cualquier momento.' },
  { q: '¿Qué pasa si la señal es incorrecta?', a: 'Ningún sistema es infalible. El bot está diseñado para preferir NO-GO ante la duda — proteger capital es la prioridad.' },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {faqs.map((f, i) => (
        <div key={i} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left text-slate-200 font-medium hover:text-white transition-colors"
          >
            {f.q}
            <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
                  {f.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

// Testimonials
const testimonials = [
  { name: 'Carlos M.', role: 'Trader independiente', text: 'Antes perdía tiempo mirando el mercado cada mañana. Ahora leo la señal a las 6 AM y ya sé qué hacer.', stars: 5 },
  { name: 'Valentina R.', role: 'Inversora particular', text: 'Lo que más me gusta es que cuando dice NO-GO, realmente no entro. Mi capital está más protegido.', stars: 5 },
  { name: 'Rodrigo A.', role: 'Crypto enthusiast', text: 'Contraté el bot propio. En 3 días estaba funcionando en mi VPS. El soporte fue excelente.', stars: 5 },
];

export default function SmartProIA() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans antialiased selection:bg-cyan-500/20">

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-black tracking-tight text-white">
            SmartPro<span className="text-cyan-400">IA</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#producto" className="hover:text-white transition-colors">Producto</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <Btn href={WA_FREE} className="text-sm px-4 py-2">
            Probar gratis <ArrowRight className="w-3.5 h-3.5" />
          </Btn>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background effects */}
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
                <Btn href={WA_FREE} className="text-base px-7 py-3.5">
                  7 días gratis <ArrowRight className="w-4 h-4" />
                </Btn>
                <Btn href="#producto" variant="outline" className="text-base px-7 py-3.5">
                  Ver cómo funciona
                </Btn>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800">
                {[
                  { n: 10, s: '+', label: 'Variables' },
                  { n: 7, s: '/7', label: 'Días activo' },
                  { n: 3, s: '', label: 'Mercados' },
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
                step: '01',
                title: 'Recopila datos',
                desc: 'Funding rate, Long/Short ratio, Open Interest, Fear & Greed, volumen, RSI, MACD, noticias y más.',
                icon: Bot,
                color: 'text-blue-400',
                bg: 'bg-blue-500/8',
              },
              {
                step: '02',
                title: 'Analiza con IA',
                desc: 'Clasifica 10+ variables y genera un score de confluencia. Prioriza NO-GO ante señales mixtas.',
                icon: LineChart,
                color: 'text-cyan-400',
                bg: 'bg-cyan-500/8',
              },
              {
                step: '03',
                title: 'Señal al canal',
                desc: 'Exactamente a las 6:00 AM publica la señal GO / CAUTION / NO-GO en el canal Telegram privado.',
                icon: Bell,
                color: 'text-green-400',
                bg: 'bg-green-500/8',
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-slate-900/50 border border-slate-800 rounded-2xl p-7 hover:border-slate-700 transition-colors"
              >
                <div className="text-xs font-mono text-slate-700 mb-4">{s.step}</div>
                <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-5`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </motion.div>
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
              cta="Empezar gratis"
              href={WA_FREE}
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
              href={WA_LINK}
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
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge>Testimonios</Badge>
            <h2 className="text-4xl font-black text-white mt-4">Lo que dicen los usuarios</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6"
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICIOS FREELANCE ── */}
      <section className="py-28 px-6 bg-slate-900/20">
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
              <Btn href={WA_FREE} className="mx-auto text-lg px-8 py-4">
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
