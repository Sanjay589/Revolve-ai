'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Sparkles, TrendingUp, RefreshCw, Calendar, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-neutral">
              <Megaphone size={12} /> PROMOTIONS & GROWTH
            </span>
          </div>
          <h1 className="page-title">Growth Campaigns</h1>
          <p className="page-subtitle">
            AI-recommended promotional campaigns bounded by your merchant safety policy.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={fetchCampaigns} isLoading={isLoading}>
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> New Campaign
          </Button>
        </div>
      </div>

      {/* Campaigns Grid */}
      {campaigns.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Megaphone size={32} color="var(--text-secondary)" style={{ margin: '0 auto 12px' }} />
          <h3 className="font-heading" style={{ fontSize: '1.125rem', marginBottom: 6 }}>
            No campaigns found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>
            Create a campaign manually or let the AI Agent propose one from inventory patterns.
          </p>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Create First Campaign
          </Button>
        </Card>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}>
          {campaigns.map((c) => (
            <Card key={c.id} className="flex flex-col justify-between">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Badge variant={c.status === 'ACTIVE' ? 'success' : 'neutral'}>
                    {c.status}
                  </Badge>
                  {c.isAiGenerated && (
                    <span className="badge badge-ai" style={{ fontSize: '0.6875rem' }}>
                      <Sparkles size={10} /> AI GENERATED
                    </span>
                  )}
                </div>

                <h3 className="font-heading" style={{ fontSize: '1.125rem', marginBottom: 6 }}>
                  {c.name}
                </h3>

                {c.description && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
                    {c.description}
                  </p>
                )}

                {c.targetAudience && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 12 }}>
                    🎯 Target: {c.targetAudience}
                  </p>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--border-secondary)', paddingTop: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.8125rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Discount:</span>
                    <p style={{ fontWeight: 600 }}>{c.discountPercent ? `${c.discountPercent}%` : 'N/A'}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Budget / Spent:</span>
                    <p style={{ fontWeight: 600 }}>
                      {c.budget ? formatCurrency(c.budget) : 'N/A'} ({formatCurrency(c.spent)})
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Campaign"
        description="Must satisfy merchant policy limits"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            label="Campaign Name"
            required
            placeholder="e.g. Marathon Runners Special 10%"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            label="Description & Offer Details"
            rows={2}
            placeholder="Provide details on products eligible for discount..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            label="Target Audience"
            placeholder="e.g. Registered runners in Bengaluru & Mumbai"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="Discount (%)"
              type="number"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
            />
            <Input
              label="Budget (₹ INR)"
              type="number"
              value={budgetRupees}
              onChange={(e) => setBudgetRupees(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Launch Campaign
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
