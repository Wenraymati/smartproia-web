'use client';

import { useState } from 'react';
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

/* ─── Types ──────────────────────────────────────────────────────────── */

type Volume = 'low' | 'mid' | 'high';
type PlanKey = 'basic' | 'standard' | 'premium';

interface QuoteState {
  industry: string;
  volume: Volume | null;
  features: string[];
}

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

const PLAN_DATA: Record<PlanKey, {
  name: string;
  setup: string;
  monthly: string;
  tagline: string;
  features: string[];
  checkoutPlan: 'basico' | 'pro' | 'wa';
  highlight: boolean;
}> = {
  basic: {
    name: 'Basic',
    setup: '$250',
    monthly: '$60',
    tagline: 'Para negocios con flujo bajo de consultas que quieren empezar a automatizar.',
    features: [
      'Hasta 500 mensajes/mes',
      '1 número WhatsApp Business',
      'Hasta 5 flujos de conversación',
      'Dashboard Chatwoot para tu equipo',
      'Reporte mensual de conversaciones',
      'Soporte por email',
      'Setup en 7 días hábiles',
    ],
    checkoutPlan: 'basico',
    highlight: false,
  },
  standard: {
    name: 'Standard',
    setup: '$350',
    monthly: '$90',
    tagline: 'El más elegido. Ideal para negocios con flujo constante de consultas.',
    features: [
      'Mensajes ilimitados',
      '1 número WhatsApp Business',
      'Flujos ilimitados',
      'Dashboard Chatwoot + múltiples agentes',
      'Reporte semanal detallado',
      'Soporte por WhatsApp',
      'Ajustes mensuales incluidos',
      'Setup en 7 días hábiles',
    ],
    checkoutPlan: 'pro',
    highlight: true,
  },
  premium: {
    name: 'Premium',
    setup: '$500',
    monthly: '$150',
    tagline: 'Para empresas con operación compleja, múltiples sucursales o integraciones.',
    features: [
      'Todo lo de Standard',
      'Múltiples números WhatsApp',
      'Bot multiagente con escalado',
      'Integraciones con CRM o sistemas propios',
      'Gestor dedicado de cuenta',
      'Reportes personalizados',
      'SLA de respuesta prioritario',
      'Setup en 5 días hábiles',
    ],
    checkoutPlan: 'wa',
    highlight: false,
  },
};

/* ─── Quote logic ────────────────────────────────────────────────────── */

function computePlan(volume: Volume | null, featureCount: number): PlanKey {
  if (volume === 'high' || featureCount >= 4) return 'premium';
  if (volume === 'low' && featureCount <= 1) return 'basic';
  return 'standard';
}

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

/* ─── Step 4: Result ─────────────────────────────────────────────────── */

function StepResult({
  quote,
  onBack,
}: {
  quote: QuoteState;
  onBack: () => void;
}) {
  const planKey = computePlan(quote.volume, quote.features.length);
  const plan = PLAN_DATA[planKey];

  const industryLabel = INDUSTRIES.find((i) => i.id === quote.industry)?.label ?? quote.industry;
  const volumeLabel = VOLUME_OPTIONS.find((v) => v.id === quote.volume)?.label ?? '';
  const featureLabels = FEATURE_OPTIONS
    .filter((f) => quote.features.includes(f.id))
    .map((f) => f.label);

  // Build WA pre-filled text
  const waText = encodeURIComponent(
    `Hola, acabo de cotizar en smartproia.com y me recomendaron el plan ${plan.name} (${plan.setup} setup + ${plan.monthly}/mes).\n\nRubro: ${industryLabel}\nVolumen: ${volumeLabel}\nFunciones: ${featureLabels.join(', ') || 'No seleccionadas'}\n\n¿Podemos avanzar?`
  );

  // Primary checkout URL
  const checkoutHref =
    plan.checkoutPlan === 'wa'
      ? `${WA_BASE}?text=${waText}`
      : `/api/checkout?plan=${plan.checkoutPlan}`;
  const checkoutExternal = plan.checkoutPlan === 'wa';

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        {plan.highlight && (
          <span className="bg-green-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">
            Más popular
          </span>
        )}
        <span className="text-slate-500 text-sm">Plan recomendado</span>
      </div>

      {/* Plan header */}
      <div
        className={`rounded-2xl p-6 border mb-6 ${
          plan.highlight
            ? 'bg-gradient-to-b from-green-950/40 to-slate-900 border-green-500/50 shadow-xl shadow-green-500/10'
            : 'bg-slate-900/60 border-slate-700'
        }`}
      >
        <h2 className={`text-3xl font-black mb-1 ${plan.highlight ? 'text-green-400' : 'text-white'}`}>
          {plan.name}
        </h2>
        <p className="text-slate-400 text-sm mb-5 leading-relaxed">{plan.tagline}</p>

        <div className="flex items-baseline gap-3 mb-2">
          <span className={`text-4xl font-black ${plan.highlight ? 'text-green-400' : 'text-white'}`}>
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
              <CheckCircle2
                className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? 'text-green-400' : 'text-slate-500'}`}
              />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Summary of answers */}
      <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-4 mb-8 text-xs text-slate-500 space-y-1.5">
        <p><span className="text-slate-400 font-medium">Rubro:</span> {industryLabel}</p>
        <p><span className="text-slate-400 font-medium">Volumen:</span> {volumeLabel}</p>
        {featureLabels.length > 0 && (
          <p><span className="text-slate-400 font-medium">Funciones:</span> {featureLabels.join(', ')}</p>
        )}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3 mb-6">
        <a
          href={checkoutHref}
          target={checkoutExternal ? '_blank' : undefined}
          rel={checkoutExternal ? 'noopener noreferrer' : undefined}
          className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl py-4 transition-all shadow-lg shadow-green-500/20 text-base"
        >
          {plan.checkoutPlan === 'wa' ? (
            <><MessageCircle className="w-4 h-4" /> Consultar por WhatsApp</>
          ) : (
            <>Contratar ahora <ChevronRight className="w-4 h-4" /></>
          )}
        </a>
        <a
          href={`${WA_BASE}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 border border-slate-700 text-slate-300 hover:border-green-500 hover:text-green-400 font-semibold rounded-xl py-3.5 transition-all text-sm"
        >
          <MessageCircle className="w-4 h-4" /> Hablar primero por WhatsApp
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
  });

  const TOTAL_STEPS = 4;

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
            Respondé 3 preguntas y te recomendamos el plan ideal.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <ProgressBar step={step} total={TOTAL_STEPS} />

          {step === 1 && (
            <StepIndustry
              value={quote.industry}
              onChange={(v) => setQuote((q) => ({ ...q, industry: v }))}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <StepVolume
              value={quote.volume}
              onChange={(v) => setQuote((q) => ({ ...q, volume: v }))}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <StepFeatures
              value={quote.features}
              onChange={(v) => setQuote((q) => ({ ...q, features: v }))}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <StepResult
              quote={quote}
              onBack={() => setStep(3)}
            />
          )}
        </div>

        {/* Trust signals */}
        {step < 4 && (
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
