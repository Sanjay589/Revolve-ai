import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'crypto';
import { WebhookService } from '@/server/services/webhook-service';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    webhookEvent: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
    payment: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    order: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    auditEvent: {
      create: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(prisma)),
  },
}));

describe('Webhook Idempotency & Deduplication', () => {
  const secret = 'webhook_secret_idempotency_test';

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RAZORPAY_WEBHOOK_SECRET = secret;
  });

  it('should detect duplicate webhook events and avoid re-processing', async () => {
    const eventId = 'evt_duplicate_test_999';
    const payload = {
      id: eventId,
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_test_dup_123',
            order_id: 'order_test_dup_123',
            method: 'upi',
          },
        },
      },
    };

    const rawBody = JSON.stringify(payload);
    const signature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

    // Mock that the event was ALREADY processed
    (prisma.webhookEvent.findUnique as any).mockResolvedValue({
      id: 'wh_record_1',
      eventId,
      processed: true,
    });

    const result = await WebhookService.processEvent(rawBody, signature);

    expect(result).toEqual({
      status: 'duplicate',
      eventId,
    });

    // Verify it did NOT call upsert or transaction to re-execute handlers
    expect(prisma.webhookEvent.upsert).not.toHaveBeenCalled();
    expect(prisma.auditEvent.create).not.toHaveBeenCalled();
  });

  it('should process new webhook events and mark as processed', async () => {
    const eventId = 'evt_new_unique_123';
    const payload = {
      id: eventId,
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_test_new_123',
            order_id: 'order_test_new_123',
            method: 'card',
          },
        },
      },
    };

    const rawBody = JSON.stringify(payload);
    const signature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

    // Not existing yet
    (prisma.webhookEvent.findUnique as any).mockResolvedValue(null);
    (prisma.webhookEvent.upsert as any).mockResolvedValue({
      id: 'wh_record_new',
      eventId,
      processed: false,
    });
    (prisma.payment.findFirst as any).mockResolvedValue({
      id: 'pay_db_1',
      razorpayOrderId: 'order_test_new_123',
    });
    (prisma.order.findFirst as any).mockResolvedValue({
      id: 'order_db_1',
      merchantId: 'merchant_123',
      status: 'CREATED',
    });

    const result = await WebhookService.processEvent(rawBody, signature);

    expect(result.status).toBe('processed');
    expect(result.eventId).toBe(eventId);
    expect(prisma.webhookEvent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ processed: true }),
      })
    );
  });
});
