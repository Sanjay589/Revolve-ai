import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public API — AI-readable product catalog
// No auth required — this is the externally consumable catalog

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const merchantId = url.searchParams.get('merchantId');

    if (!merchantId) {
      return NextResponse.json(
        { error: 'merchantId query parameter is required' },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: { merchantId, isActive: true },
      include: {
        variants: { where: { isActive: true } },
      },
      orderBy: { name: 'asc' },
    });

    // Format for AI consumption
    const catalog = {
      merchantId,
      lastUpdated: new Date().toISOString(),
      productCount: products.length,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        shortDescription: p.shortDescription,
        price: {
          amount: p.price,
          display: `₹${(p.price / 100).toLocaleString('en-IN')}`,
          currency: p.currency,
        },
        category: p.category,
        features: p.features,
        tags: p.tags,
        availability: {
          inStock: p.inventory > 0,
          inventory: p.inventory,
        },
        variants: p.variants.map((v) => ({
          id: v.id,
          name: v.name,
          price: {
            amount: v.price,
            display: `₹${(v.price / 100).toLocaleString('en-IN')}`,
          },
          inStock: v.inventory > 0,
          attributes: v.attributes,
        })),
        relationships: {
          upsellProducts: p.upsellProductIds,
          crossSellProducts: p.crossSellProductIds,
        },
        metadata: p.aiMetadata,
      })),
    };

    return NextResponse.json(catalog, {
      headers: {
        'Cache-Control': 'public, max-age=300', // 5 minute cache
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[AI Catalog Error]', error);
    return NextResponse.json({ error: 'Failed to fetch catalog' }, { status: 500 });
  }
}
