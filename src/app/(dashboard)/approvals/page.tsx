'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Clock } from 'lucide-react';
import { ApprovalCard } from '@/components/approval-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

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
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-warning">
              <ShieldCheck size={12} /> HUMAN-IN-THE-LOOP CONTROL
            </span>
          </div>
          <h1 className="page-title">Approval Security Center</h1>
          <p className="page-subtitle">
            Sensitive AI actions and automated workflows require explicit merchant authorization.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={fetchApprovals} isLoading={isLoading}>
            <RefreshCw size={14} /> Refresh
          </Button>
        </div>
      </div>

      {/* Safety Principle Banner */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
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
          <ShieldCheck size={22} color="var(--warning)" />
        </div>
        <div>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Financial Safety Principle
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Revolve AI never moves money or launches financial campaigns without passing your strict Policy Engine constraints and merchant approval.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Pending Approvals ({approvals.filter((a) => a.status === 'PENDING').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All History
        </button>
      </div>

      {/* Approvals List */}
      {approvals.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="All Clear — No Pending Approvals"
          description="Your store is safely operating within configured bounds. When the AI proposes an action requiring sign-off, it will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {approvals.map((app) => (
            <ApprovalCard
              key={app.id}
              {...app}
              onProcessed={fetchApprovals}
            />
          ))}
        </div>
      )}
    </div>
  );
}
