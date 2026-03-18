'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: '¿Necesito tener cuenta de WhatsApp Business?',
    a: 'No es obligatorio tener una cuenta Business previa. Nosotros gestionamos todo el proceso de activación del número con la API oficial de WhatsApp. Podés usar tu número actual o uno nuevo.',
  },
  {
    q: '¿Cuánto tarda el setup?',
    a: 'El proceso completo toma entre 5 y 7 días hábiles desde que confirmás el proyecto. Incluye: relevamiento de tu negocio, configuración del bot, pruebas y lanzamiento.',
  },
  {
    q: '¿Qué pasa si quiero hacer cambios al bot después?',
    a: 'El mantenimiento mensual incluye hasta 2 ajustes al mes (respuestas, flujos, preguntas frecuentes). Cambios mayores se cotizan por separado.',
  },
  {
    q: '¿Puedo cancelar el plan mensual?',
    a: 'Sí. Sin contratos de permanencia mínima. Si cancelás, el bot deja de funcionar al término del período pagado. No hay penalizaciones.',
  },
  {
    q: '¿El bot puede cerrar ventas o solo responder preguntas?',
    a: 'Depende del flujo que diseñemos juntos. El bot puede calificar leads, enviar precios, agendar citas, y derivar al equipo humano en el momento justo. El objetivo es convertir, no solo informar.',
  },
  {
    q: '¿Qué es Chatwoot y para qué sirve?',
    a: 'Chatwoot es el dashboard que recibe tu equipo. Desde ahí ven todas las conversaciones, pueden tomar el control de un chat cuando el bot no puede resolverlo, y tienen el historial completo de cada cliente.',
  },
  {
    q: '¿Funciona para cualquier tipo de negocio?',
    a: 'Funciona mejor en negocios con flujos repetitivos: gimnasios, clínicas, inmobiliarias, restaurantes, talleres, servicios. Si tenés dudas de si aplica a tu caso, escribinos por WhatsApp y lo evaluamos gratis.',
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
