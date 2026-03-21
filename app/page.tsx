'use client';

import { useState, useEffect } from 'react';
import type { PublicStats } from './api/stats/route';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, Bot, CheckCircle2, MessageCircle, Star, Shield,
  Users, Smartphone, Zap, Clock, BarChart3, Headphones,
} from 'lucide-react';

import { Badge } from './components/Badge';
import { Btn } from './components/Btn';
import { FAQ } from './components/FAQ';
import { MobileNav } from './components/MobileNav';
import { StickyCTA } from './components/StickyCTA';
import { LeadModal } from './components/LeadModal';
import { RoiCalculator } from './components/RoiCalculator';

/* ─── Constants ─────────────────────────────────────────────── */
const WA_DEMO = 'https://wa.me/56962326907?text=Hola%2C%20quiero%20una%20demo%20del%20bot%20de%20WhatsApp%20para%20mi%20negocio';

/* ─── Tracking helper ────────────────────────────────────────── */
function track(event: string) {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event }),
  }).catch(() => {});
}
const WA_CONTACT = 'https://wa.me/56962326907?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20bots%20de%20WhatsApp';

/* ─── Single plan config ─────────────────────────────────────── */
const SINGLE_PLAN_FEATURES = [
  '24/7 atención automática',
  'IA con contexto de tu negocio',
  'Calificación de leads automática',
  'Dashboard Chatwoot incluido',
  'Alertas para casos urgentes',
  'Sin límite de conversaciones',
  'Setup en 7 días',
  '1er mes gratis',
];

/* ─── Testimonials ───────────────────────────────────────────── */
const testimonials = [
  {
    name: 'Ruiz & Ruiz Abogados',
    role: 'Estudio jurídico, Santiago',
    text: 'El bot atiende consultas de honorarios y agenda reuniones automáticamente. Ahora mi equipo se enfoca en los casos, no en responder WhatsApp.',
    stars: 5,
    caseStudyUrl: '/casos/ruizruiz',
  },
  {
    name: 'Marcelo F.',
    role: 'Dueño de gimnasio, Santiago',
    text: 'Antes perdíamos leads porque nadie respondía los mensajes de noche. Ahora el bot agenda clases solo y nosotros llegamos a trabajar con las citas ya confirmadas.',
    stars: 5,
  },
  {
    name: 'Carolina V.',
    role: 'Clínica estética, Providencia',
    text: 'El bot responde preguntas de precios, disponibilidad y hasta envía la dirección con el mapa. El equipo solo toma el control cuando el cliente ya está listo para pagar.',
    stars: 5,
  },
];

/* ─── Use cases ──────────────────────────────────────────────── */
const useCases = [
  {
    icon: '🏋️',
    title: 'Gimnasios',
    desc: 'Agenda clases, informa horarios y planes, cobra membresías y envía recordatorios automáticos de pago.',
    example: 'GymBot — en producción',
  },
  {
    icon: '🏥',
    title: 'Clínicas y salud',
    desc: 'Reserva de horas, recordatorios de cita, respuestas a preguntas frecuentes sobre tratamientos y precios.',
    example: 'Clínicas estéticas, dentistas',
  },
  {
    icon: '🏠',
    title: 'Inmobiliarias',
    desc: 'Califica leads, envía fichas de propiedades, agenda visitas y deriva a ejecutivos solo cuando hay interés real.',
    example: 'Captación de compradores 24/7',
  },
  {
    icon: '🔧',
    title: 'Servicios y talleres',
    desc: 'Presupuestos automáticos, estados de reparaciones, recordatorios de revisión y agenda de visitas técnicas.',
    example: 'RuizRuiz Bot — en producción',
  },
];

