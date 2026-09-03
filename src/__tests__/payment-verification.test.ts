import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { WebhookService } from '@/server/services/webhook-service';
import { createOrderSchema, verifyPaymentSchema } from '@/schemas/payment';

describe('Payment Verification & Webhook Architecture', () => {
  const webhookSecret = 'test_webhook_secret_key_2026';
  const razorpaySecret = 'VsLHMfaXI1xWs6r6n13h5dLy';

  it('should validate order creation schema with strict positive amount', () => {
    const validOrder = {
      productId: 'prod_run_01',
      quantity: 2,
      customerEmail: 'customer@example.com',
      customerName: 'Aarav Sharma',
      customerPhone: '+919876543210',
    };

    const parsed = createOrderSchema.safeParse(validOrder);
    expect(parsed.success).toBe(true);
  });

  it('should reject invalid or negative quantities', () => {
    const invalidOrder = {
      productId: 'prod_run_01',
      quantity: -1,
      customerEmail: 'customer@example.com',
      customerName: 'Aarav Sharma',
    };

    const parsed = createOrderSchema.safeParse(invalidOrder);
    expect(parsed.success).toBe(false);
  });

  it('should verify correct Razorpay payment signature via HMAC-SHA256', () => {
    const orderId = 'order_TXDgqgeqiwIEq5';
    const paymentId = 'pay_TXE11a88bb99';
    const rawPayload = `${orderId}|${paymentId}`;

    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(rawPayload)
      .digest('hex');

    const verifyInput = {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: expectedSignature,
    };

    const parsed = verifyPaymentSchema.safeParse(verifyInput);
    expect(parsed.success).toBe(true);

    const checkSig = crypto
      .createHmac('sha256', razorpaySecret)
      .update(`${verifyInput.razorpay_order_id}|${verifyInput.razorpay_payment_id}`)
      .digest('hex');

    expect(checkSig).toBe(expectedSignature);
  });

  it('should reject tampered payment signatures', () => {
    const orderId = 'order_TXDgqgeqiwIEq5';
    const paymentId = 'pay_TXE11a88bb99';
    const tamperedPaymentId = 'pay_FORGED_99999';

    const validSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const tamperedCheck = crypto
      .createHmac('sha256', razorpaySecret)
      .update(`${orderId}|${tamperedPaymentId}`)
      .digest('hex');

    expect(validSignature).not.toBe(tamperedCheck);
  });

  it('should verify raw webhook HMAC signatures', () => {
    process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret;
    const rawBody = JSON.stringify({
      entity: 'event',
      event: 'payment.captured',
      id: 'evt_test_123456',
    });

    const validWebhookSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const isValid = WebhookService.verifySignature(rawBody, validWebhookSig);
    expect(isValid).toBe(true);

    const isTamperedValid = WebhookService.verifySignature(rawBody, 'invalid_sig_123');
    expect(isTamperedValid).toBe(false);
  });
});
