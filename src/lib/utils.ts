import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amountInPaise: number, currency: string = 'INR'): string {
  const amount = amountInPaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(date));
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(date));
}

export function truncateId(id: string, length: number = 8): string {
  if (id.length <= length) return id;
  return id.slice(0, length) + '...';
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function generateReceipt(): string {
  return `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function generateIdempotencyKey(prefix: string, ...parts: string[]): string {
  return `${prefix}_${parts.join('_')}_${Date.now()}`;
}

export function paise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function rupees(paise: number): number {
  return paise / 100;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function percentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export interface StructuredErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    requestId?: string;
    details?: unknown;
  };
}

export function formatStructuredError(
  code: string,
  message: string,
  requestId?: string,
  details?: unknown
): StructuredErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      requestId: requestId || generateRequestId(),
      details: details ? details : undefined,
    },
  };
}

export function safeLog(
  level: 'info' | 'warn' | 'error',
  message: string,
  meta?: Record<string, unknown>
) {
  const sanitizedMeta = meta ? { ...meta } : {};
  // Strip sensitive credentials if present
  delete sanitizedMeta.password;
  delete sanitizedMeta.passwordHash;
  delete sanitizedMeta.secret;
  delete sanitizedMeta.keySecret;
  delete sanitizedMeta.token;
  delete sanitizedMeta.apiKey;

  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...sanitizedMeta,
  };

  if (level === 'error') {
    console.error(JSON.stringify(logEntry));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(logEntry));
  } else {
    console.log(JSON.stringify(logEntry));
  }
}