/* ─── Features ───────────────────────────────────────────────── */
const features = [
  {
    icon: Bot, color: 'text-cyan-400', bg: 'bg-cyan-500/8',
    title: 'IA que entiende a tus clientes',
    desc: 'El bot interpreta lenguaje natural. Si el cliente escribe "quiero info del plan familiar", entiende lo que necesita y responde en contexto.',
  },
  {
    icon: Headphones, color: 'text-purple-400', bg: 'bg-purple-500/8',
    title: 'Dashboard para tu equipo',
    desc: 'Tu equipo ve todas las conversaciones en Chatwoot. Pueden tomar control de cualquier chat en segundos cuando el bot necesita ayuda humana.',
  },
  {
    icon: Smartphone, color: 'text-green-400', bg: 'bg-green-500/8',
    title: 'WhatsApp Business oficial',
    desc: 'Usamos la API oficial de WhatsApp Business. Sin riesgo de baneo, con verificación y soporte de Meta.',
  },
  {
    icon: BarChart3, color: 'text-yellow-400', bg: 'bg-yellow-500/8',
    title: 'Reportes semanales',
    desc: 'Cada semana recibís un resumen: conversaciones atendidas, leads calificados, temas más consultados y oportunidades de mejora.',
  },
  {
    icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/8',
    title: 'Setup en 7 días',
    desc: 'De la consulta inicial al bot en producción en una semana. Nos encargamos de todo: configuración, flujos, pruebas y lanzamiento.',
  },
  {
    icon: Shield, color: 'text-red-400', bg: 'bg-red-500/8',
    title: 'Mantenimiento incluido',
    desc: 'El plan mensual incluye ajustes, mejoras al bot y soporte técnico. No te quedás solo después del setup.',
  },
];

