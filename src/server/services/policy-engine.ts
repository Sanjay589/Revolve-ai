import { prisma } from '@/lib/prisma';
import type { AgentPolicy } from '@prisma/client';

export interface PolicyCheckResult {
  passed: boolean;
  reasons: string[];
  policy: {
    maximumTransactionAmount: number;
    dailySpendLimit: number;
    maximumDiscountPercentage: number;
    requireMerchantApproval: boolean;
  };
}

export class PolicyEngine {
  /**
   * Evaluate an action against the merchant's agent policy.
   */
  static async evaluate(
    merchantId: string,
    action: {
      type: string;
      amount?: number;
      discountPercent?: number;
    }
  ): Promise<PolicyCheckResult> {
    const policy = await this.getPolicy(merchantId);
    const reasons: string[] = [];
    let passed = true;

    // Check if policy is active
    if (!policy.isActive) {
      return {
        passed: false,
        reasons: ['Agent policy is disabled for this merchant'],
        policy: this.extractPolicySummary(policy),
      };
    }

    // Check blocked actions
    if (policy.blockedActions.includes(action.type)) {
      passed = false;
      reasons.push(`Action type "${action.type}" is blocked by policy`);
    }

    // Check allowed actions
    if (policy.allowedActions.length > 0 && !policy.allowedActions.includes(action.type)) {
      passed = false;
      reasons.push(`Action type "${action.type}" is not in the allowed actions list`);
    }

    // Check maximum transaction amount
    if (action.amount && action.amount > policy.maximumTransactionAmount) {
      passed = false;
      reasons.push(
        `Amount ₹${(action.amount / 100).toLocaleString('en-IN')} exceeds maximum transaction limit of ₹${(policy.maximumTransactionAmount / 100).toLocaleString('en-IN')}`
      );
    }

    // Check daily spend limit
    if (action.amount) {
      const dailySpend = await this.getDailySpend(merchantId);
      if (dailySpend + action.amount > policy.dailySpendLimit) {
        passed = false;
        reasons.push(
          `Adding ₹${(action.amount / 100).toLocaleString('en-IN')} would exceed daily spend limit of ₹${(policy.dailySpendLimit / 100).toLocaleString('en-IN')} (current: ₹${(dailySpend / 100).toLocaleString('en-IN')})`
        );
      }
    }

    // Check maximum discount percentage
    if (action.discountPercent && action.discountPercent > policy.maximumDiscountPercentage) {
      passed = false;
      reasons.push(
        `Discount of ${action.discountPercent}% exceeds maximum allowed ${policy.maximumDiscountPercentage}%`
      );
    }

    if (passed) {
      reasons.push('All policy checks passed');
    }

    return {
      passed,
      reasons,
      policy: this.extractPolicySummary(policy),
    };
  }

  /**
   * Check if merchant approval is required for this action.
   */
  static async requiresApproval(merchantId: string): Promise<boolean> {
    const policy = await this.getPolicy(merchantId);
    return policy.requireMerchantApproval;
  }

  /**
   * Get or create default policy for merchant.
   */
  static async getPolicy(merchantId: string): Promise<AgentPolicy> {
    let policy = await prisma.agentPolicy.findUnique({
      where: { merchantId },
    });

    if (!policy) {
      policy = await prisma.agentPolicy.create({
        data: { merchantId },
      });
    }

    return policy;
  }

  /**
   * Calculate total spend today for a merchant from successful actions.
   */
  private static async getDailySpend(merchantId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const result = await prisma.aIAgentAction.aggregate({
      where: {
        merchantId,
        status: 'SUCCESS',
        amount: { not: null },
        executedAt: { gte: startOfDay },
      },
      _sum: { amount: true },
    });

    return result._sum.amount ?? 0;
  }

  private static extractPolicySummary(policy: AgentPolicy) {
    return {
      maximumTransactionAmount: policy.maximumTransactionAmount,
      dailySpendLimit: policy.dailySpendLimit,
      maximumDiscountPercentage: policy.maximumDiscountPercentage,
      requireMerchantApproval: policy.requireMerchantApproval,
    };
  }
}
