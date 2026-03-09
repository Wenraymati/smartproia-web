'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Btn } from './Btn';

interface PriceCardProps {
  title: string;
  price: string;
  sub?: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
}

export function PriceCard({ title, price, sub, features, cta, href, highlight = false }: PriceCardProps) {
  return (
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
        {features.map((f, i) => (
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
}
