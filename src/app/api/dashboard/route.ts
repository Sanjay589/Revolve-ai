import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await requireAuth(req);
    const { merchantId } = session;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalRevenue,
      lastMonthRevenue,
      totalOrders,
      lastMonthOrders,
      totalCustomers,
      pendingApprovals,
      aiRecommendations,
      recentOrders,
      recentAuditEvents,
      aiAttributedRevenue,
      totalActions,
      passedActions,
    ] = await Promise.all([
      // Current month revenue
      prisma.order.aggregate({
        where: { merchantId, status: 'PAID', createdAt: { gte: startOfMonth } },
        _sum: { amount: true },
        _count: true,
      }),
      // Last month revenue
      prisma.order.aggregate({
        where: {
          merchantId,
          status: 'PAID',
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { amount: true },
        _count: true,
      }),
      // Total orders this month
      prisma.order.count({
        where: { merchantId, createdAt: { gte: startOfMonth } },
      }),
      // Last month orders
      prisma.order.count({
        where: { merchantId, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),
      // Total customers
      prisma.customer.count({ where: { merchantId } }),
      // Pending approvals
      prisma.approval.count({
        where: { merchantId, status: 'PENDING' },
      }),
      // Recent recommendations
      prisma.aIRecommendation.findMany({
        where: { merchantId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      // Recent orders
      prisma.order.findMany({
        where: { merchantId },
        include: { payments: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      // Recent audit events
      prisma.auditEvent.findMany({
        where: { merchantId },
        orderBy: { createdAt: 'desc' },
        take: 15,
      }),
      // AI-attributed revenue (orders linked to AI actions)
      prisma.order.aggregate({
        where: {
          merchantId,
          status: 'PAID',
          aiActionId: { not: null },
          createdAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      // Total AI agent actions evaluated
      prisma.aIAgentAction.count({
        where: { merchantId },
      }),
      // Actions that successfully passed policy guardrails
      prisma.aIAgentAction.count({
        where: {
          merchantId,
          status: { notIn: ['FAILED', 'REJECTED'] },
        },
      }),
    ]);

    const revenue = totalRevenue._sum.amount || 0;
    const prevRevenue = lastMonthRevenue._sum.amount || 0;
    const paidOrders = totalRevenue._count || 0;
    const avgOrderValue = paidOrders > 0 ? Math.round(revenue / paidOrders) : 0;
    const conversionRate = totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0;
    const policyGuardrailRate = totalActions > 0
      ? Math.round((passedActions / totalActions) * 100)
      : 100;

    return NextResponse.json({
      metrics: {
        revenue,
        revenueChange: prevRevenue > 0 ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100) : 0,
        orders: paidOrders,
        ordersChange: lastMonthOrders > 0 ? Math.round(((paidOrders - (lastMonthRevenue._count || 0)) / (lastMonthRevenue._count || 1)) * 100) : 0,
        avgOrderValue,
        conversionRate,
        customers: totalCustomers,
        pendingApprovals,
        aiAttributedRevenue: aiAttributedRevenue._sum.amount || 0,
        policyGuardrailRate,
      },
      recentRecommendations: aiRecommendations,
      recentOrders,
      recentActivity: recentAuditEvents,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('[Dashboard Error]', error);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}
