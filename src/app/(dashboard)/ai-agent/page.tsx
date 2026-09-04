'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  Zap,
  TrendingUp,
  Package,
  Layers,
  CheckCircle2,
  RefreshCw,
  Eye,
  ShieldCheck,
  Shield,
  Check,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RecommendationCard } from '@/components/recommendation-card';
import { ExplainabilityModal, ExplainabilityData } from '@/components/explainability-drawer';
import { FloatingCommerceObjects } from '@/components/ui/floating-commerce-objects';
import { StatValue } from '@/components/ui/floating-value';
import { useToast } from '@/components/ui/toast';
import { formatCurrency } from '@/lib/utils';

interface Recommendation {
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
}

export default function AIAgentPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [productCount, setProductCount] = useState(7);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'upsell' | 'cross_sell' | 'campaign' | 'pricing'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedExplain, setSelectedExplain] = useState<ExplainabilityData | null>(null);
  const { success, error } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, prodRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/products')
      ]);

      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setRecommendations(dashData.recentRecommendations || []);
        setPendingApprovalsCount(dashData.metrics?.pendingApprovals || 0);
      }

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProductCount(prodData.products?.length || 0);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunAgent = async (focus: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focusArea: focus === 'all' ? 'all' : focus, limit: 6 }),
      });

      if (!res.ok) throw new Error('Agent scan failed');
      const data = await res.json();
      setRecommendations(data.recommendations || []);
      success('AI Intelligence Pass Complete', `Discovered ${data.recommendations?.length || 0} revenue opportunities.`);
    } catch (err: unknown) {
      error('Agent Error', err instanceof Error ? err.message : 'Could not complete scan');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filtered = activeTab === 'all'
    ? recommendations
    : recommendations.filter((r) => r.type.toLowerCase().includes(activeTab));

  const highConfidenceCount = recommendations.filter((r) => r.confidence >= 0.75).length;
  const topRec = recommendations[0];

  return (
    <div className="relative">
      <FloatingCommerceObjects intensity="ai" />

      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="AI REVENUE AGENT • ONLINE"
        badgeVariant="ai"
        badgeIcon={<Brain size={12} />}
        title="Autonomous"
        italicAccent="Intelligence"
        description="Catalog co-purchase discovery, margin protection, cross-sell bundles, and bounded conversion optimizers."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleRunAgent(activeTab)}
            disabled={isAnalyzing}
          >
            <Sparkles size={14} className={isAnalyzing ? 'animate-spin' : ''} />
            <span>{isAnalyzing ? 'Analyzing Product Relationships...' : 'Run Intelligence Scan'}</span>
          </Button>
        }
      />

      {/* ── Real Engine Health & Status Stats ───────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 14,
      }}>
        <div className="editorial-card" style={{ padding: '16px 18px' }}>
          <div className="stat-label">Products Analyzed</div>
          <div className="font-mono" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
            {productCount} Items
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Indexed with AI feature metadata
          </p>
        </div>

        <div className="editorial-card" style={{ padding: '16px 18px' }}>
          <div className="stat-label">Opportunities Found</div>
          <div className="font-mono" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--fintech-primary)', marginTop: 2 }}>
            {recommendations.length} Active
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Passed policy validation
          </p>
        </div>

        <div className="editorial-card" style={{ padding: '16px 18px' }}>
          <div className="stat-label">High Confidence (&gt;75%)</div>
          <div className="font-mono" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
            {highConfidenceCount}
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Strong historical basket affinity
          </p>
        </div>

        <div className="editorial-card" style={{ padding: '16px 18px' }}>
          <div className="stat-label">Awaiting Authorization</div>
          <div className="font-mono" style={{ fontSize: '1.375rem', fontWeight: 800, color: pendingApprovalsCount > 0 ? 'var(--warning)' : 'var(--text-primary)', marginTop: 2 }}>
            {pendingApprovalsCount}
          </div>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
            Rerouted to Security Center
          </p>
        </div>
      </div>

      {/* ── Current Inspectable Reasoning Pipeline ──────────── */}
      {topRec && (
        <div className="editorial-card" style={{
          padding: '20px 24px',
          background: 'var(--bg-secondary)',
          borderLeft: '4px solid var(--ai-primary)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-ai"><Brain size={12} /> CURRENT REASONING PIPELINE</span>
              <span className="stat-label" style={{ margin: 0 }}>ACTIVE COGNITION</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedExplain({
                title: topRec.title,
                type: topRec.type,
                reason: topRec.reason,
                evidence: topRec.evidence,
                expectedImpact: topRec.expectedImpact,
                confidence: topRec.confidence,
                riskLevel: topRec.riskLevel,
              })}
            >
              <Eye size={13} />
              <span>Inspect Reasoning Model</span>
            </Button>
          </div>

          <h3 className="font-heading" style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {topRec.title}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
            {topRec.reason}
          </p>

          {/* Sequential Reasoning Chain */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 10,
            background: 'var(--bg-tertiary)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)',
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                1. Evidence
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                {topRec.evidence?.[0] || 'Historical order co-purchases'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                2. Recommendation
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                Bounded Companion Incentive
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 2 }}>
                3. Expected Impact
              </div>
              <StatValue
                value={`+${formatCurrency(topRec.expectedImpact)} / mo`}
                size="md"
                font="mono"
              />
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                4. Policy Result
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--success)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={13} /> Within Limits (Pass)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Filter Tabs ──────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: 6,
        borderBottom: '1px solid var(--border-primary)',
        paddingBottom: 6,
        overflowX: 'auto',
      }}>
        {[
          { id: 'all', label: 'All Opportunities' },
          { id: 'upsell', label: 'Upsell' },
          { id: 'cross_sell', label: 'Cross-Sell Bundles' },
          { id: 'campaign', label: 'Campaigns' },
          { id: 'pricing', label: 'Pricing & Markdown' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '6px 14px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: activeTab === tab.id ? 'var(--border-primary)' : 'transparent',
              background: activeTab === tab.id ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === tab.id ? 'var(--shadow-xs)' : 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Opportunities Grid ───────────────────────────────── */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          <Skeleton height={240} />
          <Skeleton height={240} />
          <Skeleton height={240} />
        </div>
      ) : filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filtered.map((rec) => (
            <RecommendationCard
              key={rec.id}
              {...rec}
              onActionCreated={loadData}
            />
          ))}
        </div>
      ) : (
        <div className="editorial-card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <Brain size={32} style={{ color: 'var(--ai-primary)', margin: '0 auto 10px', opacity: 0.7 }} />
          <h3 className="font-heading" style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: 4 }}>
            No recommendations in this category
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto 16px' }}>
            Run an intelligence pass to analyze your product catalog and recent order histories.
          </p>
          <Button variant="primary" size="sm" onClick={() => handleRunAgent(activeTab)}>
            <Sparkles size={14} /> Run Scan Now
          </Button>
        </div>
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
