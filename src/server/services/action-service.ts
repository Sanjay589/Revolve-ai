import { prisma } from '@/lib/prisma';
import { PolicyEngine } from './policy-engine';
import { ApprovalService } from './approval-service';
import { AuditService, AuditActions } from './audit-service';
import type { ActionStatus } from '@prisma/client';

// Valid state transitions for the action state machine
const VALID_TRANSITIONS: Record<string, ActionStatus[]> = {
  PROPOSED: ['POLICY_CHECK', 'REJECTED'],
  POLICY_CHECK: ['AWAITING_APPROVAL', 'APPROVED', 'REJECTED', 'FAILED'],
  AWAITING_APPROVAL: ['APPROVED', 'REJECTED', 'EXPIRED'],
  APPROVED: ['EXECUTING'],
  EXECUTING: ['SUCCESS', 'FAILED', 'EXECUTION_UNKNOWN'],
  SUCCESS: [], // terminal
  FAILED: [], // terminal
  REJECTED: [], // terminal
  EXPIRED: [], // terminal
  EXECUTION_UNKNOWN: ['SUCCESS', 'FAILED'], // can be resolved
};

export class ActionService {
  /**
   * Create a new agent action from an AI recommendation.
   * Runs through the full state machine: PROPOSED → POLICY_CHECK → ...
   */
  static async createAction(params: {
    merchantId: string;
    userId: string;
    recommendationId?: string;
    type: string;
    title: string;
    description?: string;
    amount?: number;
    currency?: string;
    riskLevel?: string;
    metadata?: Record<string, unknown>;
    requestId?: string;
  }) {
    const {
      merchantId,
      userId,
      recommendationId,
      type,
      title,
      description,
      amount,
      currency = 'INR',
      riskLevel = 'LOW',
      metadata,
      requestId,
    } = params;

    // Create the action in PROPOSED state
    const action = await prisma.aIAgentAction.create({
      data: {
        merchantId,
        recommendationId,
        type: type as never,
        status: 'PROPOSED',
        title,
        description,
        amount,
        currency,
        riskLevel: riskLevel as never,
        metadata: metadata ? (metadata as any) : undefined,
      },
    });

    await AuditService.create({
      merchantId,
      actor: userId,
      action: AuditActions.ACTION_CREATED,
      entity: 'AIAgentAction',
      entityId: action.id,
      reason: title,
      requestId,
    });

    // ─── Policy Check ────────────────────────────────────
    await this.transitionStatus(action.id, 'PROPOSED', 'POLICY_CHECK');

    const policyResult = await PolicyEngine.evaluate(merchantId, {
      type,
      amount,
    });

    await prisma.aIAgentAction.update({
      where: { id: action.id },
      data: { policyResult: policyResult as any },
    });

    if (!policyResult.passed) {
      await this.transitionStatus(action.id, 'POLICY_CHECK', 'FAILED');
      await AuditService.create({
        merchantId,
        actor: 'system',
        action: AuditActions.POLICY_CHECK_FAILED,
        entity: 'AIAgentAction',
        entityId: action.id,
        reason: policyResult.reasons.join('; '),
        requestId,
      });

      return prisma.aIAgentAction.findUnique({
        where: { id: action.id },
        include: { recommendation: true, approval: true },
      });
    }

    await AuditService.create({
      merchantId,
      actor: 'system',
      action: AuditActions.POLICY_CHECK_PASSED,
      entity: 'AIAgentAction',
      entityId: action.id,
      requestId,
    });

    // ─── Approval Check ──────────────────────────────────
    const needsApproval = await PolicyEngine.requiresApproval(merchantId);

    if (needsApproval) {
      await this.transitionStatus(action.id, 'POLICY_CHECK', 'AWAITING_APPROVAL');
      const approval = await ApprovalService.create(merchantId, action.id);

      await AuditService.create({
        merchantId,
        actor: 'system',
        action: AuditActions.APPROVAL_REQUESTED,
        entity: 'Approval',
        entityId: approval.id,
        reason: `Approval required for: ${title}`,
        requestId,
      });

      // Create notification
      await prisma.notification.create({
        data: {
          merchantId,
          type: 'APPROVAL_REQUIRED',
          title: 'Approval Required',
          message: `AI agent action requires your approval: ${title}`,
          entityId: action.id,
          entityType: 'AIAgentAction',
        },
      });
    } else {
      // Auto-approve
      await this.transitionStatus(action.id, 'POLICY_CHECK', 'APPROVED');
    }

    return prisma.aIAgentAction.findUnique({
      where: { id: action.id },
      include: { recommendation: true, approval: true },
    });
  }

  /**
   * Approve an action and move it to APPROVED state.
   */
  static async approveAction(
    merchantId: string,
    actionId: string,
    userId: string,
    requestId?: string
  ) {
    const approval = await ApprovalService.approve(merchantId, actionId, userId);

    await AuditService.create({
      merchantId,
      actor: userId,
      action: AuditActions.MERCHANT_APPROVED,
      entity: 'AIAgentAction',
      entityId: actionId,
      requestId,
    });

    await prisma.notification.create({
      data: {
        merchantId,
        type: 'SYSTEM',
        title: 'Action Approved',
        message: `You approved: ${approval.action.title}`,
        entityId: actionId,
        entityType: 'AIAgentAction',
      },
    });

    return approval;
  }

  /**
   * Reject an action.
   */
  static async rejectAction(
    merchantId: string,
    actionId: string,
    userId: string,
    reason?: string,
    requestId?: string
  ) {
    const approval = await ApprovalService.reject(merchantId, actionId, userId, reason);

    await AuditService.create({
      merchantId,
      actor: userId,
      action: AuditActions.MERCHANT_REJECTED,
      entity: 'AIAgentAction',
      entityId: actionId,
      reason,
      requestId,
    });

    return approval;
  }

  /**
   * Transition action status with validation.
   */
  static async transitionStatus(
    actionId: string,
    from: ActionStatus,
    to: ActionStatus
  ) {
    const validTargets = VALID_TRANSITIONS[from];
    if (!validTargets || !validTargets.includes(to)) {
      throw new Error(`Invalid state transition: ${from} → ${to}`);
    }

    return prisma.aIAgentAction.update({
      where: { id: actionId, status: from },
      data: {
        status: to,
        ...(to === 'SUCCESS' || to === 'FAILED' ? { executedAt: new Date() } : {}),
      },
    });
  }

  /**
   * Get actions for a merchant with optional filtering.
   */
  static async getActions(
    merchantId: string,
    options: {
      status?: string;
      type?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const { status, type, limit = 50, offset = 0 } = options;

    const where: Record<string, unknown> = { merchantId };
    if (status) where.status = status;
    if (type) where.type = type;

    const [actions, total] = await Promise.all([
      prisma.aIAgentAction.findMany({
        where,
        include: {
          recommendation: true,
          approval: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.aIAgentAction.count({ where }),
    ]);

    return { actions, total };
  }
}
