'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Shield, Key, Sliders, CheckCircle2, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';
import { useToast } from '@/components/ui/toast';
import { formatCurrency } from '@/lib/utils';

export default function SettingsPage() {
  const [maxTxRupees, setMaxTxRupees] = useState('10000');
  const [dailySpendRupees, setDailySpendRupees] = useState('50000');
  const [maxBudgetRupees, setMaxBudgetRupees] = useState('20000');
  const [maxDiscount, setMaxDiscount] = useState('25');
  const [requireApproval, setRequireApproval] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { success, error } = useToast();

  const fetchPolicy = async () => {
    setIsLoading(true);
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

  useEffect(() => {
    fetchPolicy();
  }, []);

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/settings/policies', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maximumTransactionAmount: Math.round(parseFloat(maxTxRupees) * 100),
          dailySpendLimit: Math.round(parseFloat(dailySpendRupees) * 100),
          maximumCampaignBudget: Math.round(parseFloat(maxBudgetRupees) * 100),
          maximumDiscountPercentage: parseFloat(maxDiscount),
          requireMerchantApproval: requireApproval,
        }),
      });

      if (!res.ok) throw new Error('Failed to update policy');
      success('Policy Updated', 'Safety guardrails have been applied in real-time.');
    } catch (err: unknown) {
      error('Save Failed', err instanceof Error ? err.message : 'Error updating policy');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-fintech">
            <Sliders size={12} /> CONTROLS &amp; POLICIES
          </span>
        </div>
        <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Safety &amp; Policy Settings
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: 2 }}>
          Configure financial guardrails, automated thresholds, and human-in-the-loop authorization gates.
        </p>
      </div>

      {/* Policy Form */}
      <div className="editorial-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Shield size={20} style={{ color: 'var(--fintech-primary)' }} />
          <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Agent Financial Guardrails
          </h3>
        </div>

        <form onSubmit={handleSavePolicy} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
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
            padding: '16px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-secondary)',
          }}>
            <input
              type="checkbox"
              id="requireApproval"
              checked={requireApproval}
              onChange={(e) => setRequireApproval(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--fintech-primary)', cursor: 'pointer' }}
            />
            <label htmlFor="requireApproval" style={{ fontSize: '0.875rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <strong>Require Merchant Approval for High-Impact Changes:</strong> Always route significant AI price adjustments and campaign allocations through the Approval Security Center.
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Button variant="primary" type="submit" isLoading={isSaving}>
              Save Guardrail Policies
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
