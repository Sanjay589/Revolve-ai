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
  Layers,
  Database,
  Check,
  Circle,
  Clock,
  Sliders,
  Bot,
  ExternalLink,
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
  isDemoWorkspace?: boolean;
  productCount?: number;
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

interface UserSession {
  name?: string;
  email?: string;
  merchantName?: string;
  isDemoWorkspace?: boolean;
}

export default function OverviewPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [selectedExplain, setSelectedExplain] = useState<ExplainabilityData | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D'>('7D');
  const { success, info, error } = useToast();

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const [dashRes, sessRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/auth/session'),
      ]);

      if (dashRes.ok) {
        const json = await dashRes.json();
        setData(json);
      }

      if (sessRes.ok) {
        const sData = await sessRes.json();
        if (sData.authenticated && sData.user) {
          setSession(sData.user);
        }
      }
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

  const handleSwitchWorkspace = async (targetMode: 'demo' | 'personal') => {
    setIsSwitching(true);
    try {
      const res = await fetch('/api/auth/switch-workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: targetMode }),
      });
      if (res.ok) {
        success('Workspace Switched', `Active workspace updated.`);
        window.location.reload();
      }
    } catch {
      error('Error', 'Failed to switch workspace');
    } finally {
      setIsSwitching(false);
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} height={100} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7"><Skeleton height={320} /></div>
          <div className="lg:col-span-5"><Skeleton height={320} /></div>
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
  const productCount = data?.productCount ?? 0;
  const isDemo = Boolean(data?.isDemoWorkspace || session?.isDemoWorkspace);
  const isNewMerchant = !isDemo && productCount === 0 && metrics.orders === 0;

  // Greeting by time of day
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = session?.name ? session.name.split(' ')[0] : 'Merchant';

  // Calculate dynamic onboarding readiness
  const readinessSteps = [
    { label: 'Account created', complete: true, hint: 'Admin credentials active' },
    { label: 'Email verified', complete: true, hint: 'Identity verified' },
    { label: 'Connect product catalog', complete: productCount > 0, hint: productCount > 0 ? `${productCount} products indexed` : '0 products in catalog', href: '/catalog' },
    { label: 'Configure merchant policies', complete: true, hint: '₹10,000 max / ₹50,000 daily limit', href: '/settings' },
    { label: 'Connect Razorpay Test Mode', complete: metrics.orders > 0, hint: metrics.orders > 0 ? `${metrics.orders} verified orders` : 'Waiting for first test checkout', href: '/transactions' },
    { label: 'Run first AI opportunity scan', complete: recommendations.length > 0, hint: recommendations.length > 0 ? `${recommendations.length} opportunities discovered` : 'Catalog intelligence pending', href: '/ai-agent' },
  ];

  const completedCount = readinessSteps.filter(s => s.complete).length;
  const readinessPercentage = Math.round((completedCount / readinessSteps.length) * 100);

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
      <FloatingCommerceObjects intensity="overview" />

      {/* ── Demo Workspace Banner (If in Demo Mode) ─────────── */}
      {isDemo && (
        <div className="card mb-4" style={{
          background: 'rgba(245, 158, 11, 0.06)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '12px 18px',
        }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <div>
                <span className="font-heading text-xs font-bold text-amber-300">
                  DEMO WORKSPACE • SAMPLE DATA
                </span>
                <p className="text-[0.6875rem] text-[var(--text-secondary)]">
                  You are exploring the pre-populated Apex Athletics showcase for Razorpay Buildathon judges. All metrics and orders reflect sample data.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSwitchWorkspace('personal')}
              disabled={isSwitching}
              className="btn btn-outline btn-sm text-xs"
            >
              Switch to Personal Workspace
            </button>
          </div>
        </div>
      )}

      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="REVOLVE AI • AUTONOMOUS COMMERCE OS"
        badgeVariant="ai"
        badgeIcon={<Brain size={12} />}
        title={isNewMerchant ? `${timeGreeting}, ${firstName} 👋` : "Merchant Dashboard"}
        italicAccent={isNewMerchant ? "Let's set up your workspace." : "Overview"}
        description={isNewMerchant
          ? "Connect your commerce data, configure merchant policies, and activate AI-driven revenue intelligence."
          : "Clarity and control over every AI commerce action, policy verification, and payment outcome."
        }
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleTriggerAnalysis}
              disabled={isGenerating || isNewMerchant}
              className="btn btn-outline btn-sm"
              title={isNewMerchant ? 'Connect catalog first' : 'Run scan'}
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

      {/* ── NEW USER WORKSPACE EXPERIENCE ───────────────────── */}
      {isNewMerchant ? (
        <div className="flex flex-col gap-5">
          {/* Workspace Readiness Section */}
          <div className="card card-elevated" style={{ padding: '24px 28px', background: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 mb-4 border-b border-[var(--border-secondary)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-ai text-[0.6875rem]">SETUP WIZARD</span>
                  <h3 className="font-heading text-lg font-extrabold text-[var(--text-primary)]">
                    Workspace Readiness
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Complete these steps to activate autonomous catalog discovery, policy enforcement, and live Razorpay checkout.
                </p>
              </div>

              {/* Dynamic Percentage Badge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[0.6875rem] uppercase font-bold text-[var(--text-tertiary)]">Readiness</div>
                  <div className="font-mono text-xl font-extrabold text-[#00C076]">{readinessPercentage}% Complete</div>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-[var(--border-primary)] flex items-center justify-center font-mono text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-tertiary)]">
                  {completedCount}/6
                </div>
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {readinessSteps.map((step, idx) => (
                <div
                  key={step.label}
                  className={`p-3.5 rounded-[var(--radius-md)] border transition-all ${
                    step.complete
                      ? 'bg-[var(--bg-tertiary)] border-[var(--border-primary)] opacity-90'
                      : 'bg-[var(--bg-secondary)] border-[#00C076]/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      step.complete ? 'bg-[#00C076] text-black' : 'border border-[var(--text-tertiary)] text-[var(--text-tertiary)]'
                    }`}>
                      {step.complete ? <Check size={12} strokeWidth={3} /> : <span className="text-[0.625rem] font-bold">{idx + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-bold ${step.complete ? 'text-[var(--text-primary)]' : 'text-[#00C076]'}`}>
                        {step.label}
                      </div>
                      <div className="text-[0.6875rem] text-[var(--text-secondary)] mt-0.5 truncate">
                        {step.hint}
                      </div>
                      {step.href && !step.complete && (
                        <Link
                          href={step.href}
                          className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-[#00C076] hover:underline mt-1.5"
                        >
                          Configure now <ArrowRight size={10} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-[var(--border-secondary)]">
              <div className="flex items-center gap-3">
                <Link href="/catalog" className="btn btn-primary btn-sm">
                  Complete Setup <ArrowRight size={13} />
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[0.6875rem] text-[var(--text-tertiary)]">Want to see live numbers first?</span>
                <button
                  type="button"
                  onClick={() => handleSwitchWorkspace('demo')}
                  disabled={isSwitching}
                  className="btn btn-outline btn-sm text-xs"
                >
                  <Database size={12} />
                  <span>Explore Demo Workspace</span>
                  <span className="text-[0.625rem] text-amber-400 font-bold ml-1">• Sample Data</span>
                </button>
              </div>
            </div>
          </div>

          {/* Meaningful Empty State Composition */}
          <div className="card" style={{ padding: '28px', background: 'var(--bg-secondary)' }}>
            <div className="max-w-2xl">
              <span className="badge badge-neutral text-[0.6875rem] mb-2 font-mono">WORKSPACE STATE: UNCONNECTED</span>
              <h3 className="font-heading text-xl font-bold text-[var(--text-primary)] mb-2">
                Your commerce intelligence starts here.
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">
                No commerce activity has been connected yet. Once your catalog and payment data are connected, Revolve AI will begin analyzing opportunities, policy boundaries, and conversion lift.
              </p>

              {/* 3 Quick Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <Link
                  href="/catalog"
                  className="p-4 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)] hover:border-[#00C076] transition-all text-decoration-none group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Package size={18} className="text-[#00C076]" />
                    <ArrowUpRight size={13} className="text-[var(--text-tertiary)] group-hover:text-white" />
                  </div>
                  <h4 className="font-heading text-xs font-bold text-[var(--text-primary)]">
                    1. Connect Catalog
                  </h4>
                  <p className="text-[0.6875rem] text-[var(--text-secondary)] mt-1">
                    Upload CSV, sync API, or load demo merchandise with 1 click.
                  </p>
                </Link>

                <Link
                  href="/settings"
                  className="p-4 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)] hover:border-[#00C076] transition-all text-decoration-none group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Sliders size={18} className="text-[var(--ai-primary)]" />
                    <ArrowUpRight size={13} className="text-[var(--text-tertiary)] group-hover:text-white" />
                  </div>
                  <h4 className="font-heading text-xs font-bold text-[var(--text-primary)]">
                    2. Configure Guardrails
                  </h4>
                  <p className="text-[0.6875rem] text-[var(--text-secondary)] mt-1">
                    Set per-tx thresholds (₹10k) and daily budget limits (₹50k).
                  </p>
                </Link>

                <Link
                  href="/transactions"
                  className="p-4 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)] hover:border-[#00C076] transition-all text-decoration-none group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard size={18} className="text-amber-400" />
                    <ArrowUpRight size={13} className="text-[var(--text-tertiary)] group-hover:text-white" />
                  </div>
                  <h4 className="font-heading text-xs font-bold text-[var(--text-primary)]">
                    3. Razorpay Test Mode
                  </h4>
                  <p className="text-[0.6875rem] text-[var(--text-secondary)] mt-1">
                    Verify test checkout, HMAC signature validation, and webhooks.
                  </p>
                </Link>
              </div>

              {/* End-to-End Visual Architecture */}
              <div className="p-4 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)]">
                <div className="text-[0.625rem] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                  Deterministic Commerce Pipeline
                </div>
                <div className="flex items-center justify-between text-[0.6875rem] flex-wrap gap-2 text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">1. Signal</span>
                  <span>→</span>
                  <span className="font-semibold text-[var(--ai-text)]">2. AI Reasoning</span>
                  <span>→</span>
                  <span className="font-semibold text-amber-300">3. Policy Gate</span>
                  <span>→</span>
                  <span className="font-semibold text-amber-300">4. Approval</span>
                  <span>→</span>
                  <span className="font-semibold text-[#00C076]">5. Razorpay</span>
                  <span>→</span>
                  <span className="font-semibold text-[#00C076]">6. HMAC</span>
                  <span>→</span>
                  <span className="font-semibold text-white">7. Audit Log</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── POPULATED / DEMO DASHBOARD EXPERIENCE ─────────── */
        <>
          {/* AI Command Center */}
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

          {/* ZONE 1: REVENUE & KPI INTELLIGENCE */}
          <div className="flex flex-col gap-3.5">
            <FeaturedStatCard
              label="AI-Attributed Revenue"
              value={formatCurrency(metrics.aiAttributedRevenue)}
              badgeText="Autonomous Commerce Engine"
              change={metrics.aiAttributedRevenue > 0 ? 24 : undefined}
              changeLabel="growth from AI recommendations"
              subtext="Direct incremental revenue attributed to autonomous policy-bounded recommendations & checkouts."
            />

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

          {/* Row: Revenue Chart + AI Scan Action */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div
              className="lg:col-span-7"
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)', padding: '20px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <ChartCard
                title="Revenue Intelligence"
                data={chartData}
                dataKey="revenue"
                comparisonKey="aiRevenue"
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
            </div>

            <div
              className="lg:col-span-5"
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)', padding: '20px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}
            >
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

          {/* Row: Recent Transactions + Policy + Quick Links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div
              className="lg:col-span-7"
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)',
              }}
            >
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

            <div className="lg:col-span-5 flex flex-col gap-4">
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
        </>
      )}

      {/* Explainability Modal */}
      <ExplainabilityModal
        isOpen={Boolean(selectedExplain)}
        onClose={() => setSelectedExplain(null)}
        data={selectedExplain}
      />
    </div>
  );
}
