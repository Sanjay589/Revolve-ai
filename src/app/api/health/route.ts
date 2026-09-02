import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const checks: Record<string, string> = {};
  let healthy = true;

  // Application check
  checks.application = 'ok';

  // Database check
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = 'ok';
  } catch {
    checks.database = 'error';
    healthy = false;
  }

  // Configuration check
  const requiredEnvVars = ['DATABASE_URL', 'AUTH_SECRET'];
  const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
  checks.configuration = missingVars.length === 0 ? 'ok' : `missing: ${missingVars.join(', ')}`;
  if (missingVars.length > 0) healthy = false;

  // Razorpay configuration (optional in dev)
  checks.razorpay = process.env.RAZORPAY_KEY_ID ? 'configured' : 'not_configured';

  return NextResponse.json(
    {
      status: healthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
      version: '1.0.0',
    },
    { status: healthy ? 200 : 503 }
  );
}
