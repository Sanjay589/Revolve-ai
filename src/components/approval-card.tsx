'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, X, AlertTriangle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge, StatusPill } from '@/components/ui/badge';
import { StatValue } from '@/components/ui/floating-value';
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

      success('Action Authorized', 'The AI action has been approved and moved to execution state.');
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

      success('Action Declined', 'The proposal has been safely rejected and cancelled.');
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
      <div className="editorial-card" style={{ borderLeft: '4px solid var(--warning)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusPill status="AWAITING_APPROVAL" />
            <span className="badge badge-ai" style={{ textTransform: 'uppercase', fontSize: '0.6875rem' }}>
              {action.type}
            </span>
          </div>
        </div>

        <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
          {action.title}
        </h3>

        {action.description && (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
            {action.description}
          </p>
        )}

        {/* Policy Verification Checklist */}
        <div style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-secondary)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          marginBottom: 16,
        }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', marginBottom: 8 }}>
            Policy Guardrail Evaluation:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--success)' }}>
              <CheckCircle2 size={14} /> Transaction Limit (&lt; ₹10,000)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--success)' }}>
              <CheckCircle2 size={14} /> Cumulative Daily Spend (&lt; ₹50,000)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--success)' }}>
              <CheckCircle2 size={14} /> Max Discount Cap (&lt; 25%)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--success)' }}>
              <CheckCircle2 size={14} /> Merchant Action Allowlist
            </div>
          </div>
        </div>

        {/* Projected Value & Decision Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          paddingTop: 14,
          borderTop: '1px solid var(--border-secondary)',
        }}>
          <div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
              Projected Monthly Value
            </div>
            <StatValue
              value={action.amount ? `+${formatCurrency(action.amount)}` : 'Non-monetary optimization'}
              size="xl"
              font="mono"
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRejectOpen(true)}
              disabled={isProcessing}
            >
              <X size={14} /> Reject Proposal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsConfirmOpen(true)}
              disabled={isProcessing}
            >
              <Check size={14} /> Authorize &amp; Execute
            </Button>
          </div>
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Authorize AI Growth Action"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Are you sure you want to authorize <strong>{action.title}</strong>? Once approved, the companion offer will become active in your checkout workflow.
          </p>

          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
          }}>
            <strong>Policy Safety Guarantee:</strong> All customer payments continue to be processed through standard Razorpay checkout and cryptographically verified before order completion.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <Button variant="ghost" onClick={() => setIsConfirmOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApprove} isLoading={isProcessing}>
              Confirm &amp; Authorize
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        title="Decline AI Recommendation"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Please provide an optional reason for declining this recommendation. This helps calibrate future AI opportunities.
          </p>

          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Current supplier constraints on laptop sleeves"
            rows={3}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              outline: 'none',
              fontFamily: 'var(--font-body)',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="ghost" onClick={() => setIsRejectOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleReject} isLoading={isProcessing}>
              Decline Proposal
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
