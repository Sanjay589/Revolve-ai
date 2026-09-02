'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Copy, Check, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
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
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-ai">
              <Sparkles size={12} /> AGENT-READABLE FEED
            </span>
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Structured AI Catalog Feed
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Public schema catalog consumable by external autonomous shopping and research agents.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outline" size="sm" onClick={fetchCatalog} disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </Button>
          <Button variant="primary" size="sm" onClick={handleCopy} disabled={!catalogJson}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </Button>
        </div>
      </div>

      {/* Endpoint Info Card */}
      <div className="editorial-card" style={{ padding: '20px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="badge badge-neutral font-mono" style={{ marginBottom: 6 }}>GET /api/ai/catalog</span>
            <p className="font-mono" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', wordBreak: 'break-all', marginTop: 4 }}>
              /api/ai/catalog?merchantId={merchantId || '{merchantId}'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="stat-label">Indexed Products</span>
            <p className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--fintech-primary)' }}>
              {productCount} Items Live
            </p>
          </div>
        </div>
      </div>

      {/* JSON Viewer */}
      <div className="editorial-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '12px 18px',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            catalog-manifest.json
          </span>
          <span className="badge badge-fintech" style={{ fontSize: '0.6875rem' }}>
            VALID JSON-LD SCHEMA
          </span>
        </div>

        <pre
          className="font-mono"
          style={{
            padding: '20px',
            margin: 0,
            fontSize: '0.8125rem',
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
    </div>
  );
}
