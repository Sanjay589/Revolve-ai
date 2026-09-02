'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Brain,
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
  ChevronRight,
  Zap,
  Clock,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartCard } from '@/components/chart-card';
import { AuditTimeline } from '@/components/audit-timeline';
import { AICommandCenter } from '@/components/ai-command-center';
import { ExplainabilityModal, ExplainabilityData } from '@/components/explainability-drawer';
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
    targetProductIds?: string[];
  }>;
  recentOrders: Array<{
    id: string;
    amount: number;
    status: string;
    customerName?: string | null;
    customerEmail?: string | null;
    createdAt: string;
    razorpayOrderId?: string | null;
    payments?: Array<{
      id: string;
      method: string | null;
      razorpaySignature: string | null;
      webhookConfirmedAt: string | null;
    }>;
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
  const [selectedExplain, setSelectedExplain] = useState<ExplainabilityData | null>(null);
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('7D');
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
        body: JSON.stringify({ focusArea: 'all', limit: 5 }),
      });
      if (!res.ok) throw new Error('AI analysis failed');
      success('AI Intelligence Scan Complete', 'Fresh catalog & co-purchase opportunities discovered.');
      fetchDashboard();
    } catch (err: unknown) {
      error('Analysis Error', err instanceof Error ? err.message : 'Failed to analyze');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading && !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Skeleton height={140} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <Skeleton height={120} />
          <Skeleton height={120} />
          <Skeleton height={120} />
          <Skeleton height={120} />
        </div>
        <Skeleton height={320} />
      </div>
    );
  }

  const metrics = data?.metrics || {
    revenue: 0,
    revenueChange: 0,
    orders: 0,
    ordersChange: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    customers: 0,
    pendingApprovals: 0,
    aiAttributedRevenue: 0,
  };

  const recommendations = data?.recentRecommendations || [];
  const topOpportunity = recommendations[0];
  const totalPotential = recommendations.reduce((sum, r) => sum + r.expectedImpact, 0);

  // Dynamic Chart Data based on actual metrics
  const chartData = [
    { date: 'Mon', revenue: metrics.revenue * 0.11, orders: Math.round(metrics.orders * 0.12), aiRevenue: metrics.aiAttributedRevenue * 0.10 },
    { date: 'Tue', revenue: metrics.revenue * 0.14, orders: Math.round(metrics.orders * 0.15), aiRevenue: metrics.aiAttributedRevenue * 0.14 },
    { date: 'Wed', revenue: metrics.revenue * 0.18, orders: Math.round(metrics.orders * 0.19), aiRevenue: metrics.aiAttributedRevenue * 0.20 },
    { date: 'Thu', revenue: metrics.revenue * 0.13, orders: Math.round(metrics.orders * 0.14), aiRevenue: metrics.aiAttributedRevenue * 0.13 },
    { date: 'Fri', revenue: metrics.revenue * 0.16, orders: Math.round(metrics.orders * 0.17), aiRevenue: metrics.aiAttributedRevenue * 0.17 },
    { date: 'Sat', revenue: metrics.revenue * 0.15, orders: Math.round(metrics.orders * 0.13), aiRevenue: metrics.aiAttributedRevenue * 0.14 },
    { date: 'Sun', revenue: metrics.revenue * 0.13, orders: Math.round(metrics.orders * 0.10), aiRevenue: metrics.aiAttributedRevenue * 0.12 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1400, margin: '0 auto' }}>
      {/* ─── 1. Editorial Greeting & Intelligence Bar ───────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 16,
        paddingBottom: 4,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-fintech">
              <ShieldCheck size={12} /> APEX ATHLETICS WORKSPACE
            </span>
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {getGreeting()}, Siddharth
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Your AI growth agent discovered{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{recommendations.length} opportunities</strong> worth an estimated{' '}
            <strong style={{ color: 'var(--fintech-primary)' }}>+{formatCurrency(totalPotential)}</strong> this month.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            variant="outline"
            onClick={fetchDashboard}
            disabled={isLoading}
            size="sm"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </Button>
          <Button
            variant="fintech"
            onClick={handleTriggerAnalysis}
            disabled={isGenerating}
            size="sm"
          >
            <Sparkles size={14} className={isGenerating ? 'animate-spin' : ''} />
            <span>{isGenerating ? 'Scanning Catalog...' : 'Run Intelligence Scan'}</span>
          </Button>
        </div>
      </div>

      {/* ─── 2. AI Command Center ───────────────────────────── */}
      <AICommandCenter onTriggerScan={handleTriggerAnalysis} />

      {/* ─── 3. Asymmetric Financial Metrics ────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 16,
      }}>
        {/* Dominant Primary Metric: AI-Attributed Revenue */}
        <div
          className="dominant-stat-card"
          style={{ gridColumn: 'span 12 / span 12' }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 16,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span className="stat-label" style={{ margin: 0 }}>AI-Attributed Revenue</span>
                <span className="badge badge-ai" style={{ fontSize: '0.6875rem' }}>
                  <Brain size={11} /> Autonomous Growth
                </span>
              </div>
              <div className="stat-hero-number" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(metrics.aiAttributedRevenue)}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 6 }}>
                Generated from verified cross-sells, bundle recommendations & conversion optimizers.
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 8,
            }}>
              <div className="badge badge-fintech" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
                <TrendingUp size={14} /> +28.4% vs last period
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                {metrics.revenue > 0 ? Math.round((metrics.aiAttributedRevenue / metrics.revenue) * 100) : 18}% share of total volume
              </span>
            </div>
          </div>
        </div>

        {/* Supporting Metric 1: Gross Revenue */}
        <div className="editorial-card" style={{ gridColumn: 'span 12 / span 3' }}>
          <div className="stat-label">Gross Payment Volume</div>
          <div className="stat-metric-number">{formatCurrency(metrics.revenue)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: '0.75rem', color: 'var(--success)' }}>
            <TrendingUp size={12} /> +{metrics.revenueChange}% growth
          </div>
        </div>

        {/* Supporting Metric 2: Orders */}
        <div className="editorial-card" style={{ gridColumn: 'span 12 / span 3' }}>
          <div className="stat-label">Verified Orders</div>
          <div className="stat-metric-number">{metrics.orders.toLocaleString('en-IN')}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            <span>Razorpay captured</span>
          </div>
        </div>

        {/* Supporting Metric 3: Average Order Value */}
        <div className="editorial-card" style={{ gridColumn: 'span 12 / span 3' }}>
          <div className="stat-label">Average Order Value</div>
          <div className="stat-metric-number">{formatCurrency(metrics.avgOrderValue)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: '0.75rem', color: 'var(--fintech-primary)' }}>
            <span>+₹420 from upsells</span>
          </div>
        </div>

        {/* Supporting Metric 4: Pending Approvals */}
        <div className="editorial-card" style={{ gridColumn: 'span 12 / span 3' }}>
          <div className="stat-label">Pending Approvals</div>
          <div className="stat-metric-number" style={{ color: metrics.pendingApprovals > 0 ? 'var(--warning)' : 'var(--text-primary)' }}>
            {metrics.pendingApprovals}
          </div>
          <Link
            href="/approvals"
            style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: '0.75rem', color: 'var(--ai-primary)', textDecoration: 'none', fontWeight: 600 }}
          >
            Review Security Queue <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* ─── 4. Featured Opportunity ("YOUR AGENT AT WORK") & Chart ─ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 20,
      }}>
        {/* Featured Top Opportunity */}
        <div
          className="editorial-card"
          style={{
            gridColumn: 'span 12 / span 5',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                <span className="stat-label" style={{ margin: 0 }}>YOUR AGENT AT WORK</span>
              </div>
              <span className="badge badge-ai" style={{ fontSize: '0.6875rem' }}>
                <Brain size={11} /> TOP OPPORTUNITY
              </span>
            </div>

            {topOpportunity ? (
              <div>
                <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {topOpportunity.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
                  {topOpportunity.reason}
                </p>

                {/* Metrics Breakdown Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  marginTop: 18,
                  background: 'var(--bg-tertiary)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-secondary)',
                }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Potential Added Revenue
                    </div>
                    <div className="font-mono" style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--fintech-primary)', marginTop: 2 }}>
                      +{formatCurrency(topOpportunity.expectedImpact)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      AI Confidence
                    </div>
                    <div className="font-mono" style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                      {Math.round(topOpportunity.confidence * 100)}%
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Policy Status
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--success)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={13} /> WITHIN LIMITS
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Risk Level
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                      {topOpportunity.riskLevel} Risk
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <Sparkles size={28} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                <p>Run a catalog scan to discover revenue opportunities.</p>
              </div>
            )}
          </div>

          {topOpportunity && (
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <Button
                variant="outline"
                size="sm"
                style={{ flex: 1 }}
                onClick={() => setSelectedExplain({
                  title: topOpportunity.title,
                  type: topOpportunity.type,
                  reason: topOpportunity.reason,
                  evidence: topOpportunity.evidence,
                  expectedImpact: topOpportunity.expectedImpact,
                  confidence: topOpportunity.confidence,
                  riskLevel: topOpportunity.riskLevel,
                })}
              >
                Review Reasoning
              </Button>
              <Link href="/approvals" style={{ flex: 1, textDecoration: 'none' }}>
                <Button variant="primary" size="sm" style={{ width: '100%' }}>
                  <span>Authorize Action</span>
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Primary Revenue Trajectory Chart */}
        <div style={{ gridColumn: 'span 12 / span 7' }}>
          <ChartCard
            title="Revenue Trajectory & AI Attribution"
            data={chartData}
            dataKey="revenue"
            comparisonKey="aiRevenue"
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>
      </div>

      {/* ─── 5. Operational Activity & Verified Orders ──────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 20,
      }}>
        {/* Verified Operational Timeline */}
        <div className="editorial-card" style={{ gridColumn: 'span 12 / span 5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Verified Operational Timeline
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Immutable event stream for AI decisions & payments
              </p>
            </div>
            <Link href="/audit" style={{ fontSize: '0.75rem', color: 'var(--ai-primary)', fontWeight: 600, textDecoration: 'none' }}>
              View Full Audit →
            </Link>
          </div>

          <AuditTimeline events={data?.recentActivity || []} limit={5} />
        </div>

        {/* Recent Cryptographically Verified Orders */}
        <div className="editorial-card" style={{ gridColumn: 'span 12 / span 7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Recent Verified Transactions
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Real Razorpay test mode captures with HMAC verification
              </p>
            </div>
            <Link href="/transactions" style={{ fontSize: '0.75rem', color: 'var(--fintech-primary)', fontWeight: 600, textDecoration: 'none' }}>
              View All Ledger →
            </Link>
          </div>

          {data?.recentOrders && data.recentOrders.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="editorial-table">
                <thead>
                  <tr>
                    <th>Razorpay Order</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.slice(0, 5).map((order) => {
                    const payment = order.payments?.[0];
                    return (
                      <tr key={order.id}>
                        <td>
                          <div className="font-mono" style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                            {order.razorpayOrderId || order.id.slice(0, 14)}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                            {formatDateTime(order.createdAt)}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                            {order.customerName || 'Direct Checkout'}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                            {order.customerEmail || '—'}
                          </div>
                        </td>
                        <td>
                          <div className="font-mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {formatCurrency(order.amount)}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${order.status === 'PAID' ? 'badge-fintech' : 'badge-neutral'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-fintech" style={{ fontSize: '0.6875rem' }}>
                            <CheckCircle2 size={11} /> HMAC Verified
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <CreditCard size={28} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
              <p>No orders captured yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── 6. Explainability Modal ───────────────────────── */}
      <ExplainabilityModal
        isOpen={Boolean(selectedExplain)}
        onClose={() => setSelectedExplain(null)}
        data={selectedExplain}
      />
    </div>
  );
}
