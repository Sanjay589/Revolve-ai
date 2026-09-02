'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, X, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

export interface ApprovalCardProps {
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
  onProcessed?: () => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  actionId,
  status,
  expiresAt,
  action,
  onProcessed,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { success, error } = useToast();

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/ai/actions/${actionId}/approve`, {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to approve');
      }

      success('Action Approved', 'The AI action has been approved and moved to execution queue.');
      setIsConfirmOpen(false);
      onProcessed?.();
    } catch (err: unknown) {
      error('Approval Failed', err instanceof Error ? err.message : 'Error approving action');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/ai/actions/${actionId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason || 'Merchant declined proposal' }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reject');
      }

      success('Action Rejected', 'The proposal has been safely cancelled.');
      setIsRejectOpen(false);
      onProcessed?.();
    } catch (err: unknown) {
      error('Rejection Failed', err instanceof Error ? err.message : 'Error rejecting action');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Card style={{ borderLeft: '4px solid var(--warning)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge badge-warning" style={{ gap: 4 }}>
              <ShieldCheck size={12} /> AWAITING APPROVAL
            </span>
            <span className="badge badge-neutral" style={{ textTransform: 'uppercase' }}>
              {action.type}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            Expires {formatDateTime(expiresAt)}
          </span>
        </div>

        <h3 className="font-heading" style={{ fontSize: '1.125rem', marginBottom: 6 }}>
          {action.title}
        </h3>

        {action.description && (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
            {action.description}
          </p>
        )}

        {/* Policy evaluation summary */}
        {action.policyResult && (
          <div style={{
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: 16,
            fontSize: '0.8125rem',
          }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
              🛡️ Policy Check: {action.policyResult.passed ? 'Passed Guardrails' : 'Failed'}
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              {action.policyResult.reasons.join(' • ')}
            </p>
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border-secondary)',
          paddingTop: 12,
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Value / Budget</span>
            <p className="font-heading" style={{ fontSize: '1rem', fontWeight: 700 }}>
              {action.amount ? formatCurrency(action.amount) : 'N/A'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsRejectOpen(true)}
              style={{ color: 'var(--error)' }}
            >
              <X size={14} /> Reject
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsConfirmOpen(true)}
            >
              <Check size={14} /> Review & Approve
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Approve AI Action?"
        description="Verify financial safety controls before granting approval"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <div style={{ padding: 14, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{action.title}</p>
            {action.amount && (
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--ai-primary)', marginTop: 4 }}>
                {formatCurrency(action.amount)}
              </p>
            )}
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            By approving, you authorize the backend execution service to apply this action within your configured merchant policy limits.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApprove} isLoading={isProcessing}>
              Confirm Approval
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Reject AI Action"
        description="Provide optional feedback to tune AI behavior"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <div>
            <label className="label">Rejection Reason</label>
            <textarea
              className="input"
              rows={3}
              placeholder="e.g. Discount too high, or timing not suitable"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              style={{ height: 'auto' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" onClick={() => setIsRejectOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject} isLoading={isProcessing}>
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
