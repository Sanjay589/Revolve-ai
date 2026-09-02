import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'fintech' | 'ai' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const variantClass = {
      primary: 'btn-primary',
      secondary: 'btn-outline',
      outline: 'btn-outline',
      fintech: 'btn-fintech',
      ai: 'badge-ai',
      success: 'badge-fintech',
      danger: 'btn-primary',
      ghost: 'btn-ghost',
    }[variant];

    const sizeClass = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
      icon: 'btn-icon',
    }[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn('btn', variantClass, sizeClass, className)}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin" size={16} />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
