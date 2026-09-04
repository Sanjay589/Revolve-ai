'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Shield,
  ShieldCheck,
  Building,
  Key,
  Check,
  Moon,
  Sun,
  Laptop,
  ArrowRight,
  ExternalLink,
  Layers,
  Database,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { FloatingCommerceObjects } from '@/components/ui/floating-commerce-objects';
import { useToast } from '@/components/ui/toast';

interface UserProfileData {
  userId: string;
  merchantId: string;
  email: string;
  name: string;
  role: string;
  isDemoWorkspace: boolean;
  isNewMerchant: boolean;
  emailVerified: boolean;
  merchantName: string;
  businessName: string;
  personalMerchantName: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [isSwitching, setIsSwitching] = useState(false);
  const { success, error } = useToast();

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setProfile(data.user);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    const saved = localStorage.getItem('revolve_theme') as 'dark' | 'light' | 'system' | null;
    if (saved) setTheme(saved);
  }, []);

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('revolve_theme', newTheme);
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    success('Theme Updated', `Theme set to ${newTheme} mode.`);
  };

  const handleSwitchWorkspace = async (targetMode: 'demo' | 'personal') => {
    setIsSwitching(true);
    try {
      const res = await fetch('/api/auth/switch-workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: targetMode }),
      });
      if (res.ok) {
        success('Workspace Switched', `Switched to ${targetMode === 'demo' ? 'Demo Showcase' : 'Personal Workspace'}.`);
        window.location.reload();
      }
    } catch {
      error('Error', 'Failed to switch workspace');
    } finally {
      setIsSwitching(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'RA';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(profile?.name);

  return (
    <div className="relative">
      <FloatingCommerceObjects intensity="minimal" />

      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="ACCOUNT &amp; GOVERNANCE"
        badgeVariant="ai"
        badgeIcon={<User size={12} />}
        title="Profile &amp;"
        italicAccent="Workspace"
        description="Manage your administrator credentials, active merchant workspace, security settings, and environment preferences."
      />

      {/* ── Active Workspace Switcher Banner ─────────────────── */}
      <div className="card card-elevated" style={{
        background: profile?.isDemoWorkspace ? 'rgba(245, 158, 11, 0.05)' : 'var(--bg-secondary)',
        border: profile?.isDemoWorkspace ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-primary)',
        padding: '18px 24px',
      }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
              profile?.isDemoWorkspace ? 'bg-amber-400 text-black' : 'bg-[#00C076] text-black'
            }`}>
              {profile?.isDemoWorkspace ? <Database size={18} /> : <Building size={18} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-base font-bold text-[var(--text-primary)]">
                  {profile?.merchantName || 'Commerce Workspace'}
                </span>
                {profile?.isDemoWorkspace ? (
                  <span className="badge badge-warning text-[0.625rem]">DEMO WORKSPACE • SAMPLE DATA</span>
                ) : (
                  <span className="badge badge-success text-[0.625rem]">PERSONAL WORKSPACE</span>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {profile?.isDemoWorkspace
                  ? 'Currently viewing the pre-seeded Apex Athletics demo showcase for Buildathon judges and reviewers.'
                  : 'Your clean personal merchant account. Commerce signals, catalogs, and test payments belong solely to you.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {profile?.isDemoWorkspace ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSwitchWorkspace('personal')}
                isLoading={isSwitching}
              >
                Switch to My Workspace
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSwitchWorkspace('demo')}
                isLoading={isSwitching}
              >
                Explore Demo Workspace
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main 2-Column Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols): Personal & Merchant Details */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Personal Information Card */}
          <div className="card" style={{ padding: '20px 24px', background: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-secondary)]">
              <div className="flex items-center gap-2">
                <User size={16} className="text-[var(--ai-primary)]" />
                <h3 className="font-heading text-sm font-bold text-[var(--text-primary)]">
                  Personal Information
                </h3>
              </div>
              <span className="badge badge-success text-[0.6875rem]">Active Account</span>
            </div>

            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-[var(--text-primary)] text-[var(--text-inverse)] flex items-center justify-center font-extrabold text-lg font-heading shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading text-lg font-bold text-[var(--text-primary)]">
                  {profile?.name || 'Administrator'}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {profile?.email || 'admin@merchant.io'}
                </div>
                <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-[var(--radius-sm)] text-[0.6875rem] font-mono text-[var(--text-secondary)]">
                  Role: <span className="text-[var(--text-primary)] font-bold">{profile?.role || 'merchant_admin'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)]">
                <span className="text-[0.6875rem] uppercase font-bold text-[var(--text-tertiary)]">Email Status</span>
                <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-[#00C076]">
                  <ShieldCheck size={14} /> Email Verified
                </div>
              </div>

              <div className="p-3 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)]">
                <span className="text-[0.6875rem] uppercase font-bold text-[var(--text-tertiary)]">Account Type</span>
                <div className="text-xs font-semibold text-[var(--text-primary)] mt-1">
                  Merchant Administrator
                </div>
              </div>
            </div>
          </div>

          {/* Merchant Information Card */}
          <div className="card" style={{ padding: '20px 24px', background: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-secondary)]">
              <div className="flex items-center gap-2">
                <Building size={16} className="text-[#00C076]" />
                <h3 className="font-heading text-sm font-bold text-[var(--text-primary)]">
                  Merchant Workspace
                </h3>
              </div>
              <span className="badge badge-fintech text-[0.6875rem]">RAZORPAY TEST MODE</span>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[0.6875rem] uppercase font-bold text-[var(--text-tertiary)]">Merchant Store Name</span>
                <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
                  {profile?.merchantName}
                </p>
              </div>

              {profile?.businessName && (
                <div>
                  <span className="text-[0.6875rem] uppercase font-bold text-[var(--text-tertiary)]">Registered Legal Entity</span>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {profile.businessName}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="p-2.5 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)]">
                  <span className="text-[0.625rem] uppercase text-[var(--text-tertiary)] font-bold">Workspace ID</span>
                  <p className="font-mono text-xs text-[var(--text-primary)] mt-1 truncate">
                    {profile?.merchantId ? profile.merchantId.slice(0, 12) + '...' : '—'}
                  </p>
                </div>

                <div className="p-2.5 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)]">
                  <span className="text-[0.625rem] uppercase text-[var(--text-tertiary)] font-bold">Settlement Currency</span>
                  <p className="font-mono text-xs font-bold text-[var(--text-primary)] mt-1">
                    INR (₹)
                  </p>
                </div>

                <div className="p-2.5 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)]">
                  <span className="text-[0.625rem] uppercase text-[var(--text-tertiary)] font-bold">Timezone</span>
                  <p className="text-xs font-semibold text-[var(--text-primary)] mt-1">
                    Asia/Kolkata
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Security, Theme, & Policies */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Security & Cryptographic Integrity Card */}
          <div className="card" style={{ padding: '20px 24px', background: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-secondary)]">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#00C076]" />
                <h3 className="font-heading text-sm font-bold text-[var(--text-primary)]">
                  Security &amp; Integrity
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)]">
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">HMAC-SHA256 Signatures</div>
                  <div className="text-[0.6875rem] text-[var(--text-tertiary)]">Razorpay Webhook Verification</div>
                </div>
                <span className="badge badge-success text-[0.625rem]">ENFORCED ✓</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)]">
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">Idempotency Deduplication</div>
                  <div className="text-[0.6875rem] text-[var(--text-tertiary)]">Double-charge Prevention</div>
                </div>
                <span className="badge badge-success text-[0.625rem]">ACTIVE ✓</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)]">
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">Financial Guardrail Gate</div>
                  <div className="text-[0.6875rem] text-[var(--text-tertiary)]">Zero-Trust AI Interception</div>
                </div>
                <span className="badge badge-ai text-[0.625rem]">₹10k MAX / TX</span>
              </div>
            </div>

            <Link
              href="/settings"
              className="btn btn-outline btn-sm w-full mt-4 justify-center"
            >
              Configure Policy Guardrails
            </Link>
          </div>

          {/* Theme Preferences Card */}
          <div className="card" style={{ padding: '20px 24px', background: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-secondary)]">
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-amber-400" />
                <h3 className="font-heading text-sm font-bold text-[var(--text-primary)]">
                  Appearance &amp; Theme
                </h3>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] mb-3">
              Select your preferred visual mode for Revolve AI. Dark mode is optimized for high-density fintech monitoring.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`flex flex-col items-center justify-center p-3 rounded-[var(--radius-md)] border text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[var(--bg-tertiary)] border-[#00C076] text-white shadow-xs'
                    : 'bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Moon size={18} className="mb-1.5" />
                <span>Dark Mode</span>
                {theme === 'dark' && <span className="text-[0.625rem] text-[#00C076] font-bold mt-1">Active</span>}
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`flex flex-col items-center justify-center p-3 rounded-[var(--radius-md)] border text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-[var(--bg-tertiary)] border-[#00C076] text-white shadow-xs'
                    : 'bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Sun size={18} className="mb-1.5" />
                <span>Light Mode</span>
                {theme === 'light' && <span className="text-[0.625rem] text-[#00C076] font-bold mt-1">Active</span>}
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                className={`flex flex-col items-center justify-center p-3 rounded-[var(--radius-md)] border text-xs font-semibold transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'bg-[var(--bg-tertiary)] border-[#00C076] text-white shadow-xs'
                    : 'bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <Laptop size={18} className="mb-1.5" />
                <span>System</span>
                {theme === 'system' && <span className="text-[0.625rem] text-[#00C076] font-bold mt-1">Active</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
