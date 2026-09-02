import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createCampaignSchema } from '@/schemas/campaign';
import { AuditService, AuditActions } from '@/server/services/audit-service';

export async function GET(req: Request) {
  try {
    const session = await requireAuth(req);
    const campaigns = await prisma.campaign.findMany({
      where: { merchantId: session.merchantId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ campaigns });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();
    const validated = createCampaignSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        merchantId: session.merchantId,
        ...validated.data,
      },
    });

    await AuditService.create({
      merchantId: session.merchantId,
      actor: session.userId,
      action: AuditActions.CAMPAIGN_CREATED,
      entity: 'Campaign',
      entityId: campaign.id,
      reason: `Created campaign: ${campaign.name}`,
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
