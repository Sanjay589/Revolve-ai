'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
      text: 'Hello! I am your AI Buyer Agent. Tell me what you are looking for (e.g. "I need running shoes under ₹5,000" or "Show me laptop accessories for travel"). I will discover matching items from the catalog and can initiate a secure bounded purchase.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<{ id: string; name: string; price: number; description?: string | null } | null>(null);
  const { success, error } = useToast();

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
        text: aiResponse.summary || 'I analyzed the catalog for your request.',
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
    <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-ai">
              <Bot size={12} /> AGENTIC COMMERCE
            </span>
          </div>
          <h1 className="page-title">AI Buyer Discovery</h1>
          <p className="page-subtitle">
            Autonomous agent product discovery, recommendation explanations & bounded Razorpay purchase flow.
          </p>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          'I need running shoes under ₹5,000',
          'Show me laptop accessories for travel',
          'Find high performance athletic socks',
          'What is the best smartwatch for cardio?',
        ].map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleFastQuery(prompt)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <Card style={{ padding: '24px', minHeight: 480, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Messages Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto', marginBottom: 20 }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-lg)',
                  background: m.sender === 'user' ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                  color: m.sender === 'user' ? 'var(--text-inverse)' : 'var(--text-primary)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.5,
                }}
              >
                {m.text}
              </div>

              {/* Product Cards Carousel / Grid */}
              {m.products && m.products.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 16,
                  width: '100%',
                  marginTop: 16,
                }}>
                  {m.products.map((p) => (
                    <div
                      key={p.id}
                      className="card"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: m.recommendation?.productId === p.id ? '2px solid var(--ai-primary)' : '1px solid var(--border-primary)',
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        {m.recommendation?.productId === p.id && (
                          <span className="badge badge-ai" style={{ marginBottom: 8, fontSize: '0.6875rem' }}>
                            <Sparkles size={10} /> TOP MATCH
                          </span>
                        )}
                        <h4 className="font-heading" style={{ fontSize: '1rem', marginBottom: 4 }}>
                          {p.name}
                        </h4>
                        <p className="font-heading font-bold" style={{ fontSize: '1.125rem', color: 'var(--ai-primary)', marginBottom: 8 }}>
                          {formatCurrency(p.price)}
                        </p>
                        {p.reasoning && (
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', marginBottom: 12 }}>
                            💡 {p.reasoning}
                          </p>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setCheckoutProduct(p)}
                        style={{ marginTop: 8 }}
                      >
                        <ShoppingBag size={14} /> Buy with Razorpay
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
              <span className="ai-pulse" />
              <span>AI Buyer is searching catalog and comparing options...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border-secondary)', paddingTop: 16 }}>
          <input
            type="text"
            className="input"
            placeholder="Ask AI Buyer for any product, budget limit or feature..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            style={{ flex: 1 }}
          />
          <Button type="submit" variant="ai" disabled={!inputText.trim() || isLoading}>
            <Send size={16} /> Send
          </Button>
        </form>
      </Card>

      {/* Checkout Modal Integration for Real Test Mode Payment */}
      {checkoutProduct && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setCheckoutProduct(null)}
          product={checkoutProduct}
          onSuccess={() => {
            success('Purchase Complete', `Order for ${checkoutProduct.name} successfully created and verified.`);
          }}
        />
      )}
    </div>
  );
}
