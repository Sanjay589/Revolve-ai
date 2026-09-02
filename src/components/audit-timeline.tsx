import React from 'react';
import { formatTime, formatDate } from '@/lib/utils';
import { Sparkles, Shield, CheckCircle2, AlertCircle, CreditCard, Webhook, FileText, User } from 'lucide-react';

export interface AuditItem {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  reason?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface AuditTimelineProps {
  events: AuditItem[];
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ events }) => {
  const getEventMeta = (action: string) => {
    if (action.startsWith('AI_')) {
      return { icon: Sparkles, color: 'var(--ai-primary)', type: 'ai' };
    }
    if (action.startsWith('POLICY_')) {
      return { icon: Shield, color: 'var(--warning)', type: 'warning' };
    }
    if (action.includes('APPROVED') || action.includes('SUCCESS') || action.includes('CAPTURED') || action.includes('VERIFIED')) {
      return { icon: CheckCircle2, color: 'var(--success)', type: 'success' };
    }
    if (action.includes('FAILED') || action.includes('REJECTED')) {
      return { icon: AlertCircle, color: 'var(--error)', type: 'error' };
    }
    if (action.includes('RAZORPAY') || action.includes('PAYMENT')) {
      return { icon: CreditCard, color: 'var(--info)', type: 'info' };
    }
    if (action.includes('WEBHOOK')) {
      return { icon: Webhook, color: 'var(--text-secondary)', type: 'neutral' };
    }
    if (action.includes('USER')) {
      return { icon: User, color: 'var(--text-primary)', type: 'neutral' };
    }
    return { icon: FileText, color: 'var(--text-secondary)', type: 'neutral' };
  };

  if (events.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-tertiary)' }}>
        No audit events recorded yet.
      </div>
    );
  }

  return (
    <div className="timeline">
      {events.map((e) => {
        const meta = getEventMeta(e.action);
        const Icon = meta.icon;

        return (
          <div key={e.id} className={`timeline-item ${meta.type}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="font-mono font-semibold" style={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                  {e.action}
                </span>
                <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                  by {e.actor}
                </span>
              </div>
              <span className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                {formatTime(e.createdAt)} • {formatDate(e.createdAt)}
              </span>
            </div>

            {e.reason && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {e.reason}
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span className="font-mono truncate-id" title={e.entityId} style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                {e.entity}: {e.entityId}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
