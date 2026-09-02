'use client';

import React from 'react';
import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { ToastProvider } from '@/components/ui/toast';
import { AgentStatus } from '@/components/agent-status';
import { NotificationBell } from '@/components/notification-bell';
import { Shield } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        {/* Top Test Mode Banner */}
        <div className="test-mode-banner">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Shield size={12} /> RAZORPAY TEST MODE ENVIRONMENT • SYNTHESIZING LIVE MERCHANT GROWTH
          </span>
        </div>

        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Navigation */}
        <MobileNav />

        {/* Main Content Area */}
        <div className="main-content">
          {/* Desktop Top Header Bar */}
          <div className="hidden lg:flex" style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
          }}>
            <AgentStatus />
            <NotificationBell />
          </div>

          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
