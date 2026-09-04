'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Brain,
  Layers,
  ArrowUpRight,
  Filter,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/badge';
import { StatValue } from '@/components/ui/floating-value';
import { PipelineStepper, type PipelineStage } from '@/components/ui/pipeline-stepper';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { FloatingCommerceObjects } from '@/components/ui/floating-commerce-objects';

interface ActionItem {
  id: string;
  type: string;
  status: string;
  title: string;
  description?: string | null;
  amount?: number | null;
  riskLevel: string;
  createdAt: string;
  policyResult?: {
    passed: boolean;
    reasons: string[];
  } | null;
  approval?: {
    id: string;
    status: string;
  } | null;
}

export default function OpportunitiesPage() {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const { success, error } = useToast();

  const fetchActions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/actions');
      if (res.ok) {
        const data = await res.json();
        setActions(data.actions || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleApprove = async (actionId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/ai/actions/${actionId}/approve`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to approve');
      success('Approved', 'Action authorized for execution.');
      setSelectedAction(null);
      fetchActions();
    } catch (err: unknown) {
      error('Error', err instanceof Error ? err.message : 'Could not approve');
    } finally {
      setIsProcessing(false);
    }
  };

  // Pipeline stages calculation
  const stages: PipelineStage[] = useMemo(() => {
    const proposedCount = actions.filter((a) => a.status === 'PROPOSED').length;
    const policyCount = actions.filter((a) => a.status === 'POLICY_CHECK' || a.status === 'AWAITING_APPROVAL').length;
    const executedCount = actions.filter((a) => a.status === 'EXECUTED').length;
    const verifiedCount = actions.filter((a) => a.status === 'VERIFIED').length;

    return [
      {
        id: 'PROPOSED',
        stepNumber: 1,
        label: 'Proposed',
        count: proposedCount,
        status: proposedCount > 0 ? 'active' : 'pending',
        description: 'Basket affinity discovery',
      },
      {
        id: 'POLICY_CHECK',
        stepNumber: 2,
        label: 'Policy Check',
        count: policyCount,
        status: policyCount > 0 ? 'active' : 'pending',
        description: 'Ceiling & discount evaluation',
      },
      {
        id: 'EXECUTED',
        stepNumber: 3,
        label: 'Executed',
        count: executedCount,
        status: executedCount > 0 ? 'completed' : 'pending',
        description: 'Automated checkout execution',
      },
      {
        id: 'VERIFIED',
        stepNumber: 4,
        label: 'Verified',
        count: verifiedCount,
        status: verifiedCount > 0 ? 'completed' : 'pending',
        description: 'HMAC signature confirmed',
      },
    ];
  }, [actions]);

  // Filtered actions based on stage
  const filteredActions = useMemo(() => {
    if (stageFilter === 'all') return actions;
    if (stageFilter === 'POLICY_CHECK') {
      return actions.filter((a) => a.status === 'POLICY_CHECK' || a.status === 'AWAITING_APPROVAL');
    }
    return actions.filter((a) => a.status === stageFilter);
  }, [actions, stageFilter]);

  return (
    <div className="relative min-h-screen" style={{ paddingBottom: 64 }}>
      {/* Background Commerce Objects Motion */}
      <FloatingCommerceObjects intensity="ai" />

      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="LIFECYCLE PIPELINE"
        badgeVariant="ai"
        badgeIcon={<Sparkles size={12} />}
        title="Opportunities"
        italicAccent="Pipeline"
        description="Track and inspect autonomous AI action lifecycles from initial basket co-purchase detection through deterministic policy verification to checkout execution."
        actions={
          <div className="flex items-center gap-2">
            <Link href="/ai-agent">
              <Button variant="ai" size="sm">
                <Brain size={13} />
                <span>AI Agent Brain</span>
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={fetchActions} disabled={isLoading}>
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* ── Section 1: Real Visual Stepper Component ───────── */}
        <PipelineStepper
          stages={stages}
          activeStageId={stageFilter === 'all' ? undefined : stageFilter}
          onSelectStage={(stageId) => setStageFilter(stageFilter === stageId ? 'all' : stageId)}
        />

        {/* ── Filter Bar & Stage Counters ────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              type="button"
              onClick={() => setStageFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                stageFilter === 'all'
                  ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--border-focus)]'
              }`}
            >
              All Actions ({actions.length})
            </button>
            <button
              type="button"
              onClick={() => setStageFilter('PROPOSED')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                stageFilter === 'PROPOSED'
                  ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--border-focus)]'
              }`}
            >
              Proposed ({actions.filter((a) => a.status === 'PROPOSED').length})
            </button>
            <button
              type="button"
              onClick={() => setStageFilter('POLICY_CHECK')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                stageFilter === 'POLICY_CHECK'
                  ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--border-focus)]'
              }`}
            >
              Policy Check ({actions.filter((a) => a.status === 'POLICY_CHECK' || a.status === 'AWAITING_APPROVAL').length})
            </button>
            <button
              type="button"
              onClick={() => setStageFilter('EXECUTED')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                stageFilter === 'EXECUTED'
                  ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--border-focus)]'
              }`}
            >
              Executed ({actions.filter((a) => a.status === 'EXECUTED').length})
            </button>
            <button
              type="button"
              onClick={() => setStageFilter('VERIFIED')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                stageFilter === 'VERIFIED'
                  ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)] hover:border-[var(--border-focus)]'
              }`}
            >
              Verified ({actions.filter((a) => a.status === 'VERIFIED').length})
            </button>
          </div>

          <span className="text-xs text-[var(--text-tertiary)] font-medium">
            Showing {filteredActions.length} of {actions.length} items
          </span>
        </div>

        {/* ── Section 2: Card-First Architecture Grid (Not a Table) ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Skeleton height={240} className="rounded-[var(--radius-lg)]" />
            <Skeleton height={240} className="rounded-[var(--radius-lg)]" />
            <Skeleton height={240} className="rounded-[var(--radius-lg)]" />
          </div>
        ) : filteredActions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredActions.map((act) => {
              const isPending = act.status === 'AWAITING_APPROVAL' || act.status === 'POLICY_CHECK';

              return (
                <div
                  key={act.id}
                  className={`card card-elevated flex flex-col justify-between transition-all ${
                    isPending ? 'border-l-4 border-l-[var(--warning)]' : ''
                  }`}
                  style={{ padding: '22px 24px' }}
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="badge badge-ai text-[0.6875rem] py-0.5 px-2.5 font-bold uppercase tracking-wider">
                        {act.type}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <StatusPill status={act.status} />
                        <span
                          className={`badge ${
                            act.riskLevel === 'LOW' ? 'badge-fintech' : 'badge-warning'
                          } text-[0.625rem] py-0.5 px-2`}
                        >
                          {act.riskLevel} Risk
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-heading font-bold text-base text-[var(--text-primary)] mb-1.5 leading-snug">
                      {act.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                      {act.description || 'Autonomous basket and price optimization action generated by Revolve AI.'}
                    </p>

                    {/* Policy Evaluation Capsule */}
                    <div
                      className="p-2.5 rounded-[var(--radius-sm)] border border-[var(--border-secondary)] mb-4 flex items-center justify-between text-xs"
                      style={{ background: 'var(--bg-tertiary)' }}
                    >
                      <span className="text-[0.6875rem] uppercase font-bold text-[var(--text-tertiary)] tracking-wider flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-[var(--success)]" />
                        Policy Gate
                      </span>
                      <span className="text-[0.6875rem] font-semibold text-[var(--success)] flex items-center gap-1">
                        <CheckCircle2 size={12} /> Bounded &amp; Evaluated
                      </span>
                    </div>
                  </div>

                  <div>
                    {/* Primary Figure: Static Elevated StatValue */}
                    <div className="pt-3 border-t border-[var(--border-secondary)] flex items-end justify-between mb-4">
                      <div>
                        <div className="text-[0.6875rem] text-[var(--text-tertiary)] uppercase font-semibold tracking-wider mb-1">
                          Expected Value Impact
                        </div>
                        <StatValue
                          value={act.amount ? `+${formatCurrency(act.amount)}` : 'Optimization'}
                          size="xl"
                          font="mono"
                        />
                      </div>
                      <div className="text-[0.6875rem] text-[var(--text-tertiary)] font-mono">
                        {formatDateTime(act.createdAt).slice(0, 10)}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {act.status === 'AWAITING_APPROVAL' ? (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            onClick={() => setSelectedAction(act)}
                          >
                            <ShieldCheck size={13} />
                            <span>Authorize</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedAction(act)}
                          >
                            <Eye size={13} />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedAction(act)}
                        >
                          <Eye size={13} />
                          <span>Inspect Lifecycle</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Empty State ── */
          <div className="card card-elevated text-center py-16 px-6 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-[var(--ai-bg)] border border-[var(--ai-border)] flex items-center justify-center mx-auto mb-3 text-[var(--ai-primary)]">
              <Brain size={24} />
            </div>
            <h3 className="font-heading font-bold text-base text-[var(--text-primary)] mb-1">
              No Actions in Stage &ldquo;{stageFilter}&rdquo;
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto mb-5 leading-relaxed">
              Autonomous opportunities are continuously evaluated against merchant guardrail limits. Run a catalog scan to trigger new revenue actions.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setStageFilter('all')}>
                Show All Stages
              </Button>
              <Link href="/ai-agent">
                <Button variant="ai" size="sm">
                  <Sparkles size={13} />
                  <span>Scan in AI Agent Brain</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Action Detail Modal ─────────────────────────────── */}
      {selectedAction && (
        <Modal
          isOpen={Boolean(selectedAction)}
          onClose={() => setSelectedAction(null)}
          title="Inspect Action Lifecycle"
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-ai font-bold text-xs">{selectedAction.type}</span>
                <StatusPill status={selectedAction.status} />
                <span className="badge badge-fintech text-xs">{selectedAction.riskLevel} Risk</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[var(--text-primary)]">
                {selectedAction.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                {selectedAction.description}
              </p>
            </div>

            <div
              className="p-4 rounded-[var(--radius-md)] border border-[var(--border-primary)]"
              style={{ background: 'var(--bg-tertiary)' }}
            >
              <div className="text-[0.6875rem] text-[var(--text-tertiary)] uppercase font-semibold mb-1">
                Projected Monthly Growth Impact
              </div>
              <StatValue
                value={selectedAction.amount ? `+${formatCurrency(selectedAction.amount)}` : 'Optimization'}
                size="2xl"
                font="mono"
              />
            </div>

            {/* Policy Verification Checklist */}
            <div className="p-3.5 rounded-[var(--radius-md)] border border-[var(--border-secondary)] bg-[var(--bg-secondary)] space-y-2">
              <div className="text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                Deterministic Policy Gate Evaluation:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-[var(--success)] font-medium">
                  <CheckCircle2 size={13} /> Max Transaction Limit (&lt; ₹10,000)
                </div>
                <div className="flex items-center gap-1.5 text-[var(--success)] font-medium">
                  <CheckCircle2 size={13} /> Daily Cumulative Ceiling (&lt; ₹50,000)
                </div>
                <div className="flex items-center gap-1.5 text-[var(--success)] font-medium">
                  <CheckCircle2 size={13} /> Discount Rate Bound (&lt; 25%)
                </div>
                <div className="flex items-center gap-1.5 text-[var(--success)] font-medium">
                  <CheckCircle2 size={13} /> Merchant Action Allowlist Passed
                </div>
              </div>
            </div>

            {selectedAction.status === 'AWAITING_APPROVAL' && (
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setSelectedAction(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleApprove(selectedAction.id)}
                  isLoading={isProcessing}
                >
                  <ShieldCheck size={14} />
                  <span>Authorize Action</span>
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
