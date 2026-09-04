'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  Play,
  AlertTriangle,
  XCircle,
  Check,
  Zap,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';
import { FloatingCommerceObjects } from '@/components/ui/floating-commerce-objects';
import { useToast } from '@/components/ui/toast';
import { formatCurrency } from '@/lib/utils';

export default function SettingsPage() {
  const [maxTxRupees, setMaxTxRupees] = useState('10000');
  const [dailySpendRupees, setDailySpendRupees] = useState('50000');
  const [maxBudgetRupees, setMaxBudgetRupees] = useState('25000');
  const [maxDiscount, setMaxDiscount] = useState('20');
  const [requireApproval, setRequireApproval] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  // Simulator State
  const [simAmount, setSimAmount] = useState('12500');
  const [simDiscount, setSimDiscount] = useState('15');
  const [simResult, setSimResult] = useState<{
    passed: boolean;
    reasons: string[];
    action: 'EXECUTE' | 'INTERCEPT' | 'BLOCK';
  } | null>(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await fetch('/api/settings/policies');
        if (res.ok) {
          const data = await res.json();
          const p = data.policy;
          if (p) {
            setMaxTxRupees((p.maximumTransactionAmount / 100).toString());
            setDailySpendRupees((p.dailySpendLimit / 100).toString());
            setMaxBudgetRupees((p.maximumCampaignBudget / 100).toString());
            setMaxDiscount(p.maximumDiscountPercentage.toString());
            setRequireApproval(p.requireMerchantApproval);
          }
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        maximumTransactionAmount: Math.round(parseFloat(maxTxRupees) * 100),
        dailySpendLimit: Math.round(parseFloat(dailySpendRupees) * 100),
        maximumCampaignBudget: Math.round(parseFloat(maxBudgetRupees) * 100),
        maximumDiscountPercentage: parseFloat(maxDiscount),
        requireMerchantApproval: requireApproval,
      };

      const res = await fetch('/api/settings/policies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update policies');
      }

      success('Policy Updated', 'Guardrails actively enforced on all AI actions.');
    } catch (err: unknown) {
      error('Error', err instanceof Error ? err.message : 'Could not save policy');
    } finally {
      setIsSaving(false);
    }
  };

  const runSimulation = () => {
    const amount = parseFloat(simAmount) || 0;
    const discount = parseFloat(simDiscount) || 0;
    const maxTx = parseFloat(maxTxRupees) || 10000;
    const dailyCap = parseFloat(dailySpendRupees) || 50000;
    const maxDisc = parseFloat(maxDiscount) || 20;

    const reasons: string[] = [];
    let passed = true;

    if (amount > maxTx) {
      passed = false;
      reasons.push(
        `Amount ₹${amount.toLocaleString('en-IN')} exceeds single transaction limit of ₹${maxTx.toLocaleString('en-IN')}`
      );
    }

    if (amount > dailyCap) {
      passed = false;
      reasons.push(
        `Amount ₹${amount.toLocaleString('en-IN')} exceeds aggregate daily spend cap of ₹${dailyCap.toLocaleString('en-IN')}`
      );
    }

    if (discount > maxDisc) {
      passed = false;
      reasons.push(`Discount of ${discount}% exceeds maximum allowed limit of ${maxDisc}%`);
    }

    if (passed) {
      if (requireApproval && amount > maxTx * 0.5) {
        setSimResult({
          passed: true,
          reasons: [
            'All numeric guardrails satisfied',
            'Merchant policy rule requires human authorization for transactions > 50% of threshold',
          ],
          action: 'INTERCEPT',
        });
      } else {
        setSimResult({
          passed: true,
          reasons: ['All policy checks passed without breach. Deterministic green light.'],
          action: 'EXECUTE',
        });
      }
    } else {
      setSimResult({
        passed: false,
        reasons,
        action: 'BLOCK',
      });
    }
  };

  return (
    <div className="relative space-y-6">
      <FloatingCommerceObjects intensity="minimal" />

      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="CONTROLS &amp; POLICIES"
        badgeVariant="neutral"
        badgeIcon={<Sliders size={12} />}
        title="Safety"
        italicAccent="Guardrails"
        description="Define strict financial limits, automated thresholds, and human-in-the-loop authorization gates. The merchant maintains absolute control."
      />

      {/* ── Policy Configuration Card ────────────────────────── */}
      <div className="editorial-card p-6 bg-[#0D0D0D] border border-[#262626] rounded-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#00C076]/10 border border-[#00C076]/30 flex items-center justify-center">
            <Shield size={18} className="text-[#00C076]" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-white">
              Agent Financial Guardrails
            </h3>
            <p className="text-xs text-[#888888]">
              Rules evaluated dynamically by the Policy Interceptor before any AI action or payment executes.
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePolicy} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Max Single Transaction (₹ INR)"
              type="number"
              value={maxTxRupees}
              onChange={(e) => setMaxTxRupees(e.target.value)}
              required
              helperText="Transactions exceeding this cap require human approval."
            />

            <Input
              label="Daily Spend Limit (₹ INR)"
              type="number"
              value={dailySpendRupees}
              onChange={(e) => setDailySpendRupees(e.target.value)}
              required
              helperText="Maximum aggregate spending per calendar day."
            />

            <Input
              label="Max Campaign Budget (₹ INR)"
              type="number"
              value={maxBudgetRupees}
              onChange={(e) => setMaxBudgetRupees(e.target.value)}
              required
              helperText="Cap on automated coupon campaign budgets."
            />

            <Input
              label="Max Discount Percentage (%)"
              type="number"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              required
              helperText="Maximum allowed discount percentage for AI offers."
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#141414] rounded-lg border border-[#262626]">
            <input
              type="checkbox"
              id="requireApproval"
              checked={requireApproval}
              onChange={(e) => setRequireApproval(e.target.checked)}
              className="w-4.5 h-4.5 rounded accent-[#00C076] cursor-pointer"
            />
            <label
              htmlFor="requireApproval"
              className="text-xs text-[#CCCCCC] cursor-pointer leading-relaxed"
            >
              <strong className="text-white">Require Merchant Approval for High-Impact Actions:</strong>{' '}
              Always intercept significant AI price adjustments and campaign allocations through the Approval Security Center.
            </label>
          </div>

          <div className="flex justify-end">
            <Button variant="primary" type="submit" isLoading={isSaving}>
              <Save size={14} />
              <span>Save Guardrail Policies</span>
            </Button>
          </div>
        </form>
      </div>

      {/* ── Live Policy Interceptor Simulator ────────────────── */}
      <div className="p-6 bg-[#0D0D0D] border border-[#262626] rounded-xl space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#818CF8]/10 border border-[#818CF8]/30 flex items-center justify-center">
              <Zap size={18} className="text-[#818CF8]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Live Policy Interceptor Simulator
              </h3>
              <p className="text-xs text-[#888888]">
                Test how the deterministic policy gate responds to candidate order amounts and discount boundaries.
              </p>
            </div>
          </div>

          {/* Quick Scenario Preset Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[0.6875rem] text-[#666666] uppercase font-bold">Presets:</span>
            {[
              { label: '₹5,000 (Safe)', amt: '5000', disc: '10' },
              { label: '₹10,000 (Limit)', amt: '10000', disc: '20' },
              { label: '₹15,000 (Exceeds)', amt: '15000', disc: '15' },
              { label: '₹60,000 (Over Daily)', amt: '60000', disc: '10' },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setSimAmount(p.amt);
                  setSimDiscount(p.disc);
                }}
                className="px-2.5 py-1 rounded bg-[#141414] hover:bg-[#1F1F1F] border border-[#262626] text-[0.6875rem] text-[#CCCCCC] font-mono transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-[#888888] mb-1.5">
              Candidate Order Amount (₹)
            </label>
            <input
              type="number"
              value={simAmount}
              onChange={(e) => setSimAmount(e.target.value)}
              className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#00C076]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#888888] mb-1.5">
              Proposed Discount (%)
            </label>
            <input
              type="number"
              value={simDiscount}
              onChange={(e) => setSimDiscount(e.target.value)}
              className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#00C076]"
            />
          </div>

          <Button
            variant="ai"
            size="sm"
            onClick={runSimulation}
            className="w-full justify-center h-[34px]"
          >
            <Play size={13} />
            <span>Evaluate Policy Gate</span>
          </Button>
        </div>

        {/* Simulation Output Card */}
        {simResult && (
          <div
            className={`p-4 rounded-lg border transition-all ${
              simResult.action === 'EXECUTE'
                ? 'bg-[#00C076]/10 border-[#00C076]/30 text-[#00C076]'
                : simResult.action === 'INTERCEPT'
                ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]'
                : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-heading font-bold text-sm">
                {simResult.action === 'EXECUTE' ? (
                  <>
                    <CheckCircle2 size={16} /> PASSED — Deterministic Green Light
                  </>
                ) : simResult.action === 'INTERCEPT' ? (
                  <>
                    <AlertTriangle size={16} /> INTERCEPTED — Rerouted to Approval Security Center
                  </>
                ) : (
                  <>
                    <XCircle size={16} /> BLOCKED BY MERCHANT POLICY
                  </>
                )}
              </div>
              <span className="text-[0.6875rem] font-mono uppercase tracking-wider font-bold">
                {simResult.action}
              </span>
            </div>

            <ul className="space-y-1 text-xs list-disc list-inside text-[#CCCCCC]">
              {simResult.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
