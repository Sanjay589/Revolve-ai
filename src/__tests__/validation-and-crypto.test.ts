import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { aiRecommendationSchema, createActionSchema } from '@/schemas/ai';
import { registerSchema, loginSchema } from '@/schemas/auth';

describe('Zod Validation Schemas', () => {
  it('should validate structured AI recommendation correctly', () => {
    const validRec = {
      type: 'UPSELL',
      title: 'Upgrade to Carbon Pro',
      reason: 'Customers frequently upgrade for marathon season',
      evidence: ['42% co-purchase rate in Q3', 'High margin affinity tier'],
      expectedImpact: 840000,
      confidence: 0.88,
      riskLevel: 'LOW',
    };

    const parsed = aiRecommendationSchema.safeParse(validRec);
    expect(parsed.success).toBe(true);
  });

  it('should reject malformed AI recommendation', () => {
    const invalidRec = {
      type: 'INVALID_TYPE',
      title: '',
      confidence: 1.5, // > 1.0
    };

    const parsed = aiRecommendationSchema.safeParse(invalidRec);
    expect(parsed.success).toBe(false);
  });

  it('should validate user registration data', () => {
    const validUser = {
      name: 'Aarav Sharma',
      businessName: 'Apex Athletics',
      email: 'aarav@apexgear.io',
      password: 'StrongPassword123!',
    };

    const parsed = registerSchema.safeParse(validUser);
    expect(parsed.success).toBe(true);
  });

  it('should reject weak or short password', () => {
    const invalidUser = {
      name: 'Aarav Sharma',
      businessName: 'Apex Athletics',
      email: 'aarav@apexgear.io',
      password: 'short',
    };

    const parsed = registerSchema.safeParse(invalidUser);
    expect(parsed.success).toBe(false);
  });
});

describe('Razorpay HMAC Signature Verification Logic', () => {
  const secret = 'test_razorpay_secret_key_123';
  const orderId = 'order_test_9921AA';
  const paymentId = 'pay_test_8832BB';

  it('should correctly verify valid Razorpay payment signature', () => {
    const payload = `${orderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const checkSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    expect(validSignature).toBe(checkSignature);
  });

  it('should reject tampered signature', () => {
    const payload = `${orderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const tamperedPayload = `${orderId}|pay_tampered_id`;
    const tamperedSignature = crypto
      .createHmac('sha256', secret)
      .update(tamperedPayload)
      .digest('hex');

    expect(validSignature).not.toBe(tamperedSignature);
  });
});
