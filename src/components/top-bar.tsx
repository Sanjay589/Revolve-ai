'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Shield, Settings, Database } from 'lucide-react';
import { AgentStatus } from './agent-status';
import { NotificationBell } from './notification-bell';
import { ProfileDropdown } from './profile-dropdown';

export const TopBar: React.FC = () => {
  const pathname = usePathname();
  const [isDemo, setIsDemo] = useState(false);
  const [merchantName, setMerchantName] = useState('Workspace');

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setIsDemo(Boolean(data.user.isDemoWorkspace));
          setMerchantName(data.user.merchantName || 'Workspace');
        }
      })
      .catch(() => {});
  }, []);

  const getBreadcrumb = () => {
    if (pathname.includes('/ai-agent')) return 'Intelligence / AI Agent Brain';
    if (pathname.includes('/opportunities')) return 'Intelligence / Opportunities';
    if (pathname.includes('/approvals')) return 'Intelligence / Approval Security Center';
    if (pathname.includes('/ai-buyers')) return 'Commerce / Agentic AI Buyers';
    if (pathname.includes('/products')) return 'Commerce / Products & Inventory';
    if (pathname.includes('/catalog')) return 'Commerce / Structured AI Feed';
    if (pathname.includes('/campaigns')) return 'Commerce / Growth Campaigns';
    if (pathname.includes('/transactions')) return 'Fintech / Payment Ledger';
    if (pathname.includes('/payment-observability')) return 'Fintech / Payment Observability';
    if (pathname.includes('/audit')) return 'Fintech / Audit Trail';
    if (pathname.includes('/profile')) return 'Account / User Profile';
    if (pathname.includes('/settings')) return 'Control / Policy Guardrails';
    return 'Intelligence / Merchant Dashboard';
  };

  return (
    <header className="revolve-topbar hidden lg:flex">
      {/* Left: Breadcrumb & Active Workspace Indicator */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
          {getBreadcrumb()}
        </span>

        {/* Dynamic Workspace Badge */}
        {isDemo ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.6875rem] font-bold bg-amber-950/40 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <Database size={10} /> DEMO WORKSPACE • SAMPLE DATA
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.6875rem] font-bold bg-emerald-950/40 text-[#6EE7B7] border border-[#00C076]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C076]" />
            PERSONAL WORKSPACE
          </span>
        )}
      </div>

      {/* Right: Search, Live Status, Test Mode, Alerts, Profile */}
      <div className="flex items-center gap-3">
        {/* Global Search / Command Bar */}
        <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] px-3.5 py-1.5 rounded-full border border-[var(--border-primary)] w-60 focus-within:w-72 focus-within:border-[#00C076] transition-all">
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
        <span className="liquid-glass text-[#00C076] border border-[#00C076]/30 text-[0.6875rem] py-1 px-3 rounded-full font-semibold inline-flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C076] animate-pulse" />
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

        {/* User Profile & Workspace Dropdown */}
        <div className="pl-1 border-l border-[var(--border-primary)]">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};
