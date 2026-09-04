import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest, setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const mode = body.mode === 'demo' ? 'demo' : 'personal';

    // Retrieve the base user to know their real merchant
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { merchant: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let targetMerchantId = user.merchantId;
    let targetMerchantName = user.merchant.name;
    const isDemo = mode === 'demo';

    if (isDemo) {
      // Find the seeded demo merchant
      const demoMerchant = await prisma.merchant.findFirst({
        where: {
          OR: [
            { email: 'merchant@apexgear.io' },
            { name: { contains: 'Apex Athletics' } },
          ],
        },
      });

      if (demoMerchant) {
        targetMerchantId = demoMerchant.id;
        targetMerchantName = demoMerchant.name;
      }
    }

    // Set updated session cookie with activeMerchantId and isDemoWorkspace flag
    await setSessionCookie({
      userId: user.id,
      merchantId: user.merchantId, // base merchant
      activeMerchantId: targetMerchantId,
      isDemoWorkspace: isDemo,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      mode,
      isDemoWorkspace: isDemo,
      activeMerchantId: targetMerchantId,
      activeMerchantName: targetMerchantName,
      personalMerchantName: user.merchant.name,
    });
  } catch (error) {
    console.error('[Switch Workspace Error]', error);
    return NextResponse.json(
      { error: 'Failed to switch workspace' },
      { status: 500 }
    );
  }
}
