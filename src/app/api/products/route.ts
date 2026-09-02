import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createProductSchema } from '@/schemas/product';
import { AuditService, AuditActions } from '@/server/services/audit-service';

export async function GET(req: Request) {
  try {
    const session = await requireAuth(req);
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const active = url.searchParams.get('active');

    const where: Record<string, unknown> = { merchantId: session.merchantId };
    if (category) where.category = category;
    if (active !== null) where.isActive = active === 'true';

    const products = await prisma.product.findMany({
      where,
      include: { variants: true, _count: { select: { orderItems: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();
    const validated = createProductSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        merchantId: session.merchantId,
        name: validated.data.name,
        description: validated.data.description,
        shortDescription: validated.data.shortDescription,
        price: validated.data.price,
        compareAtPrice: validated.data.compareAtPrice,
        currency: validated.data.currency,
        category: validated.data.category,
        sku: validated.data.sku,
        inventory: validated.data.inventory,
        isActive: validated.data.isActive,
        imageUrl: validated.data.imageUrl,
        features: validated.data.features,
        tags: validated.data.tags,
        aiMetadata: validated.data.aiMetadata as any,
        upsellProductIds: validated.data.upsellProductIds,
        crossSellProductIds: validated.data.crossSellProductIds,
      },
      include: { variants: true },
    });

    await AuditService.create({
      merchantId: session.merchantId,
      actor: session.userId,
      action: AuditActions.PRODUCT_CREATED,
      entity: 'Product',
      entityId: product.id,
      reason: `Created product: ${product.name}`,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('[Product Create Error]', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
