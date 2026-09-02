import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { ApprovalService } from '@/server/services/approval-service';

export async function GET(req: Request) {
  try {
    const session = await requireAuth(req);
    const url = new URL(req.url);
    const status = url.searchParams.get('status');

    if (status === 'pending') {
      const approvals = await ApprovalService.getPending(session.merchantId);
      return NextResponse.json({ approvals, total: approvals.length });
    }

    const result = await ApprovalService.getAll(session.merchantId);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch approvals' }, { status: 500 });
  }
}
