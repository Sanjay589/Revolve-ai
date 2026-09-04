'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Check,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';

interface UserSession {
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

export const ProfileDropdown: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load session
  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setSession(data.user);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchSession();

    // Theme initialization
    const saved = localStorage.getItem('revolve_theme') as 'dark' | 'light' | 'system' | null;
    const initialTheme = saved || 'dark';
    setTheme(initialTheme);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        setIsOpen(false);
        // Refresh page so entire app loads the new active merchant context
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to switch workspace', err);
    } finally {
      setIsSwitching(false);
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

  // Generate initials (e.g. "Nihar Routhu" -> "NR", "Siddharth Roy" -> "SR")
  const getInitials = (name?: string) => {
    if (!name) return 'RA';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(session?.name);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Avatar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[var(--border-primary)] transition-all cursor-pointer bg-transparent border-none"
        aria-label="User profile and workspace menu"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-[var(--text-primary)] text-[var(--text-inverse)] flex items-center justify-center font-bold text-xs font-heading shadow-xs select-none">
            {initials}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00C076] border-2 border-[var(--bg-canvas)]" />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[var(--radius-lg)] shadow-lg z-50 p-3 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ backdropFilter: 'blur(16px)' }}
        >
          {/* Header: User Info */}
          <div className="p-2.5 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[var(--text-primary)] text-[var(--text-inverse)] flex items-center justify-center font-bold text-xs font-heading shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading text-xs font-bold text-[var(--text-primary)] truncate">
                  {session?.name || 'Merchant Administrator'}
                </div>
                <div className="text-[0.6875rem] text-[var(--text-tertiary)] truncate">
                  {session?.email || 'admin@merchant.io'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-secondary)] text-[0.6875rem]">
              <span className="text-[var(--text-secondary)]">Verification</span>
              <span className="inline-flex items-center gap-1 text-[#00C076] font-semibold">
                <ShieldCheck size={11} /> Verified
              </span>
            </div>
          </div>

          {/* Active Workspace Selector */}
          <div className="p-2 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)]">
            <div className="text-[0.625rem] uppercase font-bold tracking-wider text-[var(--text-tertiary)] mb-1.5 px-1">
              Active Workspace
            </div>
            <div className="flex flex-col gap-1">
              {/* Personal Workspace Option */}
              <button
                type="button"
                onClick={() => handleSwitchWorkspace('personal')}
                disabled={isSwitching}
                className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-[var(--radius-sm)] text-left text-xs transition-colors cursor-pointer border-none ${
                  !session?.isDemoWorkspace
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-semibold shadow-xs border border-[var(--border-primary)]'
                    : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-[#00C076]" />
                  <span className="truncate">{session?.personalMerchantName || 'Personal Workspace'}</span>
                </div>
                {!session?.isDemoWorkspace && <Check size={13} className="text-[#00C076] shrink-0" />}
              </button>

              {/* Demo Workspace Option */}
              <button
                type="button"
                onClick={() => handleSwitchWorkspace('demo')}
                disabled={isSwitching}
                className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-[var(--radius-sm)] text-left text-xs transition-colors cursor-pointer border-none ${
                  session?.isDemoWorkspace
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-semibold shadow-xs border border-[var(--border-primary)]'
                    : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="truncate">Apex Athletics (Demo Showcase)</span>
                </div>
                {session?.isDemoWorkspace && <Check size={13} className="text-amber-400 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Theme Selector: Dark, Light, System */}
          <div className="px-2 py-1.5">
            <div className="text-[0.625rem] uppercase font-bold tracking-wider text-[var(--text-tertiary)] mb-1.5">
              Theme Mode
            </div>
            <div className="grid grid-cols-3 gap-1 bg-[var(--bg-tertiary)] p-1 rounded-[var(--radius-md)] border border-[var(--border-primary)]">
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center justify-center gap-1.5 py-1 text-[0.6875rem] font-semibold rounded-[var(--radius-sm)] transition-colors cursor-pointer border-none ${
                  theme === 'dark'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-xs'
                    : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Moon size={11} /> Dark
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`flex items-center justify-center gap-1.5 py-1 text-[0.6875rem] font-semibold rounded-[var(--radius-sm)] transition-colors cursor-pointer border-none ${
                  theme === 'light'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-xs'
                    : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Sun size={11} /> Light
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                className={`flex items-center justify-center gap-1.5 py-1 text-[0.6875rem] font-semibold rounded-[var(--radius-sm)] transition-colors cursor-pointer border-none ${
                  theme === 'system'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-xs'
                    : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Laptop size={11} /> System
              </button>
            </div>
          </div>

          {/* Links & Actions */}
          <div className="pt-1 border-t border-[var(--border-secondary)] flex flex-col gap-0.5">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-[var(--radius-sm)] transition-colors text-decoration-none"
            >
              <User size={14} />
              <span>Profile &amp; Account</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-[var(--radius-sm)] transition-colors text-decoration-none"
            >
              <Settings size={14} />
              <span>Workspace Settings</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-[var(--radius-sm)] transition-colors cursor-pointer bg-transparent border-none w-full text-left"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