/* ─── Component ──────────────────────────────────────────────── */
export default function SmartProIA() {
  const [leadModal, setLeadModal] = useState(false);
  const openLead = () => setLeadModal(true);
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d: PublicStats) => setStats(d))
      .catch(() => {});
    track('landing:visit');
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans antialiased selection:bg-green-500/20">
      <LeadModal open={leadModal} onClose={() => setLeadModal(false)} redirectUrl={WA_DEMO} />
      <StickyCTA onOpen={openLead} />

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-black tracking-tight text-white">
            SmartPro<span className="text-green-400">IA</span>
          </div>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#casos" className="hover:text-white transition-colors">Casos de uso</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
            <a href="/cotizar" className="hover:text-white transition-colors text-green-400/80 hover:text-green-400">Cotizar</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          {/* Desktop CTA */}
          <div className="hidden md:block">
            <a
              href={WA_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl px-4 py-2 text-sm transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Agendar demo
            </a>
          </div>
          {/* Mobile hamburger */}
          <MobileNav onCtaClick={openLead} waFree={WA_DEMO} />
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-green-500/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — copy */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-6">
                <Badge>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Bots activos · Operando desde Chile 🇨🇱
                </Badge>
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
                Tu empresa nunca pierde<br />
                un cliente{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                  por falta de respuesta.
                </span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                Automatizamos WhatsApp para que tu equipo{' '}
                <strong className="text-white">atienda el doble sin contratar a nadie más.</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <a
                  href={WA_DEMO}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('landing:cta_demo')}
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl px-7 py-3.5 text-base transition-all shadow-lg shadow-green-500/20"
                >
                  <MessageCircle className="w-4 h-4" /> Ver demo gratis
                </a>
                <a
                  href="#precios"
                  className="inline-flex items-center justify-center text-slate-400 hover:text-white text-base transition-colors underline-offset-4 hover:underline px-4"
                >
                  Ver precios
                </a>
              </div>

              {/* Cotizar CTA — tertiary */}
              <div className="mb-12">
                <a
                  href="/cotizar"
                  onClick={() => track('landing:cta_cotizar')}
                  className="inline-flex items-center gap-1.5 text-sm text-green-400/70 hover:text-green-400 transition-colors underline-offset-4 hover:underline"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Cotizar en 2 minutos — gratis, sin compromiso
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-800">
                {[
                  { n: '24/7', label: 'Sin descanso' },
                  { n: '7d', label: 'Setup listo' },
                  { n: stats ? `${stats.botsActive}` : '2', label: 'Bots activos' },
                  { n: stats ? `${stats.totalLeads}+` : '0', label: 'Leads capturados' },
                ].map((st, i) => (
                  <div key={i}>
                    <div className="text-3xl font-black text-white">{st.n}</div>
                    <div className="text-xs text-slate-600 uppercase tracking-widest mt-1">{st.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — WhatsApp mock */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                {/* WA header */}
                <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-400/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-green-300" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">GymBot IA</div>
                    <div className="text-green-300/70 text-xs">en línea</div>
                  </div>
                </div>
                {/* Chat messages */}
                <div className="bg-[#0a1628] p-4 space-y-3 min-h-[280px]">
                  {[
                    { from: 'user', text: 'Hola, ¿tienen planes para dos personas?' },
                    { from: 'bot', text: '¡Hola! Sí, tenemos el Plan Pareja por $35.000/mes. Incluye acceso ilimitado para ambos, todas las clases y 1 sesión personal al mes. ¿Te interesa agendar una visita para conocer el gym? 💪' },
                    { from: 'user', text: 'Sí me interesa, ¿cuándo puedo ir?' },
                    { from: 'bot', text: 'Perfecto! Tenemos disponibilidad hoy de 16:00 a 20:00 y mañana de 10:00 a 13:00. ¿Qué horario te acomoda? 📅' },
                  ].map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.15 }}
                      className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                          m.from === 'user'
                            ? 'bg-[#005C4B] text-white rounded-tr-sm'
                            : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                        }`}
                      >
                        {m.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="bg-[#0a1628] px-4 pb-4">
                  <div className="bg-slate-800/60 rounded-full px-4 py-2 text-xs text-slate-600">
                    Escribí un mensaje...
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <div className="border-y border-green-500/10 bg-green-500/3 py-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-10 text-sm">
          {[
            { n: '7', label: 'Empresas activas' },
            { n: '+2.400', label: 'Mensajes automatizados' },
            { n: 'API oficial', label: 'WhatsApp' },
            { n: 'ES', label: 'Soporte en español' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black text-white">{item.n}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TRUST BAR ── */}
      <div className="border-y border-slate-800/60 bg-slate-900/20 py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
          {[
            'API oficial WhatsApp Business',
            'Setup en 7 días',
            'Sin contratos de permanencia',
            'Dashboard para tu equipo',
            'Hecho en Chile 🇨🇱',
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500/60" />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* ── CÓMO FUNCIONA ── */}
      <section id="como-funciona" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge>Cómo funciona</Badge>
            <h2 className="text-4xl font-black text-white mt-4 mb-4">Del primer mensaje a cliente, solo.</h2>
            <p className="text-slate-400 max-w-lg mx-auto">El bot hace el trabajo pesado. Tu equipo cierra el negocio.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Relevamos tu negocio',
                desc: 'Entendemos cómo trabajás, qué preguntan tus clientes, cuáles son tus servicios y cómo querés que se los presente el bot.',
                icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/8',
              },
              {
                step: '02',
                title: 'Configuramos tu bot',
                desc: 'Diseñamos los flujos de conversación, integramos la IA, conectamos tu número de WhatsApp y configuramos el dashboard para tu equipo.',
                icon: Bot, color: 'text-green-400', bg: 'bg-green-500/8',
              },
              {
                step: '03',
                title: 'Lo lanzamos en 7 días',
                desc: 'Pruebas, ajustes finales y go live. Tu bot empieza a atender clientes en menos de una semana desde la consulta inicial.',
                icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/8',
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
        </div>
      </section>

      {/* ── CASOS DE USO ── */}
      <section id="casos" className="py-28 px-6 bg-slate-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge>Casos de uso</Badge>
            <h2 className="text-4xl font-black text-white mt-4 mb-4">¿En qué tipo de negocio funciona?</h2>
            <p className="text-slate-400 max-w-lg mx-auto">Cualquier negocio que recibe consultas repetitivas puede automatizarlas.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCases.map((uc, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-colors"
              >
                <div className="text-3xl mb-4">{uc.icon}</div>
                <h3 className="font-bold text-white mb-2">{uc.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{uc.desc}</p>
                <div className="text-xs text-slate-700 border-t border-slate-800 pt-3">
                  {uc.example}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-slate-500 text-sm mb-4">¿Tu negocio no está en la lista? Igual podemos ayudarte.</p>
            <Btn href={WA_CONTACT} variant="outline">
              <MessageCircle className="w-4 h-4" /> Consultar por WhatsApp
            </Btn>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge>Qué incluye</Badge>
            <h2 className="text-4xl font-black text-white mt-4 mb-4">Todo lo que necesitás para automatizar.</h2>
            <p className="text-slate-400 max-w-lg mx-auto">No es solo el bot. Es el sistema completo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-7 hover:border-slate-700 transition-colors">
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI CALCULATOR ── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge>Calculadora de ROI</Badge>
            <h2 className="text-4xl font-black text-white mt-4 mb-4">
              ¿Cuánto te cuesta{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                no tener el bot?
              </span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              Calculá el costo real de responder WhatsApp manualmente y cuánto recuperarías con automatización.
            </p>
          </div>
          <RoiCalculator />
        </div>
      </section>

      {/* ── PRECIOS ── */}
      <section id="precios" className="py-28 px-6 bg-slate-900/20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <Badge>Plan único</Badge>
            <h2 className="text-4xl font-black text-white mt-4 mb-4">Inversión clara. Sin sorpresas.</h2>
            <p className="text-slate-400">Setup único + mantenimiento mensual. Sin contratos de permanencia.</p>
          </div>

          {/* Single plan card */}
          <div className="relative bg-gradient-to-b from-green-950/40 to-slate-900 border-2 border-green-500/50 rounded-2xl p-8 shadow-xl shadow-green-500/10 mb-6">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-green-500 text-slate-950 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wide">
                1er mes gratis
              </span>
            </div>

            <h3 className="text-2xl font-black text-green-400 mb-1">Bot WhatsApp IA</h3>
            <p className="text-slate-400 text-sm mb-6">Todo lo que necesitás para automatizar la atención de tu negocio.</p>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl font-black text-white">$499</span>
              <span className="text-slate-400 text-sm">USD setup único</span>
            </div>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-3xl font-bold text-green-400">$99</span>
              <span className="text-slate-500 text-sm">USD/mes</span>
            </div>

            <ul className="space-y-3 mb-8">
              {SINGLE_PLAN_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-green-400" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Two CTAs side by side */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/cotizar"
                onClick={() => track('landing:cta_cotizar')}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl py-3.5 transition-all shadow-lg shadow-green-500/20 text-sm"
              >
                <ArrowRight className="w-4 h-4" /> Cotizar ahora
              </a>
              <a
                href={WA_DEMO}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('landing:cta_demo')}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-700 text-slate-300 hover:border-green-500 hover:text-green-400 font-semibold rounded-xl py-3.5 transition-all text-sm"
              >
                <MessageCircle className="w-4 h-4" /> Hablar por WhatsApp
              </a>
            </div>
          </div>

          <p className="text-center text-slate-600 text-sm mt-4">
            ¿Necesitás algo más complejo?{' '}
            <a
              href={WA_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400/70 hover:text-green-400 underline underline-offset-2 transition-colors"
            >
              Hablemos
            </a>
          </p>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge>Testimonios</Badge>
            <h2 className="text-4xl font-black text-white mt-4">Lo que dicen nuestros clientes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col">
                <div className="flex mb-3">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-1">&quot;{t.text}&quot;</p>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-slate-600 text-xs">{t.role}</div>
                  {'caseStudyUrl' in t && t.caseStudyUrl && (
                    <Link
                      href={t.caseStudyUrl}
                      className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300 mt-2 transition-colors"
                    >
                      Ver caso completo <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-28 px-6 bg-slate-900/20">
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
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-14">
              <MessageCircle className="w-12 h-12 text-green-400 mx-auto mb-6" />
              <h2 className="text-4xl font-black text-white mb-4">Agendá una demo gratis.</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                En 30 minutos te mostramos cómo funciona el bot con un ejemplo real para tu negocio. Sin compromiso.
              </p>
              <a
                href={WA_DEMO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl px-8 py-4 text-lg transition-all shadow-lg shadow-green-500/20 mx-auto"
              >
                <MessageCircle className="w-5 h-5" /> Hablar por WhatsApp <ArrowRight className="w-5 h-5" />
              </a>
              <div className="mt-5">
                <a
                  href="/cotizar"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-400 transition-colors underline-offset-4 hover:underline"
                >
                  <ArrowRight className="w-3.5 h-3.5" /> O cotizá ahora en 2 minutos
                </a>
              </div>
              <p className="text-slate-700 text-xs mt-4">Sin tarjeta de crédito · Sin compromiso · Respondemos en menos de 2 horas</p>
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
                SmartPro<span className="text-green-400">IA</span>
              </div>
              <div className="text-xs text-slate-600">smartproia.com · hola@smartproia.com</div>
            </div>
            <div className="flex flex-wrap gap-6 text-xs text-slate-600">
              <a href="#como-funciona" className="hover:text-slate-400 transition-colors">Cómo funciona</a>
              <a href="#casos" className="hover:text-slate-400 transition-colors">Casos de uso</a>
              <a href="#precios" className="hover:text-slate-400 transition-colors">Precios</a>
              <a href="/pricing" className="hover:text-slate-400 transition-colors">Planes</a>
              <a href="/cotizar" className="hover:text-slate-400 transition-colors">Cotizar</a>
              <Link href="/casos/ruizruiz" className="hover:text-slate-400 transition-colors">Caso Ruiz &amp; Ruiz</Link>
              <a href="#faq" className="hover:text-slate-400 transition-colors">FAQ</a>
              <a href={WA_CONTACT} target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">Contacto</a>
            </div>
          </div>
          <div className="border-t border-slate-900 mt-8 pt-6 flex flex-col md:flex-row gap-2 justify-between text-xs text-slate-700">
            <span>🇨🇱 Hecho en Chile · Bots WhatsApp IA para negocios · © 2026 SmartProIA</span>
            <span>Los resultados pueden variar según el tipo de negocio y la configuración del bot.</span>
          </div>
        </div>
      </footer>

      {/* ── TRADING SECTION (HIDDEN — preserved for potential restore) ── */}
      {/*
      TRADING SIGNALS SECTION — commented out 2026-03-18 (pivot to bot services)
      To restore: uncomment and revert page.tsx from git history

      Original sections:
        - Hero: Señales Crypto con IA, 6AM, GO/CAUTION/NO-GO
        - LiveSignal component
        - PriceCards: Canal Básico $15/mes, Canal PRO $25/mes, Bot Propio $300
        - Bot DCA section ($400 setup)
        - Accuracy badge from /api/accuracy
        - Feedback section (bot para altcoins, etc.)
      Original WA links:
        const MP_BASIC = '/api/checkout?plan=basico';
        const MP_PRO   = '/api/checkout?plan=pro';
        const WA_BOT   = 'https://wa.me/56962326907?text=Hola%2C+quiero+cotizar+un+bot+propio+SmartProIA';
        const WA_DCA   = 'https://wa.me/56962326907?text=Hola%2C+me+interesa+el+Bot+DCA';
      */}
    </div>
  );
}
