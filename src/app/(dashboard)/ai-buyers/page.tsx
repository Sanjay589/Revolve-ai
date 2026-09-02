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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckoutModal } from '@/components/checkout-modal';
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
    <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-ai">
              <Bot size={12} /> AGENTIC COMMERCE
            </span>
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            AI Buyer Discovery
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Natural language product discovery, intelligent feature ranking & bounded Razorpay checkouts.
          </p>
        </div>
      </div>

      {/* Agentic Flow Indicator */}
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
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-primary)', fontWeight: 600 }}>
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

      {/* Chat Messages Area */}
      <div className="editorial-card" style={{ minHeight: 460, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto', maxHeight: 520, paddingRight: 4 }}>
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

                <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-lg)',
                    background: isAgent ? 'var(--bg-tertiary)' : 'var(--text-primary)',
                    color: isAgent ? 'var(--text-primary)' : 'var(--text-inverse)',
                    fontSize: '0.875rem',
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
                              <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {formatCurrency(p.price)}
                              </div>
                            </div>

                            <h4 className="font-heading" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                              {p.name}
                            </h4>

                            {p.reasoning && (
                              <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--fintech-text)',
                                background: 'var(--fintech-bg)',
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
                            variant="fintech"
                            size="sm"
                            style={{ width: '100%' }}
                            onClick={() => setCheckoutProduct({
                              id: p.id,
                              name: p.name,
                              price: p.price,
                              description: p.description,
                            })}
                          >
                            <ShoppingBag size={14} />
                            <span>Buy with Razorpay</span>
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
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
              <Bot size={18} className="animate-spin" />
              <span>Analyzing catalog and ranking matching items...</span>
            </div>
          )}
        </div>

        {/* Query Input Form */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-secondary)' }}>
          {/* Quick Prompts */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 12, paddingBottom: 4 }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Zap size={11} /> TRY:
            </span>
            {[
              'Running shoes under ₹5,000',
              'Best laptop sleeve for travel',
              'High-performance laptop accessories',
              'Water-resistant backpack',
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleFastQuery(prompt)}
                type="button"
                className="command-chip"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Describe what you want to buy (e.g. daily running shoes under ₹5,000)..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)',
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
            setMessages((prev) => [
              ...prev,
              {
                id: `ord_${Date.now()}`,
                sender: 'agent',
                text: `Payment verified for ${checkoutProduct.name}! Your order has been recorded with HMAC signature verification.`,
              },
            ]);
          }}
        />
      )}
    </div>
  );
}
