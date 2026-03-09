'use client';

import { useState, useEffect } from 'react';

type Coin = 'BTC' | 'ETH' | 'SOL';

interface SignalData {
  goNoGo: string;
  direction: string;
  confluencia: string;
  score: number;
  fearGreed?: number;
  fearGreedLabel?: string;
  news?: string[];
  reasoning?: string;
  ts?: string;
}

interface PriceData {
  price: number | null;
  change24h: number | null;
}

const COIN_META: Record<Coin, { symbol: string; icon: string; iconColor: string }> = {
  BTC: { symbol: 'BTC/USDT', icon: '₿', iconColor: 'text-orange-400' },
  ETH: { symbol: 'ETH/USDT', icon: 'Ξ', iconColor: 'text-blue-400' },
  SOL: { symbol: 'SOL/USDT', icon: '◎', iconColor: 'text-purple-400' },
};

const TABS: Coin[] = ['BTC', 'ETH', 'SOL'];

function signalStyle(goNoGo: string) {
  if (goNoGo === 'GO') return { color: 'text-green-400', bg: 'bg-green-400', rec: { text: '✅ Confluencia alta. Condiciones favorables.', cls: 'bg-green-950/30 border border-green-900/40 text-green-400' } };
  if (goNoGo === 'CAUTION') return { color: 'text-yellow-400', bg: 'bg-yellow-400', rec: { text: '⚠️ Señales mixtas. Sin entrada clara.', cls: 'bg-yellow-950/30 border border-yellow-900/40 text-yellow-400' } };
  return { color: 'text-red-400', bg: 'bg-red-400', rec: { text: '🚫 Señal débil. Preservar capital.', cls: 'bg-red-950/30 border border-red-900/40 text-red-400' } };
}

function confluenceStyle(c: string) {
  if (c === 'ALTA') return 'text-green-400';
  if (c === 'MEDIA') return 'text-yellow-400';
  return 'text-red-400';
}

function fgEmoji(label: string) {
  const l = (label || '').toLowerCase();
  if (l.includes('extreme fear')) return '🔴';
  if (l.includes('fear')) return '🟠';
  if (l.includes('neutral')) return '🟡';
  if (l.includes('extreme greed')) return '💚';
  if (l.includes('greed')) return '🟢';
  return '';
}

function fgColor(label: string) {
  const l = (label || '').toLowerCase();
  if (l.includes('fear')) return 'text-red-400';
  if (l.includes('greed')) return 'text-green-400';
  return 'text-yellow-400';
}

