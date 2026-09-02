'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  Brain,
  ShieldCheck,
  CreditCard,
  MoreHorizontal,
  Bot,
  Package,
  BookOpen,
  Megaphone,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { AgentStatus } from './agent-status';

const PRIMARY_MOBILE_TABS = [
  { href: '/overview', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ai-agent', label: 'AI Agent', icon: Brain },
  { href: '/approvals', label: 'Approvals', icon: ShieldCheck },
  { href: '/transactions', label: 'Transactions', icon: CreditCard },
];

const ALL_DRAWER_LINKS = [
  { href: '/overview', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ai-agent', label: 'AI Agent', icon: Brain },
  { href: '/opportunities', label: 'Opportunities', icon: Sparkles },
  { href: '/approvals', label: 'Approvals', icon: ShieldCheck },
  { href: '/ai-buyers', label: 'AI Buyers', icon: Bot },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/catalog', label: 'Catalog', icon: BookOpen },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/audit', label: 'Audit Trail', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  return (
    <>
      {/* Top Mobile Bar - strictly hidden on desktop (>= 1025px) */}
      <header className="mobile-top-bar">
        <Link href="/overview" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 28,
            height: 28,
            background: 'var(--ai-primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <span className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            REVOLVE AI
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AgentStatus />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="btn btn-ghost btn-icon"
            aria-label="Toggle Navigation Menu"
          >
            {drawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Slide-out Menu Overlay */}
      {drawerOpen && (
        <div
          className="overlay mobile-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
          style={{ paddingTop: 60, alignItems: 'flex-start' }}
        >
          <div
            style={{
              width: '100%',
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-primary)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              maxHeight: 'calc(100vh - 60px)',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {ALL_DRAWER_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  style={{ width: '100%', margin: '2px 0' }}
                >
                  <Icon size={18} className="nav-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div style={{ borderTop: '1px solid var(--border-secondary)', paddingTop: 8, marginTop: 8 }}>
              <button
                type="button"
                onClick={handleLogout}
                className="sidebar-nav-item"
                style={{ width: '100%', margin: 0, color: 'var(--error)' }}
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Mobile Navigation - strictly hidden on desktop (>= 1025px) */}
      <nav className="mobile-bottom-bar">
        {PRIMARY_MOBILE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                textDecoration: 'none',
                color: isActive ? 'var(--ai-primary)' : 'var(--text-secondary)',
                fontSize: '0.6875rem',
                fontWeight: isActive ? 600 : 500,
                padding: '6px 12px',
              }}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '0.6875rem',
            fontWeight: 500,
            padding: '6px 12px',
            cursor: 'pointer',
          }}
        >
          <MoreHorizontal size={18} />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
