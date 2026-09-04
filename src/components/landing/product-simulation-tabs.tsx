'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Brain,
  Eye,
  ShieldCheck,
  Lock,
  Bot,
  TrendingUp,
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export type DemoTabId = 'overview' | 'scanner' | 'explain' | 'policy' | 'ledger' | 'buyer';

export const ProductSimulationTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DemoTabId>('overview');

  // AI Buyer simulation state
  const [activeBuyerPrompt, setActiveBuyerPrompt] = useState('I need running shoes under ₹5,000');
  const [buyerResult, setBuyerResult] = useState({
    title: 'Apex HyperLight 2 Pro Running Shoes',
    price: 449900,
    reason: 'Matches daily road running criteria with responsive nitrogen foam midsole and breathable mesh upper under ₹5,000 limit.',
    features: ['Carbon Stabilizer Plate', 'Engineered Breathable Mesh', 'High-Abrasion Rubber Outsole'],
  });

  const handleRunBuyerPrompt = (
    prompt: string,
    title: string,
    price: number,
    reason: string,
    features: string[]
  ) => {
    setActiveBuyerPrompt(prompt);
    setTimeout(() => {
      setBuyerResult({ title, price, reason, features });
    }, 150);
  };

  const tabs: { id: DemoTabId; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'overview', label: '1. Dashboard Overview', icon: Activity },
    { id: 'scanner', label: '2. AI Opportunity Scanner', icon: Brain },
    { id: 'explain', label: '3. Explainability Inspector', icon: Eye },
    { id: 'policy', label: '4. Policy Guardrails', icon: ShieldCheck },
    { id: 'ledger', label: '5. Cryptographic Ledger', icon: Lock },
    { id: 'buyer', label: '6. Agentic AI Buyer', icon: Bot },
  ];

  return (
    <div className="w-full">
      {/* Tab Navigation Pill Bar */}
      <div
        role="tablist"
        aria-label="Interactive Product Capabilities"
        className="flex items-center justify-center gap-2 mb-6 flex-wrap"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`sim-tab-${tab.id}`}
              aria-controls={`sim-panel-${tab.id}`}
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-black shadow-md'
                  : 'bg-[#0D0D0D] text-[#A6A6A6] hover:text-white border border-[#333333]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-black' : 'text-[#A6A6A6]'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Frame Container */}
      <div className="rounded-2xl border border-[#333333] bg-[#0D0D0D] shadow-2xl overflow-hidden text-left">
        {/* Mock Browser Topbar */}
        <div className="bg-[#141414] px-5 py-3.5 border-b border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C076]/80" />
            </div>
            <div className="font-mono text-xs text-[#666666] bg-[#0A0A0A] px-3 py-1 rounded-md border border-[#222222]">
              revolve-ai.apexgear.io/{activeTab}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00C076]/10 text-[#00C076] border border-[#00C076]/20 text-[0.6875rem] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C076] animate-pulse" />
              LIVE POLICY ENGINE
            </span>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 md:p-8 min-h-[460px] bg-black">
          <AnimatePresence mode="wait">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                id="sim-panel-overview"
                role="tabpanel"
                aria-labelledby="sim-tab-overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                {/* Dominant Stat Banner */}
                <div className="p-6 rounded-xl border border-[#333333] bg-[#0D0D0D]">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-[#A6A6A6]">
                          AI-Attributed Revenue
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/25 text-[0.6875rem] font-semibold flex items-center gap-1">
                          <Brain size={11} /> Autonomous Attribution
                        </span>
                      </div>
                      <div className="font-mono text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                        ₹6,79,992
                      </div>
                      <p className="text-xs text-[#A6A6A6] mt-2 max-w-xl">
                        Incremental merchant volume generated by policy-checked cross-sell companion offers &amp; automated checkout bundling.
                      </p>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-lg bg-[#00C076]/10 border border-[#00C076]/25 text-[#00C076] text-xs font-semibold flex items-center gap-1.5">
                      <TrendingUp size={14} /> +28.4% growth vs prior cycle
                    </div>
                  </div>
                </div>

                {/* 4 Secondary Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-xl border border-[#222222] bg-[#0D0D0D]">
                    <div className="text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Gross Volume
                    </div>
                    <div className="font-mono text-xl font-bold text-white">₹42,85,000</div>
                  </div>

                  <div className="p-5 rounded-xl border border-[#222222] bg-[#0D0D0D]">
                    <div className="text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Verified Orders
                    </div>
                    <div className="font-mono text-xl font-bold text-white">1,420</div>
                  </div>

                  <div className="p-5 rounded-xl border border-[#222222] bg-[#0D0D0D]">
                    <div className="text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Average Order Value
                    </div>
                    <div className="font-mono text-xl font-bold text-white">₹3,017</div>
                  </div>

                  <div className="p-5 rounded-xl border border-[#222222] bg-[#0D0D0D]">
                    <div className="text-xs font-mono uppercase tracking-wider text-[#666666] mb-1">
                      Policy Guardrail Rate
                    </div>
                    <div className="font-mono text-xl font-bold text-[#00C076]">100% Valid</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: AI SCANNER */}
            {activeTab === 'scanner' && (
              <motion.div
                key="scanner"
                id="sim-panel-scanner"
                role="tabpanel"
                aria-labelledby="sim-tab-scanner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="p-6 rounded-xl border border-[#333333] bg-[#0D0D0D]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/25 text-[0.6875rem] font-semibold flex items-center gap-1">
                      <Brain size={11} /> CROSS_SELL BUNDLE
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#00C076]/10 text-[#00C076] border border-[#00C076]/25 text-[0.6875rem] font-semibold">
                      82% AI Confidence
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-white mb-2">
                    Titan Pro Laptop + Magnetic Sleeve Cross-Sell
                  </h3>
                  <p className="text-xs text-[#A6A6A6] leading-relaxed mb-4">
                    Historical basket analysis shows 34 customer orders purchased these items together. Proposing an automated 10% companion incentive at checkout.
                  </p>
                  <div className="p-3.5 rounded-lg bg-[#141414] border border-[#262626] flex justify-between items-center">
                    <div>
                      <div className="text-[0.6875rem] font-mono text-[#666666] uppercase">PROJECTED IMPACT</div>
                      <div className="font-mono text-base font-bold text-[#00C076]">+₹6,79,992 / mo</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[0.6875rem] font-mono text-[#666666] uppercase">POLICY CHECK</div>
                      <div className="text-xs font-semibold text-[#00C076]">Within Bounds ✓</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl border border-[#333333] bg-[#0D0D0D]">
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/25 text-[0.6875rem] font-semibold flex items-center gap-1">
                      <Brain size={11} /> UPSELL PROMOTION
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#00C076]/10 text-[#00C076] border border-[#00C076]/25 text-[0.6875rem] font-semibold">
                      78% AI Confidence
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-white mb-2">
                    Apex HyperLight 2 Runner Carbon Upgrade
                  </h3>
                  <p className="text-xs text-[#A6A6A6] leading-relaxed mb-4">
                    Recommending carbon plate variant to repeat marathon runners based on previous training footwear purchases in recent 90-day transactions.
                  </p>
                  <div className="p-3.5 rounded-lg bg-[#141414] border border-[#262626] flex justify-between items-center">
                    <div>
                      <div className="text-[0.6875rem] font-mono text-[#666666] uppercase">PROJECTED IMPACT</div>
                      <div className="font-mono text-base font-bold text-[#00C076]">+₹3,40,000 / mo</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[0.6875rem] font-mono text-[#666666] uppercase">POLICY CHECK</div>
                      <div className="text-xs font-semibold text-[#00C076]">Within Bounds ✓</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: EXPLAINABILITY INSPECTOR */}
            {activeTab === 'explain' && (
              <motion.div
                key="explain"
                id="sim-panel-explain"
                role="tabpanel"
                aria-labelledby="sim-tab-explain"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-xl border border-[#333333] bg-[#0D0D0D]"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/25 text-[0.6875rem] font-semibold flex items-center gap-1 w-max mb-1.5">
                      <Eye size={11} /> EXPLAINABILITY ENGINE
                    </span>
                    <h3 className="font-heading text-base font-bold text-white">
                      Why Did AI Recommend the Titan Pro Sleeve Bundle?
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#00C076]/10 text-[#00C076] border border-[#00C076]/25 text-xs font-semibold">
                    82% AI Confidence Score
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <div className="p-3.5 rounded-lg bg-[#141414] border border-[#222222]">
                    <div className="text-[0.6875rem] font-mono text-[#666666] uppercase">Expected Monthly Gain</div>
                    <div className="font-mono text-lg font-bold text-[#00C076]">+₹6,79,992</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#141414] border border-[#222222]">
                    <div className="text-[0.6875rem] font-mono text-[#666666] uppercase">Risk Rating</div>
                    <div className="text-base font-bold text-[#00C076]">LOW RISK</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#141414] border border-[#222222]">
                    <div className="text-[0.6875rem] font-mono text-[#666666] uppercase">Safety Policy Limit</div>
                    <div className="text-base font-bold text-[#00C076]">PASS (₹10k cap)</div>
                  </div>
                </div>

                <div className="text-xs font-mono uppercase tracking-wider text-[#A6A6A6] mb-3">
                  Historical Basket Evidence Points:
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222222] text-xs text-[#CCCCCC] flex gap-3">
                    <span className="font-bold text-[#00C076]">1.</span>
                    <span>34 customer orders in the past 90 days included both Titan Pro Laptop and Magnetic Sleeve.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222222] text-xs text-[#CCCCCC] flex gap-3">
                    <span className="font-bold text-[#00C076]">2.</span>
                    <span>Offering companion sleeve at checkout increases overall basket conversion by an estimated 27%.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#141414] border border-[#222222] text-xs text-[#CCCCCC] flex gap-3">
                    <span className="font-bold text-[#00C076]">3.</span>
                    <span>Merchant gross margin is protected at 42% after applying bounded 10% companion discount.</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: POLICY GUARDRAILS */}
            {activeTab === 'policy' && (
              <motion.div
                key="policy"
                id="sim-panel-policy"
                role="tabpanel"
                aria-labelledby="sim-tab-policy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-xl border border-[#333333] bg-[#0D0D0D]"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/25 text-[0.6875rem] font-semibold flex items-center gap-1 w-max mb-1.5">
                      <ShieldCheck size={11} /> POLICY ENGINE INTERCEPTOR
                    </span>
                    <h3 className="font-heading text-base font-bold text-white">
                      Autonomous Action Interception &amp; Guardrail Checklist
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#00C076]/10 text-[#00C076] border border-[#00C076]/25 text-xs font-semibold">
                    All 4 Gates Verified ✓
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-[#141414] border border-[#222222]">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#00C076] mb-1">
                      <CheckCircle2 size={16} /> Maximum Transaction Limit
                    </div>
                    <p className="text-xs text-[#A6A6A6] leading-relaxed">
                      Action amount is ₹2,499. Safely below configured cap of ₹10,000 per transaction.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#141414] border border-[#222222]">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#00C076] mb-1">
                      <CheckCircle2 size={16} /> Daily Cumulative AI Spend
                    </div>
                    <p className="text-xs text-[#A6A6A6] leading-relaxed">
                      Daily usage is ₹14,200 / ₹50,000. Within daily merchant budget limit.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#141414] border border-[#222222]">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#00C076] mb-1">
                      <CheckCircle2 size={16} /> Maximum Discount Threshold
                    </div>
                    <p className="text-xs text-[#A6A6A6] leading-relaxed">
                      Incentive is 10%. Below maximum allowed discount ceiling of 25%.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#141414] border border-[#222222]">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#00C076] mb-1">
                      <CheckCircle2 size={16} /> Human Authorization Required
                    </div>
                    <p className="text-xs text-[#A6A6A6] leading-relaxed">
                      Routed to Approval Security Center for merchant signature before commit.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 5: CRYPTOGRAPHIC LEDGER */}
            {activeTab === 'ledger' && (
              <motion.div
                key="ledger"
                id="sim-panel-ledger"
                role="tabpanel"
                aria-labelledby="sim-tab-ledger"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-[#333333] bg-[#0D0D0D] overflow-hidden"
              >
                <div className="p-4 bg-[#141414] border-b border-[#222222] flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Lock size={13} className="text-[#00C076]" /> RAZORPAY TEST MODE LEDGER &amp; HMAC AUDIT
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#222222] text-[#666666] font-mono uppercase">
                        <th className="p-3.5">Razorpay Order ID</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Signature Verification</th>
                        <th className="p-3.5">Webhook Status</th>
                        <th className="p-3.5">Ledger Commit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1A1A]">
                      <tr>
                        <td className="p-3.5 font-mono text-white/90">order_TX6oxexSYw2Vvh</td>
                        <td className="p-3.5 font-mono font-bold text-white">₹4,499.00</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-[#00C076]/10 text-[#00C076] font-mono text-[0.6875rem]">
                            HMAC-SHA256 Valid
                          </span>
                        </td>
                        <td className="p-3.5 text-[#00C076] font-semibold">Confirmed ✓</td>
                        <td className="p-3.5 text-[#A6A6A6] font-mono text-[0.6875rem]">IMMUTABLE LOGGED</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-mono text-white/90">order_88K2laox109vla</td>
                        <td className="p-3.5 font-mono font-bold text-white">₹8,999.00</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-[#00C076]/10 text-[#00C076] font-mono text-[0.6875rem]">
                            HMAC-SHA256 Valid
                          </span>
                        </td>
                        <td className="p-3.5 text-[#00C076] font-semibold">Confirmed ✓</td>
                        <td className="p-3.5 text-[#A6A6A6] font-mono text-[0.6875rem]">IMMUTABLE LOGGED</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB 6: AGENTIC AI BUYER */}
            {activeTab === 'buyer' && (
              <motion.div
                key="buyer"
                id="sim-panel-buyer"
                role="tabpanel"
                aria-labelledby="sim-tab-buyer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 rounded-xl border border-[#333333] bg-[#0D0D0D]"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/25 text-[0.6875rem] font-semibold flex items-center gap-1 w-max mb-1.5">
                      <Bot size={11} /> AGENTIC COMMERCE CHAT
                    </span>
                    <h3 className="font-heading text-base font-bold text-white">
                      Natural Language Product Discovery &amp; Instant Razorpay Checkout
                    </h3>
                  </div>
                </div>

                {/* Query Chips */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {[
                    {
                      label: '🏃 Running shoes under ₹5,000',
                      prompt: 'I need running shoes under ₹5,000',
                      title: 'Apex HyperLight 2 Pro Running Shoes',
                      price: 449900,
                      reason: 'Matches daily road running criteria with responsive nitrogen foam midsole under ₹5,000 limit.',
                      features: ['Carbon Stabilizer Plate', 'Engineered Mesh', 'Rubber Outsole'],
                    },
                    {
                      label: '💻 Travel laptop accessories',
                      prompt: 'Show me laptop accessories for travel',
                      title: 'Apex Magnetic Waterproof Laptop Sleeve',
                      price: 249900,
                      reason: 'Engineered for 16-inch laptops with magnetic latch and weather-sealed ballistic nylon.',
                      features: ['Ballistic Nylon', 'Magnetic Latch', 'Microfiber Lining'],
                    },
                    {
                      label: '🎧 Gym ANC headphones',
                      prompt: 'Noise-cancelling gym headphones',
                      title: 'Apex SonicPro Hybrid ANC Earbuds',
                      price: 349900,
                      reason: 'IPX7 sweatproof wireless earbuds with active noise cancellation and secure ergonomic hooks.',
                      features: ['Active Noise Cancellation', 'IPX7 Sweatproof', '32h Battery'],
                    },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        handleRunBuyerPrompt(
                          item.prompt,
                          item.title,
                          item.price,
                          item.reason,
                          item.features
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer border ${
                        activeBuyerPrompt === item.prompt
                          ? 'bg-white text-black font-semibold border-white'
                          : 'bg-[#141414] text-[#A6A6A6] border-[#262626] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Result Card */}
                <div className="p-5 rounded-xl bg-[#141414] border border-[#262626]">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <span className="text-[0.6875rem] font-mono text-[#666666] uppercase mb-1 block">
                        AI MATCHED PRODUCT
                      </span>
                      <h4 className="font-heading text-sm sm:text-base font-bold text-white">
                        {buyerResult.title}
                      </h4>
                      <p className="text-xs text-[#A6A6A6] mt-1 max-w-lg">{buyerResult.reason}</p>
                    </div>
                    <div className="font-mono text-xl font-bold text-white">
                      {formatCurrency(buyerResult.price)}
                    </div>
                  </div>

                  <div className="flex gap-1.5 mt-4 flex-wrap">
                    {buyerResult.features.map((f, i) => (
                      <span
                        key={i}
                        className="text-[0.6875rem] px-2.5 py-0.5 rounded bg-[#1F1F1F] text-[#CCCCCC]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Link
                      href="/ai-buyers"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00C076] text-black text-xs font-semibold hover:bg-[#00C076]/90 transition-colors"
                    >
                      <ShoppingBag size={14} />
                      <span>Buy with Razorpay Test Mode</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
