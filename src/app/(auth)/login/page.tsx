'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/overview');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin@apexgear.io');
    setPassword('DemoMerchant@2026');
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
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 44,
            height: 44,
            background: 'var(--ai-primary)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Sparkles size={24} color="white" />
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.5rem', marginBottom: 6 }}>
            Welcome back to Revolve AI
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            AI growth engine with bounded financial safety controls
          </p>
        </div>

        {/* Demo Fast Login Helper */}
        <div style={{
          background: 'var(--ai-bg)',
          border: '1px solid var(--ai-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ai-text)' }}>
              Hackathon Evaluator Credentials
            </p>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
              admin@apexgear.io / DemoMerchant@2026
            </p>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.6875rem', padding: '4px 8px', color: 'var(--ai-primary)' }}
          >
            Auto-fill
          </button>
        </div>

        {/* Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <Input
              label="Merchant Email"
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <Link
                href="/forgot-password"
                style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                background: 'var(--error-bg)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--error)',
                fontSize: '0.8125rem',
                marginBottom: 16,
              }}>
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
              Sign In to Dashboard <ArrowRight size={16} />
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: 'var(--ai-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Register new merchant
          </Link>
        </div>
      </div>
    </div>
  );
}
