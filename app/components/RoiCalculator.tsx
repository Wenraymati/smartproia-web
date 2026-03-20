"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Clock, DollarSign, ArrowRight } from "lucide-react";

const WA_COTIZAR =
  "/cotizar";

/* Chilean peso hourly rate estimate: $900.000/mes ÷ 176h ≈ $5.100/h */
const CLP_PER_HOUR = 5_100;
const BOT_MONTHLY_CLP = 89_990; /* Standard plan */

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

export function RoiCalculator() {
  const [employees, setEmployees] = useState(2);
  const [msgsDay, setMsgsDay] = useState(30);
  const [minutesEach, setMinutesEach] = useState(8);

  const calc = useMemo(() => {
    /* Hours lost per month attending WhatsApp */
    const hoursMonth = (msgsDay * minutesEach * 30) / 60;
    /* Monthly cost of that time (shared among employees) */
    const laborCostMonth = hoursMonth * CLP_PER_HOUR;
    /* Bot automates ~70% of conversations */
    const saved = laborCostMonth * 0.7;
    const roi = saved - BOT_MONTHLY_CLP;
    const roiPct = BOT_MONTHLY_CLP > 0 ? Math.round((roi / BOT_MONTHLY_CLP) * 100) : 0;
    const hoursSaved = Math.round(hoursMonth * 0.7);
    return { saved, roi, roiPct, hoursSaved, laborCostMonth };
  }, [employees, msgsDay, minutesEach]);

  const positive = calc.roi > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
        {/* Left — inputs */}
        <div className="p-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
            Tu situación actual
          </p>

          <div className="space-y-7">
            <SliderField
              label="Empleados que responden WhatsApp"
              value={employees}
              min={1}
              max={10}
              step={1}
              display={`${employees} persona${employees > 1 ? "s" : ""}`}
              onChange={setEmployees}
            />
            <SliderField
              label="Mensajes recibidos por día"
              value={msgsDay}
              min={5}
              max={200}
              step={5}
              display={`${msgsDay} msgs/día`}
              onChange={setMsgsDay}
            />
            <SliderField
              label="Minutos por conversación"
              value={minutesEach}
              min={2}
              max={30}
              step={1}
              display={`${minutesEach} min`}
              onChange={setMinutesEach}
            />
          </div>

          <p className="mt-6 text-xs text-slate-600">
            * El bot automatiza el 70% de las conversaciones. Cálculo basado en
            sueldo promedio CLP $900.000/mes.
          </p>
        </div>

        {/* Right — results */}
        <div className="p-8 bg-slate-950/60 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
              Con SmartProIA Bot
            </p>

            <div className="space-y-4 mb-8">
              <ResultRow
                icon={<Clock className="w-4 h-4 text-cyan-400" />}
                label="Horas liberadas al mes"
                value={`${calc.hoursSaved}h`}
                accent="text-cyan-400"
              />
              <ResultRow
                icon={<DollarSign className="w-4 h-4 text-green-400" />}
                label="Costo laboral ahorrado"
                value={fmt(calc.saved)}
                accent="text-green-400"
              />
              <div className="border-t border-slate-800 pt-4">
                <ResultRow
                  icon={<TrendingUp className="w-4 h-4 text-yellow-400" />}
                  label="ROI mensual neto"
                  value={positive ? fmt(calc.roi) : "—"}
                  accent={positive ? "text-yellow-400" : "text-slate-500"}
                  large
                />
              </div>
            </div>

            {positive && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-6">
                <p className="text-green-400 text-sm font-semibold">
                  Retorno de {calc.roiPct}% sobre la inversión mensual
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  El bot se paga solo y genera ganancia neta.
                </p>
              </div>
            )}
          </div>

          <a
            href={WA_COTIZAR}
            className="inline-flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl px-6 py-3.5 text-sm transition-all shadow-lg shadow-green-500/20"
          >
            Cotizar mi bot <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-slate-300">{label}</label>
        <span className="text-sm font-mono font-semibold text-white">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-green-400"
      />
      <div className="flex justify-between text-xs text-slate-600 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function ResultRow({
  icon,
  label,
  value,
  accent,
  large,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  large?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 min-w-0">
        {icon}
        <span className="text-slate-400 text-sm truncate">{label}</span>
      </div>
      <span className={`font-bold font-mono shrink-0 ${large ? "text-xl" : "text-base"} ${accent}`}>
        {value}
      </span>
    </div>
  );
}
