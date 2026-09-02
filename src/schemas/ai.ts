import { z } from 'zod';

export const riskLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const recommendationTypeSchema = z.enum([
  'UPSELL',
  'CROSS_SELL',
  'CAMPAIGN',
  'PRICING',
  'BUNDLE',
  'CONVERSION',
]);

export const aiRecommendationSchema = z.object({
  type: recommendationTypeSchema,
  title: z.string().min(1).max(500),
  reason: z.string().min(1).max(2000),
  evidence: z.array(z.string()).min(1),
  expectedImpact: z.number().int().positive(),
  confidence: z.number().min(0).max(1),
  riskLevel: riskLevelSchema,
  productId: z.string().optional(),
  targetProductIds: z.array(z.string()).optional().default([]),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const actionTypeSchema = z.enum([
  'UPSELL',
  'CROSS_SELL',
  'CAMPAIGN',
  'PRICING',
  'BUNDLE',
  'DISCOUNT',
  'AI_PURCHASE',
]);

export const createActionSchema = z.object({
  recommendationId: z.string().optional(),
  type: actionTypeSchema,
  title: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  amount: z.number().int().positive().optional(),
  currency: z.string().default('INR'),
  riskLevel: riskLevelSchema.default('LOW'),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const aiBuyerMessageSchema = z.object({
  sessionId: z.string().optional(),
  message: z.string().min(1).max(1000),
  buyerName: z.string().optional(),
  buyerEmail: z.string().email().optional(),
});

export const generateRecommendationsSchema = z.object({
  focusArea: z.enum(['all', 'upsell', 'cross_sell', 'campaign', 'pricing']).default('all'),
  limit: z.number().int().min(1).max(20).default(5),
});

export type AIRecommendation = z.infer<typeof aiRecommendationSchema>;
export type CreateActionInput = z.infer<typeof createActionSchema>;
export type AIBuyerMessage = z.infer<typeof aiBuyerMessageSchema>;
export type GenerateRecommendationsInput = z.infer<typeof generateRecommendationsSchema>;
