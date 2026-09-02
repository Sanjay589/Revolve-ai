'use client';

import React from 'react';
import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/top-bar';
import { MobileNav } from '@/components/mobile-nav';
import { ToastProvider } from '@/components/ui/toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="finpilot-shell">
        {/* Floating Left Sidebar (Desktop) */}
        <Sidebar />

        {/* Mobile Navigation Header & Bottom Tabs (< 1025px) */}
        <MobileNav />

        {/* Main Dashboard Content Area */}
        <div className="finpilot-main">
          {/* Shared TopBar Header (Desktop) */}
          <TopBar />

          {/* Page Content Container */}
          <main className="finpilot-content-container">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
