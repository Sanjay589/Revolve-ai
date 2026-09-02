'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Shield, Key, Sliders, CheckCircle2, Lock, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-neutral">
            <Sliders size={12} /> CONTROLS & POLICIES
          </span>
        </div>
        <h1 className="page-title">Safety & Policy Settings</h1>
        <p className="page-subtitle">
          Configure financial guardrails, automated thresholds, and human-in-the-loop authorization gates.
        </p>
      </div>

      {/* Policy Form */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Shield size={20} color="var(--warning)" />
          <h3 className="font-heading" style={{ fontSize: '1.125rem' }}>
            Agent Financial Guardrails
          </h3>
        </div>

        <form onSubmit={handleSavePolicy} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <Input
              label="Maximum Transaction Limit (₹)"
              type="number"
              value={maxTxRupees}
              onChange={(e) => setMaxTxRupees(e.target.value)}
              hint="AI actions above this amount will be blocked from automatic checkout"
            />

            <Input
              label="Daily Aggregate Spend Limit (₹)"
              type="number"
              value={dailySpendRupees}
              onChange={(e) => setDailySpendRupees(e.target.value)}
              hint="Cumulative ceiling for all automated orders within 24 hours"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <Input
              label="Maximum Campaign Budget (₹)"
              type="number"
              value={maxBudgetRupees}
              onChange={(e) => setMaxBudgetRupees(e.target.value)}
              hint="Upper boundary for AI-proposed promotional campaigns"
            />

            <Input
              label="Max Promotional Discount (%)"
              type="number"
              min="1"
              max="100"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              hint="Ceiling on any discount generated by upsell or campaign engines"
            />
          </div>

          {/* Toggle Require Approval */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Require Merchant Approval</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                When enabled, all AI actions must be reviewed in the Approval Center before execution.
              </p>
            </div>
            <input
              type="checkbox"
              checked={requireApproval}
              onChange={(e) => setRequireApproval(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--ai-primary)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Save Guardrail Policies
            </Button>
          </div>
        </form>
      </Card>

      {/* Razorpay Integration Status Card */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Key size={20} color="var(--ai-primary)" />
          <h3 className="font-heading" style={{ fontSize: '1.125rem' }}>
            Payment Gateway Environment
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Operating Mode</span>
            <span className="badge badge-warning">RAZORPAY TEST MODE</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>HMAC Verification</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>Active (Server-side)</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Webhook Deduplication</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>Enabled (Unique eventId)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
