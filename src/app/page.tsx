'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Brain, CreditCard, FileCheck, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'var(--ai-primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <span className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700 }}>
            REVOLVE AI
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/login" className="btn btn-ghost">Sign In</Link>
          <Link href="/register" className="btn btn-primary">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '80px 24px 60px',
          textAlign: 'center',
        }}
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
          <span className="badge badge-ai" style={{ marginBottom: 16, display: 'inline-flex' }}>
            <Sparkles size={12} /> AI-Powered Revenue Growth
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: 800,
            margin: '0 auto 24px',
          }}
        >
          Turn every transaction into an intelligent growth opportunity.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}
        >
          AI-powered revenue optimization with explainable decisions, merchant safety controls, and real payment integration.
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link href="/register" className="btn btn-primary btn-lg">
            Start Growing Revenue <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </motion.div>
      </motion.section>

      {/* Flow Diagram */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '40px 24px 80px',
        }}
      >
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(24px, 4vw, 48px)',
            overflow: 'hidden',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="font-heading" style={{ marginBottom: 8 }}>How Revolve AI Works</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Every AI action is explainable, bounded, policy-checked, and audited.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            maxWidth: 900,
            margin: '0 auto',
          }}>
            {[
              { icon: Brain, label: 'AI Agent', desc: 'Detects opportunities', color: 'var(--ai-primary)' },
              { icon: Shield, label: 'Policy Engine', desc: 'Enforces safety limits', color: 'var(--warning)' },
              { icon: CheckCircle2, label: 'Approval', desc: 'Merchant control', color: 'var(--success)' },
              { icon: CreditCard, label: 'Razorpay', desc: 'Secure payment', color: 'var(--info)' },
              { icon: FileCheck, label: 'Audit Trail', desc: 'Immutable record', color: 'var(--text-secondary)' },
            ].map((step, i) => (
              <motion.div
                key={step.label}
                variants={fadeUp}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: 20,
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-tertiary)',
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                  background: `color-mix(in srgb, ${step.color} 10%, transparent)`,
                }}>
                  <step.icon size={24} color={step.color} />
                </div>
                <h4 style={{ fontSize: '0.9375rem', marginBottom: 4 }}>{step.label}</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{step.desc}</p>
                {i < 4 && (
                  <div style={{ display: 'none' }}>
                    <ChevronRight size={16} color="var(--text-tertiary)" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Features */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px 80px',
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {[
            {
              title: 'Explainable AI Decisions',
              desc: 'Every recommendation includes what, why, evidence, expected impact, and risk level. No black box.',
              badge: 'AI',
            },
            {
              title: 'Bounded AI Actions',
              desc: 'AI cannot directly control money. Every action goes through validation, policy, and approval before execution.',
              badge: 'Security',
            },
            {
              title: 'Real Payment Processing',
              desc: 'Integrated with Razorpay for real order creation, payment capture, signature verification, and webhook confirmation.',
              badge: 'Payments',
            },
            {
              title: 'Merchant Safety Controls',
              desc: 'Configure maximum transaction amounts, daily spend limits, required approvals, and action restrictions.',
              badge: 'Policy',
            },
            {
              title: 'AI Buyer Agent',
              desc: 'AI agents can discover products, compare options, and initiate bounded purchases through your catalog.',
              badge: 'Commerce',
            },
            {
              title: 'Immutable Audit Trail',
              desc: 'Every AI decision, policy check, approval, payment, and webhook is recorded with full traceability.',
              badge: 'Compliance',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card"
            >
              <span className="badge badge-neutral" style={{ marginBottom: 12 }}>{feature.badge}</span>
              <h3 style={{ fontSize: '1.0625rem', marginBottom: 8 }}>{feature.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px 80px',
        textAlign: 'center',
      }}>
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(40px, 6vw, 64px)',
        }}>
          <h2 className="font-heading" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 12 }}>
            Ready to grow revenue with AI?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
            Start with the free tier. No credit card required. AI safety controls included.
          </p>
          <Link href="/register" className="btn btn-ai btn-lg">
            <Sparkles size={18} /> Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-primary)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-tertiary)',
        fontSize: '0.8125rem',
      }}>
        <p>© 2026 Revolve AI. Built for the Razorpay Hackathon. AI that grows your revenue. Safely.</p>
      </footer>
    </div>
  );
}
