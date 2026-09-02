import { NextResponse } from 'next/server';
import { WebhookService } from '@/server/services/webhook-service';

export async function POST(req: Request) {
  try {
    // Get raw body for signature verification — must read before any parsing
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = WebhookService.verifySignature(rawBody, signature);
    if (!isValid) {
      console.error('[Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Process the webhook event
    const result = await WebhookService.processEvent(rawBody, signature);

    return NextResponse.json(
      { status: result.status, eventId: result.eventId },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Webhook Error]', error);
    // Always return 200 to prevent Razorpay from retrying on application errors
    // The error is logged and the event is stored for manual review
    return NextResponse.json(
      { status: 'error', message: 'Webhook processing error' },
      { status: 200 }
    );
  }
}
