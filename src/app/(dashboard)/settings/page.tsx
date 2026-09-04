'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, Shield, Save, CheckCircle2, Lock } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';
import { FloatingCommerceObjects } from '@/components/ui/floating-commerce-objects';
import { useToast } from '@/components/ui/toast';

export default function SettingsPage() {
  const [maxTxRupees, setMaxTxRupees] = useState('10000');
  const [dailySpendRupees, setDailySpendRupees] = useState('50000');
  const [maxBudgetRupees, setMaxBudgetRupees] = useState('25000');
  const [maxDiscount, setMaxDiscount] = useState('20');
  const [requireApproval, setRequireApproval] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

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

  return (
    <div className="relative">
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

      {/* ── Policy Form Card ────────────────────────────────── */}
      <div className="editorial-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-md)',
            background: 'var(--success-bg)', border: '1px solid var(--success-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={16} style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <h3 className="font-heading" style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Agent Financial Guardrails
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Rules evaluated dynamically before any AI action or transaction is executed.
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePolicy} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
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

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 16px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)',
          }}>
            <input
              type="checkbox"
              id="requireApproval"
              checked={requireApproval}
              onChange={(e) => setRequireApproval(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--fintech-primary)', cursor: 'pointer' }}
            />
            <label htmlFor="requireApproval" style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', cursor: 'pointer', lineHeight: 1.4 }}>
              <strong>Require Merchant Approval for High-Impact Actions:</strong> Always intercept significant AI price adjustments and campaign allocations through the Approval Security Center.
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="primary" type="submit" isLoading={isSaving}>
              Save Guardrail Policies
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
