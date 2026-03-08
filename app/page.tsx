'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, LineChart, Bell, Zap, Shield, CheckCircle2, MessageCircle } from 'lucide-react';

const WA_LINK = "https://wa.me/56962326907?text=Hola%2C%20quiero%20unirme%20a%20SmartProIA%20VIP";
const WA_BOT  = "https://wa.me/56962326907?text=Hola%2C%20quiero%20cotizar%20un%20bot%20propio";
const WA_FREE = "https://wa.me/56962326907?text=Hola%2C%20quiero%20probar%20SmartProIA%20gratis";

// --- Components ---
const Button = ({ children, variant = 'primary', href, className, ...props }: any) => {
  const base = "px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer";
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-105",
    outline: "border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-400 bg-transparent"
  };
  const cls = `${base} ${variants[variant as keyof typeof variants]} ${className || ''}`;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  return <button className={cls} {...props}>{children}</button>;
};

const Card = ({ title, price, sub, features, recommended = false, cta, href }: any) => (
  <motion.div
    whileHover={{ y: -8 }}
    className={`relative p-8 rounded-2xl border ${recommended
      ? 'border-cyan-500 bg-slate-900/80 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
      : 'border-slate-800 bg-slate-950/50'}`}
  >
    {recommended && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
        MÁS POPULAR
      </div>
    )}
    <h3 className="text-xl font-bold text-slate-100 mb-1">{title}</h3>
    <div className="text-3xl font-bold text-cyan-400 mb-1">{price}</div>
    {sub && <div className="text-xs text-slate-500 mb-6">{sub}</div>}
    <ul className="space-y-3 mb-8">
      {features.map((feat: string, i: number) => (
        <li key={i} className="flex items-start gap-2 text-slate-400 text-sm">
          <CheckCircle2 className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
          {feat}
        </li>
      ))}
    </ul>
    <Button variant={recommended ? 'primary' : 'outline'} href={href} className="w-full justify-center">
      {cta} <ArrowRight className="w-4 h-4" />
    </Button>
  </motion.div>
);

// Signal preview component
const SignalPreview = () => (
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 blur-[80px] opacity-20 rounded-2xl" />
    <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl font-mono text-sm">
      <div className="text-cyan-400 font-bold mb-4">🤖 SmartProIA Signal — hoy 06:00</div>
      <div className="space-y-2 text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-500">₿ BTC/USDT</span>
          <span>$67,060 <span className="text-red-400">↓ -1.6%</span></span>
        </div>
        <div className="border-t border-slate-800 pt-2 flex justify-between">
          <span className="text-slate-500">Señal</span>
          <span className="text-yellow-400 font-bold">⚠️ CAUTION</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Dirección</span>
          <span>⚖️ NEUTRAL</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Confluencia</span>
          <span className="text-yellow-400">BAJA (0/10)</span>
        </div>
        <div className="border-t border-slate-800 pt-2 flex justify-between">
          <span className="text-slate-500">Fear & Greed</span>
          <span className="text-red-400">🔴 12/100 Extreme Fear</span>
        </div>
        <div className="border-t border-slate-800 pt-2 text-slate-400 text-xs leading-relaxed">
          📰 USDC supera a Tether en capitalización<br />
          📰 Bitcoin baja 1.4% en volumen reducido
        </div>
        <div className="border-t border-slate-800 pt-2 text-red-400 font-bold text-xs">
          🚫 Señal débil. Preservar capital.
        </div>
      </div>
      <div className="mt-4 text-slate-600 text-xs">— SmartProIA Bot | Análisis autónomo 24/7</div>
    </div>
  </div>
);

