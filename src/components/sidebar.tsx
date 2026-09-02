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
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const NAV_ITEMS = [
  { href: '/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/ai-agent', label: 'AI Agent', icon: Brain },
  { href: '/opportunities', label: 'Opportunities', icon: Sparkles },
  { href: '/approvals', label: 'Approvals', icon: ShieldCheck },
  { href: '/ai-buyers', label: 'AI Buyers', icon: Bot },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/catalog', label: 'Catalog', icon: BookOpen },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/audit', label: 'Audit Trail', icon: FileText },
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
        padding: '20px 24px 16px',
        borderBottom: '1px solid var(--border-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
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
          <span className="font-heading" style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            REVOLVE AI
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} className="nav-icon" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Account */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-secondary)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        <Link
          href="/settings"
          className={`sidebar-nav-item ${pathname === '/settings' ? 'active' : ''}`}
          style={{ width: '100%', margin: 0 }}
        >
          <Settings size={18} className="nav-icon" />
          <span>Settings</span>
        </Link>
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
    </aside>
  );
};
