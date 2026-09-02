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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

      if (!res.ok) throw new Error('Agent execution failed');
      const data = await res.json();
      setRecommendations(data.recommendations || []);
      success('AI Intelligence Pass Complete', `Generated ${data.recommendations?.length || 0} revenue opportunities.`);
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
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-ai">
              <Brain size={12} /> AUTONOMOUS REVENUE AGENT
            </span>
          </div>
          <h1 className="page-title">AI Growth Agent</h1>
          <p className="page-subtitle">
            Catalog intelligence, co-purchase pattern discovery & bounded conversion optimizers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={loadRecommendations} isLoading={isLoading}>
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button variant="ai" onClick={() => handleRunAgent(activeTab)} isLoading={isAnalyzing}>
            <Sparkles size={14} /> Run Intelligence Scan
          </Button>
        </div>
      </div>

      {/* Intelligence Summary Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}>
        <Card isAi>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="metric-label">Pipeline Opportunity</span>
            <TrendingUp size={16} color="var(--success)" />
          </div>
          <div className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>
            +{formatCurrency(totalPotential)}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Aggregated monthly impact across all proposals
          </p>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="metric-label">Engine Model</span>
            <Brain size={16} color="var(--ai-primary)" />
          </div>
          <div className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Revolve Deterministic v2.4
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Pluggable architecture (Gemini / OpenAI ready)
          </p>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="metric-label">Active Guardrails</span>
            <CheckCircle2 size={16} color="var(--info)" />
          </div>
          <div className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            100% Policy Bound
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Human approval enforced before execution
          </p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, overflowX: 'auto' }}>
        {[
          { key: 'all', label: 'All Opportunities' },
          { key: 'upsell', label: 'Upsell Upgrades' },
          { key: 'cross_sell', label: 'Cross-Sell Bundles' },
          { key: 'campaign', label: 'Campaigns' },
          { key: 'pricing', label: 'Pricing Adjustments' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`btn btn-sm ${activeTab === tab.key ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recommendations Grid */}
      {filtered.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Brain size={32} color="var(--ai-primary)" style={{ margin: '0 auto 12px' }} />
          <h3 className="font-heading" style={{ fontSize: '1.125rem', marginBottom: 6 }}>
            No opportunities in this category
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>
            Click below to run the AI engine across your catalog and order patterns.
          </p>
          <Button variant="ai" onClick={() => handleRunAgent(activeTab)} isLoading={isAnalyzing}>
            <Sparkles size={14} /> Scan Category Now
          </Button>
        </Card>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {filtered.map((rec) => (
            <RecommendationCard
              key={rec.id}
              {...rec}
              onActionCreated={loadRecommendations}
            />
          ))}
        </div>
      )}
    </div>
  );
}