function fmt(price: number | null, coin: Coin) {
  if (price === null) return '—';
  if (coin === 'SOL') return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function fmtChange(change: number | null) {
  if (change === null) return { text: '—', dir: 'flat' as const };
  return { text: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`, dir: change >= 0 ? 'up' as const : 'down' as const };
}

function timeAgo(ts?: string) {
  if (!ts) return '';
  const diff = Date.now() - new Date(ts).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `hace ${h}h`;
  if (m > 0) return `hace ${m}m`;
  return 'ahora';
}

// Placeholder signal shown before real data loads
const PLACEHOLDER: SignalData = {
  goNoGo: 'CAUTION',
  direction: 'NEUTRAL',
  confluencia: 'BAJA',
  score: 0,
};

export function LiveSignal() {
  const [tab, setTab] = useState<Coin>('BTC');
  const [prices, setPrices] = useState<Record<Coin, PriceData>>({ BTC: { price: null, change24h: null }, ETH: { price: null, change24h: null }, SOL: { price: null, change24h: null } });
  const [fearGreed, setFearGreed] = useState<{ value: string; label: string } | null>(null);
  const [signal, setSignal] = useState<SignalData>(PLACEHOLDER);

  useEffect(() => {
    async function loadPrices() {
      try {
        const res = await fetch('/api/prices');
        if (!res.ok) return;
        const data = await res.json();
        setPrices({ BTC: data.BTC, ETH: data.ETH, SOL: data.SOL });
        setFearGreed(data.fearGreed);
      } catch { /* keep */ }
    }
    async function loadSignal() {
      try {
        const res = await fetch('/api/signal');
        if (!res.ok) return;
        const data = await res.json();
        if (data) setSignal(data);
      } catch { /* keep */ }
    }
    loadPrices();
    loadSignal();
    const p = setInterval(loadPrices, 60_000);
    const s = setInterval(loadSignal, 300_000); // refresh signal every 5 min
    return () => { clearInterval(p); clearInterval(s); };
  }, []);

  const meta = COIN_META[tab];
  const live = prices[tab];
  const price = fmt(live?.price ?? null, tab);
  const { text: changeText, dir: changeDir } = fmtChange(live?.change24h ?? null);
  const ss = signalStyle(signal.goNoGo);
  const fgVal = fearGreed?.value ?? (signal.fearGreed ? String(signal.fearGreed) : '—');
  const fgLbl = fearGreed?.label ?? signal.fearGreedLabel ?? '';
  const news = signal.news ?? [];
  const dirDisplay = tab === 'BTC' ? (signal.direction || 'NEUTRAL') : tab === 'ETH' ? 'LATERAL' : 'ALCISTA';

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-purple-500/30 rounded-2xl blur-xl" />
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-800/60 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-400">SmartProIA · Live Signal</span>
          </div>
          <span className="text-xs text-slate-600 font-mono">
            {signal.ts ? `Actualizado ${timeAgo(signal.ts)}` : '06:00 AM'}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-mono font-bold transition-colors ${
                tab === t
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/40'
                  : 'text-slate-600 hover:text-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4 font-mono text-sm">
          {/* Price row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-lg ${meta.iconColor}`}>{meta.icon}</span>
              <span className="text-slate-300">{meta.symbol}</span>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">{price}</div>
              <div className={`text-xs ${changeDir === 'up' ? 'text-green-400' : changeDir === 'down' ? 'text-red-400' : 'text-slate-500'}`}>
                {changeDir === 'up' ? '↑' : changeDir === 'down' ? '↓' : ''} {changeText} 24h
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800" />

          {/* Signal grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/60 rounded-xl p-3">
              <div className="text-slate-500 text-xs mb-1">Señal</div>
              <div className={`flex items-center gap-1.5 font-bold ${ss.color}`}>
                <span className={`w-2 h-2 rounded-full ${ss.bg}`} />
                {signal.goNoGo}
              </div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3">
              <div className="text-slate-500 text-xs mb-1">Dirección</div>
              <div className="text-slate-300 font-bold">{dirDisplay}</div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3">
              <div className="text-slate-500 text-xs mb-1">Confluencia</div>
              <div className={`font-bold ${confluenceStyle(signal.confluencia)}`}>{signal.confluencia}</div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3">
              <div className="text-slate-500 text-xs mb-1">Fear & Greed</div>
              <div className={`font-bold ${fgColor(fgLbl)}`}>
                {fgVal} {fgEmoji(fgLbl)}
              </div>
            </div>
          </div>

          {/* News — only shown if real data available */}
          {news.length > 0 && (
            <div className="border-t border-slate-800 pt-3 space-y-1.5">
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">Noticias</div>
              {news.map((n, i) => (
                <div key={i} className="text-slate-400 text-xs">📰 {n}</div>
              ))}
            </div>
          )}

          {/* Recommendation */}
          <div className={`rounded-xl p-3 ${ss.rec.cls}`}>
            <div className="text-xs font-bold">{ss.rec.text}</div>
            {signal.reasoning && (
              <div className="text-xs mt-1 opacity-80">{signal.reasoning}</div>
            )}
          </div>

          <div className="text-slate-700 text-xs text-center">
            — SmartProIA Bot · Análisis autónomo 24/7
          </div>
        </div>
      </div>
    </div>
  );
}
