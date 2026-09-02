'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Modal } from '@/components/ui/modal';
import { Input, Textarea, Select } from '@/components/ui/form';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

interface ProductItem {
  id: string;
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  category?: string | null;
  sku?: string | null;
  inventory: number;
  isActive: boolean;
  features: string[];
  tags: string[];
  createdAt: string;
  variants?: Array<{
    id: string;
    name: string;
    price: number;
    inventory: number;
  }>;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priceRupees, setPriceRupees] = useState('');
  const [compareAtPriceRupees, setCompareAtPriceRupees] = useState('');
  const [category, setCategory] = useState('Footwear');
  const [inventory, setInventory] = useState('50');
  const [featuresStr, setFeaturesStr] = useState('');
  const [tagsStr, setTagsStr] = useState('');

  const { success, error } = useToast();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPriceRupees('');
    setCompareAtPriceRupees('');
    setCategory('Footwear');
    setInventory('50');
    setFeaturesStr('');
    setTagsStr('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProductItem) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description || '');
    setPriceRupees((p.price / 100).toString());
    setCompareAtPriceRupees(p.compareAtPrice ? (p.compareAtPrice / 100).toString() : '');
    setCategory(p.category || 'General');
    setInventory(p.inventory.toString());
    setFeaturesStr(p.features.join(', '));
    setTagsStr(p.tags.join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name,
        description,
        price: Math.round(parseFloat(priceRupees) * 100),
        compareAtPrice: compareAtPriceRupees ? Math.round(parseFloat(compareAtPriceRupees) * 100) : undefined,
        category,
        inventory: parseInt(inventory, 10) || 0,
        features: featuresStr.split(',').map((s) => s.trim()).filter(Boolean),
        tags: tagsStr.split(',').map((s) => s.trim()).filter(Boolean),
      };

      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save product');

      success(editingId ? 'Product Updated' : 'Product Created', 'Catalog successfully synchronized with AI engine.');
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      error('Error', err instanceof Error ? err.message : 'Could not save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="COMMERCE CATALOG"
        badgeVariant="neutral"
        badgeIcon={<Package size={12} />}
        title="Products &amp; Inventory"
        description="Manage store merchandise indexed for autonomous AI discovery, companion bundling, and natural language recommendations."
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" onClick={fetchProducts} disabled={isLoading}>
              <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </Button>
            <Button variant="primary" size="sm" onClick={openCreateModal}>
              <Plus size={14} />
              <span>Add Product</span>
            </Button>
          </div>
        }
      />

      {/* ── Products Table ──────────────────────────────────── */}
      <div className="editorial-card" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Skeleton height={36} />
            <Skeleton height={36} />
            <Skeleton height={36} />
          </div>
        ) : products.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Buffer</th>
                  <th>AI Features Tagged</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="font-heading" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                        {p.name}
                      </div>
                      {p.shortDescription && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {p.shortDescription}
                        </div>
                      )}
                    </td>

                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>
                        {p.category || 'General'}
                      </span>
                    </td>

                    <td>
                      <div className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                        {formatCurrency(p.price)}
                      </div>
                      {p.compareAtPrice && (
                        <div className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>
                          {formatCurrency(p.compareAtPrice)}
                        </div>
                      )}
                    </td>

                    <td>
                      <span className={`badge ${p.inventory > 10 ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.6875rem' }}>
                        {p.inventory} in stock
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {p.features?.slice(0, 3).map((f, i) => (
                          <span key={i} style={{ fontSize: '0.6875rem', padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(p)}>
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <Package size={32} style={{ margin: '0 auto 10px', opacity: 0.6 }} />
            <h3 className="font-heading" style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: 4 }}>
              No Products in Catalog
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
              Add items to enable autonomous bundling and buyer discovery.
            </p>
            <Button variant="primary" size="sm" onClick={openCreateModal}>
              <Plus size={14} /> Add First Product
            </Button>
          </div>
        )}
      </div>

      {/* ── Product Create / Edit Modal ─────────────────────── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Product Details' : 'Add New Product to Catalog'}
        size="lg"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Product Title"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Apex Carbon Pro Running Shoes"
          />

          <Textarea
            label="Full Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter comprehensive product specification for AI search reasoning..."
            rows={3}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <Input
              label="Price (₹)"
              required
              type="number"
              step="0.01"
              value={priceRupees}
              onChange={(e) => setPriceRupees(e.target.value)}
              placeholder="4499.00"
            />
            <Input
              label="Compare At Price (₹)"
              type="number"
              step="0.01"
              value={compareAtPriceRupees}
              onChange={(e) => setCompareAtPriceRupees(e.target.value)}
              placeholder="5999.00"
            />
            <Input
              label="Inventory Stock"
              required
              type="number"
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
              placeholder="50"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <Input
              label="AI Features (comma-separated)"
              value={featuresStr}
              onChange={(e) => setFeaturesStr(e.target.value)}
              placeholder="Carbon plate, Breathable mesh, Lightweight"
            />
            <Input
              label="Tags (comma-separated)"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="Running, Marathon, Performance"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              {editingId ? 'Save Changes' : 'Publish to Catalog'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
