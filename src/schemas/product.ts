import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().max(2000).optional(),
  shortDescription: z.string().max(500).optional(),
  price: z.number().int().positive('Price must be a positive integer (in paise)'),
  compareAtPrice: z.number().int().positive().optional().nullable(),
  currency: z.string().default('INR'),
  category: z.string().max(100).optional(),
  sku: z.string().max(100).optional(),
  inventory: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  imageUrl: z.string().url().optional().nullable(),
  features: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  aiMetadata: z.record(z.string(), z.unknown()).optional().nullable(),
  upsellProductIds: z.array(z.string()).default([]),
  crossSellProductIds: z.array(z.string()).default([]),
});

export const updateProductSchema = createProductSchema.partial();

export const createVariantSchema = z.object({
  name: z.string().min(1),
  sku: z.string().optional(),
  price: z.number().int().positive(),
  inventory: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  attributes: z.record(z.string(), z.string()).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
