import React from 'react';
import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'elevated' | 'interactive' | 'featured' | 'ai' | 'success' | 'warning' | 'danger';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  compact?: boolean;
  isAi?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', compact, isAi, children, ...props }, ref) => {
    const variantClass = {
      default: '',
      elevated: 'card-elevated',
      interactive: 'card-interactive',
      featured: 'card-featured',
      ai: 'card-ai',
      success: 'card-success',
      warning: 'card-warning',
      danger: 'card-danger',
    }[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'card',
          variantClass,
          compact && 'card-compact',
          isAi && 'card-ai',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
