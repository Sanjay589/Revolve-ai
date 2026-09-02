'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

export interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
  aiRevenue: number;
}

export interface ChartCardProps {
  title: string;
  data: ChartDataPoint[];
  dataKey?: string;
  comparisonKey?: string;
  timeRange?: '7D' | '30D' | '90D';
  onTimeRangeChange?: (range: '7D' | '30D' | '90D') => void;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data,
  dataKey = 'revenue',
  comparisonKey = 'aiRevenue',
  timeRange = '7D',
  onTimeRangeChange,
}) => {
  const formatYAxis = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}k`;
    return `₹${Math.round(val / 100)}`;
  };

  return (
    <div className="editorial-card" style={{ padding: '24px 20px 16px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
      }}>
        <div>
          <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            Gross Payment Volume vs Autonomous AI Attribution
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-primary)' }} />
              Total Revenue
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ai-primary)' }} />
              AI-Attributed
            </span>
          </div>

          {/* Time Filter Pills */}
          {onTimeRangeChange && (
            <div style={{
              display: 'flex',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              padding: 2,
              border: '1px solid var(--border-primary)',
            }}>
              {(['7D', '30D', '90D'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => onTimeRangeChange(t)}
                  style={{
                    padding: '3px 9px',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: timeRange === t ? 'var(--bg-secondary)' : 'transparent',
                    color: timeRange === t ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    boxShadow: timeRange === t ? 'var(--shadow-xs)' : 'none',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--text-primary)" stopOpacity={0.08} />
                <stop offset="95%" stopColor="var(--text-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--ai-primary)" stopOpacity={0.16} />
                <stop offset="95%" stopColor="var(--ai-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="var(--border-secondary)" />
            <XAxis
              dataKey="date"
              stroke="var(--text-tertiary)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--text-tertiary)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
                borderRadius: '10px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                boxShadow: 'var(--shadow-md)',
              }}
              formatter={(val: unknown) => [
                typeof val === 'number' ? formatCurrency(val) : String(val),
              ]}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              name="Total Revenue"
              stroke="var(--text-primary)"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
            <Area
              type="monotone"
              dataKey={comparisonKey}
              name="AI-Attributed Revenue"
              stroke="var(--ai-primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAi)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
