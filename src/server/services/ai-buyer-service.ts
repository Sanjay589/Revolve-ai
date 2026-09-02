import { prisma } from '@/lib/prisma';
import { AIEngine } from './ai-engine';

export class AIBuyerService {
  /**
   * Start a new AI buyer session.
   */
  static async createSession(merchantId: string, buyerName?: string, buyerEmail?: string) {
    return prisma.aIBuyerSession.create({
      data: {
        merchantId,
        buyerName,
        buyerEmail,
        status: 'active',
      },
    });
  }

  /**
   * Process a buyer message: search catalog, compare products, recommend.
   */
  static async processMessage(params: {
    merchantId: string;
    sessionId: string;
    message: string;
  }) {
    const { merchantId, sessionId, message } = params;

    // Verify session belongs to merchant
    const session = await prisma.aIBuyerSession.findFirst({
      where: { id: sessionId, merchantId },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // Search catalog
    const searchResult = await AIEngine.searchCatalog(merchantId, message);

    // Build AI response
    const aiResponse = {
      type: searchResult.products.length > 0 ? 'product_results' : 'no_results',
      summary: searchResult.summary,
      products: searchResult.products.slice(0, 5).map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        features: p.features,
        category: p.category,
        reasoning: p.reasoning,
      })),
      recommendation:
        searchResult.products.length > 0
          ? {
              productId: searchResult.products[0].id,
              productName: searchResult.products[0].name,
              reason: `Best match based on your requirements. ${searchResult.products[0].reasoning}`,
            }
          : null,
    };

    // Store the request
    const request = await prisma.aIBuyerRequest.create({
      data: {
        sessionId,
        userMessage: message,
        aiResponse,
        productIds: searchResult.products.map((p) => p.id),
        status: searchResult.products.length > 0 ? 'product_found' : 'no_results',
      },
    });

    return {
      request,
      response: aiResponse,
    };
  }

  /**
   * Select a product for purchase from search results.
   */
  static async selectProduct(params: {
    merchantId: string;
    sessionId: string;
    requestId: string;
    productId: string;
  }) {
    const { merchantId, sessionId, requestId, productId } = params;

    // Verify session
    const session = await prisma.aIBuyerSession.findFirst({
      where: { id: sessionId, merchantId },
    });
    if (!session) throw new Error('Session not found');

    // Verify product
    const product = await prisma.product.findFirst({
      where: { id: productId, merchantId, isActive: true },
    });
    if (!product) throw new Error('Product not found or unavailable');

    // Update request
    await prisma.aIBuyerRequest.update({
      where: { id: requestId },
      data: {
        selectedProductId: productId,
        status: 'product_selected',
      },
    });

    return {
      product,
      message: `Great choice! ${product.name} at ₹${(product.price / 100).toLocaleString('en-IN')}. Ready to proceed with purchase?`,
    };
  }

  /**
   * Get session history.
   */
  static async getSessionHistory(merchantId: string, sessionId: string) {
    const session = await prisma.aIBuyerSession.findFirst({
      where: { id: sessionId, merchantId },
      include: {
        requests: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) throw new Error('Session not found');
    return session;
  }

  /**
   * Get all sessions for a merchant.
   */
  static async getSessions(merchantId: string, limit = 20, offset = 0) {
    const [sessions, total] = await Promise.all([
      prisma.aIBuyerSession.findMany({
        where: { merchantId },
        include: {
          requests: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.aIBuyerSession.count({ where: { merchantId } }),
    ]);

    return { sessions, total };
  }
}
