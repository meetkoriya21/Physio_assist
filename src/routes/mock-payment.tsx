import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Copy, Check, Lock, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/mock-payment")({
  head: () => ({
    meta: [
      { title: "Test Payment Gateway — PhysioLife Clinic" },
      { name: "description", content: "Test QR Code payment simulation page for PhysioLife Clinic." },
    ],
  }),
  component: MockPaymentPage,
});

function MockPaymentPage() {
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [txnId, setTxnId] = useState("");

  const handleSimulate = () => {
    const mockId = `TXN-${Math.floor(Math.random() * 900000000000 + 100000000000)}`;
    setTxnId(mockId);
    setPaid(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(txnId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <AlertTriangle className="h-3.5 w-3.5" /> Test Mode
          </div>
          <h1 className="font-display text-2xl font-bold text-white">PhysioLife Clinic</h1>
          <p className="text-slate-400 text-sm mt-1">Digital Payment Portal (Sandbox)</p>
        </div>

        {/* Invoice details card */}
        <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800/80 mb-6">
          <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-3 mb-3 text-slate-400">
            <span>Description</span>
            <span className="text-white font-medium">Physiotherapy Session Fee</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-3 mb-3 text-slate-400">
            <span>Currency</span>
            <span className="text-white font-medium">GBP (£)</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-slate-400 text-sm font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-emerald-400">£75.00</span>
          </div>
        </div>

        {!paid ? (
          <div className="space-y-4">
            <div className="text-sm text-slate-400 text-center leading-relaxed">
              This is a simulated QR/Digital payment for testing purposes. No actual money will be deducted from your account.
            </div>
            <button
              onClick={handleSimulate}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 active:scale-[0.99]"
            >
              Simulate Successful Payment
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col items-center justify-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mb-2" />
              <div className="text-emerald-400 font-bold text-lg">Payment Simulated!</div>
              <div className="text-xs text-slate-400 mt-1">Status: SUCCESSFUL (DEMO)</div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Your Mock Transaction ID / UTR
              </label>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-center text-white flex items-center justify-center select-all">
                  {txnId}
                </div>
                <button
                  onClick={handleCopy}
                  className="px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition-colors active:scale-95"
                  title="Copy Transaction ID"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 text-center mt-2 leading-relaxed">
                Copy the transaction ID above and enter it in the "Transaction ID / UTR Number" field on the booking screen to confirm your appointment.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5 text-slate-500" />
          <span>Secure sandbox mode. No actual financial processing takes place.</span>
        </div>
      </div>
    </div>
  );
}
