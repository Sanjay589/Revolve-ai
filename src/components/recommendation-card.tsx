'use client';

import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  FileText,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExplainabilityModal } from '@/components/explainability-drawer';
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
  targetProductIds?: string[];
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
  targetProductIds,
  onActionCreated,
}) => {
  const [isExplainOpen, setIsExplainOpen] = useState(false);
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

      success('Action Submitted to Policy Engine', 'Action is now in policy check and awaiting merchant authorization.');
      setIsExplainOpen(false);
      onActionCreated?.();
    } catch (err: unknown) {
      error('Action Failed', err instanceof Error ? err.message : 'Could not propose action');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="editorial-card flex flex-col justify-between" style={{ height: '100%' }}>
        <div>
          {/* Card Header Badges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="badge badge-ai" style={{ fontSize: '0.6875rem' }}>
              <Brain size={11} /> {type}
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                {Math.round(confidence * 100)}% Conf
              </span>
              <span className={`badge ${riskLevel === 'LOW' ? 'badge-fintech' : 'badge-warning'}`} style={{ fontSize: '0.6875rem' }}>
                {riskLevel} Risk
              </span>
            </div>
          </div>

          <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3 }}>
            {title}
          </h3>

          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
            {reason}
          </p>

          {/* Evidence Pills */}
          {evidence.length > 0 && (
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-secondary)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              marginBottom: 16,
            }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 6 }}>
                Pattern Evidence:
              </div>
              <ul style={{ paddingLeft: 14, margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {evidence.slice(0, 2).map((point, index) => (
                  <li key={index} style={{ marginBottom: 3 }}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          {/* Impact Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 12,
            borderTop: '1px solid var(--border-secondary)',
            marginBottom: 14,
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                Expected Impact
              </div>
              <div className="font-mono value-float" style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--fintech-primary)' }}>
                +{formatCurrency(expectedImpact)}
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 400 }}> /mo</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                Policy Limit
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <CheckCircle2 size={12} /> Bounded
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              variant="outline"
              size="sm"
              style={{ flex: 1 }}
              onClick={() => setIsExplainOpen(true)}
            >
              Explain
            </Button>
            <Button
              variant="primary"
              size="sm"
              style={{ flex: 1.3 }}
              disabled={isSubmitting}
              onClick={handleCreateAction}
            >
              <span>{isSubmitting ? 'Submitting...' : 'Authorize'}</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </div>

      <ExplainabilityModal
        isOpen={isExplainOpen}
        onClose={() => setIsExplainOpen(false)}
        data={{
          title,
          type,
          reason,
          evidence,
          expectedImpact,
          confidence,
          riskLevel,
          onAuthorize: handleCreateAction,
        }}
      />
    </>
  );
};
