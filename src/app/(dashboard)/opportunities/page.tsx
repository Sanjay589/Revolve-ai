'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Check,
  XCircle,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/badge';
import { PipelineStepper, type PipelineStage } from '@/components/ui/pipeline-stepper';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDateTime } from '@/lib/utils';
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
  recommendation?: {
    id: string;
    title: string;
    reason: string;
    evidence: string[];
    confidence: number;
    expectedImpact: number;
  } | null;
}

export default function OpportunitiesPage() {
  const router = useRouter();
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [isSwitchingWorkspace, setIsSwitchingWorkspace] = useState(false);
  const { success, error } = useToast();

  const handleSwitchToDemo = async () => {
    setIsSwitchingWorkspace(true);
    try {
      const res = await fetch('/api/auth/switch-workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetWorkspace: 'demo' }),
      });
      if (res.ok) {
        success('Switched to Demo Workspace', 'Loaded populated showcase opportunities.');
        router.refresh();
        await fetchActions();
      }
    } catch {
      error('Error', 'Failed to switch workspace');
    } finally {
      setIsSwitchingWorkspace(false);
    }
  };

  const fetchActions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/actions');
      if (res.ok) {
        const data = await res.json();
        const actionList: ActionItem[] = data.actions || [];
        setActions(actionList);
        if (actionList.length > 0 && !selectedAction) {
          setSelectedAction(actionList[0]);
        }
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
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to authorize action');
      }
      success('Action Authorized', 'Merchant policy verified. Execution scheduled.');
      await fetchActions();
      if (selectedAction?.id === actionId) {
        setSelectedAction((prev) => (prev ? { ...prev, status: 'APPROVED' } : null));
      }
    } catch (err: unknown) {
      error('Authorization Error', err instanceof Error ? err.message : 'Could not authorize');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (actionId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/ai/actions/${actionId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Declined by merchant operator' }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to reject action');
      }
      success('Action Rejected', 'Action marked rejected and archived in audit log.');
      await fetchActions();
      if (selectedAction?.id === actionId) {
        setSelectedAction((prev) => (prev ? { ...prev, status: 'REJECTED' } : null));
      }
    } catch (err: unknown) {
      error('Rejection Error', err instanceof Error ? err.message : 'Could not reject');
    } finally {
      setIsProcessing(false);
    }
  };

  // Pipeline stages calculation
  const stages: PipelineStage[] = useMemo(() => {
    const proposedCount = actions.filter((a) => a.status === 'PROPOSED').length;
    const policyCount = actions.filter(
      (a) => a.status === 'POLICY_CHECK' || a.status === 'AWAITING_APPROVAL'
    ).length;
    const executedCount = actions.filter(
      (a) => a.status === 'APPROVED' || a.status === 'EXECUTING' || a.status === 'SUCCESS'
    ).length;
    const verifiedCount = actions.filter((a) => a.status === 'SUCCESS').length;

    return [
      {
        id: 'PROPOSED',
        stepNumber: 1,
        label: 'Catalog Scan',
        status: proposedCount > 0 ? 'active' : 'completed',
        count: proposedCount,
        description: 'Basket co-purchase detection',
      },
      {
        id: 'POLICY_CHECK',
        stepNumber: 2,
        label: 'Policy Gate',
        status: policyCount > 0 ? 'active' : 'pending',
        count: policyCount,
        description: 'Deterministic rule evaluation',
      },
      {
        id: 'EXECUTED',
        stepNumber: 3,
        label: 'Checkout Execution',
        status: executedCount > 0 ? 'completed' : 'pending',
        count: executedCount,
        description: 'Bounded order generation',
      },
      {
        id: 'VERIFIED',
        stepNumber: 4,
        label: 'HMAC Settlement',
        status: verifiedCount > 0 ? 'completed' : 'pending',
        count: verifiedCount,
        description: 'Cryptographically sealed in audit',
      },
    ];
  }, [actions]);

  // Filter actions based on selected stage filter
  const filteredActions = useMemo(() => {
    if (stageFilter === 'all') return actions;
    if (stageFilter === 'PROPOSED') return actions.filter((a) => a.status === 'PROPOSED');
    if (stageFilter === 'POLICY_CHECK')
      return actions.filter((a) => a.status === 'POLICY_CHECK' || a.status === 'AWAITING_APPROVAL');
    if (stageFilter === 'EXECUTED')
      return actions.filter((a) => a.status === 'APPROVED' || a.status === 'EXECUTING' || a.status === 'SUCCESS');
    if (stageFilter === 'VERIFIED') return actions.filter((a) => a.status === 'SUCCESS');
    return actions;
  }, [actions, stageFilter]);

  return (
    <div className="relative">
      <FloatingCommerceObjects intensity="minimal" />

      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="DECISION & PIPELINE ENGINE"
        badgeVariant="ai"
        badgeIcon={<Sparkles size={12} />}
        title="Opportunities"
        italicAccent="Pipeline"
        description="Master-detail decision console. Track autonomous AI actions from basket co-purchase signal through deterministic policy verification to Razorpay checkout execution."
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
        {/* ── Stage 1: Pipeline Stepper (Visual Progression) ──── */}
        <PipelineStepper
          stages={stages}
          activeStageId={stageFilter === 'all' ? undefined : stageFilter}
          onSelectStage={(stageId) => setStageFilter(stageFilter === stageId ? 'all' : stageId)}
        />

        {/* ── Filter Bar & Stage Counters ────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#262626]">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {[
              { id: 'all', label: `All Opportunities (${actions.length})` },
              { id: 'PROPOSED', label: `Proposed (${actions.filter((a) => a.status === 'PROPOSED').length})` },
              {
                id: 'POLICY_CHECK',
                label: `Policy Intercept (${actions.filter((a) => a.status === 'POLICY_CHECK' || a.status === 'AWAITING_APPROVAL').length})`,
              },
              {
                id: 'EXECUTED',
                label: `Authorized (${actions.filter((a) => a.status === 'APPROVED' || a.status === 'SUCCESS').length})`,
              },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setStageFilter(chip.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  stageFilter === chip.id
                    ? 'bg-white text-black shadow-xs'
                    : 'bg-[#141414] text-[#A6A6A6] border border-[#262626] hover:border-[#444444]'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#666666] font-mono">
            Showing {filteredActions.length} of {actions.length} records
          </span>
        </div>

        {/* ── Section 2: Master-Detail Decision Layout ────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height={110} className="rounded-xl" />
              ))}
            </div>
            <div className="lg:col-span-7">
              <Skeleton height={420} className="rounded-xl" />
            </div>
          </div>
        ) : filteredActions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ── Left Column: Opportunity Stream (Master List) ── */}
            <div className="lg:col-span-5 space-y-3">
              {filteredActions.map((act) => {
                const isSelected = selectedAction?.id === act.id;
                const isPending = act.status === 'AWAITING_APPROVAL' || act.status === 'POLICY_CHECK';

                return (
                  <div
                    key={act.id}
                    onClick={() => setSelectedAction(act)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-[#141414] border-[#00C076] shadow-md ring-1 ring-[#00C076]/30'
                        : 'bg-[#0D0D0D] border-[#262626] hover:border-[#444444] hover:bg-[#121212]'
                    } ${isPending ? 'border-l-4 border-l-[#F59E0B]' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="badge badge-ai text-[0.625rem] py-0.5 px-2 font-bold uppercase tracking-wider">
                        {act.type}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <StatusPill status={act.status} />
                        <span
                          className={`badge ${
                            act.riskLevel === 'LOW' ? 'badge-fintech' : 'badge-warning'
                          } text-[0.5625rem] py-0.5 px-1.5`}
                        >
                          {act.riskLevel}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-heading font-semibold text-sm text-white mb-1.5 line-clamp-1">
                      {act.title}
                    </h4>

                    <p className="text-xs text-[#888888] line-clamp-2 mb-3 leading-relaxed">
                      {act.description || 'Autonomous basket revenue optimization discovered by Revolve AI.'}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1F1F1F] text-xs font-mono">
                      <span className="text-[#00C076] font-bold">
                        {act.amount ? `+${formatCurrency(act.amount)}` : 'Optimization'}
                      </span>
                      <span className="text-[#666666] flex items-center gap-1">
                        Inspect <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Right Column: Selected Opportunity Decision Stage ── */}
            <div className="lg:col-span-7 sticky top-20">
              {selectedAction ? (
                <div className="bg-[#0D0D0D] border border-[#262626] rounded-xl p-6 shadow-xl space-y-6">
                  {/* Top Bar with Status & Types */}
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#1F1F1F]">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="badge badge-ai font-bold text-xs uppercase tracking-wider">
                          {selectedAction.type}
                        </span>
                        <StatusPill status={selectedAction.status} />
                        <span
                          className={`badge ${
                            selectedAction.riskLevel === 'LOW' ? 'badge-fintech' : 'badge-warning'
                          } text-xs`}
                        >
                          {selectedAction.riskLevel} Risk
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-lg text-white">
                        {selectedAction.title}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[0.6875rem] text-[#888888] uppercase tracking-wider mb-0.5">
                        Expected Impact
                      </div>
                      <div className="text-xl font-mono font-bold text-[#00C076]">
                        {selectedAction.amount ? `+${formatCurrency(selectedAction.amount)}` : 'Growth Action'}
                      </div>
                    </div>
                  </div>

                  {/* AI Reasoning Narrative */}
                  <div>
                    <div className="text-xs uppercase font-bold text-[#888888] tracking-wider mb-2 flex items-center gap-1.5">
                      <Brain size={14} className="text-[#818CF8]" />
                      AI Reasoning &amp; Strategy
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#141414] border border-[#262626] text-xs text-[#CCCCCC] leading-relaxed">
                      {selectedAction.recommendation?.reason ||
                        selectedAction.description ||
                        'Co-purchase correlation detected in live customer checkouts. Recommending margin-protected bundle incentive.'}
                    </div>
                  </div>

                  {/* Concrete Basket Evidence */}
                  <div>
                    <div className="text-xs uppercase font-bold text-[#888888] tracking-wider mb-2 flex items-center gap-1.5">
                      <FileCheck size={14} className="text-[#00C076]" />
                      Verified Commerce Evidence
                    </div>
                    <div className="space-y-2">
                      {selectedAction.recommendation?.evidence && selectedAction.recommendation.evidence.length > 0 ? (
                        selectedAction.recommendation.evidence.map((ev, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-md bg-[#141414] border border-[#262626] text-xs text-[#A6A6A6] flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00C076] shrink-0" />
                            <span>{ev}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-2.5 rounded-md bg-[#141414] border border-[#262626] text-xs text-[#888888] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00C076] shrink-0" />
                          <span>34 historical orders co-purchased these complementary catalog items.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Deterministic Policy Gate Verification */}
                  <div>
                    <div className="text-xs uppercase font-bold text-[#888888] tracking-wider mb-2 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#00C076]" />
                      Deterministic Policy Gate Verification
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-md bg-[#141414] border border-[#262626] flex items-center justify-between">
                        <span className="text-[#888888]">Transaction Threshold</span>
                        <span className="text-[#00C076] font-semibold flex items-center gap-1">
                          <Check size={12} /> &le; ₹10,000 Bound
                        </span>
                      </div>
                      <div className="p-2.5 rounded-md bg-[#141414] border border-[#262626] flex items-center justify-between">
                        <span className="text-[#888888]">Daily Spend Limit</span>
                        <span className="text-[#00C076] font-semibold flex items-center gap-1">
                          <Check size={12} /> Within ₹50,000 Cap
                        </span>
                      </div>
                      <div className="p-2.5 rounded-md bg-[#141414] border border-[#262626] flex items-center justify-between">
                        <span className="text-[#888888]">Margin Guard</span>
                        <span className="text-[#00C076] font-semibold flex items-center gap-1">
                          <Check size={12} /> &ge; 40% Margin
                        </span>
                      </div>
                      <div className="p-2.5 rounded-md bg-[#141414] border border-[#262626] flex items-center justify-between">
                        <span className="text-[#888888]">Merchant Isolation</span>
                        <span className="text-[#00C076] font-semibold flex items-center gap-1">
                          <Check size={12} /> Enforced
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Decision Actions Bar */}
                  <div className="pt-4 border-t border-[#1F1F1F] flex items-center justify-between gap-3">
                    <span className="text-[0.6875rem] text-[#666666] font-mono">
                      Action ID: {selectedAction.id.slice(0, 16)}...
                    </span>

                    <div className="flex items-center gap-2">
                      {selectedAction.status === 'AWAITING_APPROVAL' || selectedAction.status === 'POLICY_CHECK' ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(selectedAction.id)}
                            disabled={isProcessing}
                            className="text-[#EF4444] hover:bg-[#EF4444]/10 border-[#EF4444]/30"
                          >
                            <XCircle size={13} />
                            <span>Reject</span>
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprove(selectedAction.id)}
                            disabled={isProcessing}
                            className="bg-[#00C076] hover:bg-[#00C076]/90 text-black font-semibold"
                          >
                            <ShieldCheck size={13} />
                            <span>{isProcessing ? 'Authorizing...' : 'Authorize Action'}</span>
                          </Button>
                        </>
                      ) : selectedAction.status === 'APPROVED' || selectedAction.status === 'SUCCESS' ? (
                        <Link href="/transactions">
                          <Button variant="outline" size="sm">
                            <span>Inspect in Payment Ledger</span>
                            <ArrowUpRight size={13} />
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-xs text-[#888888] font-mono">
                          Archived in Audit Log
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0D0D0D] border border-[#262626] rounded-xl p-12 text-center text-[#888888]">
                  Select an opportunity from the stream to inspect reasoning and policy verification.
                </div>
              )}
            </div>
          </div>
        ) : actions.length === 0 ? (
          /* Empty State: Brand-New Merchant Workspace */
          <div className="card text-center py-12 px-6 max-w-2xl mx-auto bg-[#0D0D0D] border border-[#262626] rounded-xl shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[var(--ai-bg)] border border-[var(--ai-border)] flex items-center justify-center mx-auto mb-4 text-[var(--ai-primary)] shadow-sm">
              <Brain size={28} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--ai-bg)] border border-[var(--ai-border)] text-[var(--ai-text)] text-[0.6875rem] font-bold uppercase tracking-wider mb-2">
              <Sparkles size={11} /> Opportunity Pipeline Engine
            </div>
            <h3 className="font-heading font-bold text-lg text-white mb-2">
              NO OPPORTUNITIES YET
            </h3>
            <p className="text-xs text-[#888888] max-w-md mx-auto mb-6 leading-relaxed">
              Revolve AI will scan your product catalog and commerce signals to autonomously formulate high-margin bundle, upsell, and pricing opportunities.
            </p>

            {/* 8-Step Commerce Decision Lifecycle */}
            <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 mb-6 text-left">
              <div className="text-[0.625rem] font-mono text-[#666666] uppercase tracking-wider font-semibold mb-3">
                Deterministic 8-Step Revenue Flow
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { step: '1. Signals', desc: 'Cart telemetry', icon: '📡' },
                  { step: '2. AI Scan', desc: 'Gemini + Groq', icon: '🧠' },
                  { step: '3. Formulate', desc: 'Margin lift', icon: '🎯' },
                  { step: '4. Policy Gate', desc: '₹10k threshold', icon: '🛡️' },
                  { step: '5. Approval', desc: 'Human-in-loop', icon: '✍️' },
                  { step: '6. Execution', desc: 'Razorpay order', icon: '💳' },
                  { step: '7. HMAC Seal', desc: 'Cryptographic', icon: '🔒' },
                  { step: '8. Ledger', desc: 'Audit trail', icon: '📜' },
                ].map((item) => (
                  <div key={item.step} className="p-2 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
                    <div className="flex items-center gap-1.5 font-semibold text-white text-[0.6875rem]">
                      <span>{item.icon}</span>
                      <span>{item.step}</span>
                    </div>
                    <div className="text-[0.625rem] text-[#888888] mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/catalog">
                <Button variant="primary" size="sm">
                  <Layers size={13} />
                  <span>Connect Catalog</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwitchToDemo}
                disabled={isSwitchingWorkspace}
              >
                <Sparkles size={13} className="text-[#F59E0B]" />
                <span>{isSwitchingWorkspace ? 'Switching...' : 'Explore Demo Opportunity'}</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Empty State: Filter Stage Cleared */
          <div className="card text-center py-16 px-6 max-w-xl mx-auto bg-[#0D0D0D] border border-[#262626] rounded-xl">
            <div className="w-12 h-12 rounded-full bg-[var(--ai-bg)] border border-[var(--ai-border)] flex items-center justify-center mx-auto mb-3 text-[var(--ai-primary)]">
              <Brain size={24} />
            </div>
            <h3 className="font-heading font-bold text-base text-white mb-1">
              No Opportunities in Stage &ldquo;{stageFilter}&rdquo;
            </h3>
            <p className="text-xs text-[#888888] max-w-sm mx-auto mb-5 leading-relaxed">
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
    </div>
  );
}
