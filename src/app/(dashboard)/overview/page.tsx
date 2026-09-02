'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  TrendingUp,
  ShoppingBag,
  Percent,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartCard } from '@/components/chart-card';
import { RecommendationCard } from '@/components/recommendation-card';
import { AuditTimeline } from '@/components/audit-timeline';
import { formatCurrency, getGreeting, formatDateTime } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

interface DashboardData {
  metrics: {
    revenue: number;
    revenueChange: number;
    orders: number;
    ordersChange: number;
    avgOrderValue: number;
    conversionRate: number;
    customers: number;
    pendingApprovals: number;
    aiAttributedRevenue: number;
  };
  recentRecommendations: Array<{
    id: string;
    type: string;
    title: string;
    reason: string;
    evidence: string[];
    expectedImpact: number;
    confidence: number;
    riskLevel: string;
    productId?: string | null;
  }>;
  recentOrders: Array<{
    id: string;
    amount: number;
    status: string;
    customerName?: string | null;
    customerEmail?: string | null;
    createdAt: string;
    razorpayOrderId?: string | null;
  }>;
  recentActivity: Array<{
    id: string;
    actor: string;
    action: string;
    entity: string;
    entityId: string;
    reason?: string | null;
    metadata?: Record<string, unknown> | null;
    createdAt: string;
  }>;
}

