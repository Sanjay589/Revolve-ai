'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { ToastProvider } from '@/components/ui/toast';
import { AgentStatus } from '@/components/agent-status';
import { NotificationBell } from '@/components/notification-bell';
import { Shield, Sparkles, Search, Settings, User } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageMeta = () => {
    if (pathname.includes('/ai-agent')) return { title: 'AI Agent Brain', sub: 'Autonomous revenue intelligence and real-time catalog discovery.' };
    if (pathname.includes('/opportunities')) return { title: 'Opportunities', sub: 'Verified revenue growth opportunities and bundle proposals.' };
    if (pathname.includes('/approvals')) return { title: 'Security & Approvals', sub: 'Financial control center and bounded merchant authorization.' };
    if (pathname.includes('/ai-buyers')) return { title: 'AI Buyers', sub: 'Agentic commerce shopping and natural language checkout.' };
    if (pathname.includes('/products')) return { title: 'Products & Inventory', sub: 'Catalog management and AI feature tagging.' };
    if (pathname.includes('/catalog')) return { title: 'Catalog Feed', sub: 'Machine-readable JSON-LD public agent specification.' };
    if (pathname.includes('/campaigns')) return { title: 'Campaigns', sub: 'Bounded promotional incentives and margin-safe rules.' };
    if (pathname.includes('/transactions')) return { title: 'Payment Ledger', sub: 'Cryptographic HMAC transaction records & timeout recovery.' };
    if (pathname.includes('/audit')) return { title: 'Audit Trail', sub: 'Immutable compliance records and event stream.' };
    if (pathname.includes('/settings')) return { title: 'Policy Engine Settings', sub: 'Guardrails, limits, and merchant permission matrices.' };
    return { title: 'Dashboard', sub: 'Clarity and control over every AI commerce move you make.' };
  };

  const meta = getPageMeta();

  return (
    <ToastProvider>
      <div className="finpilot-shell">
        {/* Floating Left Sidebar */}
        <Sidebar />

        {/* Mobile Navigation Header */}
        <MobileNav />

        {/* Main Content Area */}
        <main className="finpilot-main">
          {/* Top Bar (Exact Nevia / FinPilot Structure) */}
          <header className="finpilot-topbar hidden lg:flex">
            {/* Left Page Heading */}
            <div>
              <h1 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {meta.title}
              </h1>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 2 }}>
                {meta.sub}
              </p>
            </div>

            {/* Right Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Global Search Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--bg-tertiary)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-primary)',
                width: 280,
              }}>
                <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  placeholder="Search payments, balances, or insights"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.8125rem',
                    color: 'var(--text-primary)',
                    width: '100%',
                    fontFamily: 'var(--font-body)',
                  }}
                />
              </div>

              {/* Status Badge */}
              <span className="badge badge-fintech" style={{ fontSize: '0.75rem' }}>
                <Shield size={12} /> Test Mode
              </span>

              {/* Settings Icon Button */}
              <Link href="/settings" style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}>
                <Settings size={16} />
              </Link>

              {/* Notification Bell */}
              <NotificationBell />

              {/* User Avatar Circle with Online Dot */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-heading)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}>
                  S
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2px solid var(--bg-secondary)',
                }} />
              </div>
            </div>
          </header>

          {/* Children Pages */}
          <div style={{ width: '100%' }}>
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
