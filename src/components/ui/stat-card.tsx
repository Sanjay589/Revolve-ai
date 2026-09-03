'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, type LucideIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FloatingValue } from './floating-value';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'ai' | 'fintech' | 'warning';
  subtext?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  changeLabel = 'vs last period',
  icon: Icon,
  variant = 'default',
  subtext,
  className,
}) => {
  const isPositive = change !== undefined && change >= 0;

  const iconStyles = {
    default: {
      bg: 'var(--bg-tertiary)',
      color: 'var(--text-secondary)',
    },
    ai: {
      bg: 'var(--ai-bg)',
      color: 'var(--ai-primary)',
    },
    fintech: {
      bg: 'var(--success-bg)',
      color: 'var(--success)',
    },
    warning: {
      bg: 'var(--warning-bg)',
      color: 'var(--warning)',
    },
  }[variant];

  return (
    <div
      className={cn(
        'card card-elevated flex flex-col justify-between transition-all hover:border-[var(--border-focus)]',
        variant === 'ai' && 'border-[var(--ai-border)]',
        className
      )}
      style={{ padding: '20px 22px' }}
    >
      {/* Top: Label and Icon */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div
            className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
            style={{ background: iconStyles.bg }}
          >
            <Icon size={16} color={iconStyles.color} />
          </div>
        )}
      </div>

      {/* 1C: Floating Layer for Primary Monetary KPI */}
      <div className="mb-2">
        <FloatingValue
          value={value}
          size="2xl"
          font={typeof value === 'string' && value.includes('₹') ? 'heading' : 'mono'}
        />
      </div>

      {/* Companion Trend or Subtext */}
      <div className="flex items-center gap-1.5 text-xs">
        {change !== undefined ? (
          <>
            <span
              className={cn(
                'companion-float font-bold px-1.5 py-0.5 rounded',
                isPositive
                  ? 'text-[var(--success)] bg-[var(--success-bg)]'
                  : 'text-[var(--error)] bg-[var(--error-bg)]'
              )}
            >
              {isPositive ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
              {Math.abs(change)}%
            </span>
            <span className="text-[var(--text-tertiary)] font-normal truncate">
              {changeLabel}
            </span>
          </>
        ) : subtext ? (
          <span className="text-[var(--text-tertiary)] text-xs truncate">{subtext}</span>
        ) : null}
      </div>
    </div>
  );
};

export interface FeaturedStatCardProps {
  label: string;
  value: string | number;
  badgeText?: string;
  change?: number;
  changeLabel?: string;
  subtext?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const FeaturedStatCard: React.FC<FeaturedStatCardProps> = ({
  label,
  value,
  badgeText = 'Autonomous ROI',
  change,
  changeLabel = 'attributed this month',
  subtext = 'Generated via dynamic upsells, bundle offers & policy-checked agent actions',
  className,
}) => {
  return (
    <div
      className={cn(
        'card card-featured card-elevated relative overflow-hidden transition-all hover:shadow-lg',
        className
      )}
      style={{
        padding: '24px 28px',
        border: '1.5px solid var(--ai-border)',
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(238, 242, 255, 0.7) 100%)',
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-ai flex items-center gap-1.5 py-1 px-3 text-xs font-bold">
              <Sparkles size={12} />
              {badgeText}
            </span>
            <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
              {label}
            </span>
          </div>

          {/* 1C: Primary Floating Value Layer */}
          <div className="my-1.5">
            <FloatingValue
              value={value}
              size="3xl"
              font="heading"
            />
          </div>

          <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-xl">
            {subtext}
          </p>
        </div>

        {change !== undefined && (
          <div className="flex flex-col md:items-end flex-shrink-0">
            <span className="companion-float font-bold text-sm text-[var(--success)] bg-[var(--success-bg)] border border-[var(--success-border)] px-2.5 py-1 rounded-full">
              <ArrowUpRight size={14} className="mr-1" />
              +{change}%
            </span>
            <span className="text-[0.6875rem] text-[var(--text-tertiary)] mt-1 font-medium">
              {changeLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
