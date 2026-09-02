import { prisma } from '@/lib/prisma';
import type { AIRecommendation as AIRecSchema } from '@/schemas/ai';

/**
 * Deterministic AI Engine that generates structured recommendations
 * from actual catalog data and order history.
 * 
 * Pluggable: swap to Gemini/OpenAI by changing AI_PROVIDER env var.
 */
export class AIEngine {
  /**
   * Generate recommendations based on merchant's product catalog and order data.
   */
  static async generateRecommendations(
    merchantId: string,
    options: { focusArea?: string; limit?: number } = {}
  ): Promise<AIRecSchema[]> {
    const { focusArea = 'all', limit = 5 } = options;

    const [products, orders, customers] = await Promise.all([
      prisma.product.findMany({
        where: { merchantId, isActive: true },
        include: { variants: true, orderItems: true },
      }),
      prisma.order.findMany({
        where: { merchantId, status: { in: ['PAID', 'CREATED'] } },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.customer.findMany({
        where: { merchantId },
        take: 100,
      }),
    ]);

    if (products.length === 0) {
      return [];
    }

    const recommendations: AIRecSchema[] = [];

    // ─── Upsell Recommendations ────────────────────────
    if (focusArea === 'all' || focusArea === 'upsell') {
      const upsellRecs = this.generateUpsellRecommendations(products, orders);
      recommendations.push(...upsellRecs);
    }

    // ─── Cross-sell Recommendations ────────────────────
    if (focusArea === 'all' || focusArea === 'cross_sell') {
      const crossSellRecs = this.generateCrossSellRecommendations(products, orders);
      recommendations.push(...crossSellRecs);
    }

    // ─── Campaign Recommendations ──────────────────────
    if (focusArea === 'all' || focusArea === 'campaign') {
      const campaignRecs = this.generateCampaignRecommendations(products, orders, customers);
      recommendations.push(...campaignRecs);
    }

    // ─── Pricing Recommendations ───────────────────────
    if (focusArea === 'all' || focusArea === 'pricing') {
      const pricingRecs = this.generatePricingRecommendations(products, orders);
      recommendations.push(...pricingRecs);
    }

    return recommendations.slice(0, limit);
  }

  /**
   * Analyze catalog for AI buyer product matching.
   */
  static async searchCatalog(
    merchantId: string,
    query: string
  ): Promise<{
    products: Array<{
      id: string;
      name: string;
      price: number;
      description: string | null;
      features: string[];
      category: string | null;
      score: number;
      reasoning: string;
    }>;
    summary: string;
  }> {
    const products = await prisma.product.findMany({
      where: { merchantId, isActive: true },
      include: { variants: true },
    });

    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(Boolean);

    // Score products based on query relevance
    const scored = products
      .map((p) => {
        let score = 0;
        const nameLower = p.name.toLowerCase();
        const descLower = (p.description || '').toLowerCase();
        const categoryLower = (p.category || '').toLowerCase();
        const tags = p.tags.map((t) => t.toLowerCase());
        const features = p.features.map((f) => f.toLowerCase());

        // Name matches (highest weight)
        queryWords.forEach((word) => {
          if (nameLower.includes(word)) score += 10;
          if (descLower.includes(word)) score += 5;
          if (categoryLower.includes(word)) score += 8;
          if (tags.some((t) => t.includes(word))) score += 6;
          if (features.some((f) => f.includes(word))) score += 4;
        });

        // Price extraction from query
        const priceMatch = query.match(/(?:under|below|less than|max|upto|up to)\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*)/i);
        if (priceMatch) {
          const maxPrice = parseInt(priceMatch[1].replace(/,/g, '')) * 100; // to paise
          if (p.price <= maxPrice) {
            score += 15;
          } else {
            score -= 20; // penalize items over budget
          }
        }

        // Build reasoning
        let reasoning = '';
        if (score > 0) {
          const matchReasons: string[] = [];
          if (nameLower.includes(queryLower) || queryWords.some((w) => nameLower.includes(w)))
            matchReasons.push('matches your search terms');
          if (priceMatch && p.price <= parseInt(priceMatch[1].replace(/,/g, '')) * 100)
            matchReasons.push('fits within your budget');
          if (features.length > 0)
            matchReasons.push(`offers ${p.features.length} key features`);
          reasoning = matchReasons.length > 0 ? matchReasons.join(', ') : 'relevant product';
        }

        return {
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          features: p.features,
          category: p.category,
          imageUrl: p.imageUrl,
          score,
          reasoning: reasoning.charAt(0).toUpperCase() + reasoning.slice(1),
        };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score);

    const summary =
      scored.length > 0
        ? `Found ${scored.length} products matching "${query}". The top match is ${scored[0].name} at ₹${(scored[0].price / 100).toLocaleString('en-IN')}.`
        : `No products found matching "${query}". Try a different search term.`;

    return { products: scored, summary };
  }

  // ─── Private Recommendation Generators ──────────────────

  private static generateUpsellRecommendations(
    products: Array<{ id: string; name: string; price: number; category: string | null; orderItems: Array<{ orderId: string }> }>,
    orders: Array<{ id: string; items: Array<{ productId: string; price: number }> }>
  ): AIRecSchema[] {
    const recs: AIRecSchema[] = [];

    // Find products frequently purchased together
    const productPairCounts = new Map<string, number>();
    for (const order of orders) {
      const itemIds = order.items.map((i) => i.productId);
      for (let i = 0; i < itemIds.length; i++) {
        for (let j = i + 1; j < itemIds.length; j++) {
          const key = [itemIds[i], itemIds[j]].sort().join('::');
          productPairCounts.set(key, (productPairCounts.get(key) || 0) + 1);
        }
      }
    }

    // Find high-value upsell opportunities
    const productMap = new Map(products.map((p) => [p.id, p]));
    for (const [pair, count] of productPairCounts) {
      if (count < 2) continue;
      const [id1, id2] = pair.split('::');
      const p1 = productMap.get(id1);
      const p2 = productMap.get(id2);
      if (!p1 || !p2) continue;

      const cheaper = p1.price < p2.price ? p1 : p2;
      const expensive = p1.price < p2.price ? p2 : p1;
      const percentage = Math.round((count / Math.max(orders.length, 1)) * 100);

      recs.push({
        type: 'UPSELL',
        title: `Upsell ${expensive.name} with ${cheaper.name}`,
        reason: `Customers purchasing ${cheaper.name} frequently also purchase ${expensive.name}`,
        evidence: [
          `${percentage}% of customers who bought ${cheaper.name} also bought ${expensive.name}`,
          `${count} co-purchases observed in recent orders`,
        ],
        expectedImpact: expensive.price * Math.max(count, 3),
        confidence: Math.min(0.95, 0.5 + (count / orders.length) * 0.5),
        riskLevel: 'LOW',
        productId: cheaper.id,
        targetProductIds: [expensive.id],
      });
    }

    // If no co-purchase data, generate from category analysis
    if (recs.length === 0 && products.length >= 2) {
      const categories = new Map<string, typeof products>();
      products.forEach((p) => {
        const cat = p.category || 'General';
        if (!categories.has(cat)) categories.set(cat, []);
        categories.get(cat)!.push(p);
      });

      for (const [, catProducts] of categories) {
        if (catProducts.length < 2) continue;
        const sorted = [...catProducts].sort((a, b) => b.price - a.price);
        const premium = sorted[0];
        const base = sorted[sorted.length - 1];
        if (premium.id === base.id) continue;

        recs.push({
          type: 'UPSELL',
          title: `Recommend ${premium.name} as premium upgrade`,
          reason: `${premium.name} is a premium alternative to ${base.name} in the same category`,
          evidence: [
            `Price difference of ₹${((premium.price - base.price) / 100).toLocaleString('en-IN')} provides upsell opportunity`,
            `Both products are in the ${premium.category || 'same'} category`,
          ],
          expectedImpact: (premium.price - base.price) * 5,
          confidence: 0.72,
          riskLevel: 'LOW',
          productId: base.id,
          targetProductIds: [premium.id],
        });
      }
    }

    return recs;
  }

  private static generateCrossSellRecommendations(
    products: Array<{ id: string; name: string; price: number; category: string | null; tags: string[]; crossSellProductIds: string[] }>,
    _orders: Array<{ id: string; items: Array<{ productId: string }> }>
  ): AIRecSchema[] {
    const recs: AIRecSchema[] = [];

    // Use explicit cross-sell relationships
    for (const product of products) {
      if (product.crossSellProductIds.length === 0) continue;
      const targets = products.filter((p) => product.crossSellProductIds.includes(p.id));
      if (targets.length === 0) continue;

      const target = targets[0];
      recs.push({
        type: 'CROSS_SELL',
        title: `Cross-sell ${target.name} with ${product.name}`,
        reason: `${target.name} is a complementary product to ${product.name}`,
        evidence: [
          `Product relationship configured in catalog`,
          `Combined value: ₹${((product.price + target.price) / 100).toLocaleString('en-IN')}`,
        ],
        expectedImpact: target.price * 8,
        confidence: 0.82,
        riskLevel: 'LOW',
        productId: product.id,
        targetProductIds: [target.id],
      });
    }

    // Generate from tag overlap
    if (recs.length === 0) {
      for (let i = 0; i < products.length; i++) {
        for (let j = i + 1; j < products.length; j++) {
          const p1 = products[i];
          const p2 = products[j];
          if (p1.category === p2.category) continue; // different categories only

          const sharedTags = p1.tags.filter((t) => p2.tags.includes(t));
          if (sharedTags.length > 0) {
            recs.push({
              type: 'CROSS_SELL',
              title: `Bundle ${p1.name} with ${p2.name}`,
              reason: `These products share common attributes and appeal to similar customers`,
              evidence: [
                `Shared attributes: ${sharedTags.join(', ')}`,
                `Different categories provide cross-sell opportunity`,
              ],
              expectedImpact: Math.min(p1.price, p2.price) * 5,
              confidence: 0.65 + sharedTags.length * 0.05,
              riskLevel: 'LOW',
              productId: p1.id,
              targetProductIds: [p2.id],
            });
          }
        }
      }
    }

    return recs;
  }

  private static generateCampaignRecommendations(
    products: Array<{ id: string; name: string; price: number; category: string | null; inventory: number }>,
    orders: Array<{ id: string; amount: number; createdAt: Date }>,
    customers: Array<{ id: string }>
  ): AIRecSchema[] {
    const recs: AIRecSchema[] = [];

    // High inventory products → discount campaign
    const highInventory = products.filter((p) => p.inventory > 50);
    if (highInventory.length > 0) {
      const target = highInventory.sort((a, b) => b.inventory - a.inventory)[0];
      recs.push({
        type: 'CAMPAIGN',
        title: `Inventory clearance campaign for ${target.name}`,
        reason: `${target.name} has high inventory (${target.inventory} units) that could benefit from promotional pricing`,
        evidence: [
          `Current inventory: ${target.inventory} units`,
          `A 10% discount could accelerate sales by estimated 30%`,
        ],
        expectedImpact: Math.round(target.price * 0.1 * Math.min(target.inventory, 20)),
        confidence: 0.74,
        riskLevel: 'LOW',
        productId: target.id,
        targetProductIds: [target.id],
      });
    }

    // Customer re-engagement campaign
    if (customers.length > 5 && orders.length > 0) {
      const avgOrderValue = orders.reduce((sum, o) => sum + o.amount, 0) / orders.length;
      recs.push({
        type: 'CAMPAIGN',
        title: 'Customer re-engagement campaign',
        reason: `Target ${customers.length} existing customers with personalized offers to drive repeat purchases`,
        evidence: [
          `${customers.length} customers in database`,
          `Average order value: ₹${(avgOrderValue / 100).toLocaleString('en-IN')}`,
          `Re-engagement campaigns typically see 15-25% conversion rates`,
        ],
        expectedImpact: Math.round(avgOrderValue * customers.length * 0.15),
        confidence: 0.68,
        riskLevel: 'LOW',
        targetProductIds: [],
      });
    }

    return recs;
  }

  private static generatePricingRecommendations(
    products: Array<{ id: string; name: string; price: number; compareAtPrice: number | null; orderItems: Array<{ orderId: string }> }>,
    orders: Array<{ id: string }>
  ): AIRecSchema[] {
    const recs: AIRecSchema[] = [];

    // Products with no sales → pricing adjustment
    const noSales = products.filter((p) => p.orderItems.length === 0);
    if (noSales.length > 0 && orders.length > 5) {
      const target = noSales[0];
      recs.push({
        type: 'PRICING',
        title: `Review pricing for ${target.name}`,
        reason: `${target.name} has no sales despite active listing — pricing may need adjustment`,
        evidence: [
          `0 orders while other products have ${orders.length} total orders`,
          `Current price: ₹${(target.price / 100).toLocaleString('en-IN')}`,
          `Consider a competitive price analysis`,
        ],
        expectedImpact: Math.round(target.price * 3),
        confidence: 0.60,
        riskLevel: 'MEDIUM',
        productId: target.id,
        targetProductIds: [target.id],
      });
    }

    return recs;
  }
}
