'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: '¿Necesito saber de trading para usar esto?',
    a: 'No. La señal es clara: GO (entra), CAUTION (precaución) o NO-GO (no entres). Con eso basta.',
  },
  {
    q: '¿El bot tiene acceso a mi cuenta?',
    a: 'Nunca. Solo analiza el mercado y envía señales. Tú decides si operas o no.',
  },
  {
    q: '¿Cuándo llegan las señales?',
    a: 'Todos los días a las 6:00 AM hora Chile, directo al canal Telegram privado.',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí. Sin contratos, sin permanencia mínima. Cancelas en cualquier momento desde el mismo Mercado Pago.',
  },
  {
    q: '¿Qué garantía tienen las señales?',
    a: 'No garantizamos rentabilidad — ningún sistema puede. Lo que sí garantizamos: señales entregadas a tiempo, datos reales y preferencia por NO-GO cuando hay duda, para proteger tu capital ante la incertidumbre.',
  },
  {
    q: '¿En qué se diferencia de otros canales de señales?',
    a: 'Transparencia total: mostramos accuracy real, sin capturas selectivas. El sistema es 100% autónomo (no depende de un "trader guru"), corre 24/7 y prioriza proteger capital sobre buscar operaciones a cualquier costo.',
  },
  {
    q: '¿Qué pasa si la señal es incorrecta?',
    a: 'Ningún sistema es infalible. El bot está diseñado para preferir NO-GO ante la duda — proteger capital es la prioridad número uno.',
  },
];

export function FAQ() {
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
            <ChevronDown
              className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
            />
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
}
