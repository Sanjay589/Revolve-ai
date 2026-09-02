import { z } from 'zod';

export const updatePolicySchema = z.object({
  maximumTransactionAmount: z.number().int().positive().optional(),
  dailySpendLimit: z.number().int().positive().optional(),
  maximumCampaignBudget: z.number().int().positive().optional(),
  maximumDiscountPercentage: z.number().min(0).max(100).optional(),
  requireMerchantApproval: z.boolean().optional(),
  allowedActions: z.array(z.string()).optional(),
  blockedActions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type UpdatePolicyInput = z.infer<typeof updatePolicySchema>;
