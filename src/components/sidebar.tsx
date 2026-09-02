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
  Sliders,
  HelpCircle,
  TrendingUp,
  Zap
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const NAV_GROUPS = [
  {
    title: 'MAIN MENU',
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
    <aside className="finpilot-sidebar">
      {/* ─── 1. Brand Logo & Title ────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 16,
        borderBottom: '1px solid var(--border-secondary)',
      }}>
        <Link href="/overview" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1rem',
            fontFamily: 'var(--font-heading)',
            boxShadow: '0 4px 10px rgba(234, 88, 12, 0.3)',
          }}>
            R
          </div>
          <div>
            <div className="font-heading" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              REVOLVE AI
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
              Commerce Operating OS
            </div>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* ─── 2. Workspace Selector (Exact FinPilot BayFi Style) ─── */}
      <div style={{ padding: '14px 0 8px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)',
          cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 'var(--radius-sm)',
              background: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800,
              flexShrink: 0,
            }}>
              A
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              Apex Athletics
            </span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        </div>
      </div>

      {/* ─── 3. Navigation Links (Grouped with Coral Active Pills) ─ */}
      <nav style={{ flex: 1, padding: '4px 0', overflowY: 'auto' }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.title} style={{ marginBottom: 12 }}>
            <div className="nav-section-header">{group.title}</div>
            <div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/overview'
                  ? pathname === '/overview' || pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={`nav-pill-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={17} className="nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Quick Log Out Action */}
        <button
          onClick={handleLogout}
          className="nav-pill-item"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        >
          <LogOut size={17} className="nav-icon" />
          <span>Log out</span>
        </button>
      </nav>

      {/* ─── 4. Bottom Safety / Guardrail Shield Card ─────────── */}
      <div style={{
        marginTop: 12,
        padding: '14px',
        background: 'linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid #fed7aa',
        textAlign: 'center',
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#ea580c',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 8px',
          boxShadow: '0 4px 10px rgba(234, 88, 12, 0.25)',
        }}>
          <Shield size={16} />
        </div>
        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#9a3412', marginBottom: 2 }}>
          Policy Guardrails
        </div>
        <div style={{ fontSize: '0.6875rem', color: '#c2410c', lineHeight: 1.3, marginBottom: 10 }}>
          Max ₹10,000/tx • 100% Policy Intercept
        </div>
        <Link href="/settings" style={{
          display: 'block',
          padding: '6px 12px',
          background: '#ea580c',
          color: '#ffffff',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.75rem',
          fontWeight: 700,
          textDecoration: 'none',
        }}>
          Configure Rules
        </Link>
      </div>
    </aside>
  );
};
