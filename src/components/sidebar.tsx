'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Brain,
  Sparkles,
  ShieldCheck,
  Bot,
  Package,
  BookOpen,
  Megaphone,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  Sliders
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const NAV_GROUPS = [
  {
    title: 'OPERATE',
    items: [
      { href: '/overview', label: 'Overview', icon: LayoutDashboard },
      { href: '/ai-agent', label: 'AI Agent', icon: Brain },
      { href: '/opportunities', label: 'Opportunities', icon: Sparkles },
      { href: '/approvals', label: 'Approvals', icon: ShieldCheck },
    ],
  },
  {
    title: 'COMMERCE',
    items: [
      { href: '/products', label: 'Products', icon: Package },
      { href: '/ai-buyers', label: 'AI Buyers', icon: Bot },
      { href: '/catalog', label: 'Catalog Feed', icon: BookOpen },
      { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
    ],
  },
  {
    title: 'CONTROL',
    items: [
      { href: '/transactions', label: 'Transactions', icon: CreditCard },
      { href: '/audit', label: 'Audit Trail', icon: FileText },
      { href: '/settings', label: 'Policies', icon: Sliders },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{
        padding: '18px 18px 14px',
        borderBottom: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/overview" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.9375rem',
            fontFamily: 'var(--font-heading)',
          }}>
            R
          </div>
          <div>
            <div className="font-heading" style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              REVOLVE AI
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
              Commerce Operating OS
            </div>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Workspace Selector Badge (Like Nevia / FinPilot) */}
      <div style={{ padding: '12px 14px 6px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-secondary)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            <div style={{
              width: 22,
              height: 22,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--fintech-bg)',
              color: 'var(--fintech-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              flexShrink: 0,
            }}>
              A
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              Apex Athletics &amp; Gear
            </span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        </div>
      </div>

      {/* Grouped Navigation Links */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.title} style={{ marginBottom: 12 }}>
            <div className="sidebar-section-title">{group.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/overview' && pathname.startsWith(item.href + '/'));

                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={16} className="nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Merchant Profile & Safety Indicator */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--border-primary)',
        background: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-md)',
            background: 'var(--fintech-bg)',
            color: 'var(--fintech-text)',
            border: '1px solid var(--fintech-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8125rem',
            fontWeight: 700,
            flexShrink: 0,
            fontFamily: 'var(--font-heading)',
          }}>
            A
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              Apex Athletics &amp; Gear
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>Merchant Admin</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};
