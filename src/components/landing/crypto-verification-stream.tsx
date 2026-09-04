'use client';

import React from 'react';
import { Lock, ShieldCheck, Check, Key } from 'lucide-react';

export const CryptoVerificationStream: React.FC = () => {

  return (
    <div className="w-full my-6 p-6 sm:p-7 rounded-2xl bg-[#080808] border border-[#2A2A2A] relative overflow-hidden font-mono text-xs">
      {/* Background Subtle Grid Texture */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-[#222222] mb-6 relative z-10">
        <div className="flex items-center gap-2 text-[#818CF8]">
          <Lock size={14} />
          <span className="font-bold tracking-wider">HMAC_SHA256_AUTHENTICATION_PIPELINE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00C076] animate-pulse" />
          <span className="text-[#00C076] font-bold">CONSTANT_TIME_AUDIT: VERIFIED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Left Column: Webhook Payload */}
        <div className="flex flex-col gap-2">
          <div className="text-[0.6875rem] text-[#888888] uppercase tracking-wider flex items-center justify-between">
            <span>Incoming Webhook JSON</span>
            <span className="text-[#818CF8]">order.paid</span>
          </div>
          <div className="p-4 rounded-xl bg-[#000000] border border-[#222222] text-[0.6875rem] text-[#CCCCCC] leading-relaxed overflow-x-auto">
            <span className="text-[#666666]">{`{`}</span><br />
            &nbsp;&nbsp;<span className="text-[#818CF8]">&quot;entity&quot;</span>: <span className="text-[#00C076]">&quot;event&quot;</span>,<br />
            &nbsp;&nbsp;<span className="text-[#818CF8]">&quot;account_id&quot;</span>: <span className="text-white">&quot;acc_ApexGear2026&quot;</span>,<br />
            &nbsp;&nbsp;<span className="text-[#818CF8]">&quot;event&quot;</span>: <span className="text-[#00C076]">&quot;order.paid&quot;</span>,<br />
            &nbsp;&nbsp;<span className="text-[#818CF8]">&quot;payload&quot;</span>: <span className="text-[#666666]">{`{`}</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#818CF8]">&quot;order&quot;</span>: <span className="text-[#666666]">{`{`}</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#818CF8]">&quot;id&quot;</span>: <span className="text-white">&quot;order_TX6oxexSYw2Vvh&quot;</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#818CF8]">&quot;amount&quot;</span>: <span className="text-[#F59E0B]">119900</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#818CF8]">&quot;currency&quot;</span>: <span className="text-white">&quot;INR&quot;</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#818CF8]">&quot;status&quot;</span>: <span className="text-[#00C076]">&quot;paid&quot;</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#666666]">{`}`}</span><br />
            &nbsp;&nbsp;<span className="text-[#666666]">{`}`}</span><br />
            <span className="text-[#666666]">{`}`}</span>
          </div>
        </div>

        {/* Right Column: Server-Side Cryptographic Validation */}
        <div className="flex flex-col gap-2">
          <div className="text-[0.6875rem] text-[#888888] uppercase tracking-wider flex items-center justify-between">
            <span>Server-Side Digest Comparison</span>
            <span className="text-[#00C076]">crypto.timingSafeEqual</span>
          </div>

          <div className="p-4 rounded-xl bg-[#000000] border border-[#222222] flex flex-col gap-3">
            {/* Computed Hash */}
            <div>
              <div className="text-[0.625rem] text-[#666666] uppercase mb-1">
                Computed Server Digest (SHA256):
              </div>
              <div className="p-2 rounded bg-[#0D0D0D] border border-[#262626] text-[0.6875rem] text-white truncate font-mono select-all">
                7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
              </div>
            </div>

            {/* Received Signature */}
            <div>
              <div className="text-[0.625rem] text-[#666666] uppercase mb-1">
                Header x-razorpay-signature:
              </div>
              <div className="p-2 rounded bg-[#0D0D0D] border border-[#262626] text-[0.6875rem] text-white truncate font-mono select-all">
                7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
              </div>
            </div>

            {/* Result Verification Card */}
            <div className="p-3 rounded-lg bg-[#00C076]/10 border border-[#00C076]/30 flex items-center justify-between text-[#00C076] font-bold">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>CRYPTOGRAPHIC INTEGRITY: 100% MATCH</span>
              </div>
              <span className="text-[0.6875rem] px-2 py-0.5 rounded bg-[#00C076] text-black font-extrabold">
                VALID ✓
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
