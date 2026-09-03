import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PolicyEngine } from '@/server/services/policy-engine';
import { prisma } from '@/lib/prisma';
import { updatePolicySchema } from '@/schemas/policy';

export async function GET(req: Request) {
  try {
    const session = await requireAuth(req);
    const policy = await PolicyEngine.getPolicy(session.merchantId);
    return NextResponse.json({ policy });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch policy' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();
    const validated = updatePolicySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const policy = await prisma.agentPolicy.upsert({
      where: { merchantId: session.merchantId },
      create: { merchantId: session.merchantId, ...validated.data },
      update: validated.data,
    });

    return NextResponse.json({ policy });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update policy' }, { status: 500 });
  }
}

export const PUT = PATCH;
