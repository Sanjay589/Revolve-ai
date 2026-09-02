import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Revolve AI...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.aIBuyerRequest.deleteMany();
  await prisma.aIBuyerSession.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.webhookEvent.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.aIAgentAction.deleteMany();
  await prisma.aIRecommendation.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.agentPolicy.deleteMany();
  await prisma.user.deleteMany();
  await prisma.merchant.deleteMany();

  // 1. Create Default Demo Merchant
  const merchant = await prisma.merchant.create({
    data: {
      name: 'Apex Athletics & Gear',
      businessName: 'Apex Athletics India Pvt Ltd',
      email: 'merchant@apexgear.io',
      website: 'https://apexgear.io',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      isActive: true,
    },
  });

  console.log(`✅ Merchant created: ${merchant.name} (${merchant.id})`);

  // 2. Create Merchant Admin User
  const passwordHash = await bcrypt.hash('DemoMerchant@2026', 12);
  const user = await prisma.user.create({
    data: {
      email: 'admin@apexgear.io',
      name: 'Siddharth Roy',
      passwordHash,
      role: 'merchant_admin',
      merchantId: merchant.id,
    },
  });

  console.log(`✅ User created: ${user.email} (Password: DemoMerchant@2026)`);

  // 3. Create Agent Policy (Safety Guardrails)
  const policy = await prisma.agentPolicy.create({
    data: {
      merchantId: merchant.id,
      maximumTransactionAmount: 1000000, // ₹10,000 in paise
      dailySpendLimit: 5000000,          // ₹50,000 in paise
      maximumCampaignBudget: 2000000,     // ₹20,000 in paise
      maximumDiscountPercentage: 25.0,
      requireMerchantApproval: true,
      allowedActions: ['UPSELL', 'CROSS_SELL', 'CAMPAIGN', 'BUNDLE', 'DISCOUNT', 'AI_PURCHASE'],
      blockedActions: [],
      isActive: true,
    },
  });

  console.log('✅ Agent Policy created with strict financial boundaries');

  // 4. Create Realistic Products with rich AI metadata
  const p1 = await prisma.product.create({
    data: {
      merchantId: merchant.id,
      name: 'Velocity Pro Carbon Running Shoes',
      description: 'Ultra-lightweight marathon running shoes engineered with carbon fiber propulsion plate and responsive nitrogen-infused cushioning.',
      shortDescription: 'Carbon-plated performance marathon running shoes.',
      price: 449900, // ₹4,499
      compareAtPrice: 599900, // ₹5,999
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
        marginTier: 'High (48%)',
      },
      variants: {
        create: [
          { name: 'UK 8 / Stealth Black', sku: 'APX-RUN-01-8B', price: 449900, inventory: 15, attributes: { size: 'UK 8', color: 'Black' } },
          { name: 'UK 9 / Electric Indigo', sku: 'APX-RUN-01-9I', price: 449900, inventory: 20, attributes: { size: 'UK 9', color: 'Indigo' } },
          { name: 'UK 10 / Neon Lime', sku: 'APX-RUN-01-10L', price: 449900, inventory: 10, attributes: { size: 'UK 10', color: 'Lime' } },
        ],
      },
    },
  });

  const p2 = await prisma.product.create({
    data: {
      merchantId: merchant.id,
      name: 'Anti-Blister Compression Performance Socks (3-Pack)',
      description: 'Ergonomic graduated compression athletic socks with moisture-wicking CoolMax yarn and seamless toe protection.',
      shortDescription: 'Graduated compression moisture-wicking running socks.',
      price: 79900, // ₹799
      compareAtPrice: 119900, // ₹1,199
      category: 'Accessories',
      sku: 'APX-SCK-02',
      inventory: 120,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&auto=format&fit=crop&q=80',
      features: ['Graduated Compression', 'Seamless Toe', 'Moisture-Wicking CoolMax', 'Arch Support Band'],
      tags: ['socks', 'compression', 'accessories', 'running', 'comfort'],
      aiMetadata: {
        isFrequentlyBoughtTogether: true,
        upsellTo: [p1.id],
        crossSellTo: [p1.id],
        retentionRate: 'High repeat purchase rate (42%)',
      },
      upsellProductIds: [p1.id],
      crossSellProductIds: [p1.id],
      variants: {
        create: [
          { name: 'Medium (UK 7-9) / Charcoal', sku: 'APX-SCK-02-M', price: 79900, inventory: 60, attributes: { size: 'Medium' } },
          { name: 'Large (UK 10-12) / Slate Grey', sku: 'APX-SCK-02-L', price: 79900, inventory: 60, attributes: { size: 'Large' } },
        ],
      },
    },
  });

  const p3 = await prisma.product.create({
    data: {
      merchantId: merchant.id,
      name: 'Apex Pulse GPS Cardio Fitness Watch',
      description: 'Next-gen multisport GPS watch with real-time VO2 Max tracking, optical heart rate, solar charging, and 14-day battery life.',
      shortDescription: 'Multisport GPS smartwatch with advanced biometric tracking.',
      price: 899900, // ₹8,999
      compareAtPrice: 1099900, // ₹10,999
      category: 'Electronics',
      sku: 'APX-WTC-03',
      inventory: 30,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
      features: ['Multi-Band GPS', 'VO2 Max Metric', 'Solar Sapphire Lens', '5 ATM Water Resistant', '14-Day Battery'],
      tags: ['smartwatch', 'gps', 'heart-rate', 'fitness', 'electronics'],
      aiMetadata: {
        targetDemographic: 'Triathletes, tech enthusiasts, marathoners',
        heroProduct: true,
        highGrossValue: true,
      },
      crossSellProductIds: [p1.id, p2.id],
    },
  });

  const p4 = await prisma.product.create({
    data: {
      merchantId: merchant.id,
      name: 'Titan Pro Ultra-Slim Performance Laptop (16GB/1TB)',
      description: 'Aerospace-grade aluminum creator and developer laptop with 3.2K OLED 120Hz display and all-day battery efficiency.',
      shortDescription: '14-inch OLED powerhouse laptop for builders and creators.',
      price: 8499900, // ₹84,999
      compareAtPrice: 9499900,
      category: 'Computers',
      sku: 'APX-LPT-04',
      inventory: 15,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
      features: ['3.2K 120Hz OLED Display', '16-Core Processor', '16GB LPDDR5X RAM', '1TB NVMe Gen4 SSD', 'Magnesium Alloy Chassis'],
      tags: ['laptop', 'ultrabook', 'creator', 'developer', 'hardware'],
      aiMetadata: {
        flagshipTier: true,
        companionAccessoriesRequired: true,
      },
    },
  });

  const p5 = await prisma.product.create({
    data: {
      merchantId: merchant.id,
      name: 'Water-Resistant Magnetic Laptop Sleeve (14-inch)',
      description: 'Fleece-lined water-repellent Cordura protective sleeve with magnetic snap closure and dedicated charger pocket.',
      shortDescription: 'Cordura ballistic nylon magnetic laptop protection sleeve.',
      price: 189900, // ₹1,899
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

  const p6 = await prisma.product.create({
    data: {
      merchantId: merchant.id,
      name: 'ErgoFlow Precision Wireless Mouse',
      description: 'Dual-mode Bluetooth + 2.4GHz silent optical mouse with hyper-fast scroll wheel and thumb rest.',
      shortDescription: 'Ergonomic dual-mode silent productivity mouse.',
      price: 129900, // ₹1,299
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

  const p7 = await prisma.product.create({
    data: {
      merchantId: merchant.id,
      name: 'Voyager Modular Expandable Travel Backpack 35L',
      description: 'TSA-ready clamshell water-repellent travel pack with padded 16-inch laptop compartment and hidden anti-theft passport pocket.',
      shortDescription: 'All-weather 35L modular carry-on travel backpack.',
      price: 349900, // ₹3,499
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

  // Link mutual cross-sells
  await prisma.product.update({
    where: { id: p1.id },
    data: {
      upsellProductIds: [p3.id],
      crossSellProductIds: [p2.id],
    },
  });

  await prisma.product.update({
    where: { id: p4.id },
    data: {
      crossSellProductIds: [p5.id, p6.id, p7.id],
    },
  });

  console.log('✅ 7 Realistic products created with variants and cross-sell relationships');

  // 5. Create Customers
  const c1 = await prisma.customer.create({
    data: {
      merchantId: merchant.id,
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phone: '+919876543210',
      metadata: { city: 'Bengaluru', segment: 'VIP Athlete', lifetimePurchases: 4 },
    },
  });

  const c2 = await prisma.customer.create({
    data: {
      merchantId: merchant.id,
      name: 'Pooja Iyer',
      email: 'pooja.iyer@example.com',
      phone: '+919876501234',
      metadata: { city: 'Mumbai', segment: 'Tech Professional', lifetimePurchases: 2 },
    },
  });

  const c3 = await prisma.customer.create({
    data: {
      merchantId: merchant.id,
      name: 'Vikram Mehta',
      email: 'vikram.mehta@example.com',
      phone: '+919812345678',
      metadata: { city: 'Delhi NCR', segment: 'Active Runner', lifetimePurchases: 3 },
    },
  });

  const c4 = await prisma.customer.create({
    data: {
      merchantId: merchant.id,
      name: 'Ananya Deshmukh',
      email: 'ananya.d@example.com',
      phone: '+919765432109',
      metadata: { city: 'Pune', segment: 'Fitness Enthusiast', lifetimePurchases: 1 },
    },
  });

  console.log('✅ Sample customer cohort created');

  // 6. Create Historical Orders & Payments (Real Database Financial State)
  const o1 = await prisma.order.create({
    data: {
      merchantId: merchant.id,
      customerId: c1.id,
      razorpayOrderId: 'order_test_92A8471b01',
      status: 'PAID',
      amount: 529800, // ₹5,298
      currency: 'INR',
      receipt: 'rcpt_1725260100',
      customerEmail: c1.email,
      customerName: c1.name,
      customerPhone: c1.phone,
      idempotencyKey: 'idemp_order_seed_01',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      items: {
        create: [
          { productId: p1.id, quantity: 1, price: 449900, name: p1.name },
          { productId: p2.id, quantity: 1, price: 79900, name: p2.name },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      merchantId: merchant.id,
      orderId: o1.id,
      razorpayPaymentId: 'pay_test_92B8827c01',
      razorpayOrderId: 'order_test_92A8471b01',
      razorpaySignature: 'sig_test_verified_92A8471b01',
      status: 'CAPTURED',
      amount: 529800,
      currency: 'INR',
      method: 'upi',
      verifiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      webhookConfirmedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2000),
    },
  });

  const o2 = await prisma.order.create({
    data: {
      merchantId: merchant.id,
      customerId: c2.id,
      razorpayOrderId: 'order_test_88K2934a02',
      status: 'PAID',
      amount: 899900, // ₹8,999
      currency: 'INR',
      receipt: 'rcpt_1725260200',
      customerEmail: c2.email,
      customerName: c2.name,
      customerPhone: c2.phone,
      idempotencyKey: 'idemp_order_seed_02',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          { productId: p3.id, quantity: 1, price: 899900, name: p3.name },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      merchantId: merchant.id,
      orderId: o2.id,
      razorpayPaymentId: 'pay_test_88L9911d02',
      razorpayOrderId: 'order_test_88K2934a02',
      razorpaySignature: 'sig_test_verified_88K2934a02',
      status: 'CAPTURED',
      amount: 899900,
      currency: 'INR',
      method: 'card',
      verifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      webhookConfirmedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1500),
    },
  });

  const o3 = await prisma.order.create({
    data: {
      merchantId: merchant.id,
      customerId: c3.id,
      razorpayOrderId: 'order_test_77M4412f03',
      status: 'PAID',
      amount: 449900,
      currency: 'INR',
      receipt: 'rcpt_1725260300',
      customerEmail: c3.email,
      customerName: c3.name,
      customerPhone: c3.phone,
      idempotencyKey: 'idemp_order_seed_03',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          { productId: p1.id, quantity: 1, price: 449900, name: p1.name },
        ],
      },
    },
  });

  await prisma.payment.create({
    data: {
      merchantId: merchant.id,
      orderId: o3.id,
      razorpayPaymentId: 'pay_test_77N2200e03',
      razorpayOrderId: 'order_test_77M4412f03',
      razorpaySignature: 'sig_test_verified_77M4412f03',
      status: 'CAPTURED',
      amount: 449900,
      currency: 'INR',
      method: 'netbanking',
      verifiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      webhookConfirmedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3000),
    },
  });

  console.log('✅ Real historical orders and captured payments seeded');

  // 7. Create AI Recommendations
  const rec1 = await prisma.aIRecommendation.create({
    data: {
      merchantId: merchant.id,
      type: 'CROSS_SELL',
      title: 'Recommend Performance Socks with Velocity Running Shoes',
      reason: '42% of customers who purchased Running Shoes also purchased Performance Socks within 14 days.',
      evidence: [
        '42% co-purchase rate observed in recent athlete customer cohort',
        'Average cart value increases by ₹799 (+17.7%)',
        'Customer satisfaction rating 4.8/5 on combined bundle',
      ],
      expectedImpact: 1245000, // ₹12,450/month in paise
      confidence: 0.87,
      riskLevel: 'LOW',
      productId: p1.id,
      targetProductIds: [p2.id],
      isProcessed: true,
    },
  });

  const rec2 = await prisma.aIRecommendation.create({
    data: {
      merchantId: merchant.id,
      type: 'UPSELL',
      title: 'Upgrade Shoe Buyers to Apex Pulse GPS Fitness Watch',
      reason: 'Running shoe buyers show high affinity for biometric tracking equipment.',
      evidence: [
        'Marathon season active in major metro regions',
        'Price elasticity analysis indicates positive conversion at ₹8,999',
        'Upsell conversion historically averages 18% during checkout',
      ],
      expectedImpact: 2699700, // ₹26,997/month in paise
      confidence: 0.81,
      riskLevel: 'LOW',
      productId: p1.id,
      targetProductIds: [p3.id],
      isProcessed: false,
    },
  });

  const rec3 = await prisma.aIRecommendation.create({
    data: {
      merchantId: merchant.id,
      type: 'CAMPAIGN',
      title: 'Launch "Marathon Ready" Bundle Campaign',
      reason: 'Bundle Velocity Shoes + Performance Socks with a 10% bundle incentive to clear Q3 inventory.',
      evidence: [
        'Current inventory: 120 socks and 45 shoes',
        '10% promotional bundle increases conversion velocity by 34%',
        'Maintains high merchant gross margin at 41%',
      ],
      expectedImpact: 4500000, // ₹45,000 in paise
      confidence: 0.89,
      riskLevel: 'LOW',
      productId: p1.id,
      targetProductIds: [p1.id, p2.id],
      isProcessed: false,
    },
  });

  console.log('✅ Structured AI recommendations seeded');

  // 8. Create AI Agent Action & Pending Approval
  const action1 = await prisma.aIAgentAction.create({
    data: {
      merchantId: merchant.id,
      recommendationId: rec1.id,
      type: 'CROSS_SELL',
      status: 'AWAITING_APPROVAL',
      title: 'Activate Auto-Cross-Sell: Socks on Shoe Checkout',
      description: 'Automatically recommend Anti-Blister Compression Socks when customer adds Velocity Running Shoes to cart.',
      amount: 79900,
      currency: 'INR',
      riskLevel: 'LOW',
      policyResult: {
        passed: true,
        reasons: ['Amount ₹799 is well within limit ₹10,000', 'Action CROSS_SELL is permitted'],
      },
      idempotencyKey: 'idemp_action_seed_01',
    },
  });

  const approvalExpiresAt = new Date();
  approvalExpiresAt.setHours(approvalExpiresAt.getHours() + 24);

  await prisma.approval.create({
    data: {
      merchantId: merchant.id,
      actionId: action1.id,
      status: 'PENDING',
      expiresAt: approvalExpiresAt,
    },
  });

  console.log('✅ Agent action & pending approval seeded');

  // 9. Create Active Campaign
  await prisma.campaign.create({
    data: {
      merchantId: merchant.id,
      name: 'Autumn Velocity Runners Festival',
      description: 'Exclusive 10% discount on Velocity Pro shoes for registered community athletes.',
      targetAudience: 'Marathon and 10k runners across India',
      discountPercent: 10.0,
      budget: 1500000, // ₹15,000
      spent: 450000,   // ₹4,500
      status: 'ACTIVE',
      isAiGenerated: true,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  // 10. Create Immutable Audit Events
  await prisma.auditEvent.createMany({
    data: [
      {
        merchantId: merchant.id,
        actor: 'ai_agent',
        action: 'AI_RECOMMENDATION_CREATED',
        entity: 'AIRecommendation',
        entityId: rec1.id,
        reason: 'Catalog pattern analysis detected strong co-purchase relationship',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        merchantId: merchant.id,
        actor: 'system',
        action: 'POLICY_CHECK_PASSED',
        entity: 'AIAgentAction',
        entityId: action1.id,
        reason: 'Action verified against Merchant Safety Policy v1',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        merchantId: merchant.id,
        actor: 'system',
        action: 'APPROVAL_REQUESTED',
        entity: 'Approval',
        entityId: action1.id,
        reason: 'Merchant policy mandates approval for new automated checkout workflows',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000 + 5000),
      },
      {
        merchantId: merchant.id,
        actor: user.id,
        action: 'USER_LOGGED_IN',
        entity: 'User',
        entityId: user.id,
        reason: 'Merchant authenticated via secure session',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
  });

  // 11. Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        merchantId: merchant.id,
        type: 'APPROVAL_REQUIRED',
        title: 'Action Requires Approval',
        message: 'AI agent proposed: Activate Auto-Cross-Sell: Socks on Shoe Checkout',
        entityId: action1.id,
        entityType: 'AIAgentAction',
        isRead: false,
      },
      {
        merchantId: merchant.id,
        type: 'OPPORTUNITY',
        title: 'New Revenue Opportunity',
        message: 'AI detected ₹26,997/mo upsell opportunity for Apex Pulse GPS Watch',
        entityId: rec2.id,
        entityType: 'AIRecommendation',
        isRead: false,
      },
    ],
  });

  console.log('✅ Seed completed successfully! 🎉');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
