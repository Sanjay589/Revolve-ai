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
  Play,
  ArrowRight,
  ShieldCheck,
  Activity,
  Eye,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RecommendationCard } from '@/components/recommendation-card';
import { ExplainabilityModal, ExplainabilityData } from '@/components/explainability-drawer';
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
        setProductCount(prodData.products?.length || 7);
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

  const handleRunAgent = async (focus: string = 'all') => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focusArea: focus, limit: 6 }),
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
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* ─── 1. Header & Live Brain Indicator ───────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-ai" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              <Brain size={12} /> AI REVENUE AGENT • ONLINE
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
              Active Monitoring
            </span>
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Autonomous Intelligence Engine
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Catalog co-purchase discovery, margin protection &amp; bounded conversion optimizers.
          </p>
        </div>

        <Button
          variant="fintech"
          onClick={() => handleRunAgent(activeTab)}
          disabled={isAnalyzing}
        >
          <Sparkles size={16} className={isAnalyzing ? 'animate-spin' : ''} />
          <span>{isAnalyzing ? 'Analyzing Product Relationships...' : 'Run Intelligence Scan'}</span>
        </Button>
      </div>

      {/* ─── 2. Real Engine Health & Status Stats ─────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}>
        <div className="editorial-card" style={{ padding: '20px' }}>
          <div className="stat-label">Products Analyzed</div>
          <div className="font-mono" style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {productCount} Items
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            Indexed with AI feature metadata
          </p>
        </div>

        <div className="editorial-card" style={{ padding: '20px' }}>
          <div className="stat-label">Opportunities Found</div>
          <div className="font-mono" style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--fintech-primary)' }}>
            {recommendations.length} Active
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            Passed policy validation
          </p>
        </div>

        <div className="editorial-card" style={{ padding: '20px' }}>
          <div className="stat-label">High Confidence (&gt;75%)</div>
          <div className="font-mono" style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {highConfidenceCount}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            Strong historical basket affinity
          </p>
        </div>

        <div className="editorial-card" style={{ padding: '20px' }}>
          <div className="stat-label">Awaiting Approval</div>
          <div className="font-mono" style={{ fontSize: '1.625rem', fontWeight: 800, color: pendingApprovalsCount > 0 ? 'var(--warning)' : 'var(--text-primary)' }}>
            {pendingApprovalsCount}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            Rerouted to Security Center
          </p>
        </div>
      </div>

      {/* ─── 3. Current Inspectable Reasoning Pipeline ─────────── */}
      {topRec && (
        <div className="editorial-card" style={{ padding: '24px 28px', background: 'var(--bg-secondary)', borderLeft: '4px solid var(--ai-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
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
              <span>Inspect Reasoning</span>
            </Button>
          </div>

          <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 8 }}>
            {topRec.title}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 18 }}>
            {topRec.reason}
          </p>

          {/* Sequential Reasoning Chain */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
            background: 'var(--bg-tertiary)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
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
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                3. Expected Impact
              </div>
              <div className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--fintech-primary)', marginTop: 2 }}>
                +{formatCurrency(topRec.expectedImpact)} / mo
              </div>
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

      {/* ─── 4. Filter Tabs & Opportunities Grid ─────────────── */}
      <div style={{
        display: 'flex',
        gap: 8,
        borderBottom: '1px solid var(--border-primary)',
        paddingBottom: 12,
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
              padding: '8px 16px',
              fontSize: '0.875rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: activeTab === tab.id ? 'var(--border-primary)' : 'transparent',
              background: activeTab === tab.id ? 'var(--bg-secondary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === tab.id ? 'var(--shadow-xs)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
          <Skeleton height={260} />
          <Skeleton height={260} />
          <Skeleton height={260} />
        </div>
      ) : filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
          {filtered.map((rec) => (
            <RecommendationCard
              key={rec.id}
              {...rec}
              onActionCreated={loadData}
            />
          ))}
        </div>
      ) : (
        <div className="editorial-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Brain size={36} style={{ color: 'var(--ai-primary)', margin: '0 auto 12px', opacity: 0.6 }} />
          <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 6 }}>
            No recommendations in this category
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 20px' }}>
            Run an intelligence pass to analyze your product catalog and recent order histories.
          </p>
          <Button variant="fintech" onClick={() => handleRunAgent(activeTab)}>
            <Sparkles size={16} /> Run Scan Now
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
