'use client';

import React from 'react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ArrowRight } from 'lucide-react';

export interface TransactionCardProps {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  customerName?: string | null;
  customerEmail?: string | null;
  createdAt: string;
  paymentMethod?: string | null;
  razorpayPaymentId?: string | null;
  onView?: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  orderId,
  amount,
  status,
  customerName,
  customerEmail,
  createdAt,
  paymentMethod,
  razorpayPaymentId,
  onView,
}) => {
  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'PAID':
      case 'CAPTURED':
        return <Badge variant="success">PAID</Badge>;
      case 'CREATED':
        return <Badge variant="neutral">CREATED</Badge>;
      case 'FAILED':
        return <Badge variant="error">FAILED</Badge>;
      default:
        return <Badge variant="warning">{s}</Badge>;
    }
  };

  return (
    <Card
      compact
      onClick={onView}
      style={{ cursor: onView ? 'pointer' : 'default', marginBottom: 8 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <span className="font-heading font-bold" style={{ fontSize: '1.125rem' }}>
            {formatCurrency(amount)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span className="font-mono text-xs text-secondary truncate-id" title={orderId}>
              {orderId}
            </span>
          </div>
        </div>
        {getStatusBadge(status)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <div>
          <span>{customerName || customerEmail || 'Customer'}</span>
          {paymentMethod && <span style={{ marginLeft: 6, textTransform: 'uppercase' }}>• {paymentMethod}</span>}
        </div>
        <span className="font-mono text-tertiary">
          {formatDateTime(createdAt)}
        </span>
      </div>
    </Card>
  );
};
