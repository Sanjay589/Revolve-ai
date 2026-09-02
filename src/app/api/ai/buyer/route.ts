import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { AIBuyerService } from '@/server/services/ai-buyer-service';
import { aiBuyerMessageSchema } from '@/schemas/ai';

export async function POST(req: Request) {
  try {
    const session = await requireAuth(req);
    const body = await req.json();
    const validated = aiBuyerMessageSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { message, sessionId, buyerName, buyerEmail } = validated.data;

    // Create or use existing session
    let activeSessionId = sessionId;
    if (!activeSessionId) {
      const newSession = await AIBuyerService.createSession(
        session.merchantId,
        buyerName,
        buyerEmail
      );
      activeSessionId = newSession.id;
    }

    const result = await AIBuyerService.processMessage({
      merchantId: session.merchantId,
      sessionId: activeSessionId,
      message,
    });

    return NextResponse.json({
      sessionId: activeSessionId,
      ...result,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('[AI Buyer Error]', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await requireAuth(req);
    const result = await AIBuyerService.getSessions(session.merchantId);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
