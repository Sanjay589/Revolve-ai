'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Shield, Settings } from 'lucide-react';
import { AgentStatus } from './agent-status';
import { NotificationBell } from './notification-bell';

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
        <div className="flex items-center gap-2 bg-[#141414] px-3.5 py-1.5 rounded-full border border-[#262626] w-60 focus-within:w-72 focus-within:border-[#00C076] transition-all">
          <Search size={14} className="text-[#666666] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search payments, items..."
            className="bg-transparent border-none outline-none text-xs text-white placeholder-[#666666] w-full font-body"
          />
        </div>

        {/* Live Agent Status */}
        <AgentStatus />

        {/* Test Mode Badge with liquid-glass */}
        <span className="liquid-glass text-[#00C076] border border-[#00C076]/30 text-[0.6875rem] py-1 px-3 rounded-full font-semibold inline-flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C076] animate-pulse" />
          <Shield size={11} /> Test Mode
        </span>

        {/* Notification Bell */}
        <NotificationBell />

        {/* Settings Shortcut */}
        <Link
          href="/settings"
          className="w-8 h-8 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center text-[#A6A6A6] hover:text-white hover:bg-[#1F1F1F] transition-colors"
          title="Settings & Policies"
        >
          <Settings size={15} />
        </Link>

        {/* Merchant Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-[#262626]">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs font-heading shadow-xs">
              A
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00C076] border-2 border-black" />
          </div>
        </div>
      </div>
    </header>
  );
};
