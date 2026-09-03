'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Brain,
  CreditCard,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Bot,
  Layers,
  Lock,
  Zap,
  TrendingUp,
  RefreshCw,
  Search,
  FileText,
  Sliders,
  AlertTriangle,
  ExternalLink,
  Package,
  ShoppingBag,
  Activity,
  Check,
  X,
  HelpCircle,
  Eye,
  BarChart3,
  ShieldCheck,
  Clock,
  Terminal,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FloatingCommerceObjects } from '@/components/ui/floating-commerce-objects';
import { formatCurrency } from '@/lib/utils';

export default function LandingPage() {
  const [activeDemoTab, setActiveDemoTab] = useState<'overview' | 'scanner' | 'explain' | 'policy' | 'ledger' | 'buyer'>('overview');
  const [activeBuyerPrompt, setActiveBuyerPrompt] = useState('I need running shoes under ₹5,000');
  const [isBuyerSearching, setIsBuyerSearching] = useState(false);
  const [buyerResult, setBuyerResult] = useState({
    title: 'Apex HyperLight 2 Pro Running Shoes',
    price: 449900,
    reason: 'Matches daily road running criteria with responsive nitrogen foam midsole and breathable mesh upper under ₹5,000 limit.',
    features: ['Carbon Stabilizer Plate', 'Engineered Breathable Mesh', 'High-Abrasion Rubber Outsole'],
  });

  const handleRunBuyerPrompt = (prompt: string, title: string, price: number, reason: string, features: string[]) => {
    setActiveBuyerPrompt(prompt);
    setIsBuyerSearching(true);
    setTimeout(() => {
      setBuyerResult({ title, price, reason, features });
      setIsBuyerSearching(false);
    }, 400);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateToDemoTab = (tab: 'overview' | 'scanner' | 'explain' | 'policy' | 'ledger' | 'buyer', targetId: string = 'product-tour') => {
    setActiveDemoTab(tab);
    setMobileMenuOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      {/* Floating Organic Digital Commerce Objects (Parallax / Depth) */}
      <FloatingCommerceObjects intensity="landing" />

      {/* ─── Top Brand Navigation ────────────────────────────── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(248, 249, 250, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-primary)',
        padding: '14px 24px',
      }}>
        <div style={{
          maxWidth: 1320,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 32,
              height: 32,
              background: 'var(--text-primary)',
              color: 'var(--text-inverse)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.9375rem',
              fontFamily: 'var(--font-heading)',
            }}>
              R
            </div>
            <div>
              <span className="font-heading" style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                REVOLVE AI
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginLeft: 8, fontWeight: 500 }}>
                Commerce Operating OS
              </span>
            </div>
          </Link>

          <div style={{ display: 'none', alignItems: 'center', gap: 24, fontSize: '0.875rem', fontWeight: 500 }} className="md:flex">
            <button
              type="button"
              onClick={() => navigateToDemoTab('overview', 'product-tour')}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
            >
              Product Tour
            </button>
            <a href="#pipeline" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Safety Pipeline
            </a>
            <button
              type="button"
              onClick={() => navigateToDemoTab('explain', 'explainability')}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
            >
              AI Explainability
            </button>
            <button
              type="button"
              onClick={() => navigateToDemoTab('policy', 'policy-engine')}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
            >
              Policy Engine
            </button>
            <button
              type="button"
              onClick={() => navigateToDemoTab('buyer', 'agentic-buyer')}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
            >
              AI Buyer
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/login" className="btn btn-outline btn-sm">
              Sign In
            </Link>
            <Link href="/overview" className="btn btn-primary btn-sm">
              <span>Launch Workspace</span>
              <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              className="btn btn-ghost btn-sm md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              style={{ padding: '6px' }}
            >
              <Activity size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            padding: '14px 0 6px',
            borderTop: '1px solid var(--border-primary)',
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            <button
              type="button"
              onClick={() => navigateToDemoTab('overview', 'product-tour')}
              style={{ background: 'none', border: 'none', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, padding: '4px 0' }}
            >
              Product Tour
            </button>
            <a
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, padding: '4px 0' }}
            >
              Safety Pipeline
            </a>
            <button
              type="button"
              onClick={() => navigateToDemoTab('explain', 'explainability')}
              style={{ background: 'none', border: 'none', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, padding: '4px 0' }}
            >
              AI Explainability
            </button>
            <button
              type="button"
              onClick={() => navigateToDemoTab('policy', 'policy-engine')}
              style={{ background: 'none', border: 'none', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, padding: '4px 0' }}
            >
              Policy Engine
            </button>
            <button
              type="button"
              onClick={() => navigateToDemoTab('buyer', 'agentic-buyer')}
              style={{ background: 'none', border: 'none', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, padding: '4px 0' }}
            >
              AI Buyer
            </button>
          </div>
        )}
      </nav>

      {/* ─── 01. HERO SECTION ────────────────────────────────── */}
      <section style={{
        maxWidth: 1240,
        margin: '0 auto',
        padding: '90px 24px 70px',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}
        >
          <span className="badge badge-fintech" style={{ padding: '6px 14px', fontSize: '0.8125rem' }}>
            <Shield size={13} /> AI COMMERCE OPERATING SYSTEM • RAZORPAY TEST MODE
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading"
          style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.035em',
            maxWidth: 1020,
            margin: '0 auto 24px',
            color: 'var(--text-primary)',
          }}
        >
          AI THAT GROWS YOUR COMMERCE REVENUE.<br />
          <span style={{ color: 'var(--fintech-primary)' }}>YOU STAY IN FULL CONTROL.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: 760,
            margin: '0 auto 36px',
            lineHeight: 1.6,
          }}
        >
          Revolve AI is an AI-native commerce operating system for merchants. It discovers high-ROI revenue opportunities, explains every decision with concrete basket evidence, strictly enforces merchant safety policies, and executes bounded checkouts through Razorpay with cryptographic verification.
        </motion.p>

        {/* Live System Status Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            padding: '8px 20px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-full)',
            marginBottom: 36,
            boxShadow: 'var(--shadow-xs)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            fontSize: '0.8125rem',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
            AI Intelligence Active
          </span>
          <span style={{ color: 'var(--border-primary)' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
            <ShieldCheck size={14} style={{ color: 'var(--fintech-primary)' }} />
            Policy Interceptor: ₹10k max/tx
          </span>
          <span style={{ color: 'var(--border-primary)' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
            <CreditCard size={14} style={{ color: 'var(--ai-primary)' }} />
            Razorpay Test Mode Connected
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}
        >
          <Link href="/overview" className="btn btn-fintech" style={{ padding: '14px 32px', fontSize: '1rem' }}>
            <span>Launch Live Workspace</span>
            <ArrowRight size={18} />
          </Link>
          <a href="#product-tour" className="btn btn-outline" style={{ padding: '14px 28px', fontSize: '1rem' }}>
            Explore Interactive Tour ↓
          </a>
        </motion.div>
      </section>

      {/* ─── 02. INTERACTIVE LIVE PRODUCT PREVIEW ─────────────── */}
      <section id="product-tour" style={{
        maxWidth: 1280,
        margin: '0 auto 120px',
        padding: '0 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span className="badge badge-ai" style={{ marginBottom: 8 }}>
            <Sparkles size={12} /> INTERACTIVE PRODUCT SIMULATION
          </span>
          <h2 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            The Revolve AI Commerce Operating System in Action
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Click below to inspect each stage of autonomous discovery, policy enforcement, and checkout verification.
          </p>
        </div>

        {/* Tab Selector */}
        <div
          role="tablist"
          aria-label="Interactive Product Simulation Stages"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 20,
            flexWrap: 'wrap',
          }}
        >
          {[
            { id: 'overview', label: '1. Dashboard Overview', icon: Activity },
            { id: 'scanner', label: '2. AI Opportunity Scanner', icon: Brain },
            { id: 'explain', label: '3. Explainability Inspector', icon: Eye },
            { id: 'policy', label: '4. Policy Security Guardrails', icon: ShieldCheck },
            { id: 'ledger', label: '5. Cryptographic Ledger', icon: Lock },
            { id: 'buyer', label: '6. Agentic AI Buyer', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeDemoTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`demo-tab-${tab.id}`}
                aria-controls={`demo-panel-${tab.id}`}
                aria-selected={isActive}
                onClick={() => setActiveDemoTab(tab.id as any)}
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--text-primary)' : 'var(--border-primary)',
                  background: isActive ? 'var(--text-primary)' : 'var(--bg-secondary)',
                  color: isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* The Frame Container */}
        <div className="editorial-card" style={{
          padding: 0,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-primary)',
          background: 'var(--bg-secondary)',
        }}>
          {/* Mock Browser Header */}
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: 8, fontFamily: 'var(--font-mono)' }}>
                revolve-ai.apexgear.io/{activeDemoTab}
              </span>
            </div>
            <span className="badge badge-fintech" style={{ fontSize: '0.6875rem' }}>
              <CheckCircle2 size={11} /> LIVE POLICY ENGINE • ACTIVE WORKSPACE
            </span>
          </div>

          {/* Interactive Screen Content */}
          <div style={{ padding: '32px', minHeight: 460, background: 'var(--bg-primary)' }}>
            <AnimatePresence mode="wait">
              {/* TAB 1: OVERVIEW */}
              {activeDemoTab === 'overview' && (
                <motion.div
                  key="overview"
                  id="demo-panel-overview"
                  role="tabpanel"
                  aria-labelledby="demo-tab-overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                >
                  <div className="dominant-stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span className="stat-label" style={{ margin: 0 }}>AI-Attributed Revenue</span>
                          <span className="badge badge-ai" style={{ fontSize: '0.6875rem' }}><Brain size={11} /> Autonomous Attribution</span>
                        </div>
                        <div className="stat-hero-number">₹6,79,992</div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                          Incremental merchant volume generated by policy-checked cross-sell companion offers &amp; bundling.
                        </p>
                      </div>
                      <div className="badge badge-fintech" style={{ padding: '8px 14px', fontSize: '0.875rem' }}>
                        <TrendingUp size={15} /> +28.4% growth vs prior cycle
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                    <div className="editorial-card" style={{ padding: '16px' }}>
                      <div className="stat-label">Gross Volume</div>
                      <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹42,85,000</div>
                    </div>
                    <div className="editorial-card" style={{ padding: '16px' }}>
                      <div className="stat-label">Verified Orders</div>
                      <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700 }}>1,420</div>
                    </div>
                    <div className="editorial-card" style={{ padding: '16px' }}>
                      <div className="stat-label">Average Order Value</div>
                      <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹3,017</div>
                    </div>
                    <div className="editorial-card" style={{ padding: '16px' }}>
                      <div className="stat-label">Policy Guardrail Rate</div>
                      <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>100% Valid</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: AI SCANNER */}
              {activeDemoTab === 'scanner' && (
                <motion.div
                  key="scanner"
                  id="demo-panel-scanner"
                  role="tabpanel"
                  aria-labelledby="demo-tab-scanner"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}
                >
                  <div className="editorial-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span className="badge badge-ai"><Brain size={11} /> CROSS_SELL BUNDLE</span>
                      <span className="badge badge-fintech">82% AI Confidence</span>
                    </div>
                    <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 6 }}>
                      Titan Pro Laptop + Magnetic Sleeve Cross-Sell
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                      Historical basket analysis shows 34 customers purchased these items together. Proposing an automated 10% companion incentive at checkout.
                    </p>
                    <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>PROJECTED IMPACT</div>
                        <div className="font-mono" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--fintech-primary)' }}>+₹6,79,992 / mo</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>POLICY CHECK</div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--success)' }}>Within Bounds ✓</div>
                      </div>
                    </div>
                  </div>

                  <div className="editorial-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span className="badge badge-ai"><Brain size={11} /> UPSELL PROMOTION</span>
                      <span className="badge badge-fintech">78% AI Confidence</span>
                    </div>
                    <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 6 }}>
                      Apex HyperLight 2 Runner Carbon Upgrade
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                      Recommending carbon plate variant to repeat marathon runners based on previous training footwear purchases.
                    </p>
                    <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>PROJECTED IMPACT</div>
                        <div className="font-mono" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--fintech-primary)' }}>+₹3,40,000 / mo</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>POLICY CHECK</div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--success)' }}>Within Bounds ✓</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: EXPLAINABILITY INSPECTOR */}
              {activeDemoTab === 'explain' && (
                <motion.div
                  key="explain"
                  id="explainability"
                  role="tabpanel"
                  aria-labelledby="demo-tab-explain"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="editorial-card"
                  style={{ padding: '24px', scrollMarginTop: 100 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <span className="badge badge-ai" style={{ marginBottom: 4 }}><Eye size={12} /> EXPLAINABILITY ENGINE</span>
                      <h3 className="font-heading" style={{ fontSize: '1.1875rem', fontWeight: 700 }}>
                        Why Did AI Recommend the Titan Pro Sleeve Bundle?
                      </h3>
                    </div>
                    <span className="badge badge-fintech" style={{ padding: '6px 12px' }}>82% AI Confidence Score</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
                    <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
                      <div className="stat-label">Expected Monthly Gain</div>
                      <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--fintech-primary)' }}>+₹6,79,992</div>
                    </div>
                    <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
                      <div className="stat-label">Risk Rating</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--success)' }}>LOW RISK</div>
                    </div>
                    <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
                      <div className="stat-label">Safety Policy Limit</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--success)' }}>PASS (₹10k cap)</div>
                    </div>
                  </div>

                  <div className="stat-label" style={{ marginBottom: 8 }}>Historical Basket Evidence Points:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', display: 'flex', gap: 10 }}>
                      <span style={{ fontWeight: 700, color: 'var(--fintech-primary)' }}>1.</span>
                      <span>34 customer orders in past 90 days included both Titan Pro Laptop and Magnetic Sleeve.</span>
                    </div>
                    <div style={{ padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', display: 'flex', gap: 10 }}>
                      <span style={{ fontWeight: 700, color: 'var(--fintech-primary)' }}>2.</span>
                      <span>Offering companion sleeve at checkout increases overall basket conversion by an estimated 27%.</span>
                    </div>
                    <div style={{ padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', display: 'flex', gap: 10 }}>
                      <span style={{ fontWeight: 700, color: 'var(--fintech-primary)' }}>3.</span>
                      <span>Merchant gross margin is protected at 42% after applying bounded 10% companion discount.</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: POLICY GUARDRAILS */}
              {activeDemoTab === 'policy' && (
                <motion.div
                  key="policy"
                  id="policy-engine"
                  role="tabpanel"
                  aria-labelledby="demo-tab-policy"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="editorial-card"
                  style={{ padding: '24px', scrollMarginTop: 100 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <span className="badge badge-warning" style={{ marginBottom: 4 }}><ShieldCheck size={12} /> POLICY ENGINE INTERCEPTOR</span>
                      <h3 className="font-heading" style={{ fontSize: '1.1875rem', fontWeight: 700 }}>
                        Autonomous Action Interception &amp; Guardrail Checklist
                      </h3>
                    </div>
                    <span className="badge badge-fintech">All 4 Gates Verified ✓</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                    <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.875rem', color: 'var(--success)' }}>
                        <CheckCircle2 size={16} /> Maximum Transaction Limit
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                        Action amount is ₹2,499. Below configured cap of ₹10,000 per transaction.
                      </p>
                    </div>

                    <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.875rem', color: 'var(--success)' }}>
                        <CheckCircle2 size={16} /> Daily Cumulative AI Spend
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                        Daily usage is ₹14,200 / ₹50,000. Within daily budget limit.
                      </p>
                    </div>

                    <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.875rem', color: 'var(--success)' }}>
                        <CheckCircle2 size={16} /> Maximum Discount Threshold
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                        Incentive is 10%. Below maximum allowed discount ceiling of 25%.
                      </p>
                    </div>

                    <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.875rem', color: 'var(--success)' }}>
                        <CheckCircle2 size={16} /> Human Authorization Required
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                        Rerouted to Approval Security Center for merchant sign-off.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: CRYPTOGRAPHIC LEDGER */}
              {activeDemoTab === 'ledger' && (
                <motion.div
                  key="ledger"
                  id="demo-panel-ledger"
                  role="tabpanel"
                  aria-labelledby="demo-tab-ledger"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="editorial-card"
                  style={{ padding: 0, overflow: 'hidden' }}
                >
                  <div style={{ padding: '16px 20px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-primary)' }}>
                    <span className="badge badge-fintech"><Lock size={12} /> RAZORPAY TEST MODE LEDGER &amp; HMAC AUDIT</span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="editorial-table">
                      <thead>
                        <tr>
                          <th>Razorpay Order ID</th>
                          <th>Amount</th>
                          <th>Signature Verification</th>
                          <th>Webhook Status</th>
                          <th>Ledger Commit</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="font-mono">order_TX6oxexSYw2Vvh</td>
                          <td className="font-mono font-bold">₹4,499.00</td>
                          <td><span className="badge badge-fintech"><CheckCircle2 size={11} /> HMAC-SHA256 Valid</span></td>
                          <td><span className="badge badge-fintech">Confirmed ✓</span></td>
                          <td><span className="badge badge-neutral">IMMUTABLE LOGGED</span></td>
                        </tr>
                        <tr>
                          <td className="font-mono">order_88K2laox109vla</td>
                          <td className="font-mono font-bold">₹8,999.00</td>
                          <td><span className="badge badge-fintech"><CheckCircle2 size={11} /> HMAC-SHA256 Valid</span></td>
                          <td><span className="badge badge-fintech">Confirmed ✓</span></td>
                          <td><span className="badge badge-neutral">IMMUTABLE LOGGED</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* TAB 6: AGENTIC AI BUYER */}
              {activeDemoTab === 'buyer' && (
                <motion.div
                  key="buyer"
                  id="agentic-buyer"
                  role="tabpanel"
                  aria-labelledby="demo-tab-buyer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="editorial-card"
                  style={{ padding: '24px', scrollMarginTop: 100 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <span className="badge badge-ai" style={{ marginBottom: 4 }}><Bot size={12} /> AGENTIC COMMERCE CHAT</span>
                      <h3 className="font-heading" style={{ fontSize: '1.1875rem', fontWeight: 700 }}>
                        Natural Language Product Discovery &amp; Instant Razorpay Checkout
                      </h3>
                    </div>
                  </div>

                  {/* Interactive Query Chips */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleRunBuyerPrompt(
                        'I need running shoes under ₹5,000',
                        'Apex HyperLight 2 Pro Running Shoes',
                        449900,
                        'Matches daily road running criteria with responsive nitrogen foam midsole and breathable mesh upper under ₹5,000 limit.',
                        ['Carbon Stabilizer Plate', 'Engineered Breathable Mesh', 'High-Abrasion Rubber Outsole']
                      )}
                      className="command-chip"
                      style={{ background: activeBuyerPrompt.includes('running') ? 'var(--text-primary)' : 'var(--bg-tertiary)', color: activeBuyerPrompt.includes('running') ? 'white' : 'var(--text-secondary)' }}
                    >
                      🏃 Running shoes under ₹5,000
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRunBuyerPrompt(
                        'Show me laptop accessories for travel',
                        'Apex Magnetic Waterproof Laptop Sleeve',
                        249900,
                        'Engineered for 16-inch laptops with magnetic latch and weather-sealed ballistic nylon.',
                        ['Ballistic Nylon Exterior', 'Magnetic Latch Mechanism', 'Microfiber Anti-Scratch Lining']
                      )}
                      className="command-chip"
                      style={{ background: activeBuyerPrompt.includes('laptop') ? 'var(--text-primary)' : 'var(--bg-tertiary)', color: activeBuyerPrompt.includes('laptop') ? 'white' : 'var(--text-secondary)' }}
                    >
                      💻 Travel laptop accessories
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRunBuyerPrompt(
                        'Noise-cancelling gym headphones',
                        'Apex SonicPro Hybrid ANC Earbuds',
                        349900,
                        'IPX7 sweatproof wireless earbuds with active noise cancellation and secure ergonomic ear hooks.',
                        ['Active Noise Cancellation', 'IPX7 Sweatproof', '32h Total Battery']
                      )}
                      className="command-chip"
                      style={{ background: activeBuyerPrompt.includes('headphones') ? 'var(--text-primary)' : 'var(--bg-tertiary)', color: activeBuyerPrompt.includes('headphones') ? 'white' : 'var(--text-secondary)' }}
                    >
                      🎧 Gym ANC headphones
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRunBuyerPrompt(
                        'Ergonomic desk mat and wrist rest',
                        'Apex Glide Pro Desk Mat & Wrist Rest',
                        129900,
                        'High-density memory foam wrist support with stitched edges and water-repellent vegan leather finish.',
                        ['Ergonomic Memory Foam', 'Water-Repellent Surface', 'Non-Slip Rubber Base']
                      )}
                      className="command-chip"
                      style={{ background: activeBuyerPrompt.includes('desk') ? 'var(--text-primary)' : 'var(--bg-tertiary)', color: activeBuyerPrompt.includes('desk') ? 'white' : 'var(--text-secondary)' }}
                    >
                      ⌨️ Ergonomic desk bundle
                    </button>
                  </div>

                  {/* Result Card */}
                  <div style={{ padding: '18px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <span className="badge badge-neutral" style={{ fontSize: '0.6875rem', marginBottom: 6 }}>AI MATCHED PRODUCT</span>
                        <h4 className="font-heading" style={{ fontSize: '1.0625rem', fontWeight: 700 }}>{buyerResult.title}</h4>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4 }}>{buyerResult.reason}</p>
                      </div>
                      <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatCurrency(buyerResult.price)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                      {buyerResult.features.map((f, i) => (
                        <span key={i} style={{ fontSize: '0.6875rem', padding: '3px 8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                          {f}
                        </span>
                      ))}
                    </div>

                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                      <Link href="/ai-buyers" className="btn btn-fintech btn-sm">
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
      </section>

      {/* ─── 03. THE 8-STEP NON-NEGOTIABLE PIPELINE ───────────── */}
      <section id="pipeline" style={{
        maxWidth: 1140,
        margin: '0 auto 120px',
        padding: '0 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 54 }}>
          <span className="badge badge-fintech" style={{ marginBottom: 10 }}>
            <Shield size={12} /> THE NON-NEGOTIABLE SAFETY PIPELINE
          </span>
          <h2 className="font-heading" style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
            AI Should Be Powerful. Money Should Be Controlled.
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 620, margin: '10px auto 0', fontSize: '1rem', lineHeight: 1.6 }}>
            Every autonomous recommendation flows through 8 sequential checkpoints before a single rupee moves.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            {
              step: '01',
              phase: 'INTELLIGENCE LAYER',
              title: 'AI DETECTS',
              subtitle: 'Catalog Affinity & Co-Purchase Discovery',
              desc: 'Autonomous scanners evaluate product co-purchases, inventory buffer thresholds, and basket affinities to discover high-ROI opportunities without manual merchant rule-writing.',
              badgeColor: 'badge-ai',
            },
            {
              step: '02',
              phase: 'EXPLAINABILITY LAYER',
              title: 'AI EXPLAINS',
              subtitle: 'Transparent Evidence & Economic Reasoning',
              desc: 'Every recommendation breaks down What, Why, Concrete Historical Evidence from past order baskets, Expected Revenue Impact, and AI Confidence before any action is staged.',
              badgeColor: 'badge-ai',
            },
            {
              step: '03',
              phase: 'SAFETY LAYER',
              title: 'POLICY CHECKS',
              subtitle: 'Strict Guardrails Intercept Runaway Actions',
              desc: 'The Policy Engine intercepts all AI proposals, enforcing max single-transaction caps (₹10,000), cumulative daily spend limits (₹50,000), and discount ceilings (< 25%).',
              badgeColor: 'badge-warning',
            },
            {
              step: '04',
              phase: 'GOVERNANCE LAYER',
              title: 'MERCHANT APPROVES',
              subtitle: 'Human-in-the-Loop Authorization Center',
              desc: 'High-impact campaigns and automated discount structures require explicit merchant authorization in the Security Center. AI never spends money autonomously without sign-off.',
              badgeColor: 'badge-warning',
            },
            {
              step: '05',
              phase: 'COMMERCE LAYER',
              title: 'RAZORPAY EXECUTES',
              subtitle: 'Bounded Standard Checkout Orders',
              desc: 'Approved companion offers and AI Buyer shopping requests generate bounded Razorpay test orders with idempotency protection and native checkout integration.',
              badgeColor: 'badge-fintech',
            },
            {
              step: '06',
              phase: 'CRYPTOGRAPHY LAYER',
              title: 'SIGNATURE VERIFICATION',
              subtitle: 'HMAC-SHA256 Cryptographic Assurance',
              desc: 'The backend verifies cryptographic HMAC-SHA256 signatures server-side using the merchant secret before orders are marked as captured in the database.',
              badgeColor: 'badge-fintech',
            },
            {
              step: '07',
              phase: 'RELIABILITY LAYER',
              title: 'WEBHOOK DEDUPLICATION',
              subtitle: 'Idempotent Event Verification',
              desc: 'Razorpay webhook payloads are cryptographically verified and deduplicated by unique event IDs to prevent duplicate order updates and race conditions.',
              badgeColor: 'badge-neutral',
            },
            {
              step: '08',
              phase: 'COMPLIANCE LAYER',
              title: 'IMMUTABLE AUDIT TRAIL',
              subtitle: 'Append-Only Ledger of All Decisions',
              desc: 'Every scan, policy evaluation, merchant approval, and transaction is permanently recorded in an append-only audit trail for compliance and governance.',
              badgeColor: 'badge-neutral',
            },
          ].map((item) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35 }}
              className="editorial-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 24,
                padding: '26px 32px',
                background: 'var(--bg-secondary)',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--fintech-primary)',
                background: 'var(--bg-tertiary)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                flexShrink: 0,
              }}>
                {item.step}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span className={`badge ${item.badgeColor}`} style={{ fontSize: '0.6875rem' }}>
                    {item.phase}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                    {item.subtitle}
                  </span>
                </div>
                <h3 className="font-heading" style={{ fontSize: '1.1875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 04. DEEP DIVE: FAILURE RECOVERY & EXECUTION UNKNOWN ─ */}
      <section style={{
        maxWidth: 1140,
        margin: '0 auto 120px',
        padding: '0 24px',
      }}>
        <div className="editorial-card" style={{
          padding: '40px 36px',
          background: 'var(--bg-secondary)',
          borderLeft: '5px solid var(--fintech-primary)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'var(--fintech-bg)',
              color: 'var(--fintech-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Shield size={26} />
            </div>

            <div style={{ flex: 1 }}>
              <span className="badge badge-fintech" style={{ marginBottom: 8 }}>
                PRODUCTION FINTECH RELIABILITY
              </span>
              <h3 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
                Execution Unknown &amp; Idempotency Protection
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                When network timeouts occur during Razorpay checkout, standard systems risk double-charging customers by blindly retrying. Revolve AI introduces <strong>Execution Unknown Protection</strong>:
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 16,
                background: 'var(--bg-tertiary)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase', marginBottom: 4 }}>
                    1. Network Timeout Detected
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Checkout status transitions to <code>EXECUTION_UNKNOWN</code>. Automatic retries are locked.
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ai-primary)', textTransform: 'uppercase', marginBottom: 4 }}>
                    2. Query Razorpay API
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    System queries the live Razorpay Payments API to check if customer was already charged.
                  </p>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', marginBottom: 4 }}>
                    3. Safe Resolution
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    If paid: mark <strong>SUCCESS</strong>. If uncharged: mark <strong>SAFE TO RETRY</strong>. Zero duplicate charges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 05. FINAL CALL TO ACTION ─────────────────────────── */}
      <section style={{
        maxWidth: 960,
        margin: '0 auto 120px',
        padding: '56px 40px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-xl)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-card)',
      }}>
        <span className="badge badge-fintech" style={{ marginBottom: 14 }}>
          READY FOR HACKATHON EVALUATION
        </span>
        <h2 className="font-heading" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: 14, letterSpacing: '-0.025em' }}>
          Explore Bounded AI Commerce Live
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Log in using demo merchant credentials to run catalog intelligence scans, inspect explainable decision models, authorize policy actions, and trigger Razorpay test mode checkouts.
        </p>

        {/* Credentials Box */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 24px',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-secondary)',
          marginBottom: 32,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
        }}>
          <span><strong>Account:</strong> admin@apexgear.io</span>
          <span style={{ color: 'var(--border-primary)' }}>|</span>
          <span><strong>Password:</strong> DemoMerchant@2026</span>
        </div>

        <div>
          <Link href="/overview" className="btn btn-fintech" style={{ padding: '14px 36px', fontSize: '1rem' }}>
            <span>Enter Revolve AI Platform</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border-primary)',
        padding: '32px 32px 48px',
        maxWidth: 1320,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8125rem',
        color: 'var(--text-tertiary)',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <strong style={{ color: 'var(--text-primary)' }}>REVOLVE AI</strong> • AI-Native Commerce Operating System for Razorpay Hackathon
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Sign In</Link>
          <Link href="/overview" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Dashboard</Link>
          <Link href="/ai-agent" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>AI Agent</Link>
          <Link href="/approvals" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Approvals</Link>
          <Link href="/transactions" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Transactions</Link>
        </div>
      </footer>
    </div>
  );
}
