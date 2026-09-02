'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  badgeText?: string;
  badgeVariant?: 'ai' | 'success' | 'warning' | 'error' | 'neutral' | 'info';
  badgeIcon?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  badgeText,
  badgeVariant = 'neutral',
  badgeIcon,
  title,
  description,
  actions,
  className,
}) => {
  const badgeClass = {
    ai: 'badge-ai',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    neutral: 'badge-neutral',
    info: 'badge-info',
  }[badgeVariant];

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2',
        className
      )}
    >
      <div>
        {badgeText && (
          <div className="flex items-center gap-2 mb-1.5">
            <span className={cn('badge', badgeClass)}>
              {badgeIcon}
              {badgeText}
            </span>
          </div>
        )}
        <h1
          className="font-heading text-2xl md:text-[1.625rem] font-extrabold text-[var(--text-primary)] tracking-tight leading-tight"
        >
          {title}
        </h1>
        {description && (
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 flex-shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};
