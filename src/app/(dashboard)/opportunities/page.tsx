'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PROPOSED':
        return <Badge variant="neutral">PROPOSED</Badge>;
      case 'POLICY_CHECK':
        return <Badge variant="warning">POLICY CHECK</Badge>;
      case 'AWAITING_APPROVAL':
        return <Badge variant="warning">AWAITING APPROVAL</Badge>;
      case 'APPROVED':
        return <Badge variant="info">APPROVED</Badge>;
      case 'EXECUTING':
        return <Badge variant="ai">EXECUTING</Badge>;
      case 'SUCCESS':
        return <Badge variant="success">SUCCESS</Badge>;
      case 'FAILED':
        return <Badge variant="error">FAILED</Badge>;
      case 'REJECTED':
        return <Badge variant="error">REJECTED</Badge>;
      case 'EXPIRED':
        return <Badge variant="neutral">EXPIRED</Badge>;
      case 'EXECUTION_UNKNOWN':
        return <Badge variant="warning">UNKNOWN</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

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

  const handleReject = async (actionId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/ai/actions/${actionId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Merchant rejected from opportunity pipeline' }),
      });
      if (!res.ok) throw new Error('Failed to reject');
      success('Rejected', 'Action cancelled.');
      setSelectedAction(null);
      fetchActions();
    } catch (err: unknown) {
      error('Error', err instanceof Error ? err.message : 'Could not reject');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-ai">
              <Sparkles size={12} /> PIPELINE & EXECUTION
            </span>
          </div>
          <h1 className="page-title">Growth Opportunity Pipeline</h1>
          <p className="page-subtitle">
            Lifecycle tracking: PROPOSED → POLICY_CHECK → AWAITING_APPROVAL → APPROVED → EXECUTING → SUCCESS
          </p>
        </div>

        <Button variant="secondary" onClick={fetchActions} isLoading={isLoading}>
          <RefreshCw size={14} /> Refresh Pipeline
        </Button>
      </div>

      {/* Pipeline Lifecycle Visualizer */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        overflowX: 'auto',
      }}>
        {['PROPOSED', 'POLICY_CHECK', 'AWAITING_APPROVAL', 'APPROVED', 'EXECUTING', 'SUCCESS'].map((stage, idx) => (
          <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span className="font-mono text-xs" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              {stage}
            </span>
            {idx < 5 && <ArrowRight size={14} color="var(--text-tertiary)" />}
          </div>
        ))}
      </div>

      {/* Opportunities Table */}
      {actions.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Sparkles size={32} color="var(--ai-primary)" style={{ margin: '0 auto 12px' }} />
          <h3 className="font-heading" style={{ fontSize: '1.125rem', marginBottom: 6 }}>
            No actions in the pipeline
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Go to the AI Agent page to scan and propose new growth opportunities.
          </p>
        </Card>
      ) : (
        <div className="table-container card" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Opportunity / Action</th>
                <th>Type</th>
                <th>Projected Value</th>
                <th>Policy Status</th>
                <th>State</th>
                <th>Timestamp</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((act) => (
                <tr key={act.id} onClick={() => setSelectedAction(act)} style={{ cursor: 'pointer' }}>
                  <td>
                    <p style={{ fontWeight: 600 }}>{act.title}</p>
                    {act.description && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {act.description}
                      </p>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                      {act.type}
                    </span>
                  </td>
                  <td className="font-heading font-bold" style={{ color: 'var(--success)' }}>
                    {act.amount ? formatCurrency(act.amount) : '—'}
                  </td>
                  <td>
                    {act.policyResult?.passed ? (
                      <span className="badge badge-success" style={{ gap: 4 }}>
                        <ShieldCheck size={10} /> Passed
                      </span>
                    ) : (
                      <span className="badge badge-error">Blocked</span>
                    )}
                  </td>
                  <td>{getStatusBadge(act.status)}</td>
                  <td className="font-mono text-tertiary" style={{ fontSize: '0.75rem' }}>
                    {formatDateTime(act.createdAt)}
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAction(act);
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail & Action Modal */}
      {selectedAction && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAction(null)}
          title="Opportunity Pipeline Details"
          description={`ID: ${selectedAction.id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Title
              </span>
              <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                {selectedAction.title}
              </p>
            </div>

            {selectedAction.description && (
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Rationale
                </span>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {selectedAction.description}
                </p>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              padding: 12,
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Current State</span>
                <div style={{ marginTop: 4 }}>{getStatusBadge(selectedAction.status)}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Projected Value</span>
                <p className="font-heading font-bold" style={{ color: 'var(--success)' }}>
                  {selectedAction.amount ? formatCurrency(selectedAction.amount) : 'N/A'}
                </p>
              </div>
            </div>

            {selectedAction.policyResult && (
              <div style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontWeight: 600, fontSize: '0.8125rem', marginBottom: 4 }}>Policy Guardrail Reasons:</p>
                <ul style={{ paddingLeft: 16, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {selectedAction.policyResult.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedAction.status === 'AWAITING_APPROVAL' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <Button
                  variant="danger"
                  onClick={() => handleReject(selectedAction.id)}
                  isLoading={isProcessing}
                >
                  Reject Proposal
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleApprove(selectedAction.id)}
                  isLoading={isProcessing}
                >
                  Approve Action
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
