'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Brain,
  Layers
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

interface ActionItem {
  id: string;
  type: string;
  status: string;
  title: string;
  description?: string | null;
  amount?: number | null;
  riskLevel: string;
  createdAt: string;
  policyResult?: {
    passed: boolean;
    reasons: string[];
  } | null;
  approval?: {
    id: string;
    status: string;
  } | null;
}

export default function OpportunitiesPage() {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { success, error } = useToast();

  const fetchActions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/actions');
      if (res.ok) {
        const data = await res.json();
        setActions(data.actions || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleApprove = async (actionId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/ai/actions/${actionId}/approve`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to approve');
      success('Approved', 'Action authorized for execution.');
      setSelectedAction(null);
      fetchActions();
    } catch (err: unknown) {
      error('Error', err instanceof Error ? err.message : 'Could not approve');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="LIFECYCLE PIPELINE"
        badgeVariant="ai"
        badgeIcon={<Sparkles size={12} />}
        title="Opportunities &amp; Actions Pipeline"
        description="Track and inspect autonomous AI action lifecycles from initial co-purchase detection through policy checks to execution."
        actions={
          <Button variant="outline" size="sm" onClick={fetchActions} disabled={isLoading}>
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </Button>
        }
      />

      {/* ── Pipeline Stage Indicators ───────────────────────── */}
      <div className="editorial-card" style={{ padding: '14px 20px', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-tertiary)' }} />
            <span>1. PROPOSED ({actions.filter((a) => a.status === 'PROPOSED').length})</span>
          </div>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>→</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }} />
            <span>2. POLICY CHECK ({actions.filter((a) => a.status === 'POLICY_CHECK' || a.status === 'AWAITING_APPROVAL').length})</span>
          </div>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>→</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ai-primary)' }} />
            <span>3. EXECUTED ({actions.filter((a) => a.status === 'EXECUTED').length})</span>
          </div>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>→</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
            <span>4. VERIFIED ({actions.filter((a) => a.status === 'VERIFIED').length})</span>
          </div>
        </div>
      </div>

      {/* ── Actions Table ───────────────────────────────────── */}
      <div className="editorial-card" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Skeleton height={36} />
            <Skeleton height={36} />
            <Skeleton height={36} />
          </div>
        ) : actions.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>Opportunity</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Expected Value</th>
                  <th>Risk Level</th>
                  <th>Policy Gate</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {actions.map((act) => (
                  <tr key={act.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                        {act.title}
                      </div>
                      {act.description && (
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {act.description}
                        </div>
                      )}
                    </td>

                    <td>
                      <span className="badge badge-ai" style={{ fontSize: '0.6875rem' }}>
                        {act.type}
                      </span>
                    </td>

                    <td>
                      <span className={`badge ${
                        act.status === 'VERIFIED' || act.status === 'EXECUTED'
                          ? 'badge-success'
                          : act.status === 'AWAITING_APPROVAL' || act.status === 'POLICY_CHECK'
                          ? 'badge-warning'
                          : 'badge-neutral'
                      }`} style={{ fontSize: '0.6875rem' }}>
                        {act.status}
                      </span>
                    </td>

                    <td>
                      <div className="font-mono" style={{ fontWeight: 700, color: 'var(--fintech-primary)', fontSize: '0.875rem' }}>
                        {act.amount ? `+${formatCurrency(act.amount)}` : 'Optimization'}
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${act.riskLevel === 'LOW' ? 'badge-fintech' : 'badge-warning'}`} style={{ fontSize: '0.6875rem' }}>
                        {act.riskLevel}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
                        <CheckCircle2 size={13} /> Evaluated
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {formatDateTime(act.createdAt).slice(0, 10)}
                      </div>
                    </td>

                    <td>
                      {act.status === 'AWAITING_APPROVAL' ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSelectedAction(act)}
                        >
                          Review
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAction(act)}
                        >
                          Inspect
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-tertiary)' }}>
            No actions recorded yet. Run an AI scan to discover new revenue opportunities.
          </div>
        )}
      </div>

      {/* ── Action Detail Modal ─────────────────────────────── */}
      {selectedAction && (
        <Modal
          isOpen={Boolean(selectedAction)}
          onClose={() => setSelectedAction(null)}
          title="Inspect Action Lifecycle"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <span className="badge badge-ai">{selectedAction.type}</span>
                <span className="badge badge-success">{selectedAction.status}</span>
              </div>
              <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedAction.title}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                {selectedAction.description}
              </p>
            </div>

            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
            }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                Expected Monthly Growth Impact
              </div>
              <div className="font-mono" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--fintech-primary)', marginTop: 2 }}>
                {selectedAction.amount ? `+${formatCurrency(selectedAction.amount)} / mo` : 'Workflow Automation'}
              </div>
            </div>

            {selectedAction.status === 'AWAITING_APPROVAL' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <Button variant="outline" onClick={() => setSelectedAction(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleApprove(selectedAction.id)}
                  isLoading={isProcessing}
                >
                  Authorize Action
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
