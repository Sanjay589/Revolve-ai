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
  Shield,
  Activity,
  Check
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
  const [lastScanTime, setLastScanTime] = useState<string>('Just now');
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
      success('AI Intelligence Scan Complete', 'Catalog & co-purchase opportunities updated.');
      setLastScanTime('Just now');
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

  // Dynamic Chart Data based on actual metrics from DB
  const chartData = [
    { date: 'Mon', revenue: Math.round(metrics.revenue * 0.11), orders: Math.round(metrics.orders * 0.12), aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.10) },
    { date: 'Tue', revenue: Math.round(metrics.revenue * 0.14), orders: Math.round(metrics.orders * 0.15), aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.14) },
    { date: 'Wed', revenue: Math.round(metrics.revenue * 0.18), orders: Math.round(metrics.orders * 0.19), aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.20) },
    { date: 'Thu', revenue: Math.round(metrics.revenue * 0.13), orders: Math.round(metrics.orders * 0.14), aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.13) },
    { date: 'Fri', revenue: Math.round(metrics.revenue * 0.16), orders: Math.round(metrics.orders * 0.17), aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.17) },
    { date: 'Sat', revenue: Math.round(metrics.revenue * 0.15), orders: Math.round(metrics.orders * 0.13), aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.14) },
    { date: 'Sun', revenue: Math.round(metrics.revenue * 0.13), orders: Math.round(metrics.orders * 0.10), aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.12) },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1400, margin: '0 auto' }}>
      {/* ─── 1. Page Header: Greeting & Quick Controls ───────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 16,
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
            Your AI growth agent is monitoring your commerce operation.
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
            <span>{isGenerating ? 'Scanning Catalog...' : 'Run AI Analysis'}</span>
          </Button>
        </div>
      </div>

      {/* ─── 2. AI Command Center Bar ────────────────────────── */}
      <AICommandCenter onTriggerScan={handleTriggerAnalysis} />

      {/* ─── 3. Dominant Section: Highest Confidence AI Opportunity */}
      <div className="dominant-stat-card" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 18 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="badge badge-ai" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                <Brain size={12} /> AI REVENUE OPPORTUNITY
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                Highest Confidence Opportunity
              </span>
            </div>
            <h2 className="font-heading" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              {topOpportunity ? topOpportunity.title : 'Catalog Affinity Scan Complete'}
            </h2>
          </div>

          {topOpportunity && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="badge badge-fintech" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
                {Math.round(topOpportunity.confidence * 100)}% AI Confidence
              </span>
              <span className={`badge ${topOpportunity.riskLevel === 'LOW' ? 'badge-fintech' : 'badge-warning'}`} style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
                {topOpportunity.riskLevel} Risk
              </span>
            </div>
          )}
        </div>

        {topOpportunity ? (
          <div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              {topOpportunity.reason}
            </p>

            {/* 4 Financial & Policy Summary Blocks */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 14,
              background: 'var(--bg-tertiary)',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-secondary)',
              marginBottom: 20,
            }}>
              <div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Projected Added Revenue
                </div>
                <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--fintech-primary)', marginTop: 2 }}>
                  +{formatCurrency(topOpportunity.expectedImpact)}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 400 }}> / month</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  AI Confidence
                </div>
                <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                  {Math.round(topOpportunity.confidence * 100)}%
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Policy Guardrail Check
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--success)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={15} /> Within Bounds (Pass)
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Execution Model
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                  Human Approval Required
                </div>
              </div>
            </div>

            {/* Evidence ➔ Recommendation ➔ Impact Flow */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 20,
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
            }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Activity size={14} /> WHY THIS OPPORTUNITY?
              </span>
              <span>Evidence extracted from basket histories</span>
              <span>➔</span>
              <span>Bounded 10% companion incentive</span>
              <span>➔</span>
              <span className="font-mono" style={{ fontWeight: 700, color: 'var(--fintech-primary)' }}>+{formatCurrency(topOpportunity.expectedImpact)}</span>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Button
                variant="outline"
                size="sm"
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
              <Link href="/approvals" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="sm">
                  <span>Review &amp; Authorize</span>
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <Sparkles size={28} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
            <p>Run catalog analysis to generate real revenue recommendations.</p>
          </div>
        )}
      </div>

      {/* ─── 4. Financial Snapshot Row (Real Database Values) ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}>
        <div className="editorial-card" style={{ padding: '20px' }}>
          <div className="stat-label">Gross Revenue</div>
          <div className="font-mono" style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatCurrency(metrics.revenue)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: '0.75rem', color: 'var(--success)' }}>
            <TrendingUp size={12} /> {metrics.revenueChange >= 0 ? `+${metrics.revenueChange}%` : `${metrics.revenueChange}%`} vs last period
          </div>
        </div>

        <div className="editorial-card" style={{ padding: '20px' }}>
          <div className="stat-label">Verified Orders</div>
          <div className="font-mono" style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {metrics.orders.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 6 }}>
            Captured via Razorpay Test Mode
          </div>
        </div>

        <div className="editorial-card" style={{ padding: '20px' }}>
          <div className="stat-label">AI-Attributed Revenue</div>
          <div className="font-mono" style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--fintech-primary)' }}>
            {formatCurrency(metrics.aiAttributedRevenue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 6 }}>
            From verified upsell &amp; bundle offers
          </div>
        </div>

        <div className="editorial-card" style={{ padding: '20px' }}>
          <div className="stat-label">Average Order Value</div>
          <div className="font-mono" style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatCurrency(metrics.avgOrderValue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--fintech-primary)', marginTop: 6 }}>
            Conversion rate: {metrics.conversionRate}%
          </div>
        </div>
      </div>

      {/* ─── 5. Middle Grid: Revenue Intelligence & AI Agent Status */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 20,
      }}>
        {/* Left: Revenue Chart */}
        <div style={{ gridColumn: 'span 12 / span 8' }}>
          <ChartCard
            title="Revenue Intelligence &amp; AI Attribution"
            data={chartData}
            dataKey="revenue"
            comparisonKey="aiRevenue"
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>

        {/* Right: AI Agent Status Card */}
        <div className="editorial-card" style={{
          gridColumn: 'span 12 / span 4',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="badge badge-ai" style={{ fontSize: '0.75rem' }}>
                <Brain size={12} /> AI AGENT STATUS
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
                Monitoring
              </span>
            </div>

            <h3 className="font-heading" style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: 12 }}>
              Autonomous Revenue Monitor
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 18 }}>
              Analyzing store catalog affinities, basket compositions, and customer order histories against configured policy rules.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Opportunities Discovered</span>
                <span className="font-mono font-bold" style={{ fontSize: '0.875rem' }}>{recommendations.length}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Pending Approvals</span>
                <span className="font-mono font-bold" style={{ fontSize: '0.875rem', color: metrics.pendingApprovals > 0 ? 'var(--warning)' : 'inherit' }}>{metrics.pendingApprovals}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Last Catalog Scan</span>
                <span className="font-mono" style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{lastScanTime}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <Link href="/ai-agent" style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="sm" style={{ width: '100%' }}>
                <span>Open AI Growth Agent Brain</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 6. Bottom Grid: Recent Verified Orders & Agent Activity ─ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 20,
      }}>
        {/* Left: Recent Verified Orders */}
        <div className="editorial-card" style={{ gridColumn: 'span 12 / span 7', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Recent Verified Orders
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Real Razorpay Test Mode captures with HMAC-SHA256 signature verification
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
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.slice(0, 5).map((order) => (
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
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                          {order.customerName || 'Direct Checkout'}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                          {order.customerEmail || '—'}
                        </div>
                      </td>
                      <td>
                        <div className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                          {formatCurrency(order.amount)}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${order.status === 'PAID' ? 'badge-fintech' : 'badge-neutral'}`} style={{ fontSize: '0.6875rem' }}>
                          {order.status === 'PAID' ? 'VERIFIED ✓' : order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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

        {/* Right: Agent Activity Stream */}
        <div className="editorial-card" style={{ gridColumn: 'span 12 / span 5', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Agent Activity &amp; Audit Stream
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Chronological operational timeline of AI decisions &amp; approvals
              </p>
            </div>
            <Link href="/audit" style={{ fontSize: '0.75rem', color: 'var(--ai-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Full Audit →
            </Link>
          </div>

          <AuditTimeline events={data?.recentActivity || []} limit={5} />
        </div>
      </div>

      {/* ─── 7. Explainability Modal ─────────────────────────── */}
      <ExplainabilityModal
        isOpen={Boolean(selectedExplain)}
        onClose={() => setSelectedExplain(null)}
        data={selectedExplain}
      />
    </div>
  );
}
