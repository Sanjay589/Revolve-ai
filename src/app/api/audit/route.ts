import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { AuditService } from '@/server/services/audit-service';

export async function GET(req: Request) {
  try {
    const session = await requireAuth(req);
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const action = url.searchParams.get('action') || undefined;
    const entityId = url.searchParams.get('entityId') || undefined;

    const result = await AuditService.getByMerchant(session.merchantId, {
      limit,
      offset,
      action,
      entityId,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch audit events' }, { status: 500 });
  }
}
