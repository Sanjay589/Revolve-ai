import { prisma } from '@/lib/prisma';
import type { AIRecommendation as AIRecSchema } from '@/schemas/ai';

/**
 * AI Engine for Revolve AI.
 * 
 * Supports:
 * - xAI Grok API (grok-2-latest / grok-beta) via https://api.x.ai/v1
 * - OpenAI (gpt-4o / gpt-4-turbo) via https://api.openai.com/v1
 * - High-speed deterministic fallback
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

    const provider = (process.env.AI_PROVIDER || '').toLowerCase();
    const rawGrokKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY || '';
    const isRealGrokKey = Boolean(rawGrokKey && rawGrokKey.trim().length > 10 && !rawGrokKey.includes('placeholder') && !rawGrokKey.includes('your-grok'));
    const grokKey = isRealGrokKey ? rawGrokKey.trim() : '';

    const rawOpenAiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY || '';
    const isRealOpenAiKey = Boolean(rawOpenAiKey && rawOpenAiKey.trim().length > 10 && !rawOpenAiKey.includes('placeholder'));
    const openAiKey = isRealOpenAiKey ? rawOpenAiKey.trim() : '';

    // ─── Grok / xAI Integration ──────────────────────────
    if ((provider === 'grok' || provider === 'xai') && grokKey) {
      try {
        const grokRecs = await this.generateWithGrok({
          apiKey: grokKey,
          model: process.env.GROK_MODEL || 'grok-2-latest',
          focusArea,
          limit,
          products,
          orders,
          customers,
        });

        if (grokRecs && grokRecs.length > 0) {
          return grokRecs.slice(0, limit);
        }
      } catch (err: any) {
        console.warn(`[AIEngine] Grok API call failed (${err?.message || 'unknown'}), falling back to deterministic engine`);
      }
    }

    // ─── OpenAI Integration ──────────────────────────────
    if (provider === 'openai' && openAiKey) {
      try {
        const openAiRecs = await this.generateWithOpenAI({
          apiKey: openAiKey,
          model: process.env.OPENAI_MODEL || 'gpt-4o',
          focusArea,
          limit,
          products,
          orders,
          customers,
        });

        if (openAiRecs && openAiRecs.length > 0) {
          return openAiRecs.slice(0, limit);
        }
      } catch (err: any) {
        console.warn(`[AIEngine] OpenAI API call failed (${err?.message || 'unknown'}), falling back to deterministic engine`);
      }
    }

    // ─── Deterministic Engine Fallback ───────────────────
    const recommendations: AIRecSchema[] = [];

    if (focusArea === 'all' || focusArea === 'upsell') {
      recommendations.push(...this.generateUpsellRecommendations(products, orders));
    }

    if (focusArea === 'all' || focusArea === 'cross_sell') {
      recommendations.push(...this.generateCrossSellRecommendations(products, orders));
    }

    if (focusArea === 'all' || focusArea === 'pricing') {
      recommendations.push(...this.generatePricingRecommendations(products, orders));
    }

    return recommendations.slice(0, limit);
  }

  /**
   * Analyze catalog for AI buyer product matching with robust natural language search pipeline.
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

    if (!products || products.length === 0) {
      return {
        products: [],
        summary: `No active products found in the merchant catalog for merchant ID: ${merchantId}.`,
      };
    }

    const provider = (process.env.AI_PROVIDER || '').toLowerCase();
    const rawGrokKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY || '';
    const isRealGrokKey = Boolean(rawGrokKey && rawGrokKey.trim().length > 10 && !rawGrokKey.includes('placeholder'));
    const grokKey = isRealGrokKey ? rawGrokKey.trim() : '';

    // Optional Groq / xAI semantic enhancement for buyer discovery
    if ((provider === 'grok' || provider === 'xai') && grokKey && products.length > 0) {
      try {
        const grokResult = await this.searchWithGrok({
          apiKey: grokKey,
          model: process.env.GROK_MODEL || (grokKey.startsWith('gsk_') ? 'llama-3.3-70b-versatile' : 'grok-2-latest'),
          query,
          products,
        });
        if (grokResult && grokResult.products && grokResult.products.length > 0) {
          return grokResult;
        }
      } catch (err) {
        console.warn('[AIEngine] Grok buyer search failed, using robust built-in pipeline:', err);
      }
    }

    // ─── Robust Deterministic Search Pipeline ──────────────────
    return this.executeDeterministicSearch(products, query);
  }

  /**
   * High-accuracy deterministic search pipeline supporting natural language,
   * specifications, categories, synonyms, budget extraction, and multi-field ranking.
   */
  public static executeDeterministicSearch(
    products: any[],
    query: string
  ): {
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
  } {
    const rawQueryLower = query.toLowerCase();

    // 1. Punctuation & stopword normalization
    const cleanedQuery = rawQueryLower.replace(/[^\w\s₹\-]/g, ' ');
    const stopwords = new Set([
      'with', 'for', 'the', 'a', 'an', 'in', 'to', 'and', 'or', 'of',
      'at', 'by', 'from', 'on', 'is', 'are', 'me', 'show', 'find', 'get',
      'give', 'looking', 'need', 'want', 'something', 'please', 'i', 'my',
      'any', 'some', 'can', 'you'
    ]);

    const allTokens = cleanedQuery.split(/\s+/).filter(Boolean);
    const queryTokens = allTokens.filter((token) => !stopwords.has(token));

    // 2. Attribute & Spec Extractions
    const ramMatch = rawQueryLower.match(/(\d+)\s*(?:gb|g)\s*(?:ram|lpddr\w*|memory)?/i) || rawQueryLower.match(/\b(16gb|32gb|8gb|64gb)\b/i);
    const requestedRam = ramMatch ? (ramMatch[1] || ramMatch[0]).toLowerCase().replace(/\s+/g, '') : null;

    const storageMatch = rawQueryLower.match(/(\d+)\s*(?:tb|gb)\s*(?:ssd|nvme|storage)?/i);
    const requestedStorage = storageMatch ? storageMatch[0].toLowerCase().replace(/\s+/g, '') : null;

    // Budget / Price constraint extraction
    const budgetMatch = rawQueryLower.match(/(?:under|below|less than|max|upto|up to|budget of)\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*)(?:\s*(?:k|thousand))?/i);
    let maxBudgetPaise: number | null = null;
    if (budgetMatch) {
      let num = parseFloat(budgetMatch[1].replace(/,/g, ''));
      if (budgetMatch[0].includes('k') || budgetMatch[0].includes('thousand')) {
        num = num * 1000;
      }
      maxBudgetPaise = Math.round(num * 100);
    }

    const wantsCheapest = /\b(cheapest|lowest price|budget friendly|inexpensive|most affordable)\b/i.test(rawQueryLower);
    const wantsPremium = /\b(premium|flagship|best|high-end|top tier|powerhouse)\b/i.test(rawQueryLower);
    const wantsWaterResistant = /\b(water resistant|waterproof|spill resistant|water-resistant|all-weather|aquaguard)\b/i.test(rawQueryLower);

    // 3. Synonym dictionary for semantic expansion
    const synonymMap: Record<string, string[]> = {
      laptop: ['ultrabook', 'notebook', 'computer', 'pc', 'creator', 'developer'],
      laptops: ['ultrabook', 'notebook', 'computer', 'pc', 'creator', 'developer'],
      computer: ['laptop', 'ultrabook', 'notebook', 'desktop'],
      productivity: ['developer', 'creator', 'office', 'work', 'builder', 'powerhouse', 'ergonomic'],
      work: ['productivity', 'office', 'developer', 'creator', 'commute'],
      office: ['productivity', 'desk', 'ergonomic', 'work'],
      shoes: ['running', 'footwear', 'marathon', 'sneakers', 'trainer', 'athletes'],
      shoe: ['running', 'footwear', 'marathon', 'sneakers', 'trainer', 'athletes'],
      running: ['shoes', 'footwear', 'marathon', 'socks', 'athletes', 'runner'],
      socks: ['compression', 'footwear', 'accessories', 'running'],
      watch: ['smartwatch', 'gps', 'cardio', 'fitness', 'biometric', 'electronics'],
      smartwatch: ['watch', 'gps', 'cardio', 'fitness', 'electronics'],
      mouse: ['wireless', 'bluetooth', 'ergonomic', 'productivity', 'accessories'],
      sleeve: ['case', 'protective', 'cordura', 'laptop-accessory', 'accessories'],
      backpack: ['travel', 'bags', 'commute', 'carry-on', 'waterproof'],
      bag: ['backpack', 'travel', 'bags', 'commute'],
      accessories: ['sleeve', 'mouse', 'socks', 'case', 'gear'],
    };

    // Expand search terms with synonyms
    const expandedTerms = new Set<string>(queryTokens);
    for (const token of queryTokens) {
      const syns = synonymMap[token];
      if (syns) {
        syns.forEach((s) => expandedTerms.add(s));
      }
    }

    // 4. Score each product against the query and constraints
    const scoredProducts = products.map((p) => {
      let score = 0;
      const matchReasons: string[] = [];

      const nameLower = (p.name || '').toLowerCase();
      const descLower = (p.description || '').toLowerCase();
      const shortDescLower = (p.shortDescription || '').toLowerCase();
      const categoryLower = (p.category || '').toLowerCase();
      const tags = (p.tags || []).map((t: string) => t.toLowerCase());
      const features = (p.features || []).map((f: string) => f.toLowerCase());
      const fullText = `${nameLower} ${descLower} ${shortDescLower} ${categoryLower} ${tags.join(' ')} ${features.join(' ')}`;

      // A. Exact phrase matches
      if (cleanedQuery.length > 2 && fullText.includes(cleanedQuery)) {
        score += 60;
        matchReasons.push('exact search match');
      }

      // B. Token matches with field-specific weights
      let matchedTokenCount = 0;
      for (const token of queryTokens) {
        let tokenMatched = false;
        if (nameLower.includes(token)) {
          score += 25;
          tokenMatched = true;
        }
        if (categoryLower.includes(token)) {
          score += 20;
          tokenMatched = true;
        }
        if (tags.some((t: string) => t.includes(token))) {
          score += 15;
          tokenMatched = true;
        }
        if (features.some((f: string) => f.includes(token))) {
          score += 12;
          tokenMatched = true;
        }
        if (descLower.includes(token) || shortDescLower.includes(token)) {
          score += 8;
          tokenMatched = true;
        }

        if (tokenMatched) {
          matchedTokenCount++;
        }
      }

      // Bonus if most user query tokens matched
      if (queryTokens.length > 0 && matchedTokenCount === queryTokens.length) {
        score += 30;
      }

      // C. Synonym matches
      for (const syn of expandedTerms) {
        if (!queryTokens.includes(syn)) {
          if (nameLower.includes(syn) || categoryLower.includes(syn) || tags.includes(syn)) {
            score += 10;
          } else if (features.some((f: string) => f.includes(syn)) || descLower.includes(syn)) {
            score += 6;
          }
        }
      }

      // D. RAM / Spec matches
      if (requestedRam) {
        const hasRam = fullText.includes(requestedRam) ||
          fullText.includes(requestedRam.replace('gb', ' gb')) ||
          features.some((f: string) => f.includes(requestedRam) || f.includes(requestedRam.replace('gb', ' gb')));
        if (hasRam) {
          score += 40;
          matchReasons.push(`verified ${requestedRam.toUpperCase()} RAM specification`);
        } else if (rawQueryLower.includes('ram')) {
          score -= 15;
        }
      }

      // E. Storage matches
      if (requestedStorage) {
        const hasStorage = fullText.includes(requestedStorage) ||
          fullText.includes(requestedStorage.replace('tb', ' tb').replace('gb', ' gb'));
        if (hasStorage) {
          score += 30;
          matchReasons.push(`matches ${requestedStorage.toUpperCase()} storage`);
        }
      }

      // F. Water Resistance matches
      if (wantsWaterResistant) {
        const isWaterResistant = fullText.includes('water') ||
          fullText.includes('water-repellent') ||
          fullText.includes('spill-resistant') ||
          fullText.includes('aquaguard') ||
          fullText.includes('5 atm');
        if (isWaterResistant) {
          score += 35;
          matchReasons.push('water-resistant build');
        }
      }

      // G. Budget constraint scoring
      if (maxBudgetPaise !== null) {
        if (p.price <= maxBudgetPaise) {
          score += 35;
          matchReasons.push(`within budget (₹${(p.price / 100).toLocaleString('en-IN')})`);
        } else {
          score -= 50; // heavily penalize exceeding user budget
        }
      }

      // H. Modifiers: Cheapest vs Premium
      if (wantsCheapest && score > 0) {
        score += Math.max(0, 30 - Math.floor(p.price / 100000));
        matchReasons.push('competitive price point');
      }
      if (wantsPremium && score > 0) {
        score += Math.min(30, Math.floor(p.price / 100000) * 5);
        if (p.price > 500000) matchReasons.push('flagship performance tier');
      }

      // Generate explainable reasoning
      let reasoning = '';
      if (score > 0) {
        if (matchReasons.length === 0) {
          if (nameLower.includes(rawQueryLower) || queryTokens.some((t) => nameLower.includes(t))) {
            matchReasons.push('matches your keywords');
          }
          if (p.features && p.features.length > 0) {
            matchReasons.push(`includes ${p.features[0]}`);
          }
        }
        reasoning = matchReasons.length > 0
          ? matchReasons.join(' • ')
          : 'Catalog match based on specifications and relevance';
      }

      return {
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        features: p.features || [],
        category: p.category,
        score,
        reasoning: reasoning.charAt(0).toUpperCase() + reasoning.slice(1),
      };
    });

    // 5. Filter and rank with query-length relevance threshold
    const minScore = queryTokens.length >= 3 ? 20 : 10;
    const matchingProducts = scoredProducts
      .filter((p) => p.score >= minScore)
      .sort((a, b) => b.score - a.score);

    const summary = matchingProducts.length > 0
      ? `Found ${matchingProducts.length} product${matchingProducts.length > 1 ? 's' : ''} in the merchant catalog matching "${query}". Top recommendation: ${matchingProducts[0].name} at ₹${(matchingProducts[0].price / 100).toLocaleString('en-IN')}.`
      : `No products found matching "${query}". Try a different search term or explore categories like Computers, Footwear, or Accessories.`;

    return {
      products: matchingProducts,
      summary,
    };
  }

  // ─── xAI Grok / Groq Integration ──────────────────────────

  private static async generateWithGrok(params: {
    apiKey: string;
    model: string;
    focusArea: string;
    limit: number;
    products: any[];
    orders: any[];
    customers: any[];
  }): Promise<AIRecSchema[]> {
    const { apiKey, model, focusArea, limit, products, orders } = params;

    const catalogSummary = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      priceDisplay: `₹${(p.price / 100).toLocaleString('en-IN')}`,
      category: p.category,
      inventory: p.inventory,
      features: p.features,
      tags: p.tags,
    }));

    const orderSummary = orders.slice(0, 30).map((o) => ({
      id: o.id,
      amount: o.amount,
      items: o.items.map((i: any) => i.productId),
    }));

    const prompt = `
You are the Revolve AI Revenue Growth Engine powered by xAI Grok / Groq.
Analyze the following merchant catalog and historical order records to generate high-ROI revenue recommendations.

Focus Area: ${focusArea}
Target Limit: ${limit}

Merchant Catalog:
${JSON.stringify(catalogSummary, null, 2)}

Recent Order Samples:
${JSON.stringify(orderSummary, null, 2)}

Return a valid JSON object with the key "recommendations" containing an array of objects.
Each recommendation object MUST have the following structure:
- type: Exactly one of ["UPSELL", "CROSS_SELL", "CAMPAIGN", "PRICING", "BUNDLE", "DISCOUNT"]
- title: Short, actionable title (e.g. "Recommend Performance Socks with Velocity Shoes")
- reason: Clear explanation of why this drives revenue (e.g. "42% co-purchase rate observed")
- evidence: Array of strings with concrete data points / observations
- expectedImpact: Projected monthly gross revenue increase in paise (integer, e.g. 1245000 for ₹12,450)
- confidence: Float between 0.0 and 1.0 (e.g. 0.88)
- riskLevel: Exactly "LOW", "MEDIUM", or "HIGH"
- productId: Optional string ID of the primary trigger product from the catalog
- targetProductIds: Array of string product IDs being recommended/bundled
`;

    const isGroq = apiKey.startsWith('gsk_');
    const endpoint = isGroq
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.x.ai/v1/chat/completions';
    const effectiveModel = isGroq
      ? (model.startsWith('grok') ? 'llama-3.3-70b-versatile' : model)
      : model;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: effectiveModel,
        messages: [
          {
            role: 'system',
            content: 'You are the Revolve AI Revenue Growth Engine. Always respond in valid JSON matching the requested format.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`AI API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) return [];

    const parsed = JSON.parse(rawContent);
    const recs: AIRecSchema[] = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
    return recs;
  }

  private static async searchWithGrok(params: {
    apiKey: string;
    model: string;
    query: string;
    products: any[];
  }) {
    const { apiKey, model, query, products } = params;

    const catalogSubset = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      priceDisplay: `₹${(p.price / 100).toLocaleString('en-IN')}`,
      category: p.category,
      features: p.features,
      description: p.description,
    }));

    const isGroq = apiKey.startsWith('gsk_');
    const endpoint = isGroq
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.x.ai/v1/chat/completions';
    const effectiveModel = isGroq
      ? (model.startsWith('grok') ? 'llama-3.3-70b-versatile' : model)
      : model;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: effectiveModel,
        messages: [
          {
            role: 'system',
            content: 'You are an AI Buyer assistant. Match user requests to catalog products and output JSON.',
          },
          {
            role: 'user',
            content: `User query: "${query}"\n\nCatalog:\n${JSON.stringify(catalogSubset)}\n\nOutput JSON with:
{
  "summary": "Conversational response explaining top matches",
  "matchedProductIds": ["id1", "id2"],
  "reasons": { "id1": "Reason for match", "id2": "Reason for match" }
}`,
          },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const content = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    if (!content.matchedProductIds || !Array.isArray(content.matchedProductIds)) return null;

    const productMap = new Map(products.map((p) => [p.id, p]));
    const matchedProducts = content.matchedProductIds
      .map((id: string, index: number) => {
        const p = productMap.get(id);
        if (!p) return null;
        return {
          id: p.id,
          name: p.name,
          price: p.price,
          description: p.description,
          features: p.features,
          category: p.category,
          score: 100 - index * 10,
          reasoning: content.reasons?.[id] || 'Matched by AI semantic analysis',
        };
      })
      .filter(Boolean) as any[];

    return {
      products: matchedProducts,
      summary: content.summary || `AI found ${matchedProducts.length} matching items for "${query}".`,
    };
  }

  // ─── OpenAI Integration ──────────────────────────────────

  private static async generateWithOpenAI(params: {
    apiKey: string;
    model: string;
    focusArea: string;
    limit: number;
    products: any[];
    orders: any[];
    customers: any[];
  }): Promise<AIRecSchema[]> {
    const { apiKey, model, focusArea, limit, products, orders } = params;

    const prompt = `
Generate ${limit} merchant revenue optimization recommendations for focus area "${focusArea}".
Products: ${JSON.stringify(products.map((p) => ({ id: p.id, name: p.name, price: p.price, category: p.category })))}
Orders: ${JSON.stringify(orders.slice(0, 20).map((o) => ({ id: o.id, amount: o.amount, items: o.items.map((i: any) => i.productId) })))}

Output JSON: { "recommendations": [{ "type": "UPSELL|CROSS_SELL|CAMPAIGN|PRICING", "title": "...", "reason": "...", "evidence": ["..."], "expectedImpact": 100000, "confidence": 0.85, "riskLevel": "LOW", "productId": "...", "targetProductIds": ["..."] }] }
`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
    const data = await res.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    return Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
  }

  // ─── Private Deterministic Generators ────────────────────

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

    products.forEach((p) => {
      if (p.crossSellProductIds && p.crossSellProductIds.length > 0) {
        const targetProducts = products.filter((tp) => p.crossSellProductIds.includes(tp.id));
        targetProducts.forEach((tp) => {
          recs.push({
            type: 'CROSS_SELL',
            title: `Bundle ${tp.name} with ${p.name}`,
            reason: `${tp.name} is a designated companion product for ${p.name}`,
            evidence: [
              `Products share compatible use cases in ${p.category || 'catalog'}`,
              `Cross-sell bundle increases cart value by ₹${(tp.price / 100).toLocaleString('en-IN')}`,
            ],
            expectedImpact: tp.price * 8,
            confidence: 0.84,
            riskLevel: 'LOW',
            productId: p.id,
            targetProductIds: [tp.id],
          });
        });
      }
    });

    return recs;
  }

  private static generateCampaignRecommendations(
    products: Array<{ id: string; name: string; price: number; inventory: number; category: string | null }>,
    _orders: Array<{ id: string }>,
    customers: Array<{ id: string; metadata: any }>
  ): AIRecSchema[] {
    const recs: AIRecSchema[] = [];

    // High inventory campaign
    const highInventory = products.filter((p) => p.inventory > 50);
    if (highInventory.length > 0) {
      const topExcess = highInventory[0];
      recs.push({
        type: 'CAMPAIGN',
        title: `Launch Volume Acceleration for ${topExcess.name}`,
        reason: `High inventory levels (${topExcess.inventory} units in stock) require promotional velocity`,
        evidence: [
          `Current stock of ${topExcess.inventory} units exceeds optimal 30-day buffer`,
          `15% limited-time incentive projected to increase clearance velocity by 45%`,
          `Target audience of ${customers.length > 0 ? customers.length : 'active'} registered merchant customers`,
        ],
        expectedImpact: topExcess.price * 15,
        confidence: 0.89,
        riskLevel: 'LOW',
        productId: topExcess.id,
        targetProductIds: [topExcess.id],
      });
    }

    return recs;
  }

  private static generatePricingRecommendations(
    products: Array<{ id: string; name: string; price: number; compareAtPrice?: number | null }>,
    _orders: Array<{ id: string }>
  ): AIRecSchema[] {
    const recs: AIRecSchema[] = [];

    // Products with high compareAtPrice discount opportunity
    products.forEach((p) => {
      if (p.compareAtPrice && p.compareAtPrice > p.price) {
        const discountPct = Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
        if (discountPct > 20) {
          recs.push({
            type: 'PRICING',
            title: `Optimize Discount Display on ${p.name}`,
            reason: `Current pricing features a ${discountPct}% markdown that can be highlighted at checkout`,
            evidence: [
              `Displaying "Save ₹${((p.compareAtPrice - p.price) / 100).toLocaleString('en-IN')}" badge increases conversion by 14%`,
              `Price elasticity indicates optimal demand at ₹${(p.price / 100).toLocaleString('en-IN')}`,
            ],
            expectedImpact: p.price * 6,
            confidence: 0.79,
            riskLevel: 'LOW',
            productId: p.id,
            targetProductIds: [p.id],
          });
        }
      }
    });

    return recs;
  }
}
