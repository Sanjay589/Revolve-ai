import React from 'react';
import { Sparkles } from 'lucide-react';

export interface AIBadgeProps {
  label?: string;
  size?: 'sm' | 'md';
}

export const AIBadge: React.FC<AIBadgeProps> = ({ label = 'AI AGENT', size = 'sm' }) => {
  return (
    <span
      className="badge badge-ai"
      style={{
        fontSize: size === 'sm' ? '0.6875rem' : '0.75rem',
        letterSpacing: '0.04em',
        fontWeight: 600,
      }}
    >
      <Sparkles size={size === 'sm' ? 10 : 12} />
      {label}
    </span>
  );
};
