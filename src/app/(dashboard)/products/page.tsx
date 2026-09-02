'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Sparkles, RefreshCw, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

    const payload = {
      name,
      description,
      price: Math.round(parseFloat(priceRupees) * 100),
      compareAtPrice: compareAtPriceRupees ? Math.round(parseFloat(compareAtPriceRupees) * 100) : null,
      category,
      inventory: parseInt(inventory) || 0,
      features: featuresStr.split(',').map((f) => f.trim()).filter(Boolean),
      tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
      isActive: true,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update product');
        success('Product Updated', `${name} has been updated in your catalog.`);
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create product');
        success('Product Created', `${name} is now live and indexed by AI.`);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      error('Save Failed', err instanceof Error ? err.message : 'Error saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, pName: string) => {
    if (!confirm(`Are you sure you want to delete ${pName}?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      success('Product Removed', `${pName} was deleted.`);
      fetchProducts();
    } catch (err: unknown) {
      error('Delete Error', err instanceof Error ? err.message : 'Error deleting product');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-neutral">
              <Package size={12} /> INVENTORY & CATALOG
            </span>
          </div>
          <h1 className="page-title">Product Management</h1>
          <p className="page-subtitle">
            Manage your store catalog with AI co-purchase indexing & pricing features.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" onClick={fetchProducts} isLoading={isLoading}>
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button variant="primary" onClick={openCreateModal}>
            <Plus size={16} /> Add Product
          </Button>
        </div>
      </div>

      {/* Products Grid / Table */}
      {products.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
          <Package size={32} color="var(--text-secondary)" style={{ margin: '0 auto 12px' }} />
          <h3 className="font-heading" style={{ fontSize: '1.125rem', marginBottom: 6 }}>
            No products found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>
            Add your first product to activate AI catalog intelligence.
          </p>
          <Button variant="primary" onClick={openCreateModal}>
            <Plus size={16} /> Add First Product
          </Button>
        </Card>
      ) : (
        <div className="table-container card" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Inventory</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <p style={{ fontWeight: 600 }}>{p.name}</p>
                    {p.sku && <span className="font-mono text-xs text-tertiary">SKU: {p.sku}</span>}
                  </td>
                  <td>
                    <span className="badge badge-neutral">{p.category || 'General'}</span>
                  </td>
                  <td>
                    <span className="font-heading font-bold">{formatCurrency(p.price)}</span>
                    {p.compareAtPrice && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textDecoration: 'line-through', marginLeft: 6 }}>
                        {formatCurrency(p.compareAtPrice)}
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 500, color: p.inventory < 10 ? 'var(--error)' : 'var(--text-primary)' }}>
                      {p.inventory} in stock
                    </span>
                  </td>
                  <td>
                    <Badge variant={p.isActive ? 'success' : 'neutral'}>
                      {p.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(p)}
                        className="btn btn-ghost btn-icon"
                        aria-label="Edit product"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.name)}
                        className="btn btn-ghost btn-icon"
                        style={{ color: 'var(--error)' }}
                        aria-label="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Product' : 'Add New Product'}
        description="All fields are persisted to PostgreSQL and indexed for AI discovery"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            label="Product Name"
            required
            placeholder="e.g. Velocity Pro Carbon Running Shoes"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="Price (₹ INR)"
              type="number"
              step="0.01"
              required
              placeholder="4499"
              value={priceRupees}
              onChange={(e) => setPriceRupees(e.target.value)}
            />
            <Input
              label="Compare At Price (₹)"
              type="number"
              step="0.01"
              placeholder="5999 (optional)"
              value={compareAtPriceRupees}
              onChange={(e) => setCompareAtPriceRupees(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input
              label="Category"
              placeholder="Footwear, Electronics, etc."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Input
              label="Inventory"
              type="number"
              required
              placeholder="50"
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
            />
          </div>

          <Textarea
            label="Description"
            rows={2}
            placeholder="Detailed description of features and materials..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            label="Features (comma-separated)"
            placeholder="Carbon Fiber Plate, Nitrogen Foam, Mesh"
            value={featuresStr}
            onChange={(e) => setFeaturesStr(e.target.value)}
          />

          <Input
            label="Tags (comma-separated)"
            placeholder="running, marathon, sports"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingId ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
