'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Casos de uso', href: '#casos' },
  { label: 'Precios', href: '#precios' },
  { label: 'FAQ', href: '#faq' },
];

interface MobileNavProps {
  onCtaClick: () => void;
  waFree: string;
}

export function MobileNav({ onCtaClick }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-72 bg-[#030712] border-l border-slate-800 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                <div className="text-lg font-black text-white tracking-tight">
                  SmartPro<span className="text-cyan-400">IA</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1 p-4 flex-1">
                {NAV_LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors font-medium"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>

              {/* CTA */}
              <div className="p-4 border-t border-slate-800">
                <button
                  onClick={() => { setOpen(false); onCtaClick(); }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl px-6 py-3 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> Quiero una demo
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
