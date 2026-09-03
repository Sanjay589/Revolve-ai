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
        data: { merchantId: merchant.id },
      });

      // Provision starter product catalog for the new merchant
      const p1 = await tx.product.create({
        data: {
          merchantId: merchant.id,
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
          merchantId: merchant.id,
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
          merchantId: merchant.id,
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
          merchantId: merchant.id,
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
          merchantId: merchant.id,
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
          merchantId: merchant.id,
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
          merchantId: merchant.id,
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

      // Link mutual relationships
      await tx.product.update({
        where: { id: p1.id },
        data: { upsellProductIds: [p3.id], crossSellProductIds: [p2.id] },
      });
      await tx.product.update({
        where: { id: p4.id },
        data: { crossSellProductIds: [p5.id, p6.id, p7.id] },
      });

      return { user, merchant };
    });

    // Set session cookie
    await setSessionCookie({
      userId: result.user.id,
      merchantId: result.merchant.id,
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
