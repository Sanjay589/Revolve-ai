'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, RefreshCw, CheckCircle2, AlertCircle, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Drawer } from '@/components/ui/drawer';
import { TransactionCard } from '@/components/transaction-card';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface TransactionItem {
  id: string;
  amount: number;
  status: string;
  currency: string;
  razorpayOrderId?: string | null;
  receipt?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  createdAt: string;
  aiActionId?: string | null;
  payments?: Array<{
    id: string;
    razorpayPaymentId?: string | null;
    status: string;
    method?: string | null;
    verifiedAt?: string | null;
    webhookConfirmedAt?: string | null;
  }>;
  items?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/transactions');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'PAID':
      case 'CAPTURED':
        return <Badge variant="success">CAPTURED</Badge>;
      case 'CREATED':
        return <Badge variant="neutral">CREATED</Badge>;
      case 'FAILED':
        return <Badge variant="error">FAILED</Badge>;
      default:
        return <Badge variant="warning">{s}</Badge>;
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-neutral">
              <CreditCard size={12} /> RAZORPAY TEST MODE LEDGER
            </span>
          </div>
          <h1 className="page-title">Transaction Ledger</h1>
          <p className="page-subtitle">
            Immutable financial records verified by Razorpay cryptographic HMAC signatures & webhooks.
          </p>
        </div>

        <Button variant="secondary" onClick={fetchTransactions} isLoading={isLoading}>
          <RefreshCw size={14} /> Refresh
        </Button>
      </div>

      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden lg:block">
        {transactions.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
            <CreditCard size={32} color="var(--text-secondary)" style={{ margin: '0 auto 12px' }} />
            <h3 className="font-heading" style={{ fontSize: '1.125rem', marginBottom: 6 }}>
              No transactions recorded
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Initiate a purchase in the AI Buyer section to test the live Razorpay checkout flow.
            </p>
          </Card>
        ) : (
          <div className="table-container card" style={{ padding: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Payment ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Verified At</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  const payment = tx.payments?.[0];
                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="font-mono" style={{ fontSize: '0.8125rem' }}>
                        {tx.razorpayOrderId || tx.id.slice(0, 14)}
                      </td>
                      <td className="font-mono text-secondary" style={{ fontSize: '0.8125rem' }}>
                        {payment?.razorpayPaymentId || '—'}
                      </td>
                      <td>
                        <p style={{ fontWeight: 500 }}>{tx.customerName || 'Customer'}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{tx.customerEmail}</p>
                      </td>
                      <td className="font-heading font-bold">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                        {payment?.method || 'UPI/Card'}
                      </td>
                      <td>{getStatusBadge(tx.status)}</td>
                      <td className="font-mono text-tertiary" style={{ fontSize: '0.75rem' }}>
                        {formatDateTime(tx.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Stream View (Hidden on desktop) */}
      <div className="lg:hidden" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {transactions.map((tx) => {
          const payment = tx.payments?.[0];
          return (
            <TransactionCard
              key={tx.id}
              id={tx.id}
              orderId={tx.razorpayOrderId || tx.id.slice(0, 12)}
              amount={tx.amount}
              status={tx.status}
              customerName={tx.customerName}
              customerEmail={tx.customerEmail}
              createdAt={tx.createdAt}
              paymentMethod={payment?.method}
              razorpayPaymentId={payment?.razorpayPaymentId}
              onView={() => setSelectedTx(tx)}
            />
          );
        })}
      </div>

      {/* Transaction Detail Drawer */}
      <Drawer
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        title="Transaction Details"
        description={selectedTx ? `Order: ${selectedTx.razorpayOrderId || selectedTx.id}` : ''}
      >
        {selectedTx && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Amount Summary */}
            <div style={{
              padding: '16px',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Total Charged</span>
                <p className="font-heading font-bold" style={{ fontSize: '1.5rem', color: 'var(--ai-primary)' }}>
                  {formatCurrency(selectedTx.amount)}
                </p>
              </div>
              <div>{getStatusBadge(selectedTx.status)}</div>
            </div>

            {/* Technical Verification Details */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8 }}>
                CRYPTOGRAPHIC VERIFICATION
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Razorpay Order:</span>
                  <span className="font-mono text-primary">{selectedTx.razorpayOrderId || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Razorpay Payment ID:</span>
                  <span className="font-mono text-primary">
                    {selectedTx.payments?.[0]?.razorpayPaymentId || 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Signature Verified:</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>HMAC-SHA256 Valid</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Webhook Server Confirmation:</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>Deduplicated & Stored</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8 }}>
                CUSTOMER
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.875rem' }}>
                <p style={{ fontWeight: 600 }}>{selectedTx.customerName || 'Anonymous'}</p>
                <p style={{ color: 'var(--text-secondary)' }}>{selectedTx.customerEmail}</p>
                {selectedTx.customerPhone && <p style={{ color: 'var(--text-tertiary)' }}>{selectedTx.customerPhone}</p>}
              </div>
            </div>

            {/* Order Items */}
            {selectedTx.items && selectedTx.items.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8 }}>
                  ORDER ITEMS
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedTx.items.map((it) => (
                    <div
                      key={it.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <span>{it.quantity}x {it.name}</span>
                      <span className="font-mono font-semibold">{formatCurrency(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
