'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import { Shield, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key?: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    description?: string | null;
  };
  aiActionId?: string;
  onSuccess?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  aiActionId,
  onSuccess,
}) => {
  const [customerName, setCustomerName] = useState('Aarav Sharma');
  const [customerEmail, setCustomerEmail] = useState('aarav.sharma@example.com');
  const [customerPhone, setCustomerPhone] = useState('+919876543210');
  const [quantity, setQuantity] = useState(1);
  const [stage, setStage] = useState<'details' | 'creating_order' | 'checkout_active' | 'verifying' | 'success' | 'unknown'>('details');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { success: toastSuccess, error: toastError } = useToast();

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStage('creating_order');

    try {
      // 1. Create order on backend
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          customerEmail,
          customerName,
          customerPhone,
          aiActionId,
          idempotencyKey: `checkout_${product.id}_${Date.now()}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create Razorpay order');
      }

      const orderData = await res.json();
      const { razorpayOrderId, keyId, amount, currency } = orderData;

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK is not loaded. Please check your internet connection.');
      }

      setStage('checkout_active');

      // 2. Open standard Razorpay Checkout
      const options: RazorpayOptions = {
        key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount,
        currency,
        name: 'Revolve AI Store',
        description: `Order for ${product.name}`,
        order_id: razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          setStage('verifying');
          try {
            // 3. Backend verifies HMAC signature
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.verified) {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }

            setStage('success');
            toastSuccess('Payment Captured', `Transaction ${response.razorpay_payment_id} verified successfully.`);
            onSuccess?.();
          } catch (verErr: unknown) {
            setStage('unknown');
            setErrorMsg(verErr instanceof Error ? verErr.message : 'Verification error. Status will be confirmed via webhook.');
          }
        },
        modal: {
          ondismiss: () => {
            if (stage === 'checkout_active') {
              setStage('details');
            }
          },
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: '#6366f1',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      setStage('details');
      const msg = err instanceof Error ? err.message : 'Failed to initiate checkout';
      setErrorMsg(msg);
      toastError('Checkout Error', msg);
    }
  };

  const totalAmount = product.price * quantity;

  return (
    <Modal
      isOpen={isOpen}
      onClose={stage === 'creating_order' || stage === 'verifying' ? () => {} : onClose}
      title={stage === 'success' ? 'Payment Confirmed' : 'Razorpay Secure Checkout'}
      description="Razorpay Test Mode standard checkout flow"
    >
      {stage === 'success' ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle2 size={32} color="var(--success)" />
          </div>
          <h3 className="font-heading" style={{ fontSize: '1.25rem', marginBottom: 8 }}>
            Payment Successful!
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>
            Your transaction was verified and captured in PostgreSQL. Full audit trail recorded.
          </p>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      ) : stage === 'unknown' ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <AlertCircle size={32} color="var(--warning)" />
          </div>
          <h3 className="font-heading" style={{ fontSize: '1.125rem', marginBottom: 8 }}>
            Status Verification in Progress
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>
            Payment status could not be confirmed immediately. We are safely verifying the existing transaction without double-charging.
          </p>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={handleInitiatePayment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{product.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {formatCurrency(product.price)} each
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Total</span>
              <p className="font-heading font-bold" style={{ fontSize: '1.125rem', color: 'var(--ai-primary)' }}>
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', background: 'var(--warning-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--warning-border)' }}>
            <Shield size={14} color="var(--warning)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 500 }}>
              RAZORPAY TEST MODE • No real card charged
            </span>
          </div>

          <div>
            <label className="label">Customer Name</label>
            <input
              type="text"
              required
              className="input"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Customer Email</label>
            <input
              type="email"
              required
              className="input"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Phone (for OTP)</label>
            <input
              type="tel"
              className="input"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          {errorMsg && (
            <p className="error-text">{errorMsg}</p>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <Button type="button" variant="secondary" onClick={onClose} disabled={stage === 'creating_order' || stage === 'verifying'}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={stage === 'creating_order' || stage === 'verifying'}
            >
              {stage === 'creating_order' ? 'Creating Order...' : stage === 'verifying' ? 'Verifying Signature...' : `Pay ${formatCurrency(totalAmount)}`}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
