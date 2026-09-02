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
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RecommendationCard } from '@/components/recommendation-card';
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
  const [activeTab, setActiveTab] = useState<'all' | 'upsell' | 'cross_sell' | 'campaign' | 'pricing'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { success, error } = useToast();

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recentRecommendations || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
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

  const totalPotential = recommendations.reduce((sum, r) => sum + r.expectedImpact, 0);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-ai">
              <Brain size={12} /> AUTONOMOUS REVENUE ENGINE
            </span>
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            AI Growth Agent
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Catalog co-purchase analysis, basket intelligence & bounded conversion optimizers.
          </p>
        </div>

        <Button
          variant="fintech"
          onClick={() => handleRunAgent(activeTab)}
          disabled={isAnalyzing}
        >
          <Sparkles size={16} className={isAnalyzing ? 'animate-spin' : ''} />
          <span>{isAnalyzing ? 'Analyzing Store Data...' : 'Run Intelligence Scan'}</span>
        </Button>
      </div>

      {/* Summary Stat Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}>
        <div className="editorial-card" style={{ padding: '20px' }}>
          <div className="stat-label">Discovered Opportunities</div>
          <div className="stat-metric-number" style={{ color: 'var(--text-primary)' }}>
            {recommendations.length} Active
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            Passed policy validation
          </p>
        </div>

        <div className="editorial-card" style={{ padding: '20px' }}>
          <div className="stat-label">Projected Monthly Added Value</div>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--fintech-primary)' }}>
            +{formatCurrency(totalPotential)}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            Based on catalog affinity patterns
          </p>
        </div>

        <div className="editorial-card" style={{ padding: '20px' }}>
          <div className="stat-label">Autonomous Policy Checks</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '1.0625rem', fontWeight: 600, color: 'var(--success)', marginTop: 4 }}>
            <ShieldCheck size={18} /> 100% Policy Compliant
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4 }}>
            Max cap: ₹10,000 / tx
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
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

      {/* Opportunities Grid */}
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
              onActionCreated={loadRecommendations}
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
    </div>
  );
}
