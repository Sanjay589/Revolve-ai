'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Search, Zap, Shield, ShoppingCart, HelpCircle } from 'lucide-react';

interface AICommandCenterProps {
  onTriggerScan?: () => void;
}

export const AICommandCenter: React.FC<AICommandCenterProps> = ({ onTriggerScan }) => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const suggestedCommands = [
    { label: 'Find my biggest revenue opportunity', action: () => { if (onTriggerScan) onTriggerScan(); else router.push('/ai-agent'); } },
    { label: 'Which products should I bundle?', action: () => router.push('/opportunities') },
    { label: 'Review pending approvals', action: () => router.push('/approvals') },
    { label: 'Show recent verified orders', action: () => router.push('/transactions') },
    { label: 'Find products under ₹5,000', action: () => router.push('/ai-buyers') },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.toLowerCase().trim();
    if (!q) return;

    if (q.includes('scan') || q.includes('opportunity') || q.includes('bundle') || q.includes('grow')) {
      if (onTriggerScan) onTriggerScan();
      else router.push('/ai-agent');
    } else if (q.includes('approval') || q.includes('authorize') || q.includes('pending')) {
      router.push('/approvals');
    } else if (q.includes('buy') || q.includes('shoe') || q.includes('product') || q.includes('search')) {
      router.push('/ai-buyers');
    } else if (q.includes('transaction') || q.includes('payment') || q.includes('order')) {
      router.push('/transactions');
    } else if (q.includes('audit') || q.includes('log') || q.includes('history')) {
      router.push('/audit');
    } else {
      router.push('/ai-agent');
    }
    setQuery('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      <form onSubmit={handleSubmit} className="ai-command-bar">
        <Sparkles size={18} style={{ color: 'var(--ai-primary)', flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What would you like Revolve AI to do? (e.g., scan catalog, review approvals, find opportunities)"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            width: '100%',
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
          }}
        />
        <button
          type="submit"
          className="btn btn-fintech btn-sm"
          style={{ flexShrink: 0, padding: '6px 14px' }}
        >
          <span>Ask AI</span>
          <ArrowRight size={14} />
        </button>
      </form>

      {/* Suggested Quick Commands */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Zap size={12} /> SUGGESTED:
        </span>
        {suggestedCommands.map((cmd) => (
          <button
            key={cmd.label}
            onClick={cmd.action}
            type="button"
            className="command-chip"
          >
            {cmd.label}
          </button>
        ))}
      </div>
    </div>
  );
};
