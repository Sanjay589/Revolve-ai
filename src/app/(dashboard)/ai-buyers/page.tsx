'use client';

import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Zap
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckoutModal } from '@/components/checkout-modal';
import { FloatingCommerceObjects } from '@/components/ui/floating-commerce-objects';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    description?: string | null;
    features: string[];
    category?: string | null;
    reasoning?: string;
  }>;
  recommendation?: {
    productId: string;
    productName: string;
    reason: string;
  } | null;
}

export default function AIBuyersPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'agent',
      text: 'Welcome to Agentic Commerce. I am your autonomous AI shopping assistant. Tell me what you are looking for (e.g., "I need running shoes under ₹5,000" or "Show me laptop accessories for travel"). I will match items against the live merchant catalog and prepare a secure Razorpay checkout.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<{ id: string; name: string; price: number; description?: string | null } | null>(null);
  const { error } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: inputText,
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/buyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) throw new Error('AI Buyer failed to process request');
      const data = await res.json();
      const aiResponse = data.response;

      const agentMsg: Message = {
        id: `agt_${Date.now()}`,
        sender: 'agent',
        text: aiResponse.summary || 'I evaluated the merchant catalog for your criteria.',
        products: aiResponse.products || [],
        recommendation: aiResponse.recommendation,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: unknown) {
      error('AI Error', err instanceof Error ? err.message : 'Error in AI Buyer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFastQuery = (q: string) => {
    setInputText(q);
  };

  return (
    <div className="relative">
      <FloatingCommerceObjects intensity="ai" />

      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="AGENTIC COMMERCE"
        badgeVariant="ai"
        badgeIcon={<Bot size={12} />}
        title="AI Buyer Discovery &amp;"
        italicAccent="Checkout"
        description="Natural language product discovery, intelligent catalog matching, feature ranking, and secure Razorpay Test Mode checkout."
      />

      {/* ── Agentic Flow Indicator ──────────────────────────── */}
      <div className="editorial-card" style={{ padding: '12px 18px', background: 'var(--bg-secondary)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          fontSize: '0.75rem',
          color: 'var(--text-tertiary)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-primary)', fontWeight: 600 }}>
            1. Query Intent
          </span>
          <span>→</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-primary)', fontWeight: 600 }}>
            2. Catalog Search
          </span>
          <span>→</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--ai-text)', fontWeight: 600 }}>
            3. AI Reasoning
          </span>
          <span>→</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--fintech-primary)', fontWeight: 600 }}>
            4. Razorpay Checkout
          </span>
          <span>→</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--success)', fontWeight: 600 }}>
            5. HMAC Verification
          </span>
        </div>
      </div>

      {/* ── Chat Messages Area ──────────────────────────────── */}
      <div className="editorial-card" style={{ minHeight: 440, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', maxHeight: 520, paddingRight: 4 }}>
          {messages.map((m) => {
            const isAgent = m.sender === 'agent';

            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                  flexDirection: isAgent ? 'row' : 'row-reverse',
                }}
              >
                {isAgent && (
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--ai-bg)',
                    color: 'var(--ai-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Bot size={18} />
                  </div>
                )}

                <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-lg)',
                    background: isAgent ? 'var(--bg-tertiary)' : 'var(--text-primary)',
                    color: isAgent ? 'var(--text-primary)' : 'var(--text-inverse)',
                    fontSize: '0.8125rem',
                    lineHeight: 1.5,
                  }}>
                    {m.text}
                  </div>

                  {/* Products Grid if Returned */}
                  {m.products && m.products.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginTop: 4 }}>
                      {m.products.map((p) => (
                        <div
                          key={p.id}
                          className="editorial-card"
                          style={{
                            padding: '16px',
                            background: 'var(--bg-secondary)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            border: '1px solid var(--border-primary)',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                              <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                                {p.category || 'Product'}
                              </span>
                              <div className="font-mono" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {formatCurrency(p.price)}
                              </div>
                            </div>

                            <h4 className="font-heading" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                              {p.name}
                            </h4>

                            {p.reasoning && (
                              <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--ai-text)',
                                background: 'var(--ai-bg)',
                                padding: '4px 8px',
                                borderRadius: 'var(--radius-sm)',
                                marginBottom: 10,
                                display: 'inline-block',
                              }}>
                                <strong>Why this pick:</strong> {p.reasoning}
                              </div>
                            )}

                            {p.features && p.features.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                                {p.features.slice(0, 3).map((f, i) => (
                                  <span key={i} style={{ fontSize: '0.6875rem', padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                                    {f}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <Button
                            variant="primary"
                            size="sm"
                            style={{ width: '100%', marginTop: 8 }}
                            onClick={() => setCheckoutProduct(p)}
                          >
                            <ShoppingBag size={14} /> Buy with Razorpay
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--ai-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} style={{ color: 'var(--ai-primary)' }} />
              </div>
              <div style={{ padding: '10px 16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Evaluating product catalog &amp; generating purchase options...
              </div>
            </div>
          )}
        </div>

        {/* Input & Quick Chips Form */}
        <div style={{ marginTop: 20, borderTop: '1px solid var(--border-secondary)', paddingTop: 16 }}>
          {/* Suggestion Chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', alignSelf: 'center' }}>Try:</span>
            {[
              'Running shoes for marathons under ₹5,000',
              'Laptop with 16GB RAM for productivity',
              'Noise cancelling headphones for gym workouts',
              'Ergonomic mouse and keyboard bundle',
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                className="command-chip"
                onClick={() => handleFastQuery(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask for products, features, budgets or gift recommendations..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none',
                fontFamily: 'var(--font-body)',
              }}
            />
            <Button variant="primary" type="submit" disabled={isLoading || !inputText.trim()}>
              <Send size={15} />
              <span>Send</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutProduct && (
        <CheckoutModal
          isOpen={Boolean(checkoutProduct)}
          onClose={() => setCheckoutProduct(null)}
          product={checkoutProduct}
          onSuccess={() => {
            setCheckoutProduct(null);
          }}
        />
      )}
    </div>
  );
}
