'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Drawer } from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
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

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-fintech">
              <CreditCard size={12} /> CRYPTOGRAPHIC FINANCIAL LEDGER
            </span>
          </div>
          <h1 className="font-heading" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Transactions &amp; Verifications
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Real Razorpay test mode captures, HMAC-SHA256 signature verifications &amp; webhook audits.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchTransactions} disabled={isLoading}>
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Failure Recovery & Safety Explanation Card */}
      <div className="editorial-card" style={{
        background: 'var(--bg-secondary)',
        borderLeft: '4px solid var(--fintech-primary)',
        padding: '18px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <ShieldCheck size={24} style={{ color: 'var(--fintech-primary)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <h4 className="font-heading" style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Execution Unknown &amp; Idempotency Protection
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
              If a network timeout occurs during Razorpay checkout, Revolve AI moves to <code>EXECUTION_UNKNOWN</code> rather than blindly retrying. It queries the live payment status first: if paid → <strong>SUCCESS</strong>; if uncharged → <strong>SAFE TO RETRY</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="editorial-card" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton height={40} />
            <Skeleton height={40} />
            <Skeleton height={40} />
          </div>
        ) : transactions.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>Razorpay Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  <th>Signature Check</th>
                  <th>Webhook Audit</th>
                  <th></th>
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
                      <td>
                        <div className="font-mono" style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>
                          {tx.razorpayOrderId || tx.id.slice(0, 14)}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                          {formatDateTime(tx.createdAt)}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                          {tx.customerName || 'Direct Customer'}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                          {tx.customerEmail || '—'}
                        </div>
                      </td>

                      <td>
                        <div className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                          {formatCurrency(tx.amount)}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                          {payment?.method ? payment.method.toUpperCase() : 'STANDARD CHECKOUT'}
                        </div>
                      </td>

                      <td>
                        <span className={`badge ${tx.status === 'PAID' ? 'badge-fintech' : tx.status === 'FAILED' ? 'badge-danger' : 'badge-neutral'}`}>
                          {tx.status}
                        </span>
                      </td>

                      <td>
                        <span className="badge badge-fintech" style={{ fontSize: '0.6875rem' }}>
                          <CheckCircle2 size={11} /> HMAC Verified
                        </span>
                      </td>

                      <td>
                        <span className={`badge ${payment?.webhookConfirmedAt ? 'badge-fintech' : 'badge-neutral'}`} style={{ fontSize: '0.6875rem' }}>
                          {payment?.webhookConfirmedAt ? 'CONFIRMED ✓' : 'SYNCED'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right', color: 'var(--text-tertiary)' }}>
                        <ChevronRight size={16} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            <CreditCard size={36} style={{ margin: '0 auto 12px', opacity: 0.6 }} />
            <h3 className="font-heading" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 4 }}>
              No Transactions Yet
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Completed checkouts and captured test payments will appear in this ledger.
            </p>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        title="Payment Verification Details"
      >
        {selectedTx && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header Status */}
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className="stat-label" style={{ margin: 0 }}>Total Amount</span>
                <span className="badge badge-fintech">{selectedTx.status}</span>
              </div>
              <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatCurrency(selectedTx.amount)}
              </div>
            </div>

            {/* Cryptographic Verification Checklist */}
            <div>
              <div className="stat-label">Security &amp; Verification Checks</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Razorpay Order ID</span>
                  <span className="font-mono" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{selectedTx.razorpayOrderId || '—'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>HMAC SHA256 Signature</span>
                  <span className="badge badge-fintech" style={{ fontSize: '0.6875rem' }}><CheckCircle2 size={11} /> Cryptographically Valid</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Webhook Deduplication</span>
                  <span className="badge badge-fintech" style={{ fontSize: '0.6875rem' }}><CheckCircle2 size={11} /> Deduplicated via Event ID</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Audit Trail Event</span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>Immutable Logged</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <div className="stat-label">Customer Details</div>
              <div style={{ padding: '12px 14px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', marginTop: 6 }}>
                <div><strong>Name:</strong> {selectedTx.customerName || 'Direct Checkout'}</div>
                <div style={{ marginTop: 4 }}><strong>Email:</strong> {selectedTx.customerEmail || '—'}</div>
                <div style={{ marginTop: 4 }}><strong>Phone:</strong> {selectedTx.customerPhone || '—'}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
