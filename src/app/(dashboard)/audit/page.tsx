'use client';

import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw, Shield, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { AuditTimeline, type AuditItem } from '@/components/audit-timeline';
import { FloatingCommerceObjects } from '@/components/ui/floating-commerce-objects';

export default function AuditPage() {
  const [events, setEvents] = useState<AuditItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('all');

  const fetchAuditEvents = async () => {
    setIsLoading(true);
    try {
      const url = filterAction === 'all' ? '/api/audit' : `/api/audit?action=${filterAction}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditEvents();
  }, [filterAction]);

  return (
    <div className="relative">
      <FloatingCommerceObjects intensity="minimal" />

      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="COMPLIANCE &amp; GOVERNANCE"
        badgeVariant="success"
        badgeIcon={<FileText size={12} />}
        title="Immutable"
        italicAccent="Audit Trail"
        description="Chronological, cryptographically sealed records of all AI recommendations, policy verifications, merchant authorizations, and Razorpay captured events."
        actions={
          <button
            onClick={fetchAuditEvents}
            disabled={isLoading}
            className="btn btn-outline btn-sm"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh Log</span>
          </button>
        }
      />

      {/* ── Lifecycle Pipeline Diagram Card ─────────────────── */}
      <div className="editorial-card" style={{
        padding: '16px 20px',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 10 }}>
          Deterministic 8-Step Commerce Audit Flow:
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 8,
          fontSize: '0.75rem',
        }}>
          {[
            { step: '1. Detect', label: 'AI Scan', color: 'var(--ai-primary)' },
            { step: '2. Explain', label: 'Reasoning Model', color: 'var(--ai-primary)' },
            { step: '3. Policy', label: 'Guardrail Intercept', color: 'var(--warning-text)' },
            { step: '4. Authorize', label: 'Merchant Sign-off', color: 'var(--warning-text)' },
            { step: '5. Execute', label: 'Razorpay Order', color: 'var(--text-primary)' },
            { step: '6. Verify', label: 'HMAC Signature', color: 'var(--success)' },
            { step: '7. Webhook', label: 'Idempotent Sync', color: 'var(--ai-primary)' },
            { step: '8. Audit', label: 'Immutable Seal', color: 'var(--success)' },
          ].map((item, idx) => (
            <div key={item.step} style={{
              padding: '8px 10px',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-primary)',
            }}>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                {item.step}
              </div>
              <div style={{ fontWeight: 700, color: item.color, marginTop: 2 }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid var(--border-primary)', paddingBottom: 6 }}>
        {[
          { key: 'all', label: 'All Log Entries' },
          { key: 'AI_RECOMMENDATION_CREATED', label: 'AI Decisions' },
          { key: 'POLICY_CHECK_PASSED', label: 'Policy Checks' },
          { key: 'MERCHANT_APPROVED', label: 'Approvals' },
          { key: 'PAYMENT_CAPTURED', label: 'Payments' },
          { key: 'WEBHOOK_RECEIVED', label: 'Webhooks' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilterAction(tab.key)}
            style={{
              padding: '5px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: filterAction === tab.key ? 'var(--border-primary)' : 'transparent',
              background: filterAction === tab.key ? 'var(--bg-secondary)' : 'transparent',
              color: filterAction === tab.key ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              boxShadow: filterAction === tab.key ? 'var(--shadow-xs)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Audit Timeline Card ─────────────────────────────── */}
      <div className="editorial-card" style={{ padding: '24px 20px' }}>
        <AuditTimeline events={events} />
      </div>
    </div>
  );
}
