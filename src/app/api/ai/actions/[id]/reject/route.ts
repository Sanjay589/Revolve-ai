import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { ActionService } from '@/server/services/action-service';
import { generateRequestId } from '@/lib/utils';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(req);
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const reason = body.reason as string | undefined;
    const requestId = generateRequestId();

    const result = await ActionService.rejectAction(
      session.merchantId,
      id,
      session.userId,
      reason,
      requestId
    );

    return NextResponse.json({ approval: result, requestId });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : 'Failed to reject action';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
