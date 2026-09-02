import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
  isAi?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, compact, isAi, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('card', compact && 'card-compact', isAi && 'ai-card', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
