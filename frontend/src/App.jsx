import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MetricsGrid from './components/MetricsGrid';
import DiscrepancyPanel from './components/DiscrepancyPanel';
import NeatlogsTracePanel from './components/NeatlogsTracePanel';
import DisputeDossier from './components/DisputeDossier';

export default function App() {
  const [mode, setMode] = useState('fraud');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [disputeDispatched, setDisputeDispatched] = useState(false);

  const fetchAuditData = async (selectedMode) => {
    setLoading(true);
    setDisputeDispatched(false);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    try {
      const endpoint = selectedMode === 'clean' ? 'demo-clean' : 'demo-run';
      const res = await fetch(`http://localhost:5000/api/${endpoint}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Backend fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData(mode);
  }, [mode]);

  const handleVoiceCall = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const script = `Hello Accounts Payable at Apex Cloud Hardware. This is LedgerGuard Autonomous Agent calling on behalf of Chief Financial Officer. We have detected a discrepancy of 600 dollars on Invoice 2026-889 against Purchase Order 101. A unit price markup of 50 dollars and stealth tax inflation was identified. The scheduled Dodo Payments payout has been placed on administrative hold. Please verify your billing portal immediately.`;
    
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const isClean = data?.auditResult?.is_valid;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 selection:bg-rose-500/30">
      <Navbar isClean={isClean} mode={mode} setMode={setMode} />

      {loading ? (
        <div className="max-w-7xl mx-auto text-center py-24 text-slate-500 font-mono text-sm">
          Auditing transaction with Deterministic Engine...
        </div>
      ) : !data ? (
        <div className="max-w-7xl mx-auto text-center py-24 text-rose-400 font-mono text-sm">
          Failed to fetch data from backend. Check Port 5000.
        </div>
      ) : (
        <main className="max-w-7xl mx-auto space-y-6">
          <MetricsGrid data={data} isClean={isClean} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <DiscrepancyPanel data={data} isClean={isClean} />
              <NeatlogsTracePanel data={data} />
            </div>

            <div className="lg:col-span-5 space-y-4">
              <DisputeDossier 
                data={data}
                isClean={isClean}
                isSpeaking={isSpeaking}
                handleVoiceCall={handleVoiceCall}
                disputeDispatched={disputeDispatched}
                setDisputeDispatched={setDisputeDispatched}
              />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}