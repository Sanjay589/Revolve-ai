import { prisma } from '@/lib/prisma';

interface AuditEventInput {
  merchantId: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  requestId?: string;
  ipAddress?: string;
}

export class AuditService {
  /**
   * Create an immutable audit event.
   * Audit events cannot be updated or deleted.
   */
  static async create(input: AuditEventInput) {
    return prisma.auditEvent.create({
      data: {
        merchantId: input.merchantId,
        actor: input.actor,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        reason: input.reason,
        metadata: input.metadata ? (input.metadata as any) : undefined,
        requestId: input.requestId,
        ipAddress: input.ipAddress,
      },
    });
  }

  /**
   * Get audit events for a merchant, newest first.
   */
  static async getByMerchant(
    merchantId: string,
    options: {
      limit?: number;
      offset?: number;
      action?: string;
      entityId?: string;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ) {
    const { limit = 50, offset = 0, action, entityId, startDate, endDate } = options;

    const where: Record<string, unknown> = { merchantId };
    if (action) where.action = action;
    if (entityId) where.entityId = entityId;
    if (startDate || endDate) {
      where.createdAt = {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate }),
      };
    }

    const [events, total] = await Promise.all([
      prisma.auditEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.auditEvent.count({ where }),
    ]);

    return { events, total };
  }

  /**
   * Get audit trail for a specific entity (e.g. an action or order).
   */
  static async getEntityTrail(merchantId: string, entityId: string) {
    return prisma.auditEvent.findMany({
      where: { merchantId, entityId },
      orderBy: { createdAt: 'asc' },
    });
  }
}

// Predefined audit action types
export const AuditActions = {
  // AI
  AI_RECOMMENDATION_CREATED: 'AI_RECOMMENDATION_CREATED',
  AI_ANALYSIS_STARTED: 'AI_ANALYSIS_STARTED',
  AI_ANALYSIS_COMPLETED: 'AI_ANALYSIS_COMPLETED',

  // Policy
  POLICY_CHECK_PASSED: 'POLICY_CHECK_PASSED',
  POLICY_CHECK_FAILED: 'POLICY_CHECK_FAILED',

  // Approval
  APPROVAL_REQUESTED: 'APPROVAL_REQUESTED',
  MERCHANT_APPROVED: 'MERCHANT_APPROVED',
  MERCHANT_REJECTED: 'MERCHANT_REJECTED',
  APPROVAL_EXPIRED: 'APPROVAL_EXPIRED',

  // Actions
  ACTION_CREATED: 'ACTION_CREATED',
  ACTION_EXECUTING: 'ACTION_EXECUTING',
  ACTION_COMPLETED: 'ACTION_COMPLETED',
  ACTION_FAILED: 'ACTION_FAILED',

  // Payments
  RAZORPAY_ORDER_CREATED: 'RAZORPAY_ORDER_CREATED',
  PAYMENT_INITIATED: 'PAYMENT_INITIATED',
  PAYMENT_CAPTURED: 'PAYMENT_CAPTURED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_VERIFIED: 'PAYMENT_VERIFIED',

  // Webhooks
  WEBHOOK_RECEIVED: 'WEBHOOK_RECEIVED',
  WEBHOOK_PROCESSED: 'WEBHOOK_PROCESSED',
  WEBHOOK_FAILED: 'WEBHOOK_FAILED',

  // Products
  PRODUCT_CREATED: 'PRODUCT_CREATED',
  PRODUCT_UPDATED: 'PRODUCT_UPDATED',
  PRODUCT_DELETED: 'PRODUCT_DELETED',

  // Campaigns
  CAMPAIGN_CREATED: 'CAMPAIGN_CREATED',
  CAMPAIGN_UPDATED: 'CAMPAIGN_UPDATED',

  // Auth
  USER_REGISTERED: 'USER_REGISTERED',
  USER_LOGGED_IN: 'USER_LOGGED_IN',
  USER_LOGGED_OUT: 'USER_LOGGED_OUT',

  // AI Buyer
  AI_BUYER_SESSION_STARTED: 'AI_BUYER_SESSION_STARTED',
  AI_BUYER_PURCHASE_REQUESTED: 'AI_BUYER_PURCHASE_REQUESTED',
} as const;
