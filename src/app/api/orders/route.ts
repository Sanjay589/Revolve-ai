import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { PaymentService } from '@/server/services/payment-service';
import { createOrderSchema } from '@/schemas/payment';
import { AuditService, AuditActions } from '@/server/services/audit-service';
import { paymentLimiter, getRateLimitIdentifier } from '@/lib/rate-limit';
import { generateRequestId } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(req);
    const rateCheck = paymentLimiter.check(identifier);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many payment requests. Please wait.' },
        { status: 429 }
      );
    }

    const session = await requireAuth(req);
    const body = await req.json();
    const validated = createOrderSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const requestId = generateRequestId();
    console.log('[Server][Step 1 - Order Creation Request]', {
      merchantId: session.merchantId,
      productId: validated.data.productId,
      quantity: validated.data.quantity,
      customerEmail: validated.data.customerEmail,
      requestId,
    });

    const result = await PaymentService.createOrder({
      merchantId: session.merchantId,
      ...validated.data,
    });

    console.log('[Server][Step 1 - Order Created Successfully]', {
      orderId: result.order.id,
      razorpayOrderId: result.razorpayOrderId,
      amount: result.amount,
      alreadyExists: result.alreadyExists,
    });

    if (!result.alreadyExists) {
      await AuditService.create({
        merchantId: session.merchantId,
        actor: session.userId,
        action: AuditActions.RAZORPAY_ORDER_CREATED,
        entity: 'Order',
        entityId: result.order.id,
        metadata: {
          razorpayOrderId: result.razorpayOrderId,
          amount: result.amount,
        },
        requestId,
      });
    }

    return NextResponse.json({
      orderId: result.order.id,
      razorpayOrderId: result.razorpayOrderId,
      amount: result.amount,
      currency: result.currency,
      keyId: result.keyId,
      alreadyExists: result.alreadyExists,
      requestId,
    }, { status: result.alreadyExists ? 200 : 201 });
  } catch (error) {
    console.error('[Server][Step 1 - Order Creation Failed]', error);
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof Error && error.name === 'PaymentError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('[Order Create Error]', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
