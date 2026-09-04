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
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { HeroScrollContainer } from '@/components/landing/hero-scroll-container';
import { ProductSimulationTabs } from '@/components/landing/product-simulation-tabs';
import { EditorialWordReveal } from '@/components/landing/word-reveal';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#00C076]/30 selection:text-white overflow-x-hidden font-body">
      {/* ─── NAVIGATION BAR ────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-[#222222] px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
              Product Tour
            </a>
            <a href="#pipeline" className="hover:text-white transition-colors">
              Safety Pipeline
            </a>
            <a href="#capabilities" className="hover:text-white transition-colors">
              Core Capabilities
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
              Product Tour
            </a>
            <a
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-white"
            >
              Safety Pipeline
            </a>
            <a
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-white"
            >
              Core Capabilities
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

      {/* ─── SECTION 1: HERO & PRODUCT SIMULATION ────────────── */}
      <HeroScrollContainer>
        <section id="product-tour" className="scroll-mt-24">
          <ProductSimulationTabs />
        </section>
      </HeroScrollContainer>

      {/* ─── SECTION 2: PRODUCT STORY (ASYMMETRIC NARRATIVE) ── */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Big Editorial Statement */}
          <div className="lg:col-span-5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-3 block">
              The Commerce Dilemma
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
              AI shouldn&apos;t be a black box that spends money unchecked.
            </h2>
            <p className="text-base text-[#A6A6A6] leading-relaxed mb-6 font-normal">
              Merchants either leave substantial revenue on the table because manual pricing and bundling rules can&apos;t keep pace with customer intent, or they deploy opaque AI agents that risk rogue discounts, margin collapse, and duplicate checkout charges.
            </p>
            <div className="p-4 rounded-xl border border-[#262626] bg-[#0D0D0D]">
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
            <div className="p-6 rounded-2xl border border-[#222222] bg-[#0A0A0A]">
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
            <div className="p-7 rounded-2xl border border-[#00C076]/40 bg-[#0D0D0D] relative overflow-hidden shadow-xl">
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

      {/* ─── SECTION 3: CORE CAPABILITIES (NON-REPETITIVE) ───── */}
      <section id="capabilities" className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-2 block">
            Product Capabilities
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

      {/* ─── SECTION 4: HOW IT WORKS (THE 5-STEP PIPELINE) ──── */}
      <section id="pipeline" className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-3 block">
            End-to-End Workflow
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
              desc: 'Continuous real-time ingestion of SKUs, basket history, and inventory availability.',
            },
            {
              step: '02',
              phase: 'PROCESSING',
              title: 'Elasticity & Margin Models',
              desc: 'Autonomous calculation of product co-purchase affinity and profit margin bounds.',
            },
            {
              step: '03',
              phase: 'INTELLIGENCE',
              title: 'Multi-Model Synthesis',
              desc: 'Gemini and Groq analyze basket opportunities and formulate explainable incentives.',
            },
            {
              step: '04',
              phase: 'RESULT',
              title: 'Policy Interception',
              desc: 'Pre-execution checks enforce maximum discount caps and single transaction limits.',
            },
            {
              step: '05',
              phase: 'ACTION',
              title: 'Razorpay HMAC Checkout',
              desc: 'Bounded order generation with server-side cryptographic signature verification.',
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

      {/* ─── SECTION 5: PRODUCT UI SHOWCASE ──────────────────── */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-2 block">
              Application Preview
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              The merchant interface in full detail.
            </h2>
          </div>
          <Link
            href="/overview"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00C076] hover:underline"
          >
            <span>Open live dashboard routes</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-[#262626] bg-[#0D0D0D]">
            <div className="text-xs font-mono text-[#818CF8] mb-2 uppercase tracking-wide">
              /overview
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-2">
              Merchant Revenue Dashboard
            </h3>
            <p className="text-xs text-[#A6A6A6] leading-relaxed mb-4">
              Real-time revenue attribution, gross merchant volume trajectory, verified order counts, and policy guardrail compliance rate.
            </p>
            <Link href="/overview" className="text-xs font-semibold text-white hover:text-[#00C076] flex items-center gap-1">
              Inspect View <ChevronRight size={13} />
            </Link>
          </div>

          <div className="p-6 rounded-2xl border border-[#262626] bg-[#0D0D0D]">
            <div className="text-xs font-mono text-[#818CF8] mb-2 uppercase tracking-wide">
              /ai-agent
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-2">
              Autonomous Intelligence Brain
            </h3>
            <p className="text-xs text-[#A6A6A6] leading-relaxed mb-4">
              Multi-model routing between Gemini and Groq with live opportunity scanner triggers and explainability drawer inspection.
            </p>
            <Link href="/ai-agent" className="text-xs font-semibold text-white hover:text-[#00C076] flex items-center gap-1">
              Inspect View <ChevronRight size={13} />
            </Link>
          </div>

          <div className="p-6 rounded-2xl border border-[#262626] bg-[#0D0D0D]">
            <div className="text-xs font-mono text-[#818CF8] mb-2 uppercase tracking-wide">
              /transactions
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-2">
              Cryptographic Payment Ledger
            </h3>
            <p className="text-xs text-[#A6A6A6] leading-relaxed mb-4">
              Real Razorpay payment order statuses, server-side HMAC-SHA256 signature verification badges, and timeout recovery actions.
            </p>
            <Link href="/transactions" className="text-xs font-semibold text-white hover:text-[#00C076] flex items-center gap-1">
              Inspect View <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: METRICS & PROOF ──────────────────────── */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="font-mono text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-2">
              ₹6.8L+
            </div>
            <div className="text-sm font-semibold text-[#A6A6A6] mb-1">
              AI-Attributed Revenue
            </div>
            <div className="text-xs text-[#666666]">
              Verified incremental companion volume.
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
              0 unauthorized runaway actions.
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

      {/* ─── SECTION 7: EDITORIAL STATEMENT (WORD REVEAL) ───── */}
      <div className="border-t border-[#1F1F1F]">
        <EditorialWordReveal />
      </div>

      {/* ─── SECTION 8: USE CASES & SOLUTIONS ────────────────── */}
      <section id="use-cases" className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-2 block">
            Target Merchant Workflows
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

      {/* ─── SECTION 9: FINTECH & AI ENGINE TECHNOLOGY ──────── */}
      <section id="technology" className="py-24 md:py-32 px-6 max-w-7xl mx-auto border-t border-[#1F1F1F]">
        <div className="p-8 sm:p-12 rounded-3xl border border-[#333333] bg-[#0D0D0D] relative overflow-hidden">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-3 block">
              Fintech Reliability Architecture
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Execution Unknown &amp; Idempotency Protection
            </h2>
            <p className="text-sm text-[#A6A6A6] leading-relaxed">
              When network timeouts occur during Razorpay checkout, standard systems risk double-charging customers by blindly retrying. Revolve AI eliminates double-charge risks with dedicated execution recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#141414] border border-[#262626]">
              <div className="text-xs font-mono text-[#F59E0B] font-bold uppercase mb-2">
                1. Timeout Intercepted
              </div>
              <p className="text-xs text-[#A6A6A6] leading-relaxed">
                Order status transitions to <code className="text-white font-mono">EXECUTION_UNKNOWN</code>. Automatic retries are locked immediately.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#141414] border border-[#262626]">
              <div className="text-xs font-mono text-[#818CF8] font-bold uppercase mb-2">
                2. Live Razorpay Query
              </div>
              <p className="text-xs text-[#A6A6A6] leading-relaxed">
                The server queries the live Razorpay Payments API to check if the card was debited before any rollback occurs.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#141414] border border-[#262626]">
              <div className="text-xs font-mono text-[#00C076] font-bold uppercase mb-2">
                3. Deterministic Resolution
              </div>
              <p className="text-xs text-[#A6A6A6] leading-relaxed">
                If charged: committed as <strong className="text-white">SUCCESS</strong>. If unbilled: safely released for single retry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 10: FINAL CTA & DEMO CREDENTIALS ───────── */}
      <section className="py-24 md:py-32 px-6 max-w-5xl mx-auto border-t border-[#1F1F1F] text-center">
        <div className="p-10 sm:p-16 rounded-3xl border border-[#333333] bg-[#0D0D0D] relative overflow-hidden shadow-2xl">
          <span className="text-xs font-mono uppercase tracking-wider text-[#00C076] font-semibold mb-4 inline-block">
            Razorpay Hackathon Live Evaluation
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Explore Bounded AI Commerce Live
          </h2>
          <p className="text-sm sm:text-base text-[#A6A6A6] max-w-xl mx-auto leading-relaxed mb-8">
            Log in using demo merchant credentials to run catalog intelligence scans, inspect explainable decision models, authorize policy actions, and trigger Razorpay test mode checkouts.
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

          <div>
            <Link
              href="/overview"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/95 transition-all shadow-lg"
            >
              <span>Enter Revolve AI Platform</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer className="border-t border-[#1F1F1F] py-12 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#666666]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-tight">REVOLVE AI</span>
          <span>•</span>
          <span>Autonomous AI Commerce Operating System for Razorpay Hackathon</span>
        </div>

        <div className="flex items-center gap-6 text-[#A6A6A6]">
          <Link href="/login" className="hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/overview" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/ai-agent" className="hover:text-white transition-colors">
            AI Agent
          </Link>
          <Link href="/approvals" className="hover:text-white transition-colors">
            Approvals
          </Link>
          <Link href="/transactions" className="hover:text-white transition-colors">
            Transactions
          </Link>
        </div>
      </footer>
    </div>
  );
}
