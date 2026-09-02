import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { AIEngine } from '@/server/services/ai-engine';
import { prisma } from '@/lib/prisma';
import { generateRecommendationsSchema } from '@/schemas/ai';
import { AuditService, AuditActions } from '@/server/services/audit-service';
import { aiLimiter, getRateLimitIdentifier } from '@/lib/rate-limit';

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

    const recommendations = await AIEngine.generateRecommendations(
      session.merchantId,
      validated.data
    );

    // Store recommendations in database
    const stored = await Promise.all(
      recommendations.map((rec) =>
        prisma.aIRecommendation.create({
          data: {
            merchantId: session.merchantId,
            type: rec.type as never,
            title: rec.title,
            reason: rec.reason,
            evidence: rec.evidence,
            expectedImpact: rec.expectedImpact,
            confidence: rec.confidence,
            riskLevel: rec.riskLevel as never,
            productId: rec.productId,
            targetProductIds: rec.targetProductIds || [],
          },
        })
      )
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
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('[AI Recommendations Error]', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
