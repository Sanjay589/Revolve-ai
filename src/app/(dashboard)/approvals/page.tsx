'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Lock,
  AlertTriangle,
  Shield,
  Sliders,
  DollarSign,
  Activity,
  Check,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { ApprovalCard } from '@/components/approval-card';
import { Skeleton } from '@/components/ui/skeleton';
import { FloatingCommerceObjects } from '@/components/ui/floating-commerce-objects';
import { formatCurrency } from '@/lib/utils';

interface ApprovalItem {
  id: string;
  actionId: string;
  status: string;
  expiresAt: string;
  action: {
    id: string;
    type: string;
    title: string;
    description?: string | null;
    amount?: number | null;
    riskLevel: string;
    policyResult?: {
      passed: boolean;
      reasons: string[];
    } | null;
  };
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [isLoading, setIsLoading] = useState(true);

  const fetchApprovals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/approvals?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setApprovals(data.approvals || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [filter]);

  const pendingCount = approvals.filter((a) => a.status === 'PENDING').length;

  return (
    <div className="relative space-y-6">
      <FloatingCommerceObjects intensity="approvals" />

      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="HUMAN-IN-THE-LOOP AUTHORIZATION"
        badgeVariant="warning"
        badgeIcon={<ShieldCheck size={12} />}
        title="Approval Security Center"
        italicAccent="Governance"
        description="High-impact AI campaigns, discount thresholds, and financial workflows require explicit merchant authorization before execution."
        actions={
          <button
            onClick={fetchApprovals}
            disabled={isLoading}
            className="btn btn-outline btn-sm"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh Queue</span>
          </button>
        }
      />

      {/* ── Governance & Policy Threshold Monitor ────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0D0D0D] border border-[#262626] rounded-xl p-4.5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[0.6875rem] uppercase font-bold text-[#888888] tracking-wider flex items-center gap-1.5">
              <Shield size={14} className="text-[#00C076]" />
              Per-Tx Guardrail Bound
            </span>
            <span className="badge badge-fintech text-[0.625rem] py-0.5 px-2">Strict</span>
          </div>
          <div className="text-xl font-mono font-bold text-white mb-1">
            ₹10,000 max
          </div>
          <p className="text-xs text-[#888888] leading-relaxed">
            Actions above this limit are automatically intercepted for human authorization.
          </p>
        </div>

        <div className="bg-[#0D0D0D] border border-[#262626] rounded-xl p-4.5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[0.6875rem] uppercase font-bold text-[#888888] tracking-wider flex items-center gap-1.5">
              <Activity size={14} className="text-[#F59E0B]" />
              Daily Aggregate Cap
            </span>
            <span className="badge badge-warning text-[0.625rem] py-0.5 px-2">Enforced</span>
          </div>
          <div className="text-xl font-mono font-bold text-white mb-1">
            ₹50,000 cap
          </div>
          <p className="text-xs text-[#888888] leading-relaxed">
            Total autonomous order commitment allowed across all AI campaigns within 24h.
          </p>
        </div>

        <div className="bg-[#0D0D0D] border border-[#262626] rounded-xl p-4.5 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[0.6875rem] uppercase font-bold text-[#888888] tracking-wider flex items-center gap-1.5">
              <Lock size={14} className="text-[#818CF8]" />
              Cryptographic Execution
            </span>
            <span className="badge badge-ai text-[0.625rem] py-0.5 px-2">HMAC-SHA256</span>
          </div>
          <div className="text-xl font-mono font-bold text-white mb-1">
            Zero-Trust Gate
          </div>
          <p className="text-xs text-[#888888] leading-relaxed">
            Every authorized action produces an immutable audit record and signed payment payload.
          </p>
        </div>
      </div>

      {/* ── Financial Guardrail Guarantee Banner ──────────────── */}
      <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#262626] flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center shrink-0">
          <ShieldCheck size={20} className="text-[#F59E0B]" />
        </div>
        <div className="flex-1">
          <h4 className="font-heading font-semibold text-sm text-white">
            Zero Unauthorized Fund Movement
          </h4>
          <p className="text-xs text-[#888888] mt-0.5 leading-relaxed">
            AI autonomously scans catalogs and computes basket incentives. Guardrails are validated in real-time, but execution requires your direct cryptographic authorization.
          </p>
        </div>
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-[#262626] pb-2">
        <button
          onClick={() => setFilter('pending')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'pending'
              ? 'bg-white text-black shadow-xs'
              : 'bg-[#141414] text-[#888888] border border-[#262626] hover:text-white'
          }`}
        >
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-white text-black shadow-xs'
              : 'bg-[#141414] text-[#888888] border border-[#262626] hover:text-white'
          }`}
        >
          All Approvals History
        </button>
      </div>

      {/* ── Approvals List ───────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton height={180} className="rounded-xl" />
          <Skeleton height={180} className="rounded-xl" />
        </div>
      ) : approvals.length > 0 ? (
        <div className="space-y-4">
          {approvals.map((approval) => (
            <ApprovalCard
              key={approval.id}
              {...approval}
              onProcessed={fetchApprovals}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#0D0D0D] border border-[#262626] rounded-xl text-center py-14 px-6 max-w-xl mx-auto shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#00C076]/10 border border-[#00C076]/30 flex items-center justify-center mx-auto mb-4 text-[#00C076]">
            <CheckCircle2 size={28} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C076]/10 border border-[#00C076]/30 text-[#00C076] text-[0.6875rem] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck size={11} /> Policy Engine Active
          </div>
          <h3 className="font-heading font-bold text-lg text-white mb-2">
            NO PENDING APPROVALS
          </h3>
          <p className="text-xs text-[#888888] max-w-md mx-auto mb-6 leading-relaxed">
            AI actions requiring merchant authorization will appear here when order sizes or daily commitments exceed configured thresholds.
          </p>

          {/* Active Policy Status Display */}
          <div className="bg-[#141414] border border-[#262626] rounded-lg p-3.5 mb-6 text-left">
            <div className="text-[0.625rem] font-mono text-[#888888] uppercase tracking-wider font-semibold mb-2">
              Active Governance Bounds
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[#0D0D0D] border border-[#262626]">
                <div className="text-[#888888] text-[0.6875rem]">Per-Transaction Bound</div>
                <div className="font-mono font-bold text-white text-sm mt-0.5">₹10,000 max</div>
              </div>
              <div className="p-2.5 rounded bg-[#0D0D0D] border border-[#262626]">
                <div className="text-[#888888] text-[0.6875rem]">Daily Aggregate Cap</div>
                <div className="font-mono font-bold text-white text-sm mt-0.5">₹50,000 / day</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/settings"
              className="btn btn-outline btn-sm"
            >
              <SlidersHorizontal size={13} />
              <span>Configure Policies</span>
            </Link>
            <Link
              href="/opportunities"
              className="btn btn-primary btn-sm"
            >
              <Sparkles size={13} />
              <span>View AI Opportunities</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
