import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { ActionService } from '@/server/services/action-service';
import { createActionSchema } from '@/schemas/ai';
import { generateRequestId } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();
    const validated = createActionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const requestId = generateRequestId();
    const action = await ActionService.createAction({
      merchantId: session.merchantId,
      userId: session.userId,
      requestId,
      ...validated.data,
    });

    return NextResponse.json({ action, requestId }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('[AI Actions Error]', error);
    return NextResponse.json({ error: 'Failed to create action' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await requireAuth(req);
    const url = new URL(req.url);
    const status = url.searchParams.get('status') || undefined;
    const type = url.searchParams.get('type') || undefined;

    const result = await ActionService.getActions(session.merchantId, { status, type });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch actions' }, { status: 500 });
  }
}
