'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, RefreshCw, Lock, AlertTriangle, Shield } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { ApprovalCard } from '@/components/approval-card';
import { Skeleton } from '@/components/ui/skeleton';

interface ApprovalItem {
  id: string;
  actionId: string;
  status: string;
  expiresAt: string;
  action: {
    id: string;
    type: string;
    title: string;
    description?: string | null;
    amount?: number | null;
    riskLevel: string;
    policyResult?: {
      passed: boolean;
      reasons: string[];
    } | null;
  };
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [isLoading, setIsLoading] = useState(true);

  const fetchApprovals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/approvals?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setApprovals(data.approvals || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [filter]);

  const pendingCount = approvals.filter((a) => a.status === 'PENDING').length;

  return (
    <>
      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="HUMAN-IN-THE-LOOP AUTHORIZATION"
        badgeVariant="warning"
        badgeIcon={<ShieldCheck size={12} />}
        title="Approval Security Center"
        description="High-impact AI campaigns, discount thresholds, and financial workflows require explicit merchant authorization before execution."
        actions={
          <button
            onClick={fetchApprovals}
            disabled={isLoading}
            className="btn btn-outline btn-sm"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh Queue</span>
          </button>
        }
      />

      {/* ── Financial Guardrail Guarantee Card ───────────────── */}
      <div className="editorial-card" style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'var(--bg-secondary)',
      }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 'var(--radius-md)',
          background: 'var(--warning-bg)',
          border: '1px solid var(--warning-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <ShieldCheck size={20} style={{ color: 'var(--warning-text)' }} />
        </div>
        <div>
          <h4 className="font-heading" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Financial Guardrail Guarantee
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>
            AI autonomously proposes revenue opportunities. Policy limits are validated in real-time, but zero funds move without your direct cryptographic confirmation.
          </p>
        </div>
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--border-primary)', paddingBottom: 6 }}>
        <button
          onClick={() => setFilter('pending')}
          style={{
            padding: '6px 14px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)',
            border: '1px solid',
            borderColor: filter === 'pending' ? 'var(--border-primary)' : 'transparent',
            background: filter === 'pending' ? 'var(--bg-secondary)' : 'transparent',
            color: filter === 'pending' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            boxShadow: filter === 'pending' ? 'var(--shadow-xs)' : 'none',
          }}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '6px 14px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)',
            border: '1px solid',
            borderColor: filter === 'all' ? 'var(--border-primary)' : 'transparent',
            background: filter === 'all' ? 'var(--bg-secondary)' : 'transparent',
            color: filter === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            boxShadow: filter === 'all' ? 'var(--shadow-xs)' : 'none',
          }}
        >
          All Approvals History
        </button>
      </div>

      {/* ── Approvals List ───────────────────────────────────── */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Skeleton height={180} />
          <Skeleton height={180} />
        </div>
      ) : approvals.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {approvals.map((approval) => (
            <ApprovalCard
              key={approval.id}
              {...approval}
              onProcessed={fetchApprovals}
            />
          ))}
        </div>
      ) : (
        <div className="editorial-card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--success-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <CheckCircle2 size={24} style={{ color: 'var(--success)' }} />
          </div>
          <h3 className="font-heading" style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: 4 }}>
            Security Queue Clear
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto' }}>
            No pending AI actions requiring authorization at this time. New suggestions will appear here automatically.
          </p>
        </div>
      )}
    </>
  );
}
