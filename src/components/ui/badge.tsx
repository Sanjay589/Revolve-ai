import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle, XCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'ai' | 'neutral' | 'glass';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  children,
  ...props
}) => {
  const variantClass = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    ai: 'badge-ai',
    neutral: 'badge-neutral',
    glass: 'liquid-glass text-white/90 border border-white/10',
  }[variant];

  return (
    <span className={cn('badge', variantClass, className)} {...props}>
      {children}
    </span>
  );
};

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  className,
  ...props
}) => {
  const normalized = (status || '').toUpperCase();

  let variant: 'success' | 'warning' | 'error' | 'info' | 'ai' | 'neutral' = 'neutral';
  let icon: React.ReactNode = null;
  let label = status;

  if (['PAID', 'CAPTURED', 'APPROVED', 'SUCCESS', 'VERIFIED'].includes(normalized)) {
    variant = 'success';
    icon = <CheckCircle2 size={11} className="mr-1" />;
    label = normalized === 'CAPTURED' ? 'Captured (Paid)' : normalized;
  } else if (['PENDING', 'AWAITING_APPROVAL', 'POLICY_CHECK', 'ATTEMPTED'].includes(normalized)) {
    variant = 'warning';
    icon = <Clock size={11} className="mr-1" />;
    label = normalized === 'AWAITING_APPROVAL' ? 'Awaiting Approval' : normalized;
  } else if (['FAILED', 'REJECTED', 'CANCELLED', 'EXPIRED'].includes(normalized)) {
    variant = 'error';
    icon = <XCircle size={11} className="mr-1" />;
  } else if (['EXECUTION_UNKNOWN'].includes(normalized)) {
    variant = 'warning';
    icon = <AlertTriangle size={11} className="mr-1 text-[var(--error)]" />;
    label = 'Execution Unknown';
  } else if (['UPSELL', 'CROSS_SELL', 'AI_PURCHASE', 'PROPOSED'].includes(normalized)) {
    variant = 'ai';
    icon = <Sparkles size={11} className="mr-1" />;
  }

  return (
    <Badge variant={variant} className={cn('inline-flex items-center text-[0.6875rem] py-0.5 px-2 font-semibold', className)} {...props}>
      {icon}
      <span>{label}</span>
    </Badge>
  );
};
