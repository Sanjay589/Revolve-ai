'use client';

import React from 'react';
import {
  Brain,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  BarChart3,
  Layers
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export interface ExplainabilityData {
  title: string;
  type: string;
  reason: string;
  evidence: string[];
  expectedImpact: number;
  confidence: number;
  riskLevel: string;
  productName?: string;
  targetProductNames?: string[];
  actionId?: string;
  onAuthorize?: () => void;
}

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ExplainabilityData | null;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!data) return null;

  const confidencePct = Math.round(data.confidence * 100);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Why Did AI Recommend This?"
      size="lg"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Opportunity Summary Header */}
        <div style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
        }}>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <span className="badge badge-ai">
                <Brain size={12} /> {data.type} OPPORTUNITY
              </span>
              <span className={`badge ${data.riskLevel === 'LOW' ? 'badge-fintech' : 'badge-warning'}`}>
                {data.riskLevel} RISK
              </span>
            </div>
            <h3 className="font-heading" style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {data.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              {data.reason}
            </p>
          </div>
        </div>

        {/* 4 Financial & Policy Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: 12,
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
          }}>
            <div className="stat-label">Expected Impact</div>
            <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--fintech-primary)' }}>
              +{formatCurrency(data.expectedImpact)}
            </div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>/ month projected</span>
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
          }}>
            <div className="stat-label">AI Confidence</div>
            <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {confidencePct}%
            </div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>based on historical baskets</span>
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
          }}>
            <div className="stat-label">Policy Check</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.9375rem', fontWeight: 600, color: 'var(--success)' }}>
              <CheckCircle2 size={16} /> Within Limits
            </div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Cap: ₹10,000 / tx</span>
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
          }}>
            <div className="stat-label">Risk Rating</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: data.riskLevel === 'LOW' ? 'var(--success)' : 'var(--warning)' }}>
              {data.riskLevel} Risk
            </div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>No budget overrun</span>
          </div>
        </div>

        {/* Concrete Data Points & Evidence */}
        <div>
          <div style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-secondary)',
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <BarChart3 size={14} /> Concrete Historical Evidence & Pattern Discovery
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.evidence.map((point, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  padding: '10px 14px',
                  background: 'var(--bg-hover)',
                  border: '1px solid var(--border-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  color: 'var(--text-primary)',
                }}
              >
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: 'var(--fintech-bg)',
                  color: 'var(--fintech-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: 2,
                }}>
                  {index + 1}
                </div>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Safety & Merchant Control Notice */}
        <div style={{
          background: 'var(--bg-tertiary)',
          borderLeft: '3px solid var(--fintech-primary)',
          padding: '12px 16px',
          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <ShieldCheck size={18} style={{ color: 'var(--fintech-primary)', flexShrink: 0 }} />
          <span>
            <strong>Policy Enforced:</strong> Revolve AI never directly executes transactions. If authorized, this recommendation generates bounded companion offers verified at checkout.
          </span>
        </div>

        {/* Actions Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 10,
          paddingTop: 12,
          borderTop: '1px solid var(--border-primary)',
        }}>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {data.onAuthorize && (
            <Button
              variant="primary"
              onClick={() => {
                data.onAuthorize?.();
                onClose();
              }}
            >
              <CheckCircle2 size={16} /> Authorize Action
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
