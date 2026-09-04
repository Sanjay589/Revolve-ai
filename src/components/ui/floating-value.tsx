'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface FloatingValueProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  font?: 'heading' | 'mono';
  companion?: React.ReactNode;
  companionPosition?: 'right' | 'below';
}

const SIZE_CLASSES = {
  sm: 'text-sm font-bold',
  md: 'text-base font-bold',
  lg: 'text-xl font-bold',
  xl: 'text-2xl font-extrabold',
  '2xl': 'text-[1.75rem] font-extrabold',
  '3xl': 'text-3xl md:text-4xl font-extrabold',
  '4xl': 'text-4xl md:text-5xl font-extrabold',
};

/**
 * Section 2. Floating Value Treatment for Monetary Figures
 * Gives primary monetary values their own static elevated visual z-layer
 * via a soft stacked multi-stop drop shadow.
 * Purely static — no hover lift or transform.
 */
export const FloatingValue: React.FC<FloatingValueProps> = ({
  value,
  size = '2xl',
  font = 'heading',
  companion,
  companionPosition = 'right',
  className,
  ...props
}) => {
  const fontClass = font === 'heading' ? 'font-heading' : 'font-mono';

  return (
    <div
      className={cn(
        'inline-flex items-baseline gap-2.5',
        companionPosition === 'below' && 'flex-col items-start gap-1',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'value-float text-[var(--text-primary)] tracking-tight leading-none',
          fontClass,
          SIZE_CLASSES[size]
        )}
      >
        {value}
      </span>

      {companion && (
        <span className="companion-float">
          {companion}
        </span>
      )}
    </div>
  );
};

// Export StatValue alias per Section 2 specification
export const StatValue = FloatingValue;
export type StatValueProps = FloatingValueProps;
