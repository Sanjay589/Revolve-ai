'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, ShieldAlert, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to overview
  React.useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          router.replace('/overview');
        }
      })
      .catch(() => {});
  }, [router]);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }

      router.push('/overview');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  const fillDemo = () => {
    setEmail('admin@apexgear.io');
    setPassword('DemoMerchant@2026');
  };

  const loginDemoOneClick = () => {
    setEmail('admin@apexgear.io');
    setPassword('DemoMerchant@2026');
    performLogin('admin@apexgear.io', 'DemoMerchant@2026');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      background: 'var(--bg-primary)',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 44,
            height: 44,
            background: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 800,
          }}>
            R
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>
            Welcome to Revolve AI
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Commerce operating system for autonomous growth &amp; policy safety
          </p>
        </div>

        {/* Demo Fast Login Helper */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-xs)',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--fintech-text)' }}>
              Evaluator Test Account
            </p>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              admin@apexgear.io / DemoMerchant@2026
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              onClick={fillDemo}
              className="btn btn-outline btn-sm"
            >
              Autofill
            </button>
            <button
              type="button"
              onClick={loginDemoOneClick}
              disabled={isLoading}
              className="btn btn-fintech btn-sm"
            >
              Instant Demo Sign In
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="editorial-card" style={{ padding: '32px' }}>
          {error && (
            <div style={{
              background: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
              color: 'var(--error)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              marginBottom: 18,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Merchant Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@apexgear.io"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
            />

            <Button variant="primary" type="submit" isLoading={isLoading} style={{ width: '100%', marginTop: 8 }}>
              <span>Sign In to Workspace</span>
              <ArrowRight size={16} />
            </Button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 24 }}>
          Don&apos;t have a merchant account?{' '}
          <Link href="/register" style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Register Store
          </Link>
        </p>
      </div>
    </div>
  );
}
