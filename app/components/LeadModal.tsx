'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Loader2 } from 'lucide-react';

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  redirectUrl: string;
}

export function LeadModal({ open, onClose, redirectUrl }: LeadModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const goToWA = () => {
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setLoading(true);
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'demo-modal' }),
      });
      setDone(true);
      setTimeout(goToWA, 800);
    } catch {
      goToWA();
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => goToWA();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
            onClick={handleSkip}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-sm pointer-events-auto shadow-2xl">
              {/* Close */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-1.5 text-slate-600 hover:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {done ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">✅</div>
                  <div className="text-white font-bold text-lg mb-1">¡Listo!</div>
                  <div className="text-slate-400 text-sm">Redirigiendo a WhatsApp…</div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="text-xs font-semibold text-green-400 mb-2">Demo gratis · Sin compromiso</div>
                    <h2 className="text-xl font-black text-white mb-2">
                      ¿A qué email te mandamos info?
                    </h2>
                    <p className="text-slate-400 text-sm">
                      Dejanos tu email y te contactamos por WhatsApp para coordinar la demo.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-green-500 transition-colors text-sm"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-60 text-slate-950 font-bold rounded-xl py-3 transition-all"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>Continuar <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </form>

                  <button
                    onClick={handleSkip}
                    className="w-full text-center text-slate-600 hover:text-slate-400 text-xs mt-3 transition-colors"
                  >
                    Ir directo a WhatsApp →
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
