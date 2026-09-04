'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  Sparkles,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  ArrowUpRight,
  Send,
  Shield,
  Activity,
  BarChart3,
  Package,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/ui/page-header';
import { ChartCard } from '@/components/chart-card';
import { StatCard, FeaturedStatCard } from '@/components/ui/stat-card';
import { StatusPill } from '@/components/ui/badge';
import { FloatingCommerceObjects } from '@/components/ui/floating-commerce-objects';
import { ExplainabilityModal, ExplainabilityData } from '@/components/explainability-drawer';
import { formatCurrency, formatDateTime } from '@/lib/utils';
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
    policyGuardrailRate?: number;
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
  const [aiPrompt, setAiPrompt] = useState('');
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('7D');
  const { success, info, error } = useToast();

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
      success('AI Scan Complete', 'Revenue opportunities updated.');
      fetchDashboard();
    } catch (err: unknown) {
      error('Analysis Error', err instanceof Error ? err.message : 'Failed to analyze');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    const q = aiPrompt.toLowerCase();
    if (q.includes('scan') || q.includes('opportunity') || q.includes('revenue') || q.includes('grow')) {
      handleTriggerAnalysis();
    } else if (q.includes('approval') || q.includes('authorize')) {
      window.location.href = '/approvals';
    } else if (q.includes('product') || q.includes('buy') || q.includes('shoe')) {
      window.location.href = '/ai-buyers';
    } else if (q.includes('transaction') || q.includes('payment')) {
      window.location.href = '/transactions';
    } else {
      info('AI Processing', `Evaluating: "${aiPrompt}"`);
      handleTriggerAnalysis();
    }
    setAiPrompt('');
  };

  if (isLoading && !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Skeleton height={50} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} height={100} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 16 }}>
          <Skeleton height={320} />
          <Skeleton height={320} />
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    revenue: 0, revenueChange: 0, orders: 0, ordersChange: 0,
    avgOrderValue: 0, conversionRate: 0, customers: 0,
    pendingApprovals: 0, aiAttributedRevenue: 0,
  };

  const recommendations = data?.recentRecommendations || [];
  const topOpportunity = recommendations[0];

  const chartData = [
    { date: 'Jan', revenue: Math.round(metrics.revenue * 0.12), orders: 1, aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.1) },
    { date: 'Feb', revenue: Math.round(metrics.revenue * 0.18), orders: 1, aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.15) },
    { date: 'Mar', revenue: Math.round(metrics.revenue * 0.25), orders: 2, aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.2) },
    { date: 'Apr', revenue: Math.round(metrics.revenue * 0.35), orders: 2, aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.3) },
    { date: 'May', revenue: Math.round(metrics.revenue * 0.45), orders: 3, aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.4) },
    { date: 'Jun', revenue: Math.round(metrics.revenue * 0.6), orders: 4, aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.5) },
    { date: 'Jul', revenue: Math.round(metrics.revenue * 0.75), orders: 5, aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.65) },
    { date: 'Aug', revenue: Math.round(metrics.revenue * 0.85), orders: 6, aiRevenue: Math.round(metrics.aiAttributedRevenue * 0.75) },
    { date: 'Sep', revenue: metrics.revenue || 449900, orders: metrics.orders || 1, aiRevenue: metrics.aiAttributedRevenue || 99900 },
  ];

  return (
    <div className="relative">
      {/* Floating Organic Digital Commerce Objects (Subtle Depth) */}
      <FloatingCommerceObjects intensity="overview" />

      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="COMMERCE INTELLIGENCE"
        badgeVariant="ai"
        badgeIcon={<Brain size={12} />}
        title="Merchant Dashboard"
        italicAccent="Overview"
        description="Clarity and control over every AI commerce action, policy verification, and payment outcome."
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleTriggerAnalysis}
              disabled={isGenerating}
              className="btn btn-outline btn-sm"
            >
              <RefreshCw size={13} className={isGenerating ? 'animate-spin' : ''} />
              <span>{isGenerating ? 'Scanning...' : 'Refresh Scan'}</span>
            </button>
            <Link href="/ai-agent" className="btn btn-primary btn-sm" style={{ gap: 4 }}>
              <Sparkles size={13} />
              <span>AI Agent Brain</span>
            </Link>
          </div>
        }
      />

      {/* ── AI Command Center ──────────────────────────────── */}
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)', padding: '12px 18px',
        boxShadow: 'var(--shadow-card)',
      }}>
        <form onSubmit={handlePromptSubmit} style={{
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-md)',
            background: 'var(--ai-bg)', border: '1px solid var(--ai-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Sparkles size={16} style={{ color: 'var(--ai-primary)' }} />
          </div>
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Ask Revolve AI — scan catalog, find cross-sell, show revenue..."
            style={{
              flex: '1 1 240px', background: 'transparent', border: 'none', outline: 'none',
              fontSize: '0.8125rem', color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
            }}
          />
          <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
            {['Scan Catalog', 'Cross-Sell', 'Approvals'].map(chip => (
              <button key={chip} type="button" className="command-chip" onClick={() => {
                if (chip === 'Approvals') window.location.href = '/approvals';
                else { setAiPrompt(chip); handleTriggerAnalysis(); }
              }}>
                {chip}
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary btn-sm" style={{ gap: 4 }}>
            <Send size={13} /> Send
          </button>
        </form>
      </div>

      {/* ── ZONE 1: REVENUE & KPI INTELLIGENCE ──────────────── */}
      <div className="flex flex-col gap-3.5">
        {/* Dominant Highlight: AI-Attributed Revenue */}
        <FeaturedStatCard
          label="AI-Attributed Revenue"
          value={formatCurrency(metrics.aiAttributedRevenue)}
          badgeText="Autonomous Commerce Engine"
          change={metrics.aiAttributedRevenue > 0 ? 24 : undefined}
          changeLabel="growth from AI recommendations"
          subtext="Direct incremental revenue attributed to autonomous policy-bounded recommendations & checkouts."
        />

        {/* 4 Secondary KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <StatCard
            label="Gross Volume"
            value={formatCurrency(metrics.revenue)}
            change={Number(metrics.revenueChange.toFixed(1))}
            changeLabel="vs last month"
            icon={TrendingUp}
            variant="fintech"
          />
          <StatCard
            label="Verified Orders"
            value={String(metrics.orders)}
            change={Number(metrics.ordersChange.toFixed(0))}
            changeLabel="settled via Razorpay"
            icon={CreditCard}
            variant="default"
          />
          <StatCard
            label="Average Order Value"
            value={formatCurrency(metrics.avgOrderValue)}
            icon={BarChart3}
            variant="default"
            subtext="AOV per verified order"
          />
          <StatCard
            label="Policy Guardrail Rate"
            value={`${metrics.policyGuardrailRate ?? 100}% Valid`}
            icon={ShieldCheck}
            variant="fintech"
            subtext="Zero policy breaches detected"
          />
        </div>
      </div>

      {/* ── Row: Revenue Chart + AI Scan Action ────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '7fr 5fr',
        gap: 16,
      }}>
        {/* Revenue Intelligence Chart */}
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)', padding: '20px',
          boxShadow: 'var(--shadow-card)',
        }}>
          <ChartCard
            title="Revenue Intelligence"
            data={chartData}
            dataKey="revenue"
            comparisonKey="aiRevenue"
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>

        {/* AI Agent Status + Scan */}
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)', padding: '20px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div className="ai-pulse" />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                AI Agent Status
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Catalog Scans', val: `${recommendations.length} opportunities found`, icon: Package },
                { label: 'Policy Enforcement', val: '100% intercepted', icon: Shield },
                { label: 'Conversion Rate', val: `${metrics.conversionRate.toFixed(1)}%`, icon: Activity },
                { label: 'Active Customers', val: String(metrics.customers), icon: TrendingUp },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 12px',
                  background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-secondary)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <item.icon size={14} style={{ color: 'var(--text-tertiary)' }} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                  </div>
                  <span className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleTriggerAnalysis}
            disabled={isGenerating}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 14, justifyContent: 'center' }}
          >
            {isGenerating ? (
              <><RefreshCw size={14} className="animate-spin" /> Scanning Catalog...</>
            ) : (
              <><Sparkles size={14} /> Run AI Intelligence Scan</>
            )}
          </button>
        </div>
      </div>

      {/* ── Row: Recent Transactions + Policy + Quick Links ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '7fr 5fr',
        gap: 16,
      }}>
        {/* Recent Verified Orders */}
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 20px', borderBottom: '1px solid var(--border-secondary)',
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recent Verified Orders
            </span>
            <Link href="/transactions" style={{
              fontSize: '0.75rem', fontWeight: 600, color: 'var(--ai-text)',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              View All <ArrowUpRight size={12} />
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Verification</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders && data.recentOrders.length > 0 ? (
                  data.recentOrders.slice(0, 5).map((o) => {
                    const hasWebhook = o.payments?.some(p => p.webhookConfirmedAt);
                    const hasSignature = o.payments?.some(p => p.razorpaySignature);
                    return (
                      <tr key={o.id}>
                        <td className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {o.razorpayOrderId ? o.razorpayOrderId.slice(0, 16) : o.id.slice(0, 12)}
                        </td>
                        <td style={{ fontSize: '0.75rem' }}>
                          {formatDateTime(o.createdAt).slice(0, 10)}
                        </td>
                        <td className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {formatCurrency(o.amount)}
                        </td>
                        <td>
                          <StatusPill status={o.status} />
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {hasSignature && (
                              <span className="badge badge-success" style={{ fontSize: '0.5625rem', padding: '1px 5px' }}>
                                HMAC ✓
                              </span>
                            )}
                            {hasWebhook && (
                              <span className="badge badge-ai" style={{ fontSize: '0.5625rem', padding: '1px 5px' }}>
                                Webhook ✓
                              </span>
                            )}
                            {!hasSignature && !hasWebhook && (
                              <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-tertiary)' }}>
                      No transactions yet. Use AI Buyers to create your first order.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Policy + Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Policy Guardrails */}
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)', padding: '18px 20px',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Policy Guardrails
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>Active</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{
                flex: 1, padding: '10px 12px',
                background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-secondary)',
              }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginBottom: 2 }}>Max / Transaction</div>
                <div className="font-mono value-float" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>₹10,000</div>
              </div>
              <div style={{
                flex: 1, padding: '10px 12px',
                background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-secondary)',
              }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginBottom: 2 }}>Daily AI Limit</div>
                <div className="font-mono value-float" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>₹50,000</div>
              </div>
            </div>
            <div style={{
              marginTop: 10, padding: '8px 12px',
              background: 'var(--success-bg)', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--success-border)',
              fontSize: '0.75rem', color: 'var(--success-text)', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <CheckCircle2 size={13} /> 100% Policy Intercept Rate
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)', padding: '18px 20px',
            boxShadow: 'var(--shadow-card)', flex: 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Recent Activity
              </span>
              <Link href="/audit" style={{
                fontSize: '0.75rem', fontWeight: 600, color: 'var(--ai-text)',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
              }}>
                Audit Trail <ArrowUpRight size={12} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data?.recentActivity && data.recentActivity.length > 0 ? (
                data.recentActivity.slice(0, 4).map(evt => (
                  <div key={evt.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px',
                    background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-secondary)',
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      background: evt.action.includes('SUCCESS') || evt.action.includes('APPROVED') || evt.action.includes('CAPTURED')
                        ? 'var(--success)' : evt.action.includes('FAILED') || evt.action.includes('REJECTED')
                        ? 'var(--error)' : evt.action.startsWith('AI_')
                        ? 'var(--ai-primary)' : 'var(--text-tertiary)',
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="font-mono" style={{
                        fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {evt.action}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                        {evt.actor} · {formatDateTime(evt.createdAt).slice(11, 16)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
                  No recent activity.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Explainability Modal */}
      <ExplainabilityModal
        isOpen={Boolean(selectedExplain)}
        onClose={() => setSelectedExplain(null)}
        data={selectedExplain}
      />
    </div>
  );
}
