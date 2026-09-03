'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import { Shield, Sparkles, CheckCircle2, AlertCircle, XCircle, RotateCcw, ArrowLeft } from 'lucide-react';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id?: string;
    };
  };
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
  on: (event: string, callback: (response: any) => void) => void;
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

// Resilient on-demand script loader for Razorpay Checkout SDK
async function ensureRazorpayLoaded(): Promise<boolean> {
  if (typeof window !== 'undefined' && window.Razorpay) {
    return true;
  }
  return new Promise((resolve) => {
    const existing = document.getElementById('razorpay-checkout-script');
    if (existing) {
      existing.addEventListener('load', () => resolve(Boolean(window.Razorpay)));
      setTimeout(() => resolve(Boolean(window.Razorpay)), 1500);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
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
  const [stage, setStage] = useState<'details' | 'creating_order' | 'checkout_active' | 'verifying' | 'success' | 'failed' | 'unknown'>('details');
  const [failureReason, setFailureReason] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { success: toastSuccess, error: toastError } = useToast();

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFailureReason('');
    setStage('creating_order');

    console.log('[Checkout Flow][Step 1: Order Creation Request]', {
      productId: product.id,
      productName: product.name,
      quantity,
      customerName,
      customerEmail,
      customerPhone,
      aiActionId,
    });

    try {
      // 1. Create order on backend (strictly calculated server-side)
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
        const data = await res.json().catch(() => ({}));
        const detailedMsg = data.error || `Server responded with HTTP status ${res.status}`;
        console.error('[Checkout Flow][Step 1 Failed: Order Creation]', detailedMsg);
        throw new Error(`Order creation failed: ${detailedMsg}`);
      }

      const orderData = await res.json();
      const { razorpayOrderId, keyId, amount, currency } = orderData;

      console.log('[Checkout Flow][Step 1: Order Created Successfully]', {
        razorpayOrderId,
        amount,
        currency,
        keyIdPresent: Boolean(keyId),
      });

      // Ensure SDK is ready
      const sdkReady = await ensureRazorpayLoaded();
      if (!sdkReady || !window.Razorpay) {
        console.error('[Checkout Flow][Step 2 Failed: SDK Unavailable]');
        throw new Error('Razorpay Checkout SDK could not be loaded. Please check your network connection or ad-blocker settings.');
      }

      setStage('checkout_active');
      console.log('[Checkout Flow][Step 2: Opening Razorpay Checkout Modal]', { razorpayOrderId });

      // 2. Open standard Razorpay Checkout
      const options: RazorpayOptions = {
        key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount,
        currency,
        name: 'Revolve AI Store',
        description: `Order for ${product.name}`,
        order_id: razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          console.log('[Checkout Flow][Step 3: Razorpay Payment Authorized via Modal]', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            signatureReceived: Boolean(response.razorpay_signature),
          });

          setStage('verifying');
          try {
            console.log('[Checkout Flow][Step 4: Submitting HMAC Signature to Backend]');
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
              const reason = verifyData.error || 'Cryptographic signature mismatch against merchant secret';
              console.error('[Checkout Flow][Step 4/5 Failed: Signature Verification]', reason);
              throw new Error(`Signature verification failed: ${reason}`);
            }

            console.log('[Checkout Flow][Step 5: Payment Captured & Verified Successfully]', verifyData);
            setStage('success');
            toastSuccess('Payment Captured', `Transaction ${response.razorpay_payment_id} verified and sealed.`);
            onSuccess?.();
          } catch (verErr: unknown) {
            console.error('[Checkout Flow][Step 4/5 Error: Inconclusive Verification]', verErr);
            setStage('unknown');
            const errDetail = verErr instanceof Error ? verErr.message : 'Verification inconclusive. Check ledger status.';
            setErrorMsg(errDetail);
          }
        },
        modal: {
          ondismiss: () => {
            console.log('[Checkout Flow][Modal Dismissed by User]');
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
          color: '#111827',
        },
      };

      const rzp = new window.Razorpay(options);

      // Listen for explicit payment failure event from Razorpay
      rzp.on('payment.failed', (response: RazorpayFailureResponse) => {
        const errorDesc = response?.error?.description || response?.error?.reason || 'Transaction declined by bank or test simulator';
        console.warn('[Checkout Flow][Payment Failed Event from Razorpay]', {
          code: response?.error?.code,
          description: errorDesc,
          source: response?.error?.source,
          step: response?.error?.step,
        });
        setFailureReason(errorDesc);
        setStage('failed');
      });

      rzp.open();
    } catch (err: unknown) {
      setStage('details');
      const msg = err instanceof Error ? err.message : 'Failed to initiate checkout';
      console.error('[Checkout Flow][Checkout Initiation Failed]', err);
      setErrorMsg(msg);
      toastError('Checkout Error', msg);
    }
  };

  const totalAmount = product.price * quantity;

  return (
    <Modal
      isOpen={isOpen}
      onClose={stage === 'creating_order' || stage === 'verifying' ? () => {} : onClose}
      title={
        stage === 'success'
          ? 'Payment Confirmed'
          : stage === 'failed'
          ? 'Payment Failed'
          : stage === 'unknown'
          ? 'Status Verification'
          : 'Razorpay Secure Checkout'
      }
      description={
        stage === 'failed'
          ? 'Razorpay Test Mode transaction outcome'
          : 'Razorpay Test Mode standard checkout flow'
      }
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
            Your transaction was verified via HMAC-SHA256 and captured in PostgreSQL. Full audit trail recorded.
          </p>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      ) : stage === 'failed' ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--danger-bg, #fee2e2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <XCircle size={32} color="var(--danger, #ef4444)" />
          </div>
          <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
            PAYMENT FAILED
          </h3>
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            margin: '0 auto 20px',
            textAlign: 'left',
            fontSize: '0.8125rem',
            border: '1px solid var(--border-primary)',
          }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
              Reason:
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Payment could not be completed in Razorpay Test Mode.
              {failureReason ? ` (${failureReason})` : ''}
            </p>
          </div>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: 24 }}>
            No transaction was created. You can retry with standard Test Mode credentials or return to AI Buyer.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button variant="secondary" onClick={onClose}>
              <ArrowLeft size={14} /> Return to AI Buyer
            </Button>
            <Button variant="primary" onClick={() => setStage('details')}>
              <RotateCcw size={14} /> Try Again
            </Button>
          </div>
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
            Payment status could not be confirmed immediately. The server is safely querying Razorpay without duplicate orders.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button variant="secondary" onClick={onClose}>
              Return to AI Buyer
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleInitiatePayment} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {errorMsg && (
            <div style={{
              background: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
              color: 'var(--error)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

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

