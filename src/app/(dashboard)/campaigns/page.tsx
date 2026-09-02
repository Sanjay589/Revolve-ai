'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Sparkles, TrendingUp, RefreshCw, Calendar, Tag, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal } from '@/components/ui/modal';
import { Input, Textarea } from '@/components/ui/form';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

interface CampaignItem {
  id: string;
  name: string;
  description?: string | null;
  targetAudience?: string | null;
  discountPercent?: number | null;
  budget?: number | null;
  spent: number;
  status: string;
  isAiGenerated: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [discountPercent, setDiscountPercent] = useState('10');
  const [budgetRupees, setBudgetRupees] = useState('10000');

  const { success, error } = useToast();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          targetAudience,
          discountPercent: parseFloat(discountPercent) || 0,
          budget: Math.round(parseFloat(budgetRupees) * 100),
          isAiGenerated: false,
        }),
      });

      if (!res.ok) throw new Error('Failed to create campaign');
      success('Campaign Created', `${name} scheduled.`);
      setIsModalOpen(false);
      setName('');
      setDescription('');
      fetchCampaigns();
    } catch (err: unknown) {
      error('Error', err instanceof Error ? err.message : 'Error creating campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="PROMOTIONS &amp; CAMPAIGNS"
        badgeVariant="neutral"
        badgeIcon={<Megaphone size={12} />}
        title="Autonomous Campaigns &amp; Offers"
        description="Manage merchant promotions, bounded discount structures, and AI-generated dynamic checkout offers."
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" onClick={fetchCampaigns} disabled={isLoading}>
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus size={14} />
              <span>Create Campaign</span>
            </Button>
          </div>
        }
      />

      {/* ── Campaigns Grid ──────────────────────────────────── */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          <Skeleton height={200} />
          <Skeleton height={200} />
        </div>
      ) : campaigns.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {campaigns.map((c) => (
            <div key={c.id} className="editorial-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span className={`badge ${c.isAiGenerated ? 'badge-ai' : 'badge-neutral'}`} style={{ fontSize: '0.6875rem' }}>
                    {c.isAiGenerated ? <Sparkles size={11} /> : <Megaphone size={11} />} {c.isAiGenerated ? 'AI Generated' : 'Manual'}
                  </span>
                  <span className={`badge ${c.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '0.6875rem' }}>
                    {c.status}
                  </span>
                </div>

                <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {c.name}
                </h3>

                {c.description && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.4 }}>
                    {c.description}
                  </p>
                )}
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 10,
                  borderTop: '1px solid var(--border-secondary)',
                }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Discount</div>
                    <div className="font-mono" style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {c.discountPercent}% OFF
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Budget Cap</div>
                    <div className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {c.budget ? formatCurrency(c.budget) : 'Unlimited'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="editorial-card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-tertiary)' }}>
          <Megaphone size={32} style={{ margin: '0 auto 10px', opacity: 0.6 }} />
          <h3 className="font-heading" style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: 4 }}>
            No Active Campaigns
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
            Launch flash discounts or companion promotions for your catalog.
          </p>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} /> Create First Campaign
          </Button>
        </div>
      )}

      {/* ── Create Campaign Modal ───────────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Promotional Campaign"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Campaign Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Weekend Flash Cross-Sell"
          />

          <Textarea
            label="Objective / Target Context"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe promotion target or bundle rules..."
            rows={2}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="Discount (%)"
              required
              type="number"
              max="25"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="10"
            />
            <Input
              label="Budget Cap (₹)"
              type="number"
              value={budgetRupees}
              onChange={(e) => setBudgetRupees(e.target.value)}
              placeholder="10000"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Schedule Campaign
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
