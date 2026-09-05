import React from 'react';
import { CheckCircle2, AlertTriangle, Lock, Unlock } from 'lucide-react';

export default function MetricsGrid({ data, isClean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <span className="text-xs text-slate-400 font-medium">Audit Verdict</span>
        <div className="mt-2 flex items-center gap-2">
          {isClean ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-base font-bold text-emerald-400">100% VERIFIED</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="text-base font-bold text-amber-400">DISCREPANCY FLAGGED</span>
            </>
          )}
        </div>
        <span className="text-[11px] text-slate-500 mt-1 block">
          Ref: {data?.invoice_analyzed} vs {data?.po_analyzed}
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <span className="text-xs text-slate-400 font-medium">Risk Score</span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-2xl font-black ${isClean ? 'text-emerald-400' : 'text-rose-500'}`}>
            {data?.auditResult?.risk_score}/100
          </span>
          <span className={`text-xs font-semibold ${isClean ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isClean ? 'ZERO ANOMALIES' : 'CRITICAL DEFICIT'}
          </span>
        </div>
        <span className="text-[11px] text-slate-500 mt-1 block">
          {isClean ? 'All line items strictly within bounds' : '2 High-Severity Traps Caught'}
        </span>
      </div>

      {/* Dodo Payments Circuit Breaker */}
      <div className={`border rounded-xl p-4 transition-colors ${
        isClean ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-rose-950/20 border-rose-900/50'
      }`}>
        <span className={`text-xs font-medium flex items-center gap-1.5 ${isClean ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isClean ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
          Dodo Payments Rail
        </span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className={`text-lg font-bold font-mono ${isClean ? 'text-emerald-400' : 'text-rose-400'}`}>
            {data?.dodoAction?.payout_status}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 mt-1 block truncate font-mono">
          Ref: {data?.dodoAction?.transaction_ref}
        </span>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <span className="text-xs text-slate-400 font-medium">Capital Saved</span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-400 font-mono">
            {isClean ? '$0.00' : '$600.00'}
          </span>
          <span className="text-xs text-emerald-500 font-medium">Protected</span>
        </div>
        <span className="text-[11px] text-slate-500 mt-1 block">
          {isClean ? 'Full settlement cleared' : 'Line markup + tax difference'}
        </span>
      </div>
    </div>
  );
}