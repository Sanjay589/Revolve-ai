'use client';

import React from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { ToastProvider } from '@/components/ui/toast';
import { AgentStatus } from '@/components/agent-status';
import { NotificationBell } from '@/components/notification-bell';
import { Shield, Sparkles, Search, Sliders, Settings } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="dashboard-shell">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Navigation */}
        <MobileNav />

        {/* Main Content Area */}
        <main className="main-content">
          {/* Top Bar for Desktop */}
          <div className="hidden lg:flex" style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 24,
            boxShadow: 'var(--shadow-xs)',
          }}>
            {/* Global Search / Command Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '45%' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--bg-tertiary)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-secondary)',
                width: '100%',
              }}>
                <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  placeholder="Search payments, opportunities, or insights... (⌘K)"
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
                <span className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border-primary)' }}>
                  ⌘K
                </span>
              </div>
            </div>

            {/* Right Status Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="badge badge-fintech" style={{ fontSize: '0.6875rem' }}>
                <Shield size={11} /> RAZORPAY TEST MODE • BOUNDED
              </span>

              <AgentStatus />

              <div style={{ width: 1, height: 18, background: 'var(--border-primary)' }} />

              <NotificationBell />

              <Link href="/settings" style={{
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 6,
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
              }}>
                <Settings size={17} />
              </Link>

              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--text-primary)',
                color: 'var(--text-inverse)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
              }}>
                S
              </div>
            </div>
          </div>

          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
