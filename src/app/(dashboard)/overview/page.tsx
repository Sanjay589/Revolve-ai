'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  Sparkles,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Plus,
  ArrowUpRight,
  Send,
  Zap,
  Shield,
  Sliders,
  Eye,
  Activity,
  Calendar,
  Lock,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartCard } from '@/components/chart-card';
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
      success('AI Intelligence Scan Complete', 'Catalog affinities and revenue opportunities updated.');
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
      info('AI Processing', `Evaluating query: "${aiPrompt}"`);
      handleTriggerAnalysis();
    }
    setAiPrompt('');
  };

  if (isLoading && !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
          <div style={{ gridColumn: 'span 5' }}><Skeleton height={140} /></div>
          <div style={{ gridColumn: 'span 3' }}><Skeleton height={140} /></div>
          <div style={{ gridColumn: 'span 4' }}><Skeleton height={140} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
          <div style={{ gridColumn: 'span 6' }}><Skeleton height={320} /></div>
          <div style={{ gridColumn: 'span 6' }}><Skeleton height={320} /></div>
        </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* ══════════════════════════════════════════════════════════
          ROW 1: Financial Snapshot | Finance Score | Available Balance
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 16,
      }}>
        {/* Left Card: Financial Snapshot (5 cols) */}
        <div className="fintech-card" style={{ gridColumn: 'span 12 / span 5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Financial Snapshot
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              Customize View <ChevronDown size={12} />
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                Total Income
              </div>
              <div className="font-mono" style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                {formatCurrency(metrics.revenue)}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 600, marginTop: 2 }}>
                ▲ +12.07%
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                AI Attributed
              </div>
              <div className="font-mono" style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                {formatCurrency(metrics.aiAttributedRevenue)}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 600, marginTop: 2 }}>
                ▲ +18.4%
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0284c7' }} />
                Verified Orders
              </div>
              <div className="font-mono" style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                {metrics.orders} Captured
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#10b981', fontWeight: 600, marginTop: 2 }}>
                ▲ +22.08%
              </div>
            </div>
          </div>
        </div>

        {/* Center Card: Finance Score (3 cols) */}
        <div className="fintech-card" style={{ gridColumn: 'span 12 / span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Policy Score
            </span>
            <MoreVertical size={14} style={{ color: 'var(--text-tertiary)', cursor: 'pointer' }} />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Guardrail Quality</span>
              <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>98%</span>
            </div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#10b981', marginBottom: 8 }}>
              Optimal (100% Policy Bound)
            </div>
            {/* Progress Bar */}
            <div style={{ width: '100%', height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: '98%', height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: 4 }} />
            </div>
          </div>
        </div>

        {/* Right Card: Available Balance Hero Gradient (4 cols) */}
        <div className="fintech-hero-card" style={{ gridColumn: 'span 12 / span 4', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, opacity: 0.9 }}>
              Captured Commerce Balance
            </span>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Plus size={14} />
            </div>
          </div>

          <div>
            <div className="font-mono" style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {formatCurrency(metrics.revenue)}
              <span style={{ fontSize: '0.875rem', fontWeight: 500, opacity: 0.85, marginLeft: 4 }}>INR</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button
              onClick={handleTriggerAnalysis}
              disabled={isGenerating}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Sparkles size={13} className={isGenerating ? 'animate-spin' : ''} />
              <span>{isGenerating ? 'Scanning...' : 'Scan Catalog'}</span>
            </button>

            <Link href="/approvals" style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}>
              <span>Authorize ({metrics.pendingApprovals})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ROW 2: AI Assistant Command Center | Cash Flow Trajectory
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 16,
      }}>
        {/* Left Card: AI Assistant (6 cols) */}
        <div className="ai-assistant-container" style={{ gridColumn: 'span 12 / span 6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                AI Assistant
              </span>
              <MoreVertical size={14} style={{ color: 'var(--text-tertiary)', cursor: 'pointer' }} />
            </div>

            {/* Glowing Orange Orb from FinPilot Reference */}
            <div className="ai-orb-graphic">
              <Sparkles size={28} color="#ffffff" />
            </div>

            <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
              How can Revolve AI help you today?
            </h3>

            {/* 6 Action Chips (Exact Reference Style) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 18 }}>
              {[
                { label: 'Show revenue flow', action: () => setAiPrompt('Show revenue flow') },
                { label: 'Find cross-sell', action: () => setAiPrompt('Find cross-sell opportunities') },
                { label: 'Review approvals', action: () => { window.location.href = '/approvals'; } },
                { label: 'Show failed payments', action: () => { window.location.href = '/transactions'; } },
                { label: 'Detect catalog anomalies', action: handleTriggerAnalysis },
                { label: 'More options', action: () => { window.location.href = '/ai-agent'; } },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.action}
                  className="fintech-chip"
                >
                  <Sparkles size={11} color="#ea580c" />
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Prompt Input Bar with Send Button */}
          <form onSubmit={handlePromptSubmit} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)',
            padding: '6px 8px 6px 14px',
          }}>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask Revolve AI anything about your commerce..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.8125rem',
                color: 'var(--text-primary)',
                width: '100%',
                fontFamily: 'var(--font-body)',
              }}
            />
            <button
              type="submit"
              className="btn-coral"
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
              }}
            >
              <span>Send</span>
              <ArrowRight size={12} />
            </button>
          </form>
        </div>

        {/* Right Card: Cash Flow & Revenue Intelligence (6 cols) */}
        <div className="fintech-card" style={{ gridColumn: 'span 12 / span 6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Cash Flow &amp; Revenue Intelligence
                </span>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                  Gross volume vs AI-attributed companion transactions
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-primary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}>
                <span>This Year</span>
                <ChevronDown size={12} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
              <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatCurrency(metrics.revenue)}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: 4 }}>USD/INR</span>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: '0.6875rem', fontWeight: 600 }}>
                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Income
                </span>
                <span style={{ color: '#ea580c', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ea580c' }} /> AI Attributed
                </span>
              </div>
            </div>
          </div>

          <div style={{ height: 200, width: '100%' }}>
            <ChartCard
              title=""
              data={chartData}
              dataKey="revenue"
              comparisonKey="aiRevenue"
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ROW 3: Recent Activity | Currency Exchange / Policy Limits | Statistic Donut
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 16,
      }}>
        {/* Left: Recent Activity Table (6 cols) */}
        <div className="fintech-card" style={{ gridColumn: 'span 12 / span 6', padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recent Activity
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-primary)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}>
              <span>This Month</span>
              <ChevronDown size={11} />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Platform</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders && data.recentOrders.length > 0 ? (
                  data.recentOrders.slice(0, 4).map((o) => (
                    <tr key={o.id}>
                      <td className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {o.razorpayOrderId || o.id.slice(0, 10)}
                      </td>
                      <td style={{ fontSize: '0.75rem' }}>
                        {formatDateTime(o.createdAt).slice(0, 10)}
                      </td>
                      <td style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                        Razorpay Test
                      </td>
                      <td className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatCurrency(o.amount)}
                      </td>
                      <td>
                        <span className="badge badge-fintech" style={{ fontSize: '0.6875rem' }}>
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-tertiary)' }}>
                      No recent transactions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Center: Currency / Policy Limits Card (3 cols) */}
        <div className="fintech-card" style={{ gridColumn: 'span 12 / span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '18px 20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Policy Guardrails
              </span>
              <span className="badge badge-fintech" style={{ fontSize: '0.6875rem' }}>Active</span>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', marginBottom: 8 }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Max Transaction Limit</div>
              <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>₹10,000.00</div>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)' }}>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Daily AI Spend Limit</div>
              <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>₹50,000.00</div>
            </div>
          </div>

          <Link href="/settings" style={{
            display: 'block',
            width: '100%',
            padding: '8px',
            background: '#ea580c',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            textDecoration: 'none',
            marginTop: 10,
          }}>
            Adjust Rules
          </Link>
        </div>

        {/* Right: Commerce Attribution Statistic Donut / Breakdown (3 cols) */}
        <div className="fintech-card" style={{ gridColumn: 'span 12 / span 3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '18px 20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Catalog Statistics
              </span>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>This Month</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ea580c' }} /> Footwear &amp; Running
                </span>
                <span className="font-mono font-bold">60%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} /> Recovery Gear
                </span>
                <span className="font-mono font-bold">25%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> Hydration &amp; Tech
                </span>
                <span className="font-mono font-bold">15%</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border-secondary)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            <span>Total Catalog Items</span>
            <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>7 Products</span>
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
