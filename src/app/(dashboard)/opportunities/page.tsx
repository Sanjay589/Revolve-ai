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
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-ai">
              <Sparkles size={12} /> LIFECYCLE PIPELINE
            </span>
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Opportunities &amp; Actions Pipeline
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Track AI action lifecycles from proposal through policy validation to execution.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchActions} disabled={isLoading}>
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Pipeline Stage Indicators */}
      <div className="editorial-card" style={{ padding: '16px 20px', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-tertiary)' }} />
            <span>1. PROPOSED ({actions.filter((a) => a.status === 'PROPOSED').length})</span>
          </div>
          <span style={{ color: 'var(--text-tertiary)' }}>→</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }} />
            <span>2. POLICY CHECK ({actions.filter((a) => a.status === 'POLICY_CHECK' || a.status === 'AWAITING_APPROVAL').length})</span>
          </div>
          <span style={{ color: 'var(--text-tertiary)' }}>→</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ai-primary)' }} />
            <span>3. APPROVED ({actions.filter((a) => a.status === 'APPROVED').length})</span>
          </div>
          <span style={{ color: 'var(--text-tertiary)' }}>→</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
            <span>4. SUCCESS ({actions.filter((a) => a.status === 'SUCCESS').length})</span>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="editorial-card" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton height={40} />
            <Skeleton height={40} />
            <Skeleton height={40} />
          </div>
        ) : actions.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>Opportunity</th>
                  <th>Type</th>
                  <th>Projected Value</th>
                  <th>Risk Rating</th>
                  <th>Pipeline State</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {actions.map((act) => (
                  <tr key={act.id} onClick={() => setSelectedAction(act)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="font-heading" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                        {act.title}
                      </div>
                      {act.description && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                      <div className="font-mono" style={{ fontWeight: 700, color: 'var(--fintech-primary)' }}>
                        {act.amount ? `+${formatCurrency(act.amount)}` : '—'}
                      </div>
                    </td>

                    <td>
                      <span className={`badge ${act.riskLevel === 'LOW' ? 'badge-fintech' : 'badge-warning'}`} style={{ fontSize: '0.6875rem' }}>
                        {act.riskLevel}
                      </span>
                    </td>

                    <td>
                      <span className={`badge ${act.status === 'SUCCESS' || act.status === 'APPROVED' ? 'badge-fintech' : act.status === 'AWAITING_APPROVAL' ? 'badge-warning' : 'badge-neutral'}`}>
                        {act.status}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      {formatDateTime(act.createdAt)}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <Sparkles size={36} style={{ margin: '0 auto 12px', opacity: 0.6 }} />
            <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 4 }}>
              No Actions in Pipeline
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Authorize recommendations from the AI Agent page to start actions.
            </p>
          </div>
        )}
      </div>

      {/* Action Detail Modal */}
      {selectedAction && (
        <Modal
          isOpen={Boolean(selectedAction)}
          onClose={() => setSelectedAction(null)}
          title="Opportunity Lifecycle Details"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <span className="badge badge-ai">{selectedAction.type}</span>
                <span className="badge badge-neutral">{selectedAction.status}</span>
              </div>
              <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                {selectedAction.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                {selectedAction.description}
              </p>
            </div>

            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
            }}>
              <div className="stat-label">Projected Monthly Value</div>
              <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--fintech-primary)' }}>
                {selectedAction.amount ? `+${formatCurrency(selectedAction.amount)}` : 'N/A'}
              </div>
            </div>

            {selectedAction.status === 'AWAITING_APPROVAL' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <Button variant="ghost" onClick={() => setSelectedAction(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleApprove(selectedAction.id)}
                  isLoading={isProcessing}
                >
                  <CheckCircle2 size={16} /> Authorize Action
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
