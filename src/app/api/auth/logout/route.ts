import { NextResponse } from 'next/server';
import { clearSession, getSessionFromRequest } from '@/lib/auth';
import { AuditService, AuditActions } from '@/server/services/audit-service';

export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequest(req);

    if (session) {
      await AuditService.create({
        merchantId: session.merchantId,
        actor: session.userId,
        action: AuditActions.USER_LOGGED_OUT,
        entity: 'User',
        entityId: session.userId,
      });
    }

    await clearSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Logout Error]', error);
    await clearSession();
    return NextResponse.json({ success: true });
  }
}
