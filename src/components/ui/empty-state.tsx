import React from 'react';
import { type LucideIcon, Inbox } from 'lucide-react';
import { Button } from './button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  isAi?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  isAi,
}) => {
  return (
    <div className="card" style={{ padding: '48px 24px', textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 'var(--radius-lg)',
        background: isAi ? 'var(--ai-bg)' : 'var(--bg-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
      }}>
        <Icon size={24} color={isAi ? 'var(--ai-primary)' : 'var(--text-secondary)'} />
      </div>
      <h3 className="font-heading" style={{ fontSize: '1.125rem', marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: actionLabel ? 20 : 0 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant={isAi ? 'ai' : 'primary'} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
