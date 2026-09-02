'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Shield, Settings, Sparkles } from 'lucide-react';
import { AgentStatus } from './agent-status';
import { NotificationBell } from './notification-bell';
import { ThemeToggle } from './theme-toggle';

export const TopBar: React.FC = () => {
  const pathname = usePathname();

  const getBreadcrumb = () => {
    if (pathname.includes('/ai-agent')) return 'Intelligence / AI Agent Brain';
    if (pathname.includes('/opportunities')) return 'Intelligence / Opportunities';
    if (pathname.includes('/approvals')) return 'Intelligence / Approval Security Center';
    if (pathname.includes('/ai-buyers')) return 'Commerce / Agentic AI Buyers';
    if (pathname.includes('/products')) return 'Commerce / Products & Inventory';
    if (pathname.includes('/catalog')) return 'Commerce / Structured AI Feed';
    if (pathname.includes('/campaigns')) return 'Commerce / Growth Campaigns';
    if (pathname.includes('/transactions')) return 'Operations / Payment Ledger';
    if (pathname.includes('/audit')) return 'Operations / Audit Trail';
    if (pathname.includes('/settings')) return 'Control / Policy Guardrails';
    return 'Intelligence / Merchant Dashboard';
  };

  return (
    <header className="finpilot-topbar hidden lg:flex">
      {/* Left: Breadcrumb / Workspace context */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
          {getBreadcrumb()}
        </span>
      </div>

      {/* Right: Search, Live Status, Test Mode, Alerts, Profile */}
      <div className="flex items-center gap-3">
        {/* Global Search / Command Bar */}
        <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] px-3.5 py-1.5 rounded-full border border-[var(--border-primary)] w-60 focus-within:w-72 focus-within:border-[var(--ai-primary)] transition-all">
          <Search size={14} className="text-[var(--text-tertiary)] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search payments, items..."
            className="bg-transparent border-none outline-none text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] w-full font-body"
          />
        </div>

        {/* Live Agent Status */}
        <AgentStatus />

        {/* Test Mode Badge */}
        <span className="badge badge-success text-[0.6875rem] py-1 px-2.5">
          <Shield size={11} /> Test Mode
        </span>

        {/* Notification Bell */}
        <NotificationBell />

        {/* Settings Shortcut */}
        <Link
          href="/settings"
          className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          title="Settings & Policies"
        >
          <Settings size={15} />
        </Link>

        {/* Merchant Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-[var(--border-primary)]">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[var(--text-primary)] text-[var(--text-inverse)] flex items-center justify-center font-bold text-xs font-heading shadow-xs">
              A
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[var(--success)] border-2 border-[var(--bg-secondary)]" />
          </div>
        </div>
      </div>
    </header>
  );
};
