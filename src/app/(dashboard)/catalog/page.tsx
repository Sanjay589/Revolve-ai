'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Search,
  Package,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Code2,
  LayoutGrid
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FloatingCommerceObjects } from '@/components/ui/floating-commerce-objects';
import { useToast } from '@/components/ui/toast';

interface CatalogProduct {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: {
    amount: number;
    display: string;
    currency: string;
  };
  category: string;
  features: string[];
  tags: string[];
  availability: {
    inStock: boolean;
    inventory: number;
  };
  variants?: Array<{
    id: string;
    name: string;
    price: { amount: number; display: string };
    inStock: boolean;
    attributes?: Record<string, string>;
  }>;
  relationships?: {
    upsellProducts?: string[];
    crossSellProducts?: string[];
  };
}

export default function CatalogPage() {
  const [catalogJson, setCatalogJson] = useState<string>('');
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [merchantId, setMerchantId] = useState('');
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');
  const [searchQuery, setSearchQuery] = useState('');
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
        setProducts(catData.products || []);
        setProductCount(catData.productCount || (catData.products?.length ?? 0));
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
    success('Copied to Clipboard', 'Structured JSON catalog feed copied.');
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  return (
    <div className="relative">
      {/* Floating Organic Digital Commerce Objects */}
      <FloatingCommerceObjects intensity="overview" />

      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="AGENT-READABLE STOREFRONT FEED"
        badgeVariant="ai"
        badgeIcon={<Sparkles size={12} />}
        title="Structured Catalog Feed"
        description="Dual-view merchant catalog: human visual product cards alongside raw JSON-LD feed consumable by external AI shopping agents."
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" onClick={fetchCatalog} disabled={isLoading}>
              <RefreshCw size={13} className={isLoading ? 'animate-spin mr-1' : 'mr-1'} />
              <span>Refresh</span>
            </Button>
            <Button variant="primary" size="sm" onClick={handleCopy} disabled={!catalogJson}>
              {copied ? <Check size={13} className="mr-1" /> : <Copy size={13} className="mr-1" />}
              <span>{copied ? 'Copied' : 'Copy JSON-LD'}</span>
            </Button>
          </div>
        }
      />

      {/* ── Endpoint & Live Metadata Card ────────────────────── */}
      <div className="card card-elevated" style={{ padding: '16px 20px', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-neutral font-mono text-[0.6875rem]">GET /api/ai/catalog</span>
              <span className="badge badge-success text-[0.6875rem]">Publicly Discoverable</span>
            </div>
            <p className="font-mono text-xs text-[var(--text-secondary)] word-break break-all">
              /api/ai/catalog?merchantId={merchantId || '{merchantId}'}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[0.6875rem] uppercase tracking-wider text-[var(--text-tertiary)] font-bold">Indexed Items</span>
              <p className="font-mono text-lg font-extrabold text-[var(--fintech-primary)]">
                {productCount} Products
              </p>
            </div>
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-[var(--radius-md)]">
              <button
                type="button"
                onClick={() => setViewMode('visual')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-[var(--radius-sm)] transition-all ${
                  viewMode === 'visual'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-xs border border-[var(--border-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <LayoutGrid size={13} />
                Visual Feed
              </button>
              <button
                type="button"
                onClick={() => setViewMode('json')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-[var(--radius-sm)] transition-all ${
                  viewMode === 'json'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-xs border border-[var(--border-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Code2 size={13} />
                JSON-LD
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Architecture Pipeline Card ──────────────────────── */}
      <div className="card" style={{ padding: '20px 24px', background: 'var(--bg-secondary)' }}>
        <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
          <div>
            <span className="badge badge-ai mb-1 text-[0.6875rem] font-bold">COMMERCE LAYER ARCHITECTURE</span>
            <h3 className="font-heading text-base font-bold text-[var(--text-primary)]">
              How Autonomous Commerce Agents Consume This Feed
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { step: '1. CRAWL', label: 'Machine Ingestion', desc: 'AI Buyer agents crawl structured schema for real-time inventory.', variant: 'ai' as const },
            { step: '2. EXTRACT', label: 'Semantic Matching', desc: 'Embeddings understand attributes, materials, and sizes.', variant: 'neutral' as const },
            { step: '3. RECOMMEND', label: 'Revenue Bundling', desc: 'Algorithms discover cross-sell affinities and upsell tiers.', variant: 'warning' as const },
            { step: '4. TRANSACT', label: 'Razorpay Checkout', desc: 'Approved items transition into HMAC-verified payment orders.', variant: 'success' as const },
            { step: '5. AUDIT', label: 'Immutable Ledger', desc: 'Every price and version hash is recorded in the audit trail.', variant: 'success' as const },
          ].map((item) => (
            <div
              key={item.step}
              className="p-3 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-secondary)]"
            >
              <Badge variant={item.variant} className="text-[0.625rem] font-bold mb-1.5">
                {item.step}
              </Badge>
              <p className="text-xs font-bold text-[var(--text-primary)] mb-1">{item.label}</p>
              <p className="text-[0.6875rem] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── VIEW 1: HUMAN-FRIENDLY VISUAL CATALOG FEED ────────── */}
      {viewMode === 'visual' ? (
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[var(--radius-lg)] px-3.5 py-2">
            <Search size={16} className="text-[var(--text-tertiary)] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog by name, category, or semantic tag..."
              className="w-full bg-transparent border-none outline-none text-xs text-[var(--text-primary)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card p-5 flex flex-col gap-3">
                  <div className="h-5 bg-[var(--bg-tertiary)] rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-[var(--bg-tertiary)] rounded animate-pulse" />
                  <div className="h-16 bg-[var(--bg-tertiary)] rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => {
                const inStock = p.availability?.inStock ?? true;
                return (
                  <div
                    key={p.id}
                    className="card card-elevated card-interactive flex flex-col justify-between"
                    style={{ padding: '20px 22px' }}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="badge badge-neutral text-[0.6875rem] font-semibold">
                          {p.category}
                        </span>
                        <span
                          className={`badge ${inStock ? 'badge-success' : 'badge-error'} text-[0.6875rem] font-semibold`}
                        >
                          {inStock ? `In Stock (${p.availability?.inventory})` : 'Out of Stock'}
                        </span>
                      </div>

                      {/* Name & Short Description */}
                      <h4 className="font-heading text-base font-bold text-[var(--text-primary)] leading-snug mb-1">
                        {p.name}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">
                        {p.shortDescription || p.description}
                      </p>

                      {/* Features / Semantic Tags */}
                      {p.features && p.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {p.features.slice(0, 3).map((f) => (
                            <span
                              key={f}
                              className="text-[0.625rem] px-2 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] text-[var(--text-secondary)]"
                            >
                              {f}
                            </span>
                          ))}
                          {p.features.length > 3 && (
                            <span className="text-[0.625rem] text-[var(--text-tertiary)] self-center">
                              +{p.features.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom: Price & Variants */}
                    <div className="border-t border-[var(--border-primary)] pt-3 mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-[0.625rem] text-[var(--text-tertiary)] uppercase font-semibold">Price</span>
                        <div className="font-mono text-base font-extrabold text-[var(--text-primary)]">
                          {p.price?.display || `₹${p.price?.amount}`}
                        </div>
                      </div>

                      {p.variants && p.variants.length > 0 && (
                        <span className="badge badge-ai text-[0.625rem] font-bold">
                          {p.variants.length} Variants
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card text-center p-12 text-[var(--text-tertiary)]">
              No products found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>
      ) : (
        /* ── VIEW 2: RAW AI JSON-LD FEED ───────────────────────── */
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '10px 16px',
            background: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span className="font-mono text-xs font-semibold text-[var(--text-secondary)]">
              catalog-manifest.json (Authoritative Merchant Storefront)
            </span>
            <span className="badge badge-success text-[0.625rem]">
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
      )}
    </div>
  );
}
