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
  limit?: number;
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ events, limit }) => {
  const displayedEvents = limit ? events.slice(0, limit) : events;

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
      return { icon: CreditCard, color: 'var(--fintech-primary)', type: 'info' };
    }
    if (action.includes('WEBHOOK')) {
      return { icon: Webhook, color: 'var(--text-secondary)', type: 'neutral' };
    }
    if (action.includes('USER')) {
      return { icon: User, color: 'var(--text-primary)', type: 'neutral' };
    }
    return { icon: FileText, color: 'var(--text-secondary)', type: 'neutral' };
  };

  if (displayedEvents.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-tertiary)' }}>
        No audit events recorded yet.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {displayedEvents.map((e) => {
        const meta = getEventMeta(e.action);
        const Icon = meta.icon;

        return (
          <div
            key={e.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '10px 14px',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-secondary)',
            }}
          >
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-secondary)',
              color: meta.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 2,
            }}>
              <Icon size={15} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {e.action}
                  </span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.625rem', padding: '2px 6px' }}>
                    by {e.actor}
                  </span>
                </div>
                <span className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                  {formatTime(e.createdAt)}
                </span>
              </div>

              {e.reason && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>
                  {e.reason}
                </p>
              )}

              <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                {e.entity}: {e.entityId.slice(0, 18)}...
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
