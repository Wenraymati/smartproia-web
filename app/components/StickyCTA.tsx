'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface StickyCTAProps {
  onOpen: () => void;
}

export function StickyCTA({ onOpen }: StickyCTAProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 inset-x-0 z-50 md:hidden"
        >
          <div className="bg-[#030712]/95 backdrop-blur-xl border-t border-slate-800 px-4 py-3">
            <button
              onClick={onOpen}
              className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl py-3.5 transition-all shadow-lg shadow-green-500/30"
            >
              <MessageCircle className="w-4 h-4" /> Quiero mi bot gratis
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
