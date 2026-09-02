'use client';

import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw, Shield, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuditTimeline, type AuditItem } from '@/components/audit-timeline';

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
    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-fintech">
              <FileText size={12} /> COMPLIANCE &amp; GOVERNANCE
            </span>
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Immutable Audit Trail
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Chronological records of all AI recommendations, policy verifications, authorizations &amp; captured payments.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchAuditEvents} disabled={isLoading}>
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Log</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid var(--border-primary)', paddingBottom: 10 }}>
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
              padding: '6px 14px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: filterAction === tab.key ? 'var(--border-primary)' : 'transparent',
              background: filterAction === tab.key ? 'var(--bg-secondary)' : 'transparent',
              color: filterAction === tab.key ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Audit Timeline Card */}
      <div className="editorial-card" style={{ padding: '28px 24px' }}>
        <AuditTimeline events={events} />
      </div>
    </div>
  );
}
