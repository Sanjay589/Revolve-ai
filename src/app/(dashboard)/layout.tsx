'use client';

import React from 'react';
import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { ToastProvider } from '@/components/ui/toast';
import { AgentStatus } from '@/components/agent-status';
import { NotificationBell } from '@/components/notification-bell';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="badge badge-fintech" style={{ fontSize: '0.6875rem' }}>
                <Shield size={12} /> RAZORPAY TEST MODE • BOUNDED AI COMMERCE
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                Policy Guardrails Active (₹10,000 max / tx)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AgentStatus />
              <div style={{ width: 1, height: 20, background: 'var(--border-primary)' }} />
              <NotificationBell />
            </div>
          </div>

          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
