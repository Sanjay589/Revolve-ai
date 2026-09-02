'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Sparkles, TrendingUp, RefreshCw, Calendar, Tag } from 'lucide-react';
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
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-fintech">
              <Megaphone size={12} /> PROMOTIONS &amp; CAMPAIGNS
            </span>
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Autonomous Campaigns &amp; Offers
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Manage merchant promotions, bounded discount structures, and AI-generated flash offers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outline" size="sm" onClick={fetchCampaigns} disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} />
            <span>Create Campaign</span>
          </Button>
        </div>
      </div>

      {/* Campaigns Grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          <Skeleton height={200} />
          <Skeleton height={200} />
        </div>
      ) : campaigns.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {campaigns.map((c) => (
            <div key={c.id} className="editorial-card flex flex-col justify-between" style={{ height: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className={`badge ${c.isAiGenerated ? 'badge-ai' : 'badge-neutral'}`} style={{ fontSize: '0.6875rem' }}>
                    {c.isAiGenerated ? <Sparkles size={11} /> : <Megaphone size={11} />} {c.isAiGenerated ? 'AI Generated' : 'Manual'}
                  </span>
                  <span className={`badge ${c.status === 'ACTIVE' ? 'badge-fintech' : 'badge-neutral'}`} style={{ fontSize: '0.6875rem' }}>
                    {c.status}
                  </span>
                </div>

                <h3 className="font-heading" style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {c.name}
                </h3>

                {c.description && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                    {c.description}
                  </p>
                )}
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 12,
                  borderTop: '1px solid var(--border-secondary)',
                  marginTop: 12,
                }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>DISCOUNT</div>
                    <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--fintech-primary)' }}>
                      {c.discountPercent ? `${c.discountPercent}% OFF` : 'Special Offer'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>BUDGET SPENT</div>
                    <div className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      {formatCurrency(c.spent)} / {c.budget ? formatCurrency(c.budget) : 'Uncapped'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="editorial-card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-tertiary)' }}>
          <Megaphone size={36} style={{ margin: '0 auto 12px', opacity: 0.6 }} />
          <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 4 }}>
            No Active Campaigns
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
            Create custom discounts or authorize recommendations from the AI Agent.
          </p>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={14} /> Create First Campaign
          </Button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Commerce Campaign"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Campaign Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Autumn Runner Flash Upsell"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input
              label="Discount Percentage (%)"
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              required
            />
            <Input
              label="Budget Ceiling (₹ INR)"
              type="number"
              value={budgetRupees}
              onChange={(e) => setBudgetRupees(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Description & Offer Copy"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Promotion terms and companion offer incentives..."
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Launch Campaign
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
