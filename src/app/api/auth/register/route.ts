import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, setSessionCookie } from '@/lib/auth';
import { registerSchema } from '@/schemas/auth';
import { authLimiter, getRateLimitIdentifier } from '@/lib/rate-limit';
import { AuditService, AuditActions } from '@/server/services/audit-service';

export async function POST(req: Request) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(req);
    const rateCheck = authLimiter.check(identifier);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter || 60) } }
      );
    }

    const body = await req.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, name, businessName } = validated.data;

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create merchant and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const merchant = await tx.merchant.create({
        data: {
          name: businessName,
          businessName,
          email,
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          merchantId: merchant.id,
          role: 'merchant_admin',
        },
      });

      // Create default agent policy
      await tx.agentPolicy.create({
        data: {
          merchantId: merchant.id,
          maximumTransactionAmount: 1000000,
          dailySpendLimit: 5000000,
          maximumCampaignBudget: 2000000,
          maximumDiscountPercentage: 25.0,
          requireMerchantApproval: true,
          allowedActions: ['UPSELL', 'CROSS_SELL', 'CAMPAIGN', 'BUNDLE', 'DISCOUNT', 'AI_PURCHASE'],
          blockedActions: [],
          isActive: true,
        },
      });

      return { user, merchant };
    });

    // Set session cookie
    await setSessionCookie({
      userId: result.user.id,
      merchantId: result.merchant.id,
      activeMerchantId: result.merchant.id,
      isDemoWorkspace: false,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
    });

    // Audit
    await AuditService.create({
      merchantId: result.merchant.id,
      actor: result.user.id,
      action: AuditActions.USER_REGISTERED,
      entity: 'User',
      entityId: result.user.id,
    });

    return NextResponse.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
      merchant: {
        id: result.merchant.id,
        name: result.merchant.name,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('[Register Error]', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
