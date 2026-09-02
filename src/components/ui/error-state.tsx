import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => {
  return (
    <div className="card" style={{ padding: '36px 24px', textAlign: 'center', maxWidth: 460, margin: '0 auto', borderColor: 'var(--error-border)' }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--error-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
      }}>
        <AlertCircle size={22} color="var(--error)" />
      </div>
      <h4 className="font-heading" style={{ fontSize: '1.0625rem', marginBottom: 6 }}>{title}</h4>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: onRetry ? 18 : 0 }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
