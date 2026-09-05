import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export default function Navbar({ isClean, mode, setMode }) {
  return (
    <header className="max-w-7xl mx-auto flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg border transition-colors ${
          isClean 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {isClean ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            LedgerGuard <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">CFO WAR ROOM</span>
          </h1>
          <p className="text-xs text-slate-400">Autonomous Accounts Payable Auditing & Liquidity Circuit Breaker</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-slate-900 border border-slate-800 p-1 rounded-lg flex items-center gap-1 text-xs">
          <button
            onClick={() => setMode('fraud')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              mode === 'fraud' 
                ? 'bg-rose-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scenario: Fraud Invoice
          </button>
          <button
            onClick={() => setMode('clean')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              mode === 'clean' 
                ? 'bg-emerald-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scenario: Verified Clean
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          AO Cloud: Standby
        </div>
      </div>
    </header>
  );
}