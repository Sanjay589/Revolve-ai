import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, setSessionCookie } from '@/lib/auth';
import { loginSchema } from '@/schemas/auth';
import { authLimiter, getRateLimitIdentifier } from '@/lib/rate-limit';
import { AuditService, AuditActions } from '@/server/services/audit-service';

export async function POST(req: Request) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(req);
    const rateCheck = authLimiter.check(identifier);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter || 60) } }
      );
    }

    const body = await req.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }

    const { email, password } = validated.data;

    // Find user with merchant
    const user = await prisma.user.findUnique({
      where: { email },
      include: { merchant: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.merchant.isActive) {
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 403 }
      );
    }

    // Set session cookie
    await setSessionCookie({
      userId: user.id,
      merchantId: user.merchantId,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Audit
    await AuditService.create({
      merchantId: user.merchantId,
      actor: user.id,
      action: AuditActions.USER_LOGGED_IN,
      entity: 'User',
      entityId: user.id,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      merchant: {
        id: user.merchant.id,
        name: user.merchant.name,
      },
    });
  } catch (error) {
    console.error('[Login Error]', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
