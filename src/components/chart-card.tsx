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
import { Card } from '@/components/ui/card';
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
  metricType?: 'revenue' | 'orders' | 'aiRevenue';
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data,
  metricType = 'revenue',
}) => {
  const isRevenue = metricType === 'revenue' || metricType === 'aiRevenue';

  const formatYAxis = (val: number) => {
    if (isRevenue) {
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(0)}k`;
      return `₹${val / 100}`;
    }
    return val.toString();
  };

  return (
    <Card style={{ padding: '20px 16px 12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '0 8px' }}>
        <h3 className="font-heading" style={{ fontSize: '1.0625rem' }}>{title}</h3>
        <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-primary)' }} />
            Total Revenue
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ai-primary)' }} />
            AI-Attributed
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--text-primary)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--text-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--ai-primary)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--ai-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-secondary)" />
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
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: 'var(--shadow-md)',
              }}
              formatter={(val: unknown) => [
                typeof val === 'number' && isRevenue ? formatCurrency(val) : String(val),
              ]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Total Revenue"
              stroke="var(--text-primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
            <Area
              type="monotone"
              dataKey="aiRevenue"
              name="AI Attributed"
              stroke="var(--ai-primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAi)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
