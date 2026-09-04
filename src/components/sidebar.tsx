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
  LogOut,
  Shield,
  ChevronDown,
  Activity,
  Check,
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const NAV_GROUPS = [
  {
    title: 'INTELLIGENCE',
    items: [
      { href: '/overview', label: 'Executive Dashboard', icon: LayoutDashboard },
      { href: '/ai-agent', label: 'AI Agent Brain', icon: Brain },
      { href: '/opportunities', label: 'Opportunities Pipeline', icon: Sparkles },
      { href: '/approvals', label: 'Approval Security Center', icon: ShieldCheck },
    ],
  },
  {
    title: 'COMMERCE ENGINE',
    items: [
      { href: '/ai-buyers', label: 'Agentic AI Buyers', icon: Bot },
      { href: '/catalog', label: 'Catalog Intelligence', icon: BookOpen },
      { href: '/products', label: 'Products & Stock', icon: Package },
      { href: '/campaigns', label: 'Growth Campaigns', icon: Megaphone },
    ],
  },
  {
    title: 'FINTECH & GOVERNANCE',
    items: [
      { href: '/transactions', label: 'Payment Transactions', icon: CreditCard },
      { href: '/payment-observability', label: 'Payment Observability', icon: Activity },
      { href: '/audit', label: 'Immutable Audit Trail', icon: FileText },
      { href: '/settings', label: 'Policy Guardrails', icon: Sliders },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = React.useState<{
    merchantName?: string;
    personalMerchantName?: string;
    isDemoWorkspace?: boolean;
    name?: string;
  } | null>(null);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setSession(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleSwitchWorkspace = async (mode: 'demo' | 'personal') => {
    try {
      const res = await fetch('/api/auth/switch-workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      if (res.ok) {
        setWorkspaceMenuOpen(false);
        window.location.reload();
      }
    } catch {
      // ignore
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  const currentMerchantName = session?.merchantName || 'Apex Athletics & Gear';
  const isDemo = Boolean(session?.isDemoWorkspace);

  return (
    <aside className="revolve-sidebar" style={{ padding: '18px 12px' }}>
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

      {/* ─── 2. Interactive Workspace Selector ─────────────────── */}
      <div style={{ padding: '10px 0 6px', position: 'relative' }}>
        <button
          type="button"
          onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 10px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
          aria-label="Switch active workspace"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            <div style={{
              width: 22, height: 22,
              borderRadius: 'var(--radius-sm)',
              background: isDemo ? 'var(--warning)' : 'var(--text-primary)',
              color: isDemo ? '#000' : 'var(--text-inverse)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6875rem', fontWeight: 800,
              flexShrink: 0,
            }}>
              {currentMerchantName.slice(0, 1).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentMerchantName}
              </div>
              <div style={{ fontSize: '0.5625rem', color: isDemo ? 'var(--warning-text)' : 'var(--success)', fontWeight: 700, textTransform: 'uppercase' }}>
                {isDemo ? 'Demo Workspace' : 'Personal Workspace'}
              </div>
            </div>
          </div>
          <ChevronDown size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        </button>

        {/* Workspace Switcher Popover */}
        {workspaceMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
            padding: 6,
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            <div style={{ fontSize: '0.5625rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', padding: '2px 6px' }}>
              Available Workspaces
            </div>

            {/* Personal Workspace Option */}
            <button
              type="button"
              onClick={() => handleSwitchWorkspace('personal')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                borderRadius: 'var(--radius-sm)',
                background: !isDemo ? 'var(--bg-tertiary)' : 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.6875rem',
                fontWeight: !isDemo ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {session?.personalMerchantName || 'Personal Workspace'}
                </span>
              </div>
              {!isDemo && <Check size={12} style={{ color: 'var(--success)' }} />}
            </button>

            {/* Demo Workspace Option */}
            <button
              type="button"
              onClick={() => handleSwitchWorkspace('demo')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                borderRadius: 'var(--radius-sm)',
                background: isDemo ? 'var(--bg-tertiary)' : 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.6875rem',
                fontWeight: isDemo ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--warning)', flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  Apex Athletics (Demo Showcase)
                </span>
              </div>
              {isDemo && <Check size={12} style={{ color: 'var(--warning-text)' }} />}
            </button>
          </div>
        )}
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
