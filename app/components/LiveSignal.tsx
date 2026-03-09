'use client';

import { useState, useEffect } from 'react';
import { Minus } from 'lucide-react';

type Coin = 'BTC' | 'ETH' | 'SOL';

const SIGNAL_DATA: Record<Coin, {
  symbol: string;
  icon: string;
  iconColor: string;
  prices: string[];
  change: string;
  changeDir: 'up' | 'down' | 'flat';
  signal: string;
  signalColor: string;
  confluence: string;
  confluenceColor: string;
  fearGreed: string;
  fearGreedColor: string;
  direction: string;
  news: string[];
  rec: { text: string; cls: string };
}> = {
  BTC: {
    symbol: 'BTC/USDT',
    icon: '₿',
    iconColor: 'text-orange-400',
    prices: ['$67,240', '$67,185', '$67,310', '$67,060'],
    change: '-1.6%',
    changeDir: 'down',
    signal: 'CAUTION',
    signalColor: 'text-yellow-400',
    confluence: 'BAJA',
    confluenceColor: 'text-yellow-400',
    fearGreed: '12 🔴',
    fearGreedColor: 'text-red-400',
    direction: 'NEUTRAL',
    news: ['USDC supera a Tether en capitalización', 'Bitcoin baja 1.4% en volumen reducido'],
    rec: {
      text: '🚫 Señal débil. Preservar capital.',
      cls: 'bg-red-950/30 border border-red-900/40 text-red-400',
    },
  },
  ETH: {
    symbol: 'ETH/USDT',
    icon: 'Ξ',
    iconColor: 'text-blue-400',
    prices: ['$3,210', '$3,195', '$3,230', '$3,180'],
    change: '+0.8%',
    changeDir: 'up',
    signal: 'CAUTION',
    signalColor: 'text-yellow-400',
    confluence: 'MEDIA',
    confluenceColor: 'text-yellow-400',
    fearGreed: '12 🔴',
    fearGreedColor: 'text-red-400',
    direction: 'LATERAL',
    news: ['EIP-7702 mejora UX de wallets', 'Staking yield baja a 3.1%'],
    rec: {
      text: '⚠️ Señales mixtas. Sin entrada clara.',
      cls: 'bg-yellow-950/30 border border-yellow-900/40 text-yellow-400',
    },
  },
  SOL: {
    symbol: 'SOL/USDT',
    icon: '◎',
    iconColor: 'text-purple-400',
    prices: ['$142', '$140', '$145', '$139'],
    change: '+2.1%',
    changeDir: 'up',
    signal: 'GO',
    signalColor: 'text-green-400',
    confluence: 'ALTA',
    confluenceColor: 'text-green-400',
    fearGreed: '12 🔴',
    fearGreedColor: 'text-red-400',
    direction: 'ALCISTA',
    news: ['DeFi TVL en Solana supera $8B', 'Nuevo DEX supera $500M volumen'],
    rec: {
      text: '✅ Confluencia alta. Condiciones favorables.',
      cls: 'bg-green-950/30 border border-green-900/40 text-green-400',
    },
  },
};

const TABS: Coin[] = ['BTC', 'ETH', 'SOL'];

export function LiveSignal() {
  const [tab, setTab] = useState<Coin>('BTC');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const d = SIGNAL_DATA[tab];
  const price = d.prices[tick % d.prices.length];

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
          <span className="text-xs text-slate-600 font-mono">06:00 AM</span>
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
              <span className={`font-bold text-lg ${d.iconColor}`}>{d.icon}</span>
              <span className="text-slate-300">{d.symbol}</span>
            </div>
            <div className="text-right">
              <div className="text-white font-bold">{price}</div>
              <div
                className={`text-xs ${
                  d.changeDir === 'up' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {d.changeDir === 'up' ? '↑' : '↓'} {d.change} 24h
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800" />

          {/* Signal grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/60 rounded-xl p-3">
              <div className="text-slate-500 text-xs mb-1">Señal</div>
              <div className={`flex items-center gap-1.5 font-bold ${d.signalColor}`}>
                <span className={`w-2 h-2 rounded-full ${d.signalColor.replace('text-', 'bg-')}`} />
                {d.signal}
              </div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3">
              <div className="text-slate-500 text-xs mb-1">Dirección</div>
              <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                <Minus className="w-3 h-3" />
                {d.direction}
              </div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3">
              <div className="text-slate-500 text-xs mb-1">Confluencia</div>
              <div className={`font-bold ${d.confluenceColor}`}>{d.confluence}</div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3">
              <div className="text-slate-500 text-xs mb-1">Fear & Greed</div>
              <div className={`font-bold ${d.fearGreedColor}`}>{d.fearGreed}</div>
            </div>
          </div>

          {/* News */}
          <div className="border-t border-slate-800 pt-3 space-y-1.5">
            <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">Noticias</div>
            {d.news.map((n, i) => (
              <div key={i} className="text-slate-400 text-xs">
                📰 {n}
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div className={`rounded-xl p-3 ${d.rec.cls}`}>
            <div className="text-xs font-bold">{d.rec.text}</div>
          </div>

          <div className="text-slate-700 text-xs text-center">
            — SmartProIA Bot · Análisis autónomo 24/7
          </div>
        </div>
      </div>
    </div>
  );
}
