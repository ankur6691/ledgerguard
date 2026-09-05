import React from 'react';
import { FileText } from 'lucide-react';

export default function DiscrepancyPanel({ data, isClean }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-sky-400" />
        Deterministic Audit Breakdown
      </h2>

      {isClean ? (
        <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/50 text-xs text-emerald-300 font-mono">
          ✓ All unit rates match PO-2026-101 precisely ($500.00 & $100.00).<br />
          ✓ Claimed tax: $990.00 matches 18% authorized bracket.<br />
          ✓ Grand total authorized for automated settlement.
        </div>
      ) : (
        <div className="space-y-3">
          {data?.auditResult?.discrepancies.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-slate-950/80 border border-rose-900/40 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/50">
                  {item.type}
                </span>
                <span className="text-[10px] text-rose-400/80 font-mono uppercase tracking-wider">{item.severity}</span>
              </div>
              <p className="text-slate-300 font-mono text-[11px]">{item.details}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}