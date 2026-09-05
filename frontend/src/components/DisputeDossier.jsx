import React, { useState } from 'react';
import { Mail, CheckCircle2, Volume2, VolumeX, MessageSquare, Send, ShieldAlert } from 'lucide-react';

export default function DisputeDossier({ 
  data, 
  isClean, 
  isSpeaking, 
  handleVoiceCall, 
  disputeDispatched, 
  setDisputeDispatched 
}) {
  const [messages, setMessages] = useState([]);
  const [vendorInput, setVendorInput] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);

  const sendMessage = async (textToSend) => {
    const text = textToSend || vendorInput;
    if (!text.trim()) return;

    const newHistory = [...messages, { sender: 'vendor', text }];
    setMessages(newHistory);
    setVendorInput('');
    setLoadingReply(true);

    try {
      const res = await fetch('http://localhost:5000/api/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorMessage: text })
      });
      const response = await res.json();
      
      setMessages([
        ...newHistory,
        { 
          sender: 'agent', 
          text: response.agent_reply, 
          clause: response.applied_clause,
          status: response.dispute_status
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReply(false);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col h-full justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-400" />
            Autonomous Dispute & Negotiation
          </h2>
          {!isClean && (
            <button
              onClick={handleVoiceCall}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border transition font-mono ${
                isSpeaking 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {isSpeaking ? 'End Call' : 'Agent Voice Call'}
            </button>
          )}
        </div>

        <p className="text-xs text-slate-400 mb-3">
          {isClean 
            ? 'No dispute required. Transaction ready for automated settlement.' 
            : 'Simulate vendor pushback and test agent contract grounding.'}
        </p>

        {isClean ? (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 font-mono text-xs text-emerald-400">
            [SETTLEMENT_APPROVED] Transaction verified against PO-2026-101.
          </div>
        ) : (
          <div className="space-y-3">
            {/* Negotiation History Window */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 h-52 overflow-y-auto space-y-2.5 font-mono text-[11px]">
              {messages.length === 0 ? (
                <div className="text-slate-500 text-center py-12">
                  No pushback yet. Click a quick scenario below or send a vendor argument.
                </div>
              ) : (
                messages.map((m, idx) => (
                  <div key={idx} className={`flex flex-col ${m.sender === 'vendor' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 mb-0.5">
                      {m.sender === 'vendor' ? 'Vendor Accounts Desk' : 'LedgerGuard Arbiter'}
                    </span>
                    <div className={`p-2.5 rounded-lg max-w-[90%] leading-relaxed ${
                      m.sender === 'vendor' 
                        ? 'bg-slate-800 text-slate-200' 
                        : 'bg-rose-950/40 border border-rose-900/60 text-rose-300'
                    }`}>
                      {m.text}
                      {m.clause && (
                        <div className="mt-1.5 pt-1 border-t border-rose-900/40 flex items-center gap-1.5 text-[10px] text-amber-400">
                          <ShieldAlert className="w-3 h-3" />
                          <span>{m.clause}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Live Testing Quick Chips */}
            <div className="flex flex-wrap gap-1.5">
              <button 
                onClick={() => sendMessage("Market rates went up due to inflation.")}
                className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                + "Raw material inflation"
              </button>
              <button 
                onClick={() => sendMessage("These were emergency express delivery fees.")}
                className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                + "Express delivery"
              </button>
              <button 
                onClick={() => sendMessage("Sorry, our billing staff made a clerical error.")}
                className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                + "Typing error"
              </button>
            </div>

            {/* Custom Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={vendorInput}
                onChange={(e) => setVendorInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type vendor argument (e.g. 'Pay now or we halt supply')..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loadingReply}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg text-xs transition"
              >
                <Send className="w-3.5 h-3.5 text-slate-300" />
              </button>
            </div>
          </div>
        )}
      </div>

      {!isClean && (
        <div className="pt-3 border-t border-slate-800">
          <button 
            onClick={() => setDisputeDispatched(true)}
            disabled={disputeDispatched}
            className={`w-full py-2 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition ${
              disputeDispatched 
                ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-400 cursor-default' 
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            {disputeDispatched ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Dispute Formalized & Retained on Dodo Hold
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Dispatch Evidentiary Dossier & Lock Payout
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}