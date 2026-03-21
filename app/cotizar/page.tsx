'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  Scale,
  Dumbbell,
  ShoppingCart,
  Building2,
  Briefcase,
  MoreHorizontal,
} from 'lucide-react';

/* ─── Constants ──────────────────────────────────────────────────────── */

const WA_BASE = 'https://wa.me/56962326907';

/* ─── Tracking ───────────────────────────────────────────────────────── */

function track(event: string) {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event }),
  }).catch(() => {/* fire-and-forget */});
}

/* ─── Types ──────────────────────────────────────────────────────────── */

type Volume = 'low' | 'mid' | 'high';

interface ContactInfo {
  name: string;
  phone: string;
}

interface QuoteState {
  industry: string;
  volume: Volume | null;
  features: string[];
  contact: ContactInfo;
}

/* ─── Single plan config ─────────────────────────────────────────────── */

const BOT_PLAN = {
  name: 'Bot WhatsApp IA',
  setup: '$499',
  monthly: '$99',
  tagline: 'Todo lo que necesitás para automatizar la atención de tu negocio.',
  features: [
    '24/7 atención automática',
    'IA con contexto de tu negocio',
    'Calificación de leads automática',
    'Dashboard Chatwoot incluido',
    'Alertas para casos urgentes',
    'Sin límite de conversaciones',
    'Setup en 7 días',
    '1er mes gratis',
  ],
} as const;

/* ─── Data ───────────────────────────────────────────────────────────── */

const INDUSTRIES = [
  { id: 'juridico', label: 'Estudio jurídico', icon: Scale },
  { id: 'gimnasio', label: 'Gimnasio o fitness', icon: Dumbbell },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
  { id: 'inmobiliaria', label: 'Inmobiliaria', icon: Building2 },
  { id: 'servicios', label: 'Servicios generales', icon: Briefcase },
  { id: 'otro', label: 'Otro', icon: MoreHorizontal },
];

const VOLUME_OPTIONS: { id: Volume; label: string; sub: string }[] = [
  { id: 'low', label: 'Menos de 50 msg/día', sub: 'Negocio con consultas ocasionales' },
  { id: 'mid', label: 'Entre 50-200 msg/día', sub: 'Flujo constante de consultas' },
  { id: 'high', label: 'Más de 200 msg/día', sub: 'Alta demanda de atención' },
];

const FEATURE_OPTIONS = [
  { id: 'faq', label: 'Responder preguntas frecuentes' },
  { id: 'agendar', label: 'Agendar reuniones o citas' },
  { id: 'leads', label: 'Calificar y filtrar leads' },
  { id: 'humano', label: 'Derivar a humano en casos urgentes' },
  { id: 'cotizar', label: 'Enviar cotizaciones o precios' },
  { id: '24h', label: 'Responder 24/7 fuera de horario' },
];

/* ─── Progress bar ───────────────────────────────────────────────────── */

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs text-slate-500 mb-2">
        <span>Paso {step} de {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-cyan-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Minimal navbar ─────────────────────────────────────────────────── */

function QuoteNav() {
  const WA_CONTACT = `${WA_BASE}?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20bots%20de%20WhatsApp`;
  return (
    <header className="border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl px-6 h-16 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="text-xl font-black tracking-tight text-white">
        SmartPro<span className="text-green-400">IA</span>
      </Link>
      <a
        href={WA_CONTACT}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </header>
  );
}

/* ─── Step 1: Industry ───────────────────────────────────────────────── */

function StepIndustry({
  value,
  onChange,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-2">
        ¿En qué rubro está tu negocio?
      </h2>
      <p className="text-slate-400 text-sm mb-8">
        Esto nos ayuda a entender mejor cómo puede ayudarte el bot.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {INDUSTRIES.map((ind) => {
          const Icon = ind.icon;
          const selected = value === ind.id;
          return (
            <button
              key={ind.id}
              onClick={() => onChange(ind.id)}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl border text-left transition-all min-h-[56px] ${
                selected
                  ? 'border-green-500 bg-green-500/10 text-white'
                  : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${selected ? 'text-green-400' : 'text-slate-500'}`} />
              <span className="font-medium text-sm">{ind.label}</span>
              {selected && <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto shrink-0" />}
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!value}
        className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl py-3.5 transition-all"
      >
        Continuar <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─── Step 2: Volume ─────────────────────────────────────────────────── */

function StepVolume({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: Volume | null;
  onChange: (v: Volume) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-2">
        ¿Cuántos mensajes recibe tu negocio por día?
      </h2>
      <p className="text-slate-400 text-sm mb-8">
        Incluye WhatsApp, redes sociales y cualquier canal de consultas.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        {VOLUME_OPTIONS.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all min-h-[64px] ${
                selected
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                  selected ? 'border-green-500' : 'border-slate-600'
                }`}
              >
                {selected && <div className="w-2 h-2 rounded-full bg-green-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${selected ? 'text-white' : 'text-slate-300'}`}>
                  {opt.label}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">{opt.sub}</p>
              </div>
              {selected && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3.5 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 rounded-xl transition-all text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!value}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl py-3.5 transition-all"
        >
          Continuar <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 3: Features ───────────────────────────────────────────────── */

function StepFeatures({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((f) => f !== id));
    } else {
      onChange([...value, id]);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-2">
        ¿Qué funciones necesitás?
      </h2>
      <p className="text-slate-400 text-sm mb-8">
        Seleccioná todas las que apliquen a tu negocio.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        {FEATURE_OPTIONS.map((feat) => {
          const selected = value.includes(feat.id);
          return (
            <button
              key={feat.id}
              onClick={() => toggle(feat.id)}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all min-h-[56px] ${
                selected
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
              }`}
            >
              <div
                className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all ${
                  selected ? 'border-green-500 bg-green-500' : 'border-slate-600'
                }`}
              >
                {selected && (
                  <svg className="w-2.5 h-2.5 text-slate-950" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`font-medium text-sm flex-1 ${selected ? 'text-white' : 'text-slate-300'}`}>
                {feat.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3.5 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 rounded-xl transition-all text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Atrás
        </button>
        <button
          onClick={onNext}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl py-3.5 transition-all"
        >
          Ver mi cotización <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 4: Contact ────────────────────────────────────────────────── */

function StepContact({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: ContactInfo;
  onChange: (v: ContactInfo) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const isValid = value.name.trim().length >= 2 && value.phone.trim().length >= 8;

  return (
    <div>
      <h2 className="text-2xl font-black text-white mb-2">
        ¿A dónde te enviamos la cotización?
      </h2>
      <p className="text-slate-400 text-sm mb-8">
        Te la mandamos por WhatsApp en segundos, con los detalles de tu plan.
      </p>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tu nombre <span className="text-green-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej: Martín López"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 focus:border-green-500 focus:outline-none rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            WhatsApp / Teléfono <span className="text-green-400">*</span>
          </label>
          <input
            type="tel"
            placeholder="Ej: +56912345678"
            value={value.phone}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 focus:border-green-500 focus:outline-none rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm transition-colors"
          />
          <p className="text-slate-600 text-xs mt-1.5">
            Solo te contactamos con tu cotización. Sin spam.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3.5 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 rounded-xl transition-all text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl py-3.5 transition-all"
        >
          Ver mi cotización <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Step 5: Result ─────────────────────────────────────────────────── */

function StepResult({
  quote,
  onBack,
}: {
  quote: QuoteState;
  onBack: () => void;
}) {
  const plan = BOT_PLAN;

  const industryLabel = INDUSTRIES.find((i) => i.id === quote.industry)?.label ?? quote.industry;
  const volumeLabel = VOLUME_OPTIONS.find((v) => v.id === quote.volume)?.label ?? '';
  const featureLabels = FEATURE_OPTIONS
    .filter((f) => quote.features.includes(f.id))
    .map((f) => f.label);

  // Build WA pre-filled text including contact name
  const waText = encodeURIComponent(
    `Hola, soy ${quote.contact.name}. Acabo de cotizar en smartproia.com el plan ${plan.name} (${plan.setup} setup + ${plan.monthly}/mes).\n\nRubro: ${industryLabel}\nVolumen: ${volumeLabel}\nFunciones: ${featureLabels.join(', ') || 'No seleccionadas'}\n\n¿Podemos avanzar?`
  );

  const waHref = `${WA_BASE}?text=${waText}`;

  return (
    <div>
      {quote.contact.name && (
        <p className="text-green-400 text-sm font-medium mb-4">
          ¡Listo, {quote.contact.name.split(' ')[0]}! Esta es tu cotización:
        </p>
      )}
      <div className="mb-6 flex items-center gap-3">
        <span className="bg-green-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
          1er mes gratis
        </span>
        <span className="text-slate-500 text-sm">Plan recomendado</span>
      </div>

      {/* Plan header */}
      <div className="rounded-2xl p-6 border mb-6 bg-gradient-to-b from-green-950/40 to-slate-900 border-green-500/50 shadow-xl shadow-green-500/10">
        <h2 className="text-3xl font-black mb-1 text-green-400">
          {plan.name}
        </h2>
        <p className="text-slate-400 text-sm mb-5 leading-relaxed">{plan.tagline}</p>

        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-4xl font-black text-green-400">
            {plan.setup}
          </span>
          <span className="text-slate-400 text-sm">setup único</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-200">{plan.monthly}</span>
          <span className="text-slate-500 text-sm">/mes</span>
        </div>
      </div>

      {/* Included features */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 mb-8">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-4">Qué incluye</p>
        <ul className="space-y-3">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-400" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Summary of answers */}
      <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-4 mb-8 text-xs text-slate-500 space-y-1.5">
        {quote.contact.name && (
          <p><span className="text-slate-400 font-medium">Nombre:</span> {quote.contact.name}</p>
        )}
        <p><span className="text-slate-400 font-medium">Rubro:</span> {industryLabel}</p>
        <p><span className="text-slate-400 font-medium">Volumen:</span> {volumeLabel}</p>
        {featureLabels.length > 0 && (
          <p><span className="text-slate-400 font-medium">Funciones:</span> {featureLabels.join(', ')}</p>
        )}
      </div>

      {/* CTA — WhatsApp only */}
      <div className="flex flex-col gap-3 mb-6">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('cotizar:cta_wa')}
          className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl py-4 transition-all shadow-lg shadow-green-500/20 text-base"
        >
          <MessageCircle className="w-4 h-4" /> Consultar por WhatsApp
        </a>
      </div>

      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Cambiar respuestas
      </button>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────── */

export default function CotizarPage() {
  const [step, setStep] = useState(1);
  const [quote, setQuote] = useState<QuoteState>({
    industry: '',
    volume: null,
    features: [],
    contact: { name: '', phone: '' },
  });

  const TOTAL_STEPS = 5;

  useEffect(() => { track('cotizar:visit'); }, []);

  const goToStep = useCallback((n: number) => {
    setStep(n);
    if (n === 2) track('cotizar:step2');
    if (n === 3) track('cotizar:step3');
    if (n === 5) {
      track('cotizar:complete');
      /* Notify admin with full lead details including contact info */
      const industryLabel = INDUSTRIES.find((i) => i.id === quote.industry)?.label ?? quote.industry;
      const volumeLabel = VOLUME_OPTIONS.find((v) => v.id === quote.volume)?.label ?? quote.volume ?? '';
      const featureLabels = FEATURE_OPTIONS
        .filter((f) => quote.features.includes(f.id))
        .map((f) => f.label);
      fetch('/api/notify-cotizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: quote.contact.name,
          phone: quote.contact.phone,
          industry: industryLabel,
          volume: volumeLabel,
          features: featureLabels,
          plan: BOT_PLAN.name,
          setup: BOT_PLAN.setup,
          monthly: BOT_PLAN.monthly,
        }),
      }).catch(() => {});
    }
  }, [quote]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans antialiased">
      <QuoteNav />

      <main className="max-w-lg mx-auto px-5 py-10">
        {/* Page heading */}
        <div className="text-center mb-10">
          <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-2">
            Cotizador online
          </p>
          <h1 className="text-3xl font-black text-white">
            Tu cotización en 2 minutos
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Respondé {TOTAL_STEPS - 1} preguntas y recibís el detalle de tu plan.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <ProgressBar step={step} total={TOTAL_STEPS} />

          {step === 1 && (
            <StepIndustry
              value={quote.industry}
              onChange={(v) => setQuote((q) => ({ ...q, industry: v }))}
              onNext={() => goToStep(2)}
            />
          )}

          {step === 2 && (
            <StepVolume
              value={quote.volume}
              onChange={(v) => setQuote((q) => ({ ...q, volume: v }))}
              onNext={() => goToStep(3)}
              onBack={() => goToStep(1)}
            />
          )}

          {step === 3 && (
            <StepFeatures
              value={quote.features}
              onChange={(v) => setQuote((q) => ({ ...q, features: v }))}
              onNext={() => goToStep(4)}
              onBack={() => goToStep(2)}
            />
          )}

          {step === 4 && (
            <StepContact
              value={quote.contact}
              onChange={(v) => setQuote((q) => ({ ...q, contact: v }))}
              onNext={() => goToStep(5)}
              onBack={() => goToStep(3)}
            />
          )}

          {step === 5 && (
            <StepResult
              quote={quote}
              onBack={() => setStep(4)}
            />
          )}
        </div>

        {/* Trust signals */}
        {step < 5 && (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-xs text-slate-600">
            {['Sin compromiso', 'Respuesta en menos de 2 horas', 'Sin tarjeta de crédito'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-slate-700" />
                {t}
              </span>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 px-6 text-center text-xs text-slate-700 mt-10">
        <Link href="/" className="hover:text-slate-400 transition-colors">SmartProIA</Link>
        {' '} · smartproia.com · © 2026
      </footer>
    </div>
  );
}
