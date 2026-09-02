'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Brain,
  CreditCard,
  FileCheck,
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
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* ─── Navigation ─────────────────────────────────────── */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 32px',
        maxWidth: 1280,
        margin: '0 auto',
        borderBottom: '1px solid var(--border-primary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
          <span className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            REVOLVE AI
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/login" className="btn btn-outline btn-sm">
            Sign In
          </Link>
          <Link href="/overview" className="btn btn-primary btn-sm">
            <span>Launch Dashboard</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ─── 1. Hero Section ────────────────────────────────── */}
      <section style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '80px 24px 60px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
          <span className="badge badge-fintech" style={{ padding: '6px 14px', fontSize: '0.8125rem' }}>
            <Shield size={13} /> AI GROWTH &amp; AGENTIC COMMERCE PLATFORM
          </span>
        </div>

        <h1
          className="font-heading"
          style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: 880,
            margin: '0 auto 24px',
            color: 'var(--text-primary)',
          }}
        >
          LET AI FIND YOUR NEXT REVENUE OPPORTUNITY.<br />
          <span style={{ color: 'var(--fintech-primary)' }}>YOU STAY IN CONTROL.</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: 680,
            margin: '0 auto 36px',
            lineHeight: 1.6,
          }}
        >
          Revolve AI discovers revenue opportunities, explains every decision, enforces merchant policies and enables safe agentic commerce through Razorpay.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/login" className="btn btn-fintech" style={{ padding: '12px 28px', fontSize: '0.9375rem' }}>
            <span>Explore Revolve AI</span>
            <ArrowRight size={16} />
          </Link>
          <a href="#how-it-works" className="btn btn-outline" style={{ padding: '12px 24px', fontSize: '0.9375rem' }}>
            See How It Works
          </a>
        </div>
      </section>

      {/* ─── 2. Actual Live Product Preview (Interactive Mock) ─ */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto 80px',
        padding: '0 24px',
      }}>
        <div className="editorial-card" style={{
          padding: 0,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-primary)',
        }}>
          {/* Mock Top App Bar */}
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
                revolve-ai.apexgear.io/overview
              </span>
            </div>
            <span className="badge badge-fintech" style={{ fontSize: '0.6875rem' }}>
              <CheckCircle2 size={11} /> LIVE POLICY ENGINE ACTIVE
            </span>
          </div>

          {/* Inner Dashboard View */}
          <div style={{ padding: '28px 32px', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
              <div className="dominant-stat-card" style={{ gridColumn: 'span 12' }}>
                <div className="stat-label">AI-Attributed Revenue</div>
                <div className="stat-hero-number" style={{ color: 'var(--text-primary)' }}>
                  ₹6,79,992
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  Verified incremental volume from autonomous companion offers &amp; bundle promotions.
                </div>
              </div>

              <div className="editorial-card" style={{ gridColumn: 'span 4' }}>
                <div className="stat-label">Gross Volume</div>
                <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹42,85,000</div>
              </div>
              <div className="editorial-card" style={{ gridColumn: 'span 4' }}>
                <div className="stat-label">Orders Captured</div>
                <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700 }}>1,420</div>
              </div>
              <div className="editorial-card" style={{ gridColumn: 'span 4' }}>
                <div className="stat-label">Policy Pass Rate</div>
                <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>100% Valid</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. The 8-Step Scroll Story ─────────────────────── */}
      <section id="how-it-works" style={{
        maxWidth: 1000,
        margin: '0 auto 100px',
        padding: '0 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="badge badge-ai" style={{ marginBottom: 12 }}>
            <Brain size={12} /> THE NON-NEGOTIABLE SAFETY PIPELINE
          </span>
          <h2 className="font-heading" style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            AI Should Be Powerful. Money Should Be Controlled.
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 580, margin: '8px auto 0' }}>
            How Revolve AI safely turns autonomous catalog intelligence into verified Razorpay transactions.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            {
              step: '01',
              title: 'AI DETECTS',
              subtitle: 'Catalog & Purchase Discovery',
              desc: 'Autonomous scanners evaluate product co-purchases, inventory buffers, and basket affinities to discover high-ROI opportunities.',
              badge: 'Intelligence Layer',
            },
            {
              step: '02',
              title: 'AI EXPLAINS',
              subtitle: 'Transparent Reasoning & Evidence',
              desc: 'Every recommendation breaks down What, Why, Concrete Historical Evidence, and Projected Monthly Impact before any action is taken.',
              badge: 'Explainability',
            },
            {
              step: '03',
              title: 'POLICY CHECKS',
              subtitle: 'Strict Fintech Guardrails',
              desc: 'The Policy Engine intercepts all actions, verifying max transaction caps (₹10,000), cumulative daily limits, and discount thresholds.',
              badge: 'Safety Engine',
            },
            {
              step: '04',
              title: 'MERCHANT APPROVES',
              subtitle: 'Human-in-the-Loop Sign-Off',
              desc: 'High-impact campaigns and automated discount structures require explicit merchant authorization in the Security Center.',
              badge: 'Governance',
            },
            {
              step: '05',
              title: 'RAZORPAY EXECUTES',
              subtitle: 'Standard Checkout Orders',
              desc: 'Approved companion offers and AI Buyer shopping requests generate bounded Razorpay test orders with idempotency protection.',
              badge: 'Payments',
            },
            {
              step: '06',
              title: 'VERIFY & SIGNATURE CHECK',
              subtitle: 'HMAC-SHA256 Cryptography',
              desc: 'The backend verifies cryptographic HMAC-SHA256 signatures server-side before orders are marked as captured.',
              badge: 'Security',
            },
            {
              step: '07',
              title: 'WEBHOOK AUDIT',
              subtitle: 'Event Deduplication',
              desc: 'Razorpay webhook payloads are verified and deduplicated by unique event IDs to prevent double-processing.',
              badge: 'Reliability',
            },
            {
              step: '08',
              title: 'IMMUTABLE AUDIT TRAIL',
              subtitle: 'Complete Decision History',
              desc: 'Every scan, policy evaluation, merchant approval, and transaction is permanently recorded in an append-only audit trail.',
              badge: 'Compliance',
            },
          ].map((item, index) => (
            <div
              key={item.step}
              className="editorial-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
                padding: '24px 28px',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--fintech-primary)',
                background: 'var(--bg-tertiary)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                flexShrink: 0,
              }}>
                {item.step}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                    {item.badge}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                    {item.subtitle}
                  </span>
                </div>
                <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. Agentic AI Buyer & Failure Recovery ──────────── */}
      <section style={{
        maxWidth: 1100,
        margin: '0 auto 100px',
        padding: '0 24px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {/* Card 1: Agentic AI Buyer */}
          <div className="editorial-card" style={{ padding: '32px' }}>
            <span className="badge badge-ai" style={{ marginBottom: 14 }}>
              <Bot size={13} /> BUYER-SIDE COMMERCE
            </span>
            <h3 className="font-heading" style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: 10 }}>
              Agentic Product Discovery
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              Customers describe what they want in natural language. The AI Buyer matches catalog items, explains why each item fits, and opens the native Razorpay checkout modal instantly.
            </p>
            <Link href="/ai-buyers" className="btn btn-outline btn-sm">
              <span>Try AI Buyer Chat</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Card 2: Failure Recovery (Execution Unknown) */}
          <div className="editorial-card" style={{ padding: '32px' }}>
            <span className="badge badge-fintech" style={{ marginBottom: 14 }}>
              <Shield size={13} /> TIMEOUT RECOVERY
            </span>
            <h3 className="font-heading" style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: 10 }}>
              Execution Unknown Protection
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              When network timeouts occur, Revolve AI never blindly retries orders. It queries the live payment status to confirm whether funds were captured before allowing any retry.
            </p>
            <Link href="/transactions" className="btn btn-outline btn-sm">
              <span>Inspect Transaction Ledger</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 5. Final CTA ───────────────────────────────────── */}
      <section style={{
        maxWidth: 900,
        margin: '0 auto 100px',
        padding: '48px 32px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-xl)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-card)',
      }}>
        <h2 className="font-heading" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>
          Experience Bounded AI Commerce Today
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 28px' }}>
          Explore live AI scans, human-in-the-loop approvals, and Razorpay test mode checkouts on the demo workspace.
        </p>
        <Link href="/overview" className="btn btn-fintech" style={{ padding: '12px 32px', fontSize: '1rem' }}>
          <span>Enter Revolve AI Platform</span>
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border-primary)',
        padding: '24px 32px',
        maxWidth: 1280,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8125rem',
        color: 'var(--text-tertiary)',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>REVOLVE AI • Production-Grade AI Commerce for Razorpay Hackathon</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link href="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Sign In</Link>
          <Link href="/overview" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Dashboard</Link>
          <Link href="/ai-agent" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>AI Agent</Link>
        </div>
      </footer>
    </div>
  );
}
