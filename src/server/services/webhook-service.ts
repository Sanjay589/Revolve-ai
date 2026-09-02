import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export class WebhookService {
  /**
   * Verify Razorpay webhook signature using HMAC SHA256.
   * Must use the raw request body (unparsed string).
   */
  static verifySignature(rawBody: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('[Webhook] RAZORPAY_WEBHOOK_SECRET not configured');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Process a webhook event with deduplication and safe state transitions.
   */
  static async processEvent(rawBody: string, signature: string) {
    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.id;
    const eventType = payload.event;

    if (!eventId || !eventType) {
      throw new WebhookError('Invalid webhook payload: missing event_id or event type');
    }

    // ─── Deduplication ───────────────────────────────────
    const existing = await prisma.webhookEvent.findUnique({
      where: { eventId },
    });

    if (existing?.processed) {
      return { status: 'duplicate', eventId };
    }

    // ─── Store webhook event ─────────────────────────────
    const webhookEvent = await prisma.webhookEvent.upsert({
      where: { eventId },
      create: {
        eventId,
        eventType,
        payload,
        signature,
        processed: false,
        attempts: 1,
      },
      update: {
        attempts: { increment: 1 },
      },
    });

    // ─── Process by event type ───────────────────────────
    try {
      switch (eventType) {
        case 'payment.captured':
          await this.handlePaymentCaptured(payload);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(payload);
          break;
        case 'payment.authorized':
          await this.handlePaymentAuthorized(payload);
          break;
        case 'order.paid':
          await this.handleOrderPaid(payload);
          break;
        default:
          console.log(`[Webhook] Unhandled event type: ${eventType}`);
      }

      // Mark as processed
      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: { processed: true, processedAt: new Date() },
      });

      return { status: 'processed', eventId, eventType };
    } catch (error) {
      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  // ─── Event Handlers ──────────────────────────────────────

  private static async handlePaymentCaptured(payload: Record<string, unknown>) {
    const entity = (payload.payload as Record<string, Record<string, unknown>>)?.payment?.entity as Record<string, unknown>;
    if (!entity) return;

    const razorpayPaymentId = entity.id as string;
    const razorpayOrderId = entity.order_id as string;
    const method = entity.method as string;

    if (!razorpayOrderId) return;

    await prisma.$transaction(async (tx) => {
      // Update or create payment record
      const payment = await tx.payment.findFirst({
        where: { razorpayOrderId },
      });

      if (payment) {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            razorpayPaymentId,
            status: 'CAPTURED',
            method,
            webhookConfirmedAt: new Date(),
          },
        });
      }

      // Update order status
      const order = await tx.order.findFirst({
        where: { razorpayOrderId },
      });

      if (order && order.status !== 'PAID') {
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'PAID' },
        });
      }
    });
  }

  private static async handlePaymentFailed(payload: Record<string, unknown>) {
    const entity = (payload.payload as Record<string, Record<string, unknown>>)?.payment?.entity as Record<string, unknown>;
    if (!entity) return;

    const razorpayOrderId = entity.order_id as string;
    const errorCode = (entity.error_code as string) || undefined;
    const errorDesc = (entity.error_description as string) || undefined;

    if (!razorpayOrderId) return;

    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({
        where: { razorpayOrderId },
      });

      if (payment && payment.status !== 'CAPTURED') {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
            errorCode,
            errorDescription: errorDesc,
            webhookConfirmedAt: new Date(),
          },
        });
      }

      const order = await tx.order.findFirst({
        where: { razorpayOrderId },
      });

      if (order && order.status !== 'PAID') {
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'FAILED' },
        });
      }
    });
  }

  private static async handlePaymentAuthorized(payload: Record<string, unknown>) {
    const entity = (payload.payload as Record<string, Record<string, unknown>>)?.payment?.entity as Record<string, unknown>;
    if (!entity) return;

    const razorpayOrderId = entity.order_id as string;
    const razorpayPaymentId = entity.id as string;

    if (!razorpayOrderId) return;

    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId },
    });

    if (payment && payment.status === 'CREATED') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          razorpayPaymentId,
          status: 'AUTHORIZED',
        },
      });
    }
  }

  private static async handleOrderPaid(payload: Record<string, unknown>) {
    const entity = (payload.payload as Record<string, Record<string, unknown>>)?.order?.entity as Record<string, unknown>;
    if (!entity) return;

    const razorpayOrderId = entity.id as string;
    if (!razorpayOrderId) return;

    const order = await prisma.order.findFirst({
      where: { razorpayOrderId },
    });

    if (order && order.status !== 'PAID') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID' },
      });
    }
  }
}

export class WebhookError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebhookError';
  }
}
