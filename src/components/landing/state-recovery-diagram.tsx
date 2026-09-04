'use client';

import React from 'react';
import { AlertCircle, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

export const StateRecoveryDiagram: React.FC = () => {

  return (
    <div className="w-full my-8 p-6 rounded-2xl bg-[#080808] border border-[#262626] relative overflow-hidden">
      {/* Background Subtle Grid Texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1F1F1F] mb-6 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00C076] animate-pulse" />
          <span className="text-white font-semibold">IDEMPOTENT_EXECUTION_RECOVERY_MACHINE</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#00C076]/15 text-[#00C076] text-[0.6875rem] font-bold">
          ZERO_DUPLICATE_CHARGE_GUARANTEE
        </span>
      </div>

      {/* 3 Interactive State Nodes with Connecting Conduits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Node 1: Timeout Intercepted */}
        <div className="p-5 rounded-xl bg-[#101010] border border-[#F59E0B]/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B] text-[0.625rem] font-mono font-bold uppercase">
                Phase 01 • Intercept
              </span>
              <AlertCircle size={15} className="text-[#F59E0B]" />
            </div>
            <h4 className="font-heading text-sm font-bold text-white mb-1">
              Network Drop Intercepted
            </h4>
            <p className="text-xs text-[#A6A6A6] leading-relaxed">
              Order status shifts to <code className="text-[#F59E0B] font-mono">EXECUTION_UNKNOWN</code>. Automatic retries locked to prevent double debit.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#222222] font-mono text-[0.6875rem] text-[#888888] flex items-center justify-between">
            <span>Action: Lock</span>
            <span className="text-[#F59E0B]">BLOCKED ✓</span>
          </div>
        </div>

        {/* Node 2: Live Razorpay Query */}
        <div className="p-5 rounded-xl bg-[#101010] border border-[#818CF8]/40 flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded bg-[#818CF8]/15 text-[#818CF8] text-[0.625rem] font-mono font-bold uppercase">
                Phase 02 • Verification
              </span>
              <RefreshCw size={15} className="text-[#818CF8] animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <h4 className="font-heading text-sm font-bold text-white mb-1">
              Live Razorpay API Poll
            </h4>
            <p className="text-xs text-[#A6A6A6] leading-relaxed">
              Direct server-to-server call to Razorpay to inspect payment status before deciding rollback or capture.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#222222] font-mono text-[0.6875rem] text-[#888888] flex items-center justify-between">
            <span>Latency: 42ms</span>
            <span className="text-[#818CF8]">QUERY_OK ✓</span>
          </div>
        </div>

        {/* Node 3: Deterministic Resolution */}
        <div className="p-5 rounded-xl bg-[#101010] border border-[#00C076]/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded bg-[#00C076]/15 text-[#00C076] text-[0.625rem] font-mono font-bold uppercase">
                Phase 03 • Commit
              </span>
              <CheckCircle2 size={15} className="text-[#00C076]" />
            </div>
            <h4 className="font-heading text-sm font-bold text-white mb-1">
              Deterministic Settlement
            </h4>
            <p className="text-xs text-[#A6A6A6] leading-relaxed">
              If card debited: commit as <code className="text-[#00C076] font-mono">SUCCESS</code> with HMAC signature. If unbilled: safely released for single retry.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#222222] font-mono text-[0.6875rem] text-[#888888] flex items-center justify-between">
            <span>Audit Trail: Signed</span>
            <span className="text-[#00C076]">COMMITTED ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
