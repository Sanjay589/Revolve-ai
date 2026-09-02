'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Copy, Check, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
      // 1. Get session to know merchantId
      const sessRes = await fetch('/api/auth/session');
      const sessData = await sessRes.json();
      const mId = sessData.user?.merchantId;
      setMerchantId(mId || '');

      if (mId) {
        // 2. Fetch AI catalog JSON
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
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-ai">
              <Sparkles size={12} /> AGENT-READABLE FORMAT
            </span>
          </div>
          <h1 className="page-title">AI Catalog Interface</h1>
          <p className="page-subtitle">
            Public structured catalog specification consumable by autonomous shopping & research agents.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={fetchCatalog} isLoading={isLoading}>
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button variant="primary" onClick={handleCopy} disabled={!catalogJson}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy AI Catalog JSON'}
          </Button>
        </div>
      </div>

      {/* Endpoint Info Card */}
      <Card isAi>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="badge badge-neutral font-mono" style={{ marginBottom: 6 }}>GET /api/ai/catalog</span>
            <p className="font-mono text-xs text-secondary" style={{ wordBreak: 'break-all' }}>
              /api/ai/catalog?merchantId={merchantId || '{merchantId}'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Indexed Products</span>
            <p className="font-heading font-bold" style={{ fontSize: '1.25rem', color: 'var(--ai-primary)' }}>
              {productCount} Items Live
            </p>
          </div>
        </div>
      </Card>

      {/* JSON Viewer */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '12px 16px',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span className="font-mono text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            STRUCTURED AI CATALOG PAYLOAD
          </span>
          <span className="font-mono text-xs text-tertiary">application/json</span>
        </div>

        <pre style={{
          padding: '16px',
          margin: 0,
          background: 'var(--bg-secondary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          lineHeight: 1.5,
          color: 'var(--text-primary)',
          overflowX: 'auto',
          maxHeight: 520,
        }}>
          {isLoading ? '// Generating AI structured catalog...' : catalogJson || '// No active products found.'}
        </pre>
      </Card>
    </div>
  );
}