// --- Main ---
export default function SmartProIA() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 font-sans">

      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter text-white">
            SmartPro<span className="text-cyan-500">IA</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#como-funciona" className="hover:text-cyan-400 transition-colors">Cómo funciona</a>
            <a href="#planes" className="hover:text-cyan-400 transition-colors">Planes</a>
            <a href="#servicios" className="hover:text-cyan-400 transition-colors">Servicios</a>
          </div>
          <Button href={WA_FREE} className="text-sm px-4 py-2">Unirse gratis →</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase mb-4 block">
              Bot IA Autónomo 24/7 — Operando desde Chile
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Señales Crypto diarias con{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Inteligencia Artificial
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Cada mañana a las <strong className="text-white">6:00 AM</strong>, un bot autónomo analiza BTC, ETH y SOL con 10+ variables y te envía una señal clara al canal Telegram.{' '}
              <strong className="text-cyan-400">GO / CAUTION / NO-GO.</strong> Sin emociones.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Button href={WA_FREE}>
                7 días gratis <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" href="#como-funciona">
                Ver ejemplo real
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-800 pt-10 mt-12">
            {[
              { val: '6:00 AM', label: 'Análisis diario' },
              { val: '10+', label: 'Variables analizadas' },
              { val: 'BTC·ETH·SOL', label: 'Mercados' },
              { val: '24/7', label: 'Bot activo' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-white">{s.val}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona + Preview */}
      <section id="como-funciona" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              ¿Qué recibes cada mañana?
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              El bot analiza el mercado automáticamente y te envía una señal clara. Sin copiar señales de otros. Sin cobrarte por operación. Sin acceso a tu cuenta.
            </p>
            <ul className="space-y-5">
              {[
                { icon: Bot, text: 'Score de 10 variables: funding rate, Long/Short ratio, Open Interest, Fear & Greed, volumen y más.' },
                { icon: LineChart, text: 'Análisis técnico BTC, ETH, SOL. Dirección clara: LONG / SHORT / NEUTRAL.' },
                { icon: Bell, text: 'Alertas en tiempo real cuando cambia el mercado: price alert, funding extremo, news importante.' },
                { icon: Shield, text: 'Prefiere NO-GO ante la duda. Capital preservado > trade perdedor.' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-400 shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <SignalPreview />
        </div>
      </section>

      {/* Planes */}
      <section id="planes" className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Elige tu plan</h2>
            <p className="text-slate-400">Cancela cuando quieras. Sin permanencia mínima.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card
              title="Canal Señales"
              price="$15 USD"
              sub="por mes"
              features={[
                'Señal diaria GO/NO-GO a las 6 AM',
                'BTC análisis completo',
                'Fear & Greed + Noticias filtradas',
                'Canal Telegram privado',
                '7 días de prueba gratis',
              ]}
              cta="Empezar gratis"
              href={WA_FREE}
            />
            <Card
              title="Canal PRO"
              price="$25 USD"
              sub="por mes"
              recommended={true}
              features={[
                'Todo del plan Canal',
                'BTC + ETH + SOL análisis',
                'Alertas en tiempo real',
                'Análisis profundo domingos',
                'Soporte directo Telegram',
              ]}
              cta="Suscribirme PRO"
              href={WA_LINK}
            />
            <Card
              title="Bot Propio"
              price="$300 USD"
              sub="pago único"
              features={[
                'El mismo sistema instalado en tu PC/VPS',
                'Bot Telegram personalizado',
                'Task Scheduler automatizado',
                'Análisis configurables',
                '1 mes de soporte incluido',
              ]}
              cta="Cotizar"
              href={WA_BOT}
            />
          </div>
        </div>
      </section>

      {/* Servicios freelance */}
      <section id="servicios" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Automatización a medida</h2>
            <p className="text-slate-400 max-w-xl mx-auto">¿Necesitas automatizar algo en tu negocio? Construimos bots y sistemas IA desde cero.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { price: '$150', title: 'Bot Telegram básico', desc: 'Bot que responde preguntas, ejecuta comandos y envía reportes. Configurado y listo.', time: '2-3 días' },
              { price: '$300', title: 'Sistema crypto signals', desc: 'El mismo sistema que usamos. Pretrade + señales + Telegram + Task Scheduler.', time: '3-5 días' },
              { price: '$500', title: 'Agente IA autónomo', desc: 'Asistente con memoria, skills personalizados, acceso a APIs. Full autónomo 24/7.', time: '1-2 semanas' },
              { price: 'A convenir', title: 'Automatización negocio', desc: 'Scraping, reportes, integración de sistemas, dashboards. Lo que necesites.', time: 'Cotización gratis' },
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="text-2xl font-bold text-cyan-400 mb-1">{s.price}</div>
                <h3 className="font-bold text-white mb-3 text-sm">{s.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">{s.desc}</p>
                <div className="text-xs text-slate-600 border-t border-slate-800 pt-3">⏱ {s.time}</div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button href={WA_BOT}>
              <MessageCircle className="w-4 h-4" /> Consultar por WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-12 shadow-[0_0_60px_rgba(6,182,212,0.08)]">
            <Zap className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Empieza hoy. Gratis 7 días.</h2>
            <p className="text-slate-400 mb-8">Únete al canal, prueba una semana sin pagar. Si no te sirve, no pagas nada.</p>
            <Button href={WA_FREE} className="mx-auto">
              Quiero probarlo gratis <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-10 px-6 text-center text-slate-500 text-sm">
        <div className="mb-3 text-xl font-bold text-white tracking-tighter">SmartPro<span className="text-cyan-500">IA</span></div>
        <div className="mb-2">smartproia.com · hola@smartproia.com</div>
        <div className="text-xs text-slate-600">🇨🇱 Hecho en Chile con IA autónoma · © 2026 SmartProIA</div>
        <div className="text-xs text-slate-700 mt-2">Las señales son análisis automatizados, no constituyen asesoría financiera. Invertir tiene riesgo.</div>
      </footer>
    </div>
  );
}
