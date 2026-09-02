'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Clock, Shield } from 'lucide-react';
import { ApprovalCard } from '@/components/approval-card';
import { Button } from '@/components/ui/button';
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

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-warning">
              <ShieldCheck size={12} /> HUMAN-IN-THE-LOOP AUTHORIZATION
            </span>
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Approval Security Center
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            High-impact AI campaigns & financial changes require explicit merchant verification.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchApprovals} disabled={isLoading}>
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Safety Principle Banner */}
      <div className="editorial-card" style={{
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'var(--bg-secondary)',
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          background: 'var(--warning-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <ShieldCheck size={22} style={{ color: 'var(--warning)' }} />
        </div>
        <div>
          <h4 className="font-heading" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Financial Guardrail Guarantee
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            AI proposes opportunities based on catalog affinity. The Policy Engine validates bounds, but no funds move without merchant sign-off.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-primary)', paddingBottom: 8 }}>
        <button
          onClick={() => setFilter('pending')}
          style={{
            padding: '8px 16px',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)',
            border: '1px solid',
            borderColor: filter === 'pending' ? 'var(--border-primary)' : 'transparent',
            background: filter === 'pending' ? 'var(--bg-secondary)' : 'transparent',
            color: filter === 'pending' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          Pending Review ({approvals.filter((a) => a.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            fontSize: '0.875rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)',
            border: '1px solid',
            borderColor: filter === 'all' ? 'var(--border-primary)' : 'transparent',
            background: filter === 'all' ? 'var(--bg-secondary)' : 'transparent',
            color: filter === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          All Approvals History
        </button>
      </div>

      {/* Approvals List */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Skeleton height={180} />
          <Skeleton height={180} />
        </div>
      ) : approvals.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {approvals.map((approval) => (
            <ApprovalCard
              key={approval.id}
              {...approval}
              onProcessed={fetchApprovals}
            />
          ))}
        </div>
      ) : (
        <div className="editorial-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <CheckCircle2 size={36} style={{ color: 'var(--success)', margin: '0 auto 12px' }} />
          <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 4 }}>
            Security Queue Clear
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            No pending AI actions requiring authorization at this time.
          </p>
        </div>
      )}
    </div>
  );
}
