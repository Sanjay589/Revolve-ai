'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Sparkles, RefreshCw, ShoppingBag, CheckCircle2 } from 'lucide-react';
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
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-fintech">
              <Package size={12} /> COMMERCE CATALOG
            </span>
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Products &amp; Inventory
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Manage store merchandise indexed for autonomous AI discovery and companion bundling.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outline" size="sm" onClick={fetchProducts} disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </Button>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <Plus size={14} />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="editorial-card" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton height={40} />
            <Skeleton height={40} />
            <Skeleton height={40} />
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
                      <div className="font-heading" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
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
                      <div className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatCurrency(p.price)}
                      </div>
                      {p.compareAtPrice && (
                        <div className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>
                          {formatCurrency(p.compareAtPrice)}
                        </div>
                      )}
                    </td>

                    <td>
                      <span className={`badge ${p.inventory > 10 ? 'badge-fintech' : 'badge-warning'}`} style={{ fontSize: '0.6875rem' }}>
                        {p.inventory} in stock
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {p.features?.slice(0, 3).map((f, i) => (
                          <span key={i} style={{ fontSize: '0.6875rem', padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
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
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <Package size={36} style={{ margin: '0 auto 12px', opacity: 0.6 }} />
            <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 4 }}>
              No Products in Catalog
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
              Add items to enable autonomous bundling and buyer discovery.
            </p>
            <Button variant="primary" onClick={openCreateModal}>
              <Plus size={14} /> Add First Product
            </Button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Product' : 'Add Catalog Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Apex HyperLight 2 Running Shoes"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input
              label="Price (₹ INR)"
              type="number"
              step="0.01"
              value={priceRupees}
              onChange={(e) => setPriceRupees(e.target.value)}
              required
              placeholder="4499"
            />
            <Input
              label="Compare-at Price (₹ INR)"
              type="number"
              step="0.01"
              value={compareAtPriceRupees}
              onChange={(e) => setCompareAtPriceRupees(e.target.value)}
              placeholder="5999"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'Footwear', label: 'Footwear' },
                { value: 'Apparel', label: 'Apparel' },
                { value: 'Accessories', label: 'Accessories' },
                { value: 'Electronics', label: 'Electronics' },
                { value: 'Fitness', label: 'Fitness' },
              ]}
            />
            <Input
              label="Inventory Stock"
              type="number"
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
              required
            />
          </div>

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Product details, specs, and materials..."
          />

          <Input
            label="AI Features (comma-separated)"
            value={featuresStr}
            onChange={(e) => setFeaturesStr(e.target.value)}
            placeholder="Carbon plate, Breathable mesh, Daily running"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              {editingId ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
