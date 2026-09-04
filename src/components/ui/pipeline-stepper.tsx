'use client';

import React from 'react';
import { Check, ShieldCheck, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PipelineStage {
  id: string;
  stepNumber: number;
  label: string;
  count: number;
  status: 'completed' | 'active' | 'pending';
  description?: string;
}

export interface PipelineStepperProps {
  stages: PipelineStage[];
  activeStageId?: string;
  onSelectStage?: (stageId: string) => void;
  className?: string;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  stages,
  activeStageId,
  onSelectStage,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="card card-elevated p-4 md:p-5 relative overflow-hidden">
        {/* Top Connecting Track on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {stages.map((stage, idx) => {
            const isSelected = activeStageId === stage.id;
            const isCompleted = stage.status === 'completed';
            const isActive = stage.status === 'active';

            return (
              <div
                key={stage.id}
                onClick={() => onSelectStage?.(stage.id)}
                className={cn(
                  'group relative flex items-start gap-3 p-3 rounded-[var(--radius-md)] border transition-all cursor-pointer select-none',
                  isSelected
                    ? 'bg-[var(--bg-tertiary)] border-[var(--ai-primary)] shadow-sm'
                    : 'bg-[var(--bg-secondary)] border-[var(--border-secondary)] hover:border-[var(--border-focus)]'
                )}
              >
                {/* Node Indicator */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-heading font-extrabold text-xs flex-shrink-0 transition-transform group-hover:scale-105',
                    isCompleted
                      ? 'bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success-border)]'
                      : isActive
                      ? 'bg-[var(--ai-bg)] text-[var(--ai-primary)] border border-[var(--ai-border)] ring-2 ring-[var(--ai-border)] ring-offset-1 ring-offset-[var(--bg-secondary)]'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] border border-[var(--border-primary)]'
                  )}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : stage.stepNumber}
                </div>

                {/* Stage Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 mb-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] truncate">
                      {stage.label}
                    </span>
                    <span
                      className={cn(
                        'text-[0.6875rem] font-mono font-bold px-1.5 py-0.5 rounded-full',
                        stage.count > 0
                          ? 'bg-[var(--ai-bg)] text-[var(--ai-primary)] border border-[var(--ai-border)]'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                      )}
                    >
                      {stage.count}
                    </span>
                  </div>

                  {stage.description && (
                    <p className="text-[0.6875rem] text-[var(--text-tertiary)] truncate leading-tight">
                      {stage.description}
                    </p>
                  )}
                </div>

                {/* Arrow Connector on desktop between items */}
                {idx < stages.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 text-[var(--border-focus)]">
                    <ArrowRight size={13} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
