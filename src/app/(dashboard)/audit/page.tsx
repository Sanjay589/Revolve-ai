'use client';

import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw, Shield, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-neutral">
              <FileText size={12} /> COMPLIANCE & GOVERNANCE
            </span>
          </div>
          <h1 className="page-title">Immutable Audit Trail</h1>
          <p className="page-subtitle">
            Cryptographically chronological records of all AI recommendations, policy verifications, approvals & captured payments.
          </p>
        </div>

        <Button variant="secondary" onClick={fetchAuditEvents} isLoading={isLoading}>
          <RefreshCw size={14} /> Refresh Log
        </Button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
            className={`btn btn-sm ${filterAction === tab.key ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Audit Timeline Card */}
      <Card style={{ padding: '24px 20px' }}>
        <AuditTimeline events={events} />
      </Card>
    </div>
  );
}
