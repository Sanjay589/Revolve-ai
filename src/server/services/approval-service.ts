import { prisma } from '@/lib/prisma';

export class ApprovalService {
  /**
   * Create an approval request for an AI agent action.
   * Approval expires after 24 hours.
   */
  static async create(merchantId: string, actionId: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return prisma.approval.create({
      data: {
        merchantId,
        actionId,
        status: 'PENDING',
        expiresAt,
      },
      include: {
        action: {
          include: {
            recommendation: true,
          },
        },
      },
    });
  }

  /**
   * Approve an action. Returns the updated approval.
   */
  static async approve(merchantId: string, actionId: string, userId: string) {
    const approval = await prisma.approval.findFirst({
      where: { merchantId, actionId, status: 'PENDING' },
    });

    if (!approval) {
      throw new Error('Approval not found or already processed');
    }

    if (new Date() > approval.expiresAt) {
      await prisma.approval.update({
        where: { id: approval.id },
        data: { status: 'EXPIRED' },
      });
      throw new Error('Approval has expired');
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.approval.update({
        where: { id: approval.id },
        data: {
          status: 'APPROVED',
          approvedBy: userId,
          respondedAt: new Date(),
        },
        include: {
          action: true,
        },
      });

      // Update the associated action status
      await tx.aIAgentAction.update({
        where: { id: actionId },
        data: { status: 'APPROVED' },
      });

      return updated;
    });
  }

  /**
   * Reject an action.
   */
  static async reject(merchantId: string, actionId: string, userId: string, reason?: string) {
    const approval = await prisma.approval.findFirst({
      where: { merchantId, actionId, status: 'PENDING' },
    });

    if (!approval) {
      throw new Error('Approval not found or already processed');
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.approval.update({
        where: { id: approval.id },
        data: {
          status: 'REJECTED',
          rejectedBy: userId,
          reason,
          respondedAt: new Date(),
        },
        include: {
          action: true,
        },
      });

      await tx.aIAgentAction.update({
        where: { id: actionId },
        data: { status: 'REJECTED' },
      });

      return updated;
    });
  }

  /**
   * Get pending approvals for a merchant.
   */
  static async getPending(merchantId: string) {
    // First expire any past-due approvals
    await prisma.approval.updateMany({
      where: {
        merchantId,
        status: 'PENDING',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'EXPIRED' },
    });

    // Also update associated actions
    const expired = await prisma.approval.findMany({
      where: { merchantId, status: 'EXPIRED' },
      select: { actionId: true },
    });

    if (expired.length > 0) {
      await prisma.aIAgentAction.updateMany({
        where: {
          id: { in: expired.map((e) => e.actionId) },
          status: 'AWAITING_APPROVAL',
        },
        data: { status: 'EXPIRED' },
      });
    }

    return prisma.approval.findMany({
      where: { merchantId, status: 'PENDING' },
      include: {
        action: {
          include: {
            recommendation: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get all approvals for a merchant.
   */
  static async getAll(merchantId: string, limit = 50, offset = 0) {
    const [approvals, total] = await Promise.all([
      prisma.approval.findMany({
        where: { merchantId },
        include: {
          action: {
            include: {
              recommendation: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.approval.count({ where: { merchantId } }),
    ]);

    return { approvals, total };
  }
}
