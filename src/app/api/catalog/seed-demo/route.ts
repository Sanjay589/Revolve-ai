import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { AuditService, AuditActions } from '@/server/services/audit-service';

export async function POST(req: Request) {
  try {
    const session = await requireAuth(req);

    // Check if merchant already has products
    const existingCount = await prisma.product.count({
      where: { merchantId: session.merchantId },
    });

    if (existingCount > 0) {
      return NextResponse.json(
        { message: 'Catalog already contains products', count: existingCount },
        { status: 200 }
      );
    }

    // Provision demo starter products into the active merchant
    const result = await prisma.$transaction(async (tx) => {
      const p1 = await tx.product.create({
        data: {
          merchantId: session.merchantId,
          name: 'Velocity Pro Carbon Running Shoes',
          description: 'Ultra-lightweight marathon running shoes engineered with carbon fiber propulsion plate and responsive nitrogen-infused cushioning.',
          shortDescription: 'Carbon-plated performance marathon running shoes.',
          price: 449900,
          compareAtPrice: 599900,
          category: 'Footwear',
          sku: 'APX-RUN-01',
          inventory: 45,
          isActive: true,
          imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
          features: ['Carbon Fiber Plate', 'Nitrogen-Infused Foam', 'Breathable Engineered Mesh', 'Anti-Slip Traction Outsole'],
          tags: ['running', 'marathon', 'footwear', 'carbon-plate', 'sports'],
          aiMetadata: {
            targetDemographic: 'Marathon runners, athletes',
            popularPairingCategories: ['Accessories', 'Apparel'],
            priceSensitivity: 'Medium',
          },
        },
      });

      const p2 = await tx.product.create({
        data: {
          merchantId: session.merchantId,
          name: 'Anti-Blister Compression Performance Socks (3-Pack)',
          description: 'Ergonomic graduated compression athletic socks with moisture-wicking CoolMax yarn and seamless toe protection.',
          shortDescription: 'Graduated compression moisture-wicking running socks.',
          price: 79900,
          compareAtPrice: 119900,
          category: 'Accessories',
          sku: 'APX-SCK-02',
          inventory: 120,
          isActive: true,
          imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&auto=format&fit=crop&q=80',
          features: ['Graduated Compression', 'Seamless Toe', 'Moisture-Wicking CoolMax', 'Arch Support Band'],
          tags: ['socks', 'compression', 'accessories', 'running', 'comfort'],
          upsellProductIds: [p1.id],
          crossSellProductIds: [p1.id],
        },
      });

      const p3 = await tx.product.create({
        data: {
          merchantId: session.merchantId,
          name: 'Apex Pulse GPS Cardio Fitness Watch',
          description: 'Next-gen multisport GPS watch with real-time VO2 Max tracking, optical heart rate, solar charging, and 14-day battery life.',
          shortDescription: 'Multisport GPS smartwatch with advanced biometric tracking.',
          price: 899900,
          compareAtPrice: 1099900,
          category: 'Electronics',
          sku: 'APX-WTC-03',
          inventory: 30,
          isActive: true,
          imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
          features: ['Multi-Band GPS', 'VO2 Max Metric', 'Solar Sapphire Lens', '5 ATM Water Resistant', '14-Day Battery'],
          tags: ['smartwatch', 'gps', 'heart-rate', 'fitness', 'electronics'],
          crossSellProductIds: [p1.id, p2.id],
        },
      });

      const p4 = await tx.product.create({
        data: {
          merchantId: session.merchantId,
          name: 'Titan Pro Ultra-Slim Performance Laptop (16GB/1TB)',
          description: 'Aerospace-grade aluminum creator and developer laptop with 3.2K OLED 120Hz display and all-day battery efficiency.',
          shortDescription: '14-inch OLED powerhouse laptop for builders and creators.',
          price: 8499900,
          compareAtPrice: 9499900,
          category: 'Computers',
          sku: 'APX-LPT-04',
          inventory: 15,
          isActive: true,
          imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
          features: ['3.2K 120Hz OLED Display', '16-Core Processor', '16GB LPDDR5X RAM', '1TB NVMe Gen4 SSD', 'Magnesium Alloy Chassis'],
          tags: ['laptop', 'ultrabook', 'creator', 'developer', 'hardware'],
        },
      });

      const p5 = await tx.product.create({
        data: {
          merchantId: session.merchantId,
          name: 'Water-Resistant Magnetic Laptop Sleeve (14-inch)',
          description: 'Fleece-lined water-repellent Cordura protective sleeve with magnetic snap closure and dedicated charger pocket.',
          shortDescription: 'Cordura ballistic nylon magnetic laptop protection sleeve.',
          price: 189900,
          compareAtPrice: 249900,
          category: 'Accessories',
          sku: 'APX-SLV-05',
          inventory: 75,
          isActive: true,
          imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
          features: ['Cordura Ballistic Nylon', 'Plush Microfiber Interior', 'Magnetic Auto-Align Flap', 'Spill-Resistant'],
          tags: ['sleeve', 'case', 'laptop-accessory', 'waterproof', 'protective'],
          crossSellProductIds: [p4.id],
        },
      });

      const p6 = await tx.product.create({
        data: {
          merchantId: session.merchantId,
          name: 'ErgoFlow Precision Wireless Mouse',
          description: 'Dual-mode Bluetooth + 2.4GHz silent optical mouse with hyper-fast scroll wheel and thumb rest.',
          shortDescription: 'Ergonomic dual-mode silent productivity mouse.',
          price: 129900,
          compareAtPrice: 179900,
          category: 'Accessories',
          sku: 'APX-MOU-06',
          inventory: 90,
          isActive: true,
          imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
          features: ['4000 DPI Sensor', 'Whisper-Quiet Clicks', 'Multi-Device Flow Pairing', 'USB-C Fast Recharge'],
          tags: ['mouse', 'wireless', 'ergonomic', 'bluetooth', 'desk-setup'],
          crossSellProductIds: [p4.id],
        },
      });

      const p7 = await tx.product.create({
        data: {
          merchantId: session.merchantId,
          name: 'Voyager Modular Expandable Travel Backpack 35L',
          description: 'TSA-ready clamshell water-repellent travel pack with padded 16-inch laptop compartment and hidden anti-theft passport pocket.',
          shortDescription: 'All-weather 35L modular carry-on travel backpack.',
          price: 349900,
          compareAtPrice: 499900,
          category: 'Travel & Bags',
          sku: 'APX-BPK-07',
          inventory: 50,
          isActive: true,
          imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
          features: ['TSA Clamshell Opening', 'Hidden RFID Pocket', 'Padded Laptop Sleeve', 'Luggage Pass-Through Strap', 'YKK Aquaguard Zippers'],
          tags: ['backpack', 'travel', 'commute', 'waterproof', 'bags'],
        },
      });

      await tx.product.update({
        where: { id: p1.id },
        data: { upsellProductIds: [p3.id], crossSellProductIds: [p2.id] },
      });
      await tx.product.update({
        where: { id: p4.id },
        data: { crossSellProductIds: [p5.id, p6.id, p7.id] },
      });

      return 7;
    });

    await AuditService.create({
      merchantId: session.merchantId,
      actor: session.userId,
      action: AuditActions.PRODUCT_CREATED,
      entity: 'Product',
      entityId: session.merchantId,
      metadata: { source: 'demo_catalog_import', count: result },
    });

    return NextResponse.json({
      success: true,
      message: 'Demo catalog imported successfully',
      importedCount: result,
    });
  } catch (error) {
    console.error('[Seed Demo Catalog Error]', error);
    return NextResponse.json(
      { error: 'Failed to import demo catalog' },
      { status: 500 }
    );
  }
}
