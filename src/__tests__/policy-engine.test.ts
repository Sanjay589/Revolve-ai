import { describe, it, expect, vi } from 'vitest';
import { PolicyEngine } from '@/server/services/policy-engine';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    agentPolicy: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    aIAgentAction: {
      aggregate: vi.fn(),
    },
  },
}));

describe('PolicyEngine', () => {
  const mockMerchantId = 'merchant_test_01';

  it('should pass validation when action is within configured limits', async () => {
    (prisma.agentPolicy.findUnique as any).mockResolvedValue({
      id: 'pol_1',
      merchantId: mockMerchantId,
      maximumTransactionAmount: 1000000, // ₹10,000
      dailySpendLimit: 5000000,          // ₹50,000
      maximumCampaignBudget: 2000000,
      maximumDiscountPercentage: 25.0,
      requireMerchantApproval: true,
      allowedActions: ['UPSELL', 'CROSS_SELL', 'CAMPAIGN'],
      blockedActions: [],
      isActive: true,
    });

    (prisma.aIAgentAction.aggregate as any).mockResolvedValue({
      _sum: { amount: 500000 }, // ₹5,000 spent today
    });

    const result = await PolicyEngine.evaluate(mockMerchantId, {
      type: 'UPSELL',
      amount: 400000, // ₹4,000
      discountPercent: 10,
    });

    expect(result.passed).toBe(true);
    expect(result.reasons).toContain('All policy checks passed');
  });

  it('should block action when amount exceeds maximum transaction limit', async () => {
    (prisma.agentPolicy.findUnique as any).mockResolvedValue({
      id: 'pol_1',
      merchantId: mockMerchantId,
      maximumTransactionAmount: 1000000, // ₹10,000
      dailySpendLimit: 5000000,
      maximumCampaignBudget: 2000000,
      maximumDiscountPercentage: 25.0,
      requireMerchantApproval: true,
      allowedActions: ['UPSELL', 'CROSS_SELL'],
      blockedActions: [],
      isActive: true,
    });

    (prisma.aIAgentAction.aggregate as any).mockResolvedValue({
      _sum: { amount: 0 },
    });

    const result = await PolicyEngine.evaluate(mockMerchantId, {
      type: 'UPSELL',
      amount: 1500000, // ₹15,000 (> ₹10,000 limit)
    });

    expect(result.passed).toBe(false);
    expect(result.reasons[0]).toContain('exceeds maximum transaction limit');
  });

  it('should block action when discount exceeds maximum allowed percentage', async () => {
    (prisma.agentPolicy.findUnique as any).mockResolvedValue({
      id: 'pol_1',
      merchantId: mockMerchantId,
      maximumTransactionAmount: 1000000,
      dailySpendLimit: 5000000,
      maximumCampaignBudget: 2000000,
      maximumDiscountPercentage: 20.0,
      requireMerchantApproval: true,
      allowedActions: ['UPSELL', 'CROSS_SELL'],
      blockedActions: [],
      isActive: true,
    });

    const result = await PolicyEngine.evaluate(mockMerchantId, {
      type: 'UPSELL',
      amount: 50000,
      discountPercent: 30.0, // > 20%
    });

    expect(result.passed).toBe(false);
    expect(result.reasons[0]).toContain('exceeds maximum allowed');
  });

  it('should block action if type is in blockedActions', async () => {
    (prisma.agentPolicy.findUnique as any).mockResolvedValue({
      id: 'pol_1',
      merchantId: mockMerchantId,
      maximumTransactionAmount: 1000000,
      dailySpendLimit: 5000000,
      maximumCampaignBudget: 2000000,
      maximumDiscountPercentage: 25.0,
      requireMerchantApproval: true,
      allowedActions: ['UPSELL', 'CROSS_SELL'],
      blockedActions: ['CAMPAIGN'],
      isActive: true,
    });

    const result = await PolicyEngine.evaluate(mockMerchantId, {
      type: 'CAMPAIGN',
    });

    expect(result.passed).toBe(false);
    expect(result.reasons[0]).toContain('is blocked by policy');
  });
});