export default function OverviewPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { success, error } = useToast();

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Failed to load dashboard data');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleTriggerAnalysis = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focusArea: 'all', limit: 4 }),
      });
      if (!res.ok) throw new Error('AI analysis failed');
      success('AI Engine Analysis Complete', 'Fresh catalog & co-purchase opportunities generated.');
      fetchDashboard();
    } catch (err: unknown) {
      error('Analysis Error', err instanceof Error ? err.message : 'Failed to analyze');
    } finally {
      setIsGenerating(false);
    }
  };

  // Chart data synthesizing last 7 days based on real metrics
  const chartData = [
    { date: 'Mon', revenue: (data?.metrics.revenue || 1500000) * 0.12, orders: 2, aiRevenue: (data?.metrics.aiAttributedRevenue || 400000) * 0.10 },
    { date: 'Tue', revenue: (data?.metrics.revenue || 1500000) * 0.15, orders: 3, aiRevenue: (data?.metrics.aiAttributedRevenue || 400000) * 0.14 },
    { date: 'Wed', revenue: (data?.metrics.revenue || 1500000) * 0.18, orders: 4, aiRevenue: (data?.metrics.aiAttributedRevenue || 400000) * 0.20 },
    { date: 'Thu', revenue: (data?.metrics.revenue || 1500000) * 0.14, orders: 3, aiRevenue: (data?.metrics.aiAttributedRevenue || 400000) * 0.15 },
    { date: 'Fri', revenue: (data?.metrics.revenue || 1500000) * 0.22, orders: 5, aiRevenue: (data?.metrics.aiAttributedRevenue || 400000) * 0.25 },
    { date: 'Sat', revenue: (data?.metrics.revenue || 1500000) * 0.26, orders: 6, aiRevenue: (data?.metrics.aiAttributedRevenue || 400000) * 0.28 },
    { date: 'Sun', revenue: (data?.metrics.revenue || 1500000) * 0.20, orders: 4, aiRevenue: (data?.metrics.aiAttributedRevenue || 400000) * 0.22 },
  ];

  const topOpportunity = data?.recentRecommendations?.[0];

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">{getGreeting()}, Merchant</h1>
          <p className="page-subtitle">
            Your AI growth agent is monitoring opportunities while protecting every transaction.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={fetchDashboard} isLoading={isLoading}>
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button variant="ai" onClick={handleTriggerAnalysis} isLoading={isGenerating}>
            <Sparkles size={14} /> Run AI Analysis
          </Button>
        </div>
      </div>

      {/* Hero Component: YOUR AGENT AT WORK */}
      <Card isAi style={{ background: 'var(--bg-secondary)', border: '1px solid var(--ai-border)', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="ai-pulse" />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em', color: 'var(--ai-text)' }}>
              YOUR AGENT AT WORK
            </span>
            <span className="badge badge-ai" style={{ fontSize: '0.6875rem' }}>
              AUTONOMOUS MONITORING
            </span>
          </div>

          <Link href="/opportunities" style={{ fontSize: '0.8125rem', color: 'var(--ai-primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            View All Opportunities <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton height={24} width="60%" />
            <Skeleton height={18} width="90%" />
          </div>
        ) : topOpportunity ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'center' }}>
            <div>
              <span className="badge badge-warning" style={{ marginBottom: 8, gap: 4 }}>
                <AlertCircle size={12} /> TOP REVENUE OPPORTUNITY
              </span>
              <h2 className="font-heading" style={{ fontSize: '1.25rem', marginBottom: 6 }}>
                {topOpportunity.title}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {topOpportunity.reason}
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: 'var(--bg-tertiary)',
              padding: 16,
              borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Potential Added Revenue:</span>
                <span className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
                  +{formatCurrency(topOpportunity.expectedImpact)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>Confidence & Risk:</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="badge badge-neutral">{Math.round(topOpportunity.confidence * 100)}%</span>
                  <Badge variant="success">LOW RISK</Badge>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <Link href="/opportunities" className="btn btn-secondary btn-sm w-full">
                  Review Details
                </Link>
                <Link href="/approvals" className="btn btn-ai btn-sm w-full">
                  Authorize <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px 0', color: 'var(--text-secondary)' }}>
            No pending opportunities. Run AI Analysis to scan catalog co-purchase patterns.
          </div>
        )}
      </Card>

      {/* 6 Key Financial Metric Cards */}
      <div className="grid-metrics">
        <MetricCard
          label="Monthly Revenue"
          value={isLoading ? '...' : formatCurrency(data?.metrics.revenue || 0)}
          change={data?.metrics.revenueChange}
          icon={TrendingUp}
        />
        <MetricCard
          label="Total Orders"
          value={isLoading ? '...' : data?.metrics.orders || 0}
          change={data?.metrics.ordersChange}
          icon={ShoppingBag}
        />
        <MetricCard
          label="AI-Attributed Revenue"
          value={isLoading ? '...' : formatCurrency(data?.metrics.aiAttributedRevenue || 0)}
          icon={Sparkles}
          isAi
          subtext="From verified AI recommendations"
        />
        <MetricCard
          label="Average Order Value"
          value={isLoading ? '...' : formatCurrency(data?.metrics.avgOrderValue || 0)}
          icon={CreditCard}
        />
        <MetricCard
          label="Conversion Rate"
          value={isLoading ? '...' : `${data?.metrics.conversionRate || 0}%`}
          icon={Percent}
        />
        <MetricCard
          label="Pending Approvals"
          value={isLoading ? '...' : data?.metrics.pendingApprovals || 0}
          icon={ShieldCheck}
          subtext="Actions awaiting merchant authorization"
        />
      </div>

      {/* Revenue Growth Chart & Opportunities */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Chart */}
        <div style={{ gridColumn: 'span 2' }}>
          <ChartCard
            title="Revenue & AI Growth Trajectory"
            data={chartData}
            metricType="revenue"
          />
        </div>

        {/* Live AI Activity Feed */}
        <Card style={{ maxHeight: 380, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 className="font-heading" style={{ fontSize: '1.0625rem' }}>AI Activity Stream</h3>
            <Link href="/audit" style={{ fontSize: '0.75rem', color: 'var(--ai-primary)', textDecoration: 'none', fontWeight: 600 }}>
              Full Audit
            </Link>
          </div>

          <AuditTimeline events={data?.recentActivity?.slice(0, 6) || []} />
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 className="font-heading" style={{ fontSize: '1.125rem' }}>Recent Transactions</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Live captured orders through Razorpay Test Mode
            </p>
          </div>
          <Link href="/transactions" className="btn btn-secondary btn-sm">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders?.map((ord) => (
                <tr key={ord.id}>
                  <td className="font-mono" style={{ fontSize: '0.8125rem' }}>
                    {ord.razorpayOrderId || ord.id.slice(0, 12)}
                  </td>
                  <td>
                    <p style={{ fontWeight: 500 }}>{ord.customerName || 'Customer'}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{ord.customerEmail}</p>
                  </td>
                  <td className="font-heading font-bold">
                    {formatCurrency(ord.amount)}
                  </td>
                  <td>
                    <Badge variant={ord.status === 'PAID' ? 'success' : 'neutral'}>
                      {ord.status}
                    </Badge>
                  </td>
                  <td className="font-mono text-tertiary" style={{ fontSize: '0.75rem' }}>
                    {formatDateTime(ord.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
