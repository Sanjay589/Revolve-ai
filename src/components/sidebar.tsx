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
  Sliders,
  Settings,
  LogOut,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const NAV_GROUPS = [
  {
    title: 'INTELLIGENCE',
    items: [
      { href: '/overview', label: 'Dashboard', icon: LayoutDashboard },
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
      { href: '/catalog', label: 'Catalog', icon: BookOpen },
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
    title: 'GENERAL',
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
    <aside className="finpilot-sidebar" style={{ padding: '18px 12px' }}>
      {/* ─── 1. Brand Logo & Title ────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 6px 14px',
        borderBottom: '1px solid var(--border-secondary)',
      }}>
        <Link href="/overview" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: 'var(--radius-md)',
            background: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.875rem',
            fontFamily: 'var(--font-heading)',
          }}>R</div>
          <div>
            <div className="font-heading" style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              REVOLVE AI
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: '0.02em' }}>
              Commerce Operating OS
            </div>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* ─── 2. Workspace Selector ────────────────────────────── */}
      <div style={{ padding: '10px 0 6px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 10px',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            <div style={{
              width: 22, height: 22,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--text-primary)',
              color: 'var(--text-inverse)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6875rem', fontWeight: 800,
              flexShrink: 0,
            }}>
              A
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              Apex Athletics &amp; Gear
            </span>
          </div>
          <ChevronDown size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        </div>
      </div>

      {/* ─── 3. Grouped Navigation Links ──────────────────────── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.title} style={{ marginBottom: 10 }}>
            <div className="nav-section-header">{group.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/overview'
                  ? pathname === '/overview' || pathname === '/'
                  : pathname === item.href || (pathname.startsWith(item.href + '/') && item.label !== 'Settings');

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

      {/* ─── 4. Guardrail Status Box ──────────────────────────── */}
      <div style={{
        padding: '10px 12px',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-primary)',
        marginTop: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <Shield size={12} style={{ color: 'var(--ai-primary)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Policy Guardrails</span>
        </div>
        <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', lineHeight: 1.3, marginBottom: 6 }}>
          Max ₹10k/tx · 100% Intercept
        </div>
        <Link href="/settings" style={{
          display: 'block', textAlign: 'center',
          padding: '4px 8px',
          background: 'var(--bg-secondary)', color: 'var(--text-primary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.6875rem', fontWeight: 600,
          textDecoration: 'none',
        }}>
          Configure
        </Link>
      </div>

      {/* ─── 5. Log Out Action ────────────────────────────────── */}
      <button
        onClick={handleLogout}
        className="sidebar-nav-item"
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          marginTop: 6, padding: '7px 12px',
          color: 'var(--text-tertiary)', fontSize: '0.75rem',
        }}
      >
        <LogOut size={14} />
        <span>Sign Out</span>
      </button>
    </aside>
  );
};
