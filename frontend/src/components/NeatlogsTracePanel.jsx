import React from 'react';
import { Activity } from 'lucide-react';

export default function NeatlogsTracePanel({ data }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-sky-400" />
        Neatlogs Decision Trace Engine
      </h2>
      <div className="space-y-2 font-mono text-[11px]">
        {data?.auditResult?.traces.map((trace, idx) => (
          <div key={idx} className="p-2.5 rounded bg-slate-950 border border-slate-800/80 flex items-start justify-between">
            <div>
              <span className="text-sky-400 font-bold">[{trace.step}]</span>
              <p className="text-slate-400 mt-0.5">{trace.message || `Discrepancies found: ${trace.discrepancies_found}`}</p>
            </div>
            <span className="text-slate-600 text-[10px]">{new Date(trace.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}