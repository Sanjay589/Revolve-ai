import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PaymentService } from '@/server/services/payment-service';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(req);
    const { id } = await params;

    const result = await PaymentService.handleTimeout(id, session.merchantId);

    if (!result) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('[Transaction Recover Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Reconciliation failed' },
      { status: 500 }
    );
  }
}
