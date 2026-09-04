import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getSessionFromRequest(req);

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const [user, activeMerchant, productCount, orderCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.userId },
        include: { merchant: true },
      }),
      prisma.merchant.findUnique({
        where: { id: session.merchantId },
      }),
      prisma.product.count({
        where: { merchantId: session.merchantId },
      }),
      prisma.order.count({
        where: { merchantId: session.merchantId },
      }),
    ]);

    const isDemo = Boolean(session.isDemoWorkspace) || activeMerchant?.email === 'merchant@apexgear.io';
    const isNewMerchant = productCount === 0 && orderCount === 0;

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: session.userId,
        merchantId: session.merchantId,
        email: session.email,
        name: session.name,
        role: session.role,
        isDemoWorkspace: isDemo,
        isNewMerchant,
        productCount,
        orderCount,
        emailVerified: true,
        merchantName: activeMerchant?.name || user?.merchant?.name || 'My Store',
        businessName: activeMerchant?.businessName || user?.merchant?.businessName || '',
        personalMerchantName: user?.merchant?.name || 'My Store',
      },
    });
  } catch (err) {
    console.error('[Session Error]', err);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
