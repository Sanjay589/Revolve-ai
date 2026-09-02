import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { AIEngine } from '@/server/services/ai-engine';
import { prisma } from '@/lib/prisma';
import { generateRecommendationsSchema } from '@/schemas/ai';
import { AuditService, AuditActions } from '@/server/services/audit-service';
import { aiLimiter, getRateLimitIdentifier } from '@/lib/rate-limit';

const VALID_REC_TYPES = new Set(['UPSELL', 'CROSS_SELL', 'CAMPAIGN', 'PRICING', 'BUNDLE', 'CONVERSION']);
const VALID_RISK_LEVELS = new Set(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export async function POST(req: Request) {
  try {
    const identifier = getRateLimitIdentifier(req);
    const rateCheck = aiLimiter.check(identifier);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const session = await requireAuth(req);
    const body = await req.json();
    const validated = generateRecommendationsSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await AuditService.create({
      merchantId: session.merchantId,
      actor: 'ai_agent',
      action: AuditActions.AI_ANALYSIS_STARTED,
      entity: 'Merchant',
      entityId: session.merchantId,
    });

    // Fetch existing merchant products to validate foreign keys
    const merchantProducts = await prisma.product.findMany({
      where: { merchantId: session.merchantId, isActive: true },
      select: { id: true },
    });
    const validProductIds = new Set(merchantProducts.map((p) => p.id));

    const recommendations = await AIEngine.generateRecommendations(
      session.merchantId,
      validated.data
    );

    // Sanitize and store recommendations in database
    const stored = await Promise.all(
      recommendations.map(async (rec) => {
        const sanitizedType = VALID_REC_TYPES.has(rec.type) ? rec.type : 'UPSELL';
        const sanitizedRisk = VALID_RISK_LEVELS.has(rec.riskLevel) ? rec.riskLevel : 'LOW';
        const sanitizedProductId = rec.productId && validProductIds.has(rec.productId) ? rec.productId : null;
        const sanitizedTargetIds = Array.isArray(rec.targetProductIds)
          ? rec.targetProductIds.filter((id) => validProductIds.has(id))
          : [];
        const sanitizedImpact = Math.round(Number(rec.expectedImpact) || 10000);
        const sanitizedConfidence = Math.min(1, Math.max(0, Number(rec.confidence) || 0.75));
        const sanitizedEvidence = Array.isArray(rec.evidence) && rec.evidence.length > 0
          ? rec.evidence.map(String)
          : ['Derived from historical catalog analysis'];

        return prisma.aIRecommendation.create({
          data: {
            merchantId: session.merchantId,
            type: sanitizedType as never,
            title: rec.title || 'Revenue Growth Opportunity',
            reason: rec.reason || 'Identified opportunity to increase average order value',
            evidence: sanitizedEvidence,
            expectedImpact: sanitizedImpact,
            confidence: sanitizedConfidence,
            riskLevel: sanitizedRisk as never,
            productId: sanitizedProductId,
            targetProductIds: sanitizedTargetIds,
          },
        });
      })
    );

    await AuditService.create({
      merchantId: session.merchantId,
      actor: 'ai_agent',
      action: AuditActions.AI_ANALYSIS_COMPLETED,
      entity: 'Merchant',
      entityId: session.merchantId,
      metadata: { recommendationCount: stored.length },
    });

    // Create notification
    if (stored.length > 0) {
      await prisma.notification.create({
        data: {
          merchantId: session.merchantId,
          type: 'AI_ANALYSIS',
          title: 'AI Analysis Complete',
          message: `Found ${stored.length} new revenue opportunities`,
          entityType: 'AIRecommendation',
        },
      });
    }

    return NextResponse.json({ recommendations: stored });
  } catch (error: any) {
    if (error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('=== [AI Recommendations Error Detail] ===', error?.message, error?.stack);
    return NextResponse.json({
      error: 'Failed to generate recommendations',
      detail: error?.message || String(error),
      stack: error?.stack
    }, { status: 500 });
  }
}
