import React from 'react';
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  isAi?: boolean;
  subtext?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  changeLabel = 'vs last period',
  icon: Icon,
  isAi,
  subtext,
}) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className={`metric-card ${isAi ? 'ai-card' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span className="metric-label">{label}</span>
        {Icon && (
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-md)',
            background: isAi ? 'var(--ai-bg)' : 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon size={16} color={isAi ? 'var(--ai-primary)' : 'var(--text-secondary)'} />
          </div>
        )}
      </div>
      <div className="metric-value">{value}</div>
      {change !== undefined && (
        <div className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{Math.abs(change)}%</span>
          <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, marginLeft: 4 }}>
            {changeLabel}
          </span>
        </div>
      )}
      {subtext && (
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 6 }}>
          {subtext}
        </div>
      )}
    </div>
  );
};
