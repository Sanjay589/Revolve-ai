'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Lock,
  Sliders,
  AlertTriangle,
  Eye,
  ShieldCheck,
  Menu,
  X,
  Database,
} from 'lucide-react';
import { HeroScrollContainer } from '@/components/landing/hero-scroll-container';
import { ProductSimulationTabs } from '@/components/landing/product-simulation-tabs';
import { EditorialWordReveal } from '@/components/landing/word-reveal';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#00C076]/30 selection:text-white overflow-x-hidden font-body">
      {/* ─── 01 — NAVIGATION (1400px Centered) ─────────────────── */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-[#222222] px-6 sm:px-8 py-4 transition-all">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group text-decoration-none">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-extrabold text-sm font-heading shadow-md group-hover:scale-105 transition-transform">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-sm font-extrabold tracking-tight text-white leading-none">
                REVOLVE AI
              </span>
              <span className="text-[0.625rem] text-[#A6A6A6] tracking-wider uppercase font-mono mt-0.5">
                Commerce OS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-[#A6A6A6]">
            <a href="#product-tour" className="hover:text-white transition-colors">
              Product
            </a>
            <a href="#pipeline" className="hover:text-white transition-colors">
              Safety &amp; Guardrails
            </a>
            <a href="#capabilities" className="hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#technology" className="hover:text-white transition-colors">
              Fintech Engine
            </a>
            <a href="#use-cases" className="hover:text-white transition-colors">
              Solutions
            </a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-xs font-medium text-[#A6A6A6] hover:text-white border border-transparent hover:border-[#333333] transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/overview"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all shadow-sm"
            >
              <span>Launch Workspace</span>
              <ArrowRight size={13} />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#A6A6A6] hover:text-white border border-[#222222]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-[#222222] mt-3 flex flex-col gap-3 text-sm text-[#A6A6A6]">
            <a
              href="#product-tour"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-white"
            >
              Product
            </a>
            <a
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-white"
            >
              Safety &amp; Guardrails
            </a>
            <a
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-white"
            >
              Capabilities
            </a>
            <a
              href="#technology"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-white"
            >
              Fintech Engine
            </a>
            <a
              href="#use-cases"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-white"
            >
              Solutions
            </a>
          </div>
        )}
      </nav>

      {/* ─── 02 — HERO & 03 — PRODUCT EXPERIENCE ──────────────── */}
      <HeroScrollContainer>
        <section id="product-tour" className="scroll-mt-24">
          <ProductSimulationTabs />
        </section>
      </HeroScrollContainer>

      {/* ─── 04 — THE COMMERCE PROBLEM (ASYMMETRIC SPLIT) ─────── */}
      <section className="py-28 md:py-36 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Big Editorial Statement */}
          <div className="lg:col-span-5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-3 block">
              04 • The Commerce Problem
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
              AI shouldn&apos;t be a black box that spends money unchecked.
            </h2>
            <p className="text-base text-[#A6A6A6] leading-relaxed mb-6 font-normal">
              Merchants either leave substantial revenue on the table because static bundling rules can&apos;t keep pace with customer intent, or they deploy opaque AI agents that risk rogue discounts, margin collapse, and duplicate checkout charges.
            </p>
            <div className="p-5 rounded-xl border border-[#262626] bg-[#0D0D0D]">
              <div className="font-editorial text-xl text-white italic mb-1">
                &ldquo;Speed without guardrails is catastrophic.&rdquo;
              </div>
              <div className="text-xs text-[#666666]">
                Revolve AI isolates intelligence into discovery, and binds execution to strict merchant policies.
              </div>
            </div>
          </div>

          {/* Right Column: Comparative Composition */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* The Old Way: Unbounded Agent */}
            <div className="p-6 sm:p-7 rounded-2xl border border-[#222222] bg-[#0A0A0A]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#EF4444] mb-2 uppercase tracking-wide">
                <AlertTriangle size={15} /> Unconstrained Autonomous Agents
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                Opaque Decisions &amp; Unchecked Capital Movement
              </h3>
              <p className="text-xs text-[#A6A6A6] leading-relaxed">
                Autonomous models generate discounts dynamically without pre-execution validation. When network dropouts happen, systems retry blindly, generating duplicate card charges and customer disputes.
              </p>
            </div>

            {/* The Revolve AI Way: Zero-Trust Governance */}
            <div className="p-7 sm:p-8 rounded-2xl border border-[#00C076]/40 bg-[#0D0D0D] relative overflow-hidden shadow-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#00C076] mb-2 uppercase tracking-wide">
                <ShieldCheck size={16} /> Revolve AI Architecture
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-3">
                Pre-Execution Interception &amp; Cryptographic Signatures
              </h3>
              <p className="text-sm text-[#A6A6A6] leading-relaxed mb-5">
                Every AI recommendation is halted at four strict policy gates. If the single-transaction amount exceeds ₹10,000 or the daily budget surpasses ₹50,000, execution is intercepted and routed to the merchant Security Center for cryptographic sign-off.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#222222]">
                <div>
                  <div className="text-[0.6875rem] font-mono text-[#666666] uppercase">Max Tx Cap</div>
                  <div className="font-mono text-sm font-bold text-white">₹10,000 / order</div>
                </div>
                <div>
                  <div className="text-[0.6875rem] font-mono text-[#666666] uppercase">Daily AI Ceiling</div>
                  <div className="font-mono text-sm font-bold text-white">₹50,000 / day</div>
                </div>
                <div>
                  <div className="text-[0.6875rem] font-mono text-[#666666] uppercase">Checkout Security</div>
                  <div className="font-mono text-sm font-bold text-[#00C076]">HMAC-SHA256</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 05 — REVOLVE AI'S APPROACH (CORE PHILOSOPHY) ─────── */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-2 block">
            05 • Product Philosophy
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Four pillars of bounded commerce.
          </h2>
          <p className="text-base text-[#A6A6A6] leading-relaxed">
            Revolve AI never executes unchecked actions. The operating system unifies autonomous opportunity discovery with merchant oversight.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Autonomy',
              subtitle: 'Discovery & Synthesis',
              desc: 'Background agents scan SKUs, inventory velocity, and co-purchase elasticity without manual merchant effort.',
              icon: Brain,
              color: '#818CF8',
            },
            {
              title: 'Observability',
              subtitle: 'Concrete Evidence',
              desc: 'Every generated discount surfaces its historical basket affinity, confidence score, and projected merchant margin.',
              icon: Eye,
              color: '#00C076',
            },
            {
              title: 'Control',
              subtitle: 'Pre-Execution Policy',
              desc: 'Strict policy interceptors enforce hard caps on discount percentages, order maximums, and daily merchant budgets.',
              icon: Sliders,
              color: '#F59E0B',
            },
            {
              title: 'Verification',
              subtitle: 'Cryptographic Ledger',
              desc: 'All completed orders are cryptographically signed via HMAC-SHA256 and committed to an immutable audit trail.',
              icon: Lock,
              color: '#00C076',
            },
          ].map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-7 rounded-2xl border border-[#262626] bg-[#0D0D0D] flex flex-col justify-between hover:border-[#444444] transition-all"
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 border"
                    style={{
                      borderColor: `${pillar.color}30`,
                      backgroundColor: `${pillar.color}10`,
                      color: pillar.color,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white mb-1">
                    {pillar.title}
                  </h3>
                  <div className="text-xs font-mono text-[#666666] mb-3 uppercase tracking-wider">
                    {pillar.subtitle}
                  </div>
                  <p className="text-xs text-[#A6A6A6] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 06 — REVENUE INTELLIGENCE & 07 — PIPELINE ────────── */}
      <section id="pipeline" className="py-28 md:py-36 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-3 block">
            06 &amp; 07 • End-to-End Execution Flow
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            The 5-Step Controlled Execution Pipeline
          </h2>
          <p className="text-base text-[#A6A6A6] leading-relaxed">
            Every autonomous recommendation flows through 5 sequential checkpoints before a single rupee moves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              phase: 'INPUT',
              title: 'Catalog Affinity & Orders',
              desc: 'Continuous real-time ingestion of SKUs, basket history, and inventory availability across the merchant store.',
            },
            {
              step: '02',
              phase: 'PROCESSING',
              title: 'Elasticity & Margin Models',
              desc: 'Autonomous calculation of product co-purchase affinity and profit margin bounds for bundling.',
            },
            {
              step: '03',
              phase: 'INTELLIGENCE',
              title: 'Multi-Model Synthesis',
              desc: 'Gemini and Groq analyze basket opportunities and formulate explainable incentives with confidence scores.',
            },
            {
              step: '04',
              phase: 'RESULT',
              title: 'Policy Interception',
              desc: 'Pre-execution checks enforce maximum discount caps and single transaction limits (₹10k cap).',
            },
            {
              step: '05',
              phase: 'ACTION',
              title: 'Razorpay HMAC Checkout',
              desc: 'Bounded order generation with server-side cryptographic signature verification and ledger commit.',
            },
          ].map((item, idx) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl border border-[#262626] bg-[#0D0D0D] flex flex-col justify-between relative group hover:border-[#444444] transition-all"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-xl font-extrabold text-[#00C076]">
                    {item.step}
                  </span>
                  <span className="text-[0.625rem] font-mono uppercase tracking-widest text-[#666666] bg-[#141414] px-2 py-0.5 rounded border border-[#222222]">
                    {item.phase}
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold text-white mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#A6A6A6] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {idx < 4 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-20 text-[#444444]">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── 08 — SAFETY & POLICY INTERCEPTION ────────────────── */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-2 block">
              08 • Policy Interception
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Pre-execution zero-trust guardrails.
            </h2>
            <p className="text-sm text-[#A6A6A6] leading-relaxed mb-6">
              When an AI agent recommends a cross-sell companion or checkout incentive, Revolve AI halts the payload at the interceptor layer. Every variable is evaluated against merchant-defined policy thresholds.
            </p>
            <div className="flex flex-col gap-2.5 text-xs text-[#A6A6A6]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#00C076]" />
                <span>Single Transaction Ceiling: ₹10,000 maximum</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#00C076]" />
                <span>Daily Cumulative AI Budget: ₹50,000 allowance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#00C076]" />
                <span>Maximum Allowed Discount: 15% margin floor</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 p-7 rounded-2xl border border-[#333333] bg-[#0D0D0D]">
            <div className="flex items-center justify-between pb-4 border-b border-[#222222] mb-5">
              <span className="font-mono text-xs text-[#666666] uppercase">POLICY_INTERCEPTOR_EVALUATION</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#00C076]/15 text-[#00C076] text-xs font-mono font-bold">
                GATE_STATUS: 100% PASSED
              </span>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-between">
                <div>
                  <div className="text-[#A6A6A6]">Rule: max_single_transaction_amount</div>
                  <div className="text-white font-bold">Proposed: ₹1,199.00 &lt; Ceiling: ₹10,000.00</div>
                </div>
                <span className="text-[#00C076] font-bold">VERIFIED ✓</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-between">
                <div>
                  <div className="text-[#A6A6A6]">Rule: max_discount_percentage</div>
                  <div className="text-white font-bold">Injected: 10.0% &le; Cap: 15.0%</div>
                </div>
                <span className="text-[#00C076] font-bold">VERIFIED ✓</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-between">
                <div>
                  <div className="text-[#A6A6A6]">Rule: daily_ai_action_budget</div>
                  <div className="text-white font-bold">Accumulated: ₹14,820 / ₹50,000 (29.6%)</div>
                </div>
                <span className="text-[#00C076] font-bold">VERIFIED ✓</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 09 — FINTECH & RAZORPAY EXECUTION ────────────────── */}
      <section id="technology" className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="p-8 sm:p-12 rounded-3xl border border-[#333333] bg-[#0D0D0D] relative overflow-hidden">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-3 block">
              09 • Fintech Reliability Architecture
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Execution Unknown &amp; Idempotency Protection
            </h2>
            <p className="text-sm text-[#A6A6A6] leading-relaxed">
              When network timeouts occur during Razorpay checkout, standard systems risk double-charging customers by blindly retrying. Revolve AI eliminates double-charge risks with dedicated execution recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#141414] border border-[#262626]">
              <div className="text-xs font-mono text-[#F59E0B] font-bold uppercase mb-2">
                1. Timeout Intercepted
              </div>
              <p className="text-xs text-[#A6A6A6] leading-relaxed">
                Order status transitions to <code className="text-white font-mono">EXECUTION_UNKNOWN</code>. Automatic retries are locked immediately to protect customer accounts.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#141414] border border-[#262626]">
              <div className="text-xs font-mono text-[#818CF8] font-bold uppercase mb-2">
                2. Live Razorpay Query
              </div>
              <p className="text-xs text-[#A6A6A6] leading-relaxed">
                The server queries the live Razorpay Payments API to verify whether the card was actually debited before any rollback or cancellation occurs.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#141414] border border-[#262626]">
              <div className="text-xs font-mono text-[#00C076] font-bold uppercase mb-2">
                3. Deterministic Resolution
              </div>
              <p className="text-xs text-[#A6A6A6] leading-relaxed">
                If charged: committed as <strong className="text-white">SUCCESS</strong> with signature. If unbilled: safely released for a single verified checkout retry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 10 — CRYPTOGRAPHIC VERIFICATION / LEDGER ─────────── */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-2 block">
            10 • Cryptographic Integrity
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            Server-side HMAC-SHA256 signature auditing.
          </h2>
        </div>

        <div className="p-7 sm:p-8 rounded-2xl border border-[#333333] bg-[#0A0A0A] font-mono text-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-[#222222] mb-5">
            <span className="text-[#818CF8]">SECURE_CHECKOUT_LEDGER_SIGNATURE</span>
            <span className="text-[#00C076]">IMMUTABLE_AUDIT_TRAIL_ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 text-[#A6A6A6]">
              <div className="text-[0.6875rem] text-[#666666] uppercase">Incoming Webhook Payload</div>
              <pre className="p-4 rounded-xl bg-[#000000] border border-[#222222] overflow-x-auto text-[0.6875rem] text-white/90 leading-relaxed">
{`{
  "entity": "event",
  "account_id": "acc_ApexGear2026",
  "event": "order.paid",
  "contains": ["payment", "order"],
  "payload": {
    "order": {
      "id": "order_TX6oxexSYw2Vvh",
      "amount": 119900,
      "status": "paid"
    }
  }
}`}
              </pre>
            </div>

            <div className="flex flex-col gap-2 text-[#A6A6A6]">
              <div className="text-[0.6875rem] text-[#666666] uppercase">HMAC-SHA256 Cryptographic Verification</div>
              <div className="p-4 rounded-xl bg-[#000000] border border-[#222222] flex flex-col gap-3">
                <div>
                  <div className="text-[0.625rem] text-[#666666]">Generated Digest:</div>
                  <div className="text-white text-[0.6875rem] truncate">
                    7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                  </div>
                </div>
                <div>
                  <div className="text-[0.625rem] text-[#666666]">Received Razorpay Signature:</div>
                  <div className="text-white text-[0.6875rem] truncate">
                    7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                  </div>
                </div>
                <div className="pt-2 border-t border-[#222222] flex items-center justify-between text-[#00C076] font-bold">
                  <span>Signature Match</span>
                  <span>CONSTANT_TIME_EQUAL ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 11 — PRODUCT ANALYTICS (REAL METRICS) ───────────── */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="font-mono text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-2">
              ₹6,79,992
            </div>
            <div className="text-sm font-semibold text-[#A6A6A6] mb-1">
              AI-Attributed Revenue
            </div>
            <div className="text-xs text-[#666666]">
              Incremental companion offer volume.
            </div>
          </div>

          <div>
            <div className="font-mono text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-2">
              1,420
            </div>
            <div className="text-sm font-semibold text-[#A6A6A6] mb-1">
              Verified Orders
            </div>
            <div className="text-xs text-[#666666]">
              Processed through Razorpay test mode.
            </div>
          </div>

          <div>
            <div className="font-mono text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#00C076] tracking-tight mb-2">
              100%
            </div>
            <div className="text-sm font-semibold text-[#A6A6A6] mb-1">
              Policy Compliance
            </div>
            <div className="text-xs text-[#666666]">
              Zero unauthorized runaway actions.
            </div>
          </div>

          <div>
            <div className="font-mono text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-2">
              ₹10k
            </div>
            <div className="text-sm font-semibold text-[#A6A6A6] mb-1">
              Single Transaction Limit
            </div>
            <div className="text-xs text-[#666666]">
              Hard interceptor cap on autonomous spend.
            </div>
          </div>
        </div>
      </section>

      {/* ─── 12 — CORE CAPABILITIES (ASYMMETRIC ROWS) ────────── */}
      <section id="capabilities" className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-2 block">
            12 • Core Capabilities
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Built for enterprise-grade commerce reliability.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Capability 1: Catalog Affinity Discovery (Span 7) */}
          <div className="md:col-span-7 p-8 rounded-2xl border border-[#333333] bg-[#0D0D0D] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#818CF8] uppercase tracking-wider mb-3">
                <Brain size={14} /> Capability 01 • Discovery Engine
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-3">
                Continuous Catalog &amp; Basket Affinity Scanning
              </h3>
              <p className="text-sm text-[#A6A6A6] leading-relaxed mb-6">
                Automated background scanners correlate product co-purchases, inventory buffer thresholds, and checkout abandonments across your Razorpay payment ledger. High-ROI bundle and cross-sell companion offers are surfaced automatically.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] font-mono text-xs flex justify-between items-center">
              <span className="text-[#A6A6A6]">Scanning 34 past orders: Titan Pro + Sleeve</span>
              <span className="text-[#00C076] font-bold">+₹6,79,992 projected</span>
            </div>
          </div>

          {/* Capability 2: AI Explainability (Span 5) */}
          <div className="md:col-span-5 p-8 rounded-2xl border border-[#333333] bg-[#0D0D0D] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#818CF8] uppercase tracking-wider mb-3">
                <Eye size={14} /> Capability 02 • Transparency
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-3">
                Complete Explainability &amp; Concrete Basket Evidence
              </h3>
              <p className="text-sm text-[#A6A6A6] leading-relaxed mb-6">
                No hallucinated recommendations. Every action discloses its exact economic rationale, customer cohort volume, confidence rating, and estimated merchant margin protection.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#141414] border border-[#222222] text-xs text-[#00C076] font-semibold flex items-center gap-2">
              <CheckCircle2 size={15} /> 82% Verified Confidence Score
            </div>
          </div>

          {/* Capability 3: Zero-Trust Policy Interceptor (Span 5) */}
          <div className="md:col-span-5 p-8 rounded-2xl border border-[#333333] bg-[#0D0D0D] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#F59E0B] uppercase tracking-wider mb-3">
                <Sliders size={14} /> Capability 03 • Governance
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-3">
                Merchant Policy Engine &amp; Hard Spending Limits
              </h3>
              <p className="text-sm text-[#A6A6A6] leading-relaxed mb-6">
                Define the rules of engagement. Configure maximum discount caps, single transaction ceilings, and daily AI action allowances. The policy interceptor acts before execution, never after.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#141414] border border-[#222222] text-xs font-mono text-[#A6A6A6] flex justify-between">
              <span>Policy Status:</span>
              <span className="text-white font-bold">₹10,000 Tx Cap Active</span>
            </div>
          </div>

          {/* Capability 4: Cryptographic Razorpay Checkout (Span 7) */}
          <div className="md:col-span-7 p-8 rounded-2xl border border-[#333333] bg-[#0D0D0D] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00C076] uppercase tracking-wider mb-3">
                <Lock size={14} /> Capability 04 • Execution
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-3">
                Native Razorpay Test Mode &amp; Server-Side HMAC Verification
              </h3>
              <p className="text-sm text-[#A6A6A6] leading-relaxed mb-6">
                When a buyer confirms a recommendation or an agentic shopping session closes, standard bounded Razorpay orders are issued. Payments are cryptographically validated server-side using your Razorpay merchant secret.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] font-mono text-xs flex justify-between items-center">
              <span className="text-white/80">HMAC-SHA256 Server Validation</span>
              <span className="text-[#00C076] font-bold">100% Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 13 — MERCHANT USE CASES & SOLUTIONS ──────────────── */}
      <section id="use-cases" className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-2 block">
            13 • Target Merchant Workflows
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Engineered for high-intent commerce businesses.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl border border-[#262626] bg-[#0D0D0D] flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#00C076] uppercase tracking-wider mb-2 block">
                01 • D2C Apparel &amp; Gear
              </span>
              <h3 className="font-heading text-xl font-bold text-white mb-3">
                High-Velocity Basket Cross-Sells
              </h3>
              <p className="text-sm text-[#A6A6A6] leading-relaxed">
                Recommend compatible accessories at checkout based on actual co-purchase history with strict margin protection.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#222222] text-xs text-[#666666]">
              Average Order Value uplift: +28.4%
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-[#262626] bg-[#0D0D0D] flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#00C076] uppercase tracking-wider mb-2 block">
                02 • Electronics &amp; Hardware
              </span>
              <h3 className="font-heading text-xl font-bold text-white mb-3">
                Warranty &amp; Care Upsell Attachments
              </h3>
              <p className="text-sm text-[#A6A6A6] leading-relaxed">
                Automatically bundle protection plans and charging companions with hardware purchases within merchant policy ceilings.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#222222] text-xs text-[#666666]">
              Zero-Risk: Enforces max 10% discount cap
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-[#262626] bg-[#0D0D0D] flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-[#00C076] uppercase tracking-wider mb-2 block">
                03 • Razorpay Merchants
              </span>
              <h3 className="font-heading text-xl font-bold text-white mb-3">
                Execution Unknown Payment Recovery
              </h3>
              <p className="text-sm text-[#A6A6A6] leading-relaxed">
                Safely query payments when customer connection drops during checkout without causing double billing or chargebacks.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#222222] text-xs text-[#666666]">
              Idempotent webhook verification
            </div>
          </div>
        </div>
      </section>

      {/* ─── 14 — PROOF / REAL PRODUCT METRICS ────────────────── */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="p-8 sm:p-12 rounded-3xl border border-[#333333] bg-[#0D0D0D] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-2 block">
              14 • Quantitative Proof
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">
              Verified outcomes, verifiable in test mode.
            </h3>
            <p className="text-sm text-[#A6A6A6] max-w-xl">
              All numbers in Revolve AI represent actual catalog transactions, basket recommendations, and policy passes processed through Razorpay API test webhooks.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/overview"
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 transition-all shadow-md"
            >
              Verify Live Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 15 — TECHNICAL ARCHITECTURE (ENGINEERING DEPTH) ─── */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-2 block">
            15 • Engineering Architecture
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            Multi-model intelligence with strict security isolation.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-6 rounded-2xl border border-[#262626] bg-[#0D0D0D] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#818CF8] mb-3">
                <Brain size={16} /> AI Routing Layer
              </div>
              <p className="text-[#A6A6A6] text-xs leading-relaxed font-sans mb-4">
                Hybrid routing delegates complex basket elasticity calculations to Gemini 1.5 Pro and sub-second prompt responses to Groq LLaMA 3.3.
              </p>
            </div>
            <div className="pt-3 border-t border-[#222222] text-[0.6875rem] text-[#666666]">
              Latency: &lt; 240ms median
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[#262626] bg-[#0D0D0D] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#00C076] mb-3">
                <ShieldCheck size={16} /> Interceptor Middleware
              </div>
              <p className="text-[#A6A6A6] text-xs leading-relaxed font-sans mb-4">
                Deterministic Next.js route handlers validate incoming recommendation payloads before order creation. Unapproved mutations are rejected.
              </p>
            </div>
            <div className="pt-3 border-t border-[#222222] text-[0.6875rem] text-[#666666]">
              Enforcement: Zero-Trust Pre-Execution
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[#262626] bg-[#0D0D0D] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#F59E0B] mb-3">
                <Database size={16} /> Prisma &amp; SQLite Ledger
              </div>
              <p className="text-[#A6A6A6] text-xs leading-relaxed font-sans mb-4">
                Every action, approval, transaction attempt, and HMAC validation is recorded in the immutable audit log table with full timestamps.
              </p>
            </div>
            <div className="pt-3 border-t border-[#222222] text-[0.6875rem] text-[#666666]">
              Retention: Complete audit history
            </div>
          </div>
        </div>
      </section>

      {/* ─── 16 — PRODUCT CASE STUDY (TITAN PRO BUNDLE) ───────── */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="p-8 sm:p-12 rounded-3xl border border-[#262626] bg-[#0A0A0A]">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-[#818CF8] font-semibold mb-2 block">
              16 • Real Product Case Study
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
              Titan Pro Laptop + Magnetic Sleeve Basket Optimization
            </h3>
            <p className="text-sm text-[#A6A6A6] leading-relaxed">
              How Revolve AI turned checkout basket abandonments into ₹6,79,992 in verified incremental merchant volume.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 border-t border-[#222222]">
            <div>
              <div className="text-[0.6875rem] font-mono text-[#666666] uppercase mb-1">Customer Problem</div>
              <div className="text-xs text-white">42% dropoff when adding accessories separately.</div>
            </div>
            <div>
              <div className="text-[0.6875rem] font-mono text-[#666666] uppercase mb-1">AI Intervention</div>
              <div className="text-xs text-white">Surfaced 10% companion incentive at checkout.</div>
            </div>
            <div>
              <div className="text-[0.6875rem] font-mono text-[#666666] uppercase mb-1">Safety Gate</div>
              <div className="text-xs text-[#00C076] font-semibold">Passed &lt; ₹10k transaction rule.</div>
            </div>
            <div>
              <div className="text-[0.6875rem] font-mono text-[#666666] uppercase mb-1">Measured Outcome</div>
              <div className="text-xs text-white font-bold">+28.4% AOV uplift across 34 orders.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EDITORIAL WORD REVEAL (INTERACTIVE STATEMENT) ────── */}
      <div className="border-t border-[#1F1F1F]">
        <EditorialWordReveal />
      </div>

      {/* ─── 17 — FINAL CTA & DEMO CREDENTIALS ────────────────── */}
      <section className="py-28 md:py-36 px-6 max-w-5xl mx-auto border-t border-[#1F1F1F] text-center">
        <div className="p-10 sm:p-16 rounded-3xl border border-[#333333] bg-[#0D0D0D] relative overflow-hidden shadow-2xl">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-4 inline-block">
            17 • Live Merchant Workspace
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Give AI the power to act.<br />
            <span className="font-editorial text-[#F0F3F6] font-normal italic">Keep humans in control.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#A6A6A6] max-w-xl mx-auto leading-relaxed mb-8 font-normal">
            Revolve AI connects autonomous commerce intelligence with merchant-defined guardrails, verified execution, and observable decisions.
          </p>

          {/* Credentials Bar */}
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-xl bg-[#141414] border border-[#262626] font-mono text-xs text-[#A6A6A6] mb-8 flex-wrap justify-center">
            <span>
              <strong className="text-white font-semibold">Account:</strong> admin@apexgear.io
            </span>
            <span className="text-[#333333]">•</span>
            <span>
              <strong className="text-white font-semibold">Password:</strong> DemoMerchant@2026
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/overview"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/95 transition-all shadow-lg"
            >
              <span>Launch Live Workspace</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href="#product-tour"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-[#333333] bg-[#0D0D0D] text-white/90 hover:text-white hover:border-[#555555] font-medium text-sm transition-all"
            >
              <span>Explore Interactive Tour ↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 18 — COMPLETE 5-COLUMN FOOTER ────────────────────── */}
      <footer className="border-t border-[#1F1F1F] py-16 px-6 sm:px-8 max-w-[1400px] mx-auto text-xs text-[#A6A6A6]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand & Mission */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-extrabold text-xs font-heading">
                R
              </div>
              <span className="font-heading text-sm font-extrabold tracking-tight text-white">
                REVOLVE AI
              </span>
            </div>
            <p className="text-xs text-[#666666] leading-relaxed mt-1">
              Autonomous AI commerce operating system for merchants. Bounded revenue optimization with Razorpay HMAC validation.
            </p>
          </div>

          {/* Column 1: Product */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-white uppercase tracking-wider text-[0.6875rem] font-mono">
              Product
            </span>
            <Link href="/overview" className="hover:text-white transition-colors">
              Overview Dashboard
            </Link>
            <Link href="/ai-agent" className="hover:text-white transition-colors">
              AI Opportunity Scanner
            </Link>
            <Link href="/ai-buyers" className="hover:text-white transition-colors">
              Agentic Buyer Engine
            </Link>
            <Link href="/campaigns" className="hover:text-white transition-colors">
              Automated Campaigns
            </Link>
            <Link href="/catalog" className="hover:text-white transition-colors">
              Product Catalog Feed
            </Link>
          </div>

          {/* Column 2: Safety & Governance */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-white uppercase tracking-wider text-[0.6875rem] font-mono">
              Safety &amp; Governance
            </span>
            <Link href="/settings" className="hover:text-white transition-colors">
              Policy Interceptor
            </Link>
            <Link href="/approvals" className="hover:text-white transition-colors">
              Security Approval Center
            </Link>
            <Link href="/audit" className="hover:text-white transition-colors">
              Cryptographic Audit Log
            </Link>
            <Link href="/transactions" className="hover:text-white transition-colors">
              HMAC Payment Ledger
            </Link>
          </div>

          {/* Column 3: Fintech & Tech */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-white uppercase tracking-wider text-[0.6875rem] font-mono">
              Fintech &amp; Tech
            </span>
            <a href="#technology" className="hover:text-white transition-colors">
              Razorpay Integration
            </a>
            <a href="#technology" className="hover:text-white transition-colors">
              Execution Recovery
            </a>
            <span className="text-[#666666]">Gemini 1.5 + Groq Routing</span>
            <span className="text-[#666666]">HMAC-SHA256 Signatures</span>
          </div>

          {/* Column 4: Access & Account */}
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-white uppercase tracking-wider text-[0.6875rem] font-mono">
              Access
            </span>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-white transition-colors">
              Create Account
            </Link>
            <Link href="/overview" className="hover:text-white transition-colors">
              Demo Workspace
            </Link>
            <a
              href="https://github.com/Sanjay589/Revolve-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1F1F1F] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#666666]">
          <div>
            &copy; 2026 Revolve AI. Developed for Razorpay Autonomous Commerce Hackathon.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C076]" />
            <span className="text-[#00C076] font-mono">Razorpay Test Mode Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
