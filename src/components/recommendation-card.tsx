'use client';

import React, { useState } from 'react';
import { Sparkles, TrendingUp, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

export interface RecommendationProps {
  id: string;
  type: string;
  title: string;
  reason: string;
  evidence: string[];
  expectedImpact: number;
  confidence: number;
  riskLevel: string;
  productId?: string | null;
  onActionCreated?: () => void;
}

export const RecommendationCard: React.FC<RecommendationProps> = ({
  id,
  type,
  title,
  reason,
  evidence,
  expectedImpact,
  confidence,
  riskLevel,
  onActionCreated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleCreateAction = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/ai/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendationId: id,
          type,
          title,
          description: reason,
          amount: expectedImpact,
          riskLevel,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to trigger action');
      }

      success('Action Proposed', 'AI recommendation submitted to Policy Engine for safety verification.');
      setIsModalOpen(false);
      onActionCreated?.();
    } catch (err: unknown) {
      error('Action Failed', err instanceof Error ? err.message : 'Could not propose action');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card isAi className="flex flex-col justify-between" style={{ height: '100%' }}>
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="badge badge-ai" style={{ fontSize: '0.6875rem' }}>
              <Sparkles size={10} /> {type}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="badge badge-neutral">
                {Math.round(confidence * 100)}% Confidence
              </span>
              <Badge variant={riskLevel === 'LOW' ? 'success' : 'warning'}>
                {riskLevel} RISK
              </Badge>
            </div>
          </div>

          <h3 className="font-heading" style={{ fontSize: '1.0625rem', marginBottom: 8, lineHeight: 1.3 }}>
            {title}
          </h3>

          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
            {reason}
          </p>

          {/* Evidence Snippet */}
          {evidence.length > 0 && (
            <div style={{
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              marginBottom: 16,
            }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>
                Key Evidence
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                • {evidence[0]}
              </p>
            </div>
          )}
        </div>

        {/* Footer with Impact & Action */}
        <div style={{
          borderTop: '1px solid var(--border-secondary)',
          paddingTop: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', display: 'block' }}>
              Est. Monthly Impact
            </span>
            <span className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--success)' }}>
              +{formatCurrency(expectedImpact)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" variant="secondary" onClick={() => setIsModalOpen(true)}>
              Explain
            </Button>
            <Button size="sm" variant="ai" onClick={handleCreateAction} isLoading={isSubmitting}>
              Execute <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </Card>

      {/* AI Explainability Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="AI Recommendation Explainability"
        description="Full audit rationale & projected financial impact"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <div>
            <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>
              WHAT IS RECOMMENDED?
            </h4>
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {title}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>
              WHY THIS RECOMMENDATION?
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {reason}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 6 }}>
              EVIDENCE & HISTORICAL SIGNALS
            </h4>
            <ul style={{ paddingLeft: 16, fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {evidence.map((e, idx) => (
                <li key={idx}>{e}</li>
              ))}
            </ul>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            padding: 12,
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Expected Impact</span>
              <p className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>
                +{formatCurrency(expectedImpact)}/mo
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Risk Assessment</span>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: riskLevel === 'LOW' ? 'var(--success)' : 'var(--warning)' }}>
                {riskLevel} Risk (No money moved without approval)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="ai" onClick={handleCreateAction} isLoading={isSubmitting}>
              Proceed with Policy Check
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
