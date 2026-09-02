'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';

export default function CatalogPage() {
  const [catalogJson, setCatalogJson] = useState<string>('');
  const [productCount, setProductCount] = useState(0);
  const [merchantId, setMerchantId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { success } = useToast();

  const fetchCatalog = async () => {
    setIsLoading(true);
    try {
      const sessRes = await fetch('/api/auth/session');
      const sessData = await sessRes.json();
      const mId = sessData.user?.merchantId;
      setMerchantId(mId || '');

      if (mId) {
        const catRes = await fetch(`/api/ai/catalog?merchantId=${mId}`);
        const catData = await catRes.json();
        setCatalogJson(JSON.stringify(catData, null, 2));
        setProductCount(catData.productCount || 0);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(catalogJson);
    setCopied(true);
    success('Copied to Clipboard', 'Structured JSON catalog copied.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="AGENT-READABLE FEED"
        badgeVariant="ai"
        badgeIcon={<Sparkles size={12} />}
        title="Structured AI Catalog Feed"
        description="Public JSON-LD schema feed consumable by external autonomous shopping, research, and price-comparison agents."
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" onClick={fetchCatalog} disabled={isLoading}>
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </Button>
            <Button variant="primary" size="sm" onClick={handleCopy} disabled={!catalogJson}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </Button>
          </div>
        }
      />

      {/* ── Endpoint Info Card ──────────────────────────────── */}
      <div className="editorial-card" style={{ padding: '16px 20px', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="badge badge-neutral font-mono" style={{ marginBottom: 4 }}>GET /api/ai/catalog</span>
            <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', wordBreak: 'break-all', marginTop: 2 }}>
              /api/ai/catalog?merchantId={merchantId || '{merchantId}'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="stat-label">Indexed Products</span>
            <p className="font-mono" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--fintech-primary)' }}>
              {productCount} Items Live
            </p>
          </div>
        </div>
      </div>

      {/* ── JSON Viewer ─────────────────────────────────────── */}
      <div className="editorial-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '10px 16px',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            catalog-manifest.json
          </span>
          <span className="badge badge-success" style={{ fontSize: '0.625rem' }}>
            VALID JSON-LD SCHEMA
          </span>
        </div>

        <pre
          className="font-mono"
          style={{
            padding: '18px 20px',
            margin: 0,
            fontSize: '0.75rem',
            lineHeight: 1.5,
            color: 'var(--text-primary)',
            background: 'var(--bg-secondary)',
            maxHeight: 520,
            overflowY: 'auto',
          }}
        >
          {catalogJson || 'Loading structured catalog manifest...'}
        </pre>
      </div>
    </>
  );
}
