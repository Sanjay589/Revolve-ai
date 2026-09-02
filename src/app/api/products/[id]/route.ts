import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateProductSchema } from '@/schemas/product';
import { AuditService, AuditActions } from '@/server/services/audit-service';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(req);
    const { id } = await params;
    const body = await req.json();
    const validated = updateProductSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verify merchant ownership
    const existing = await prisma.product.findFirst({
      where: { id, merchantId: session.merchantId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updateData: any = { ...validated.data };
    if (validated.data.aiMetadata !== undefined) {
      updateData.aiMetadata = validated.data.aiMetadata;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { variants: true },
    });

    await AuditService.create({
      merchantId: session.merchantId,
      actor: session.userId,
      action: AuditActions.PRODUCT_UPDATED,
      entity: 'Product',
      entityId: product.id,
      reason: `Updated product: ${product.name}`,
    });

    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(req);
    const { id } = await params;

    const existing = await prisma.product.findFirst({
      where: { id, merchantId: session.merchantId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    await AuditService.create({
      merchantId: session.merchantId,
      actor: session.userId,
      action: AuditActions.PRODUCT_DELETED,
      entity: 'Product',
      entityId: id,
      reason: `Deleted product: ${existing.name}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
