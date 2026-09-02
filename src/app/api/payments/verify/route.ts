import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PaymentService } from '@/server/services/payment-service';
import { verifyPaymentSchema } from '@/schemas/payment';
import { AuditService, AuditActions } from '@/server/services/audit-service';

export async function POST(req: Request) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();
    const validated = verifyPaymentSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid payment data' },
        { status: 400 }
      );
    }

    const result = await PaymentService.verifyPayment({
      ...validated.data,
      merchantId: session.merchantId,
    });

    if (!result.alreadyVerified) {
      await AuditService.create({
        merchantId: session.merchantId,
        actor: session.userId,
        action: AuditActions.PAYMENT_VERIFIED,
        entity: 'Payment',
        entityId: result.payment.id,
        metadata: {
          razorpayPaymentId: result.payment.razorpayPaymentId,
          orderId: result.order.id,
        },
      });

      // Create success notification
      await (await import('@/lib/prisma')).prisma.notification.create({
        data: {
          merchantId: session.merchantId,
          type: 'PAYMENT_SUCCESS',
          title: 'Payment Received',
          message: `Payment of ₹${(result.payment.amount / 100).toLocaleString('en-IN')} verified successfully`,
          entityId: result.payment.id,
          entityType: 'Payment',
        },
      });
    }

    return NextResponse.json({
      verified: true,
      orderId: result.order.id,
      paymentId: result.payment.id,
      alreadyVerified: result.alreadyVerified,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof Error && error.name === 'PaymentError') {
      return NextResponse.json({ error: error.message, verified: false }, { status: 400 });
    }
    console.error('[Payment Verify Error]', error);
    return NextResponse.json({ error: 'Verification failed', verified: false }, { status: 500 });
  }
}
