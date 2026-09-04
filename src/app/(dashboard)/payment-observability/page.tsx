'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Key,
  Database,
  RotateCcw,
  Zap,
  Lock,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { FloatingCommerceObjects } from '@/components/ui/floating-commerce-objects';
import { useToast } from '@/components/ui/toast';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export type PaymentState =
  | 'SUCCESS'
  | 'FAILURE'
  | 'DELAYED_WEBHOOK'
  | 'EXECUTION_UNKNOWN'
  | 'HMAC_FAILURE'
  | 'IDEMPOTENCY_DUPLICATE'
  | 'RECOVERY';

interface ObservabilityEvent {
  id: string;
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: string;
  state: PaymentState;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  latencyMs: number;
  webhookDelaySec?: number;
  failureReason?: string;
  hmacSignature?: string;
  idempotencyKey: string;
  retryAttempts: number;
  recoveryState?: string;
  requestId: string;
  ledgerHash?: string;
  timeline: Array<{
    step: string;
    status: 'completed' | 'failed' | 'in_progress' | 'pending';
    timestamp: string;
    details?: string;
  }>;
}

const PRESET_EVENTS: ObservabilityEvent[] = [
  {
    id: 'obs_01',
    orderId: 'order_RVL_9821034',
    paymentId: 'pay_RVL_8834912',
    amount: 449900,
    currency: 'INR',
    state: 'SUCCESS',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@gmail.com',
    createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
    latencyMs: 142,
    hmacSignature: '38a9bc72d1f90e12ca08d298ef91823abce1289df193',
    idempotencyKey: 'idemp_live_9821034_capture',
    retryAttempts: 0,
    requestId: 'req_razorpay_9821034',
    ledgerHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    timeline: [
      { step: 'Order Created', status: 'completed', timestamp: '14:20:01', details: 'Razorpay order created server-side' },
      { step: 'Payment Initiated', status: 'completed', timestamp: '14:20:04', details: 'UPI Intent triggered on merchant checkout' },
      { step: 'Razorpay Processing', status: 'completed', timestamp: '14:20:06', details: 'Banking rails cleared transaction' },
      { step: 'Webhook Received', status: 'completed', timestamp: '14:20:07', details: 'event: payment.captured received at /api/webhooks/razorpay' },
      { step: 'HMAC-SHA256 Verification', status: 'completed', timestamp: '14:20:07', details: 'Calculated signature matched x-razorpay-signature header' },
      { step: 'Idempotency Check', status: 'completed', timestamp: '14:20:07', details: 'Unique event ID validated against Prisma store' },
      { step: 'Payment Confirmed', status: 'completed', timestamp: '14:20:08', details: 'Order status updated to PAID' },
      { step: 'Audit Ledger Commit', status: 'completed', timestamp: '14:20:08', details: 'Cryptographic block committed to immutable audit trail' },
    ],
  },
  {
    id: 'obs_02',
    orderId: 'order_RVL_9821035',
    paymentId: 'pay_RVL_8834913',
    amount: 189900,
    currency: 'INR',
    state: 'FAILURE',
    customerName: 'Pooja Nair',
    customerEmail: 'pooja.nair@outlook.com',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    latencyMs: 310,
    failureReason: 'BAD_REQUEST_ERROR: Card declined by issuing bank (insufficient_funds)',
    idempotencyKey: 'idemp_live_9821035_failed',
    retryAttempts: 1,
    recoveryState: 'Customer notified via SMS to reattempt with UPI',
    requestId: 'req_razorpay_9821035',
    timeline: [
      { step: 'Order Created', status: 'completed', timestamp: '14:11:10', details: 'Order created for ₹1,899' },
      { step: 'Payment Initiated', status: 'completed', timestamp: '14:11:15', details: 'Card gateway invoked' },
      { step: 'Razorpay Processing', status: 'failed', timestamp: '14:11:18', details: 'Issuing bank returned 51: Insufficient funds' },
      { step: 'Webhook Received', status: 'completed', timestamp: '14:11:19', details: 'event: payment.failed received' },
      { step: 'HMAC-SHA256 Verification', status: 'completed', timestamp: '14:11:19', details: 'Signature verified' },
      { step: 'Failure Registered', status: 'completed', timestamp: '14:11:20', details: 'Graceful fallback: order state ATTEMPTED' },
    ],
  },
  {
    id: 'obs_03',
    orderId: 'order_RVL_9821036',
    paymentId: 'pay_RVL_8834914',
    amount: 899900,
    currency: 'INR',
    state: 'DELAYED_WEBHOOK',
    customerName: 'Vikram Mehta',
    customerEmail: 'vikram.m@techcorp.in',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    latencyMs: 44200,
    webhookDelaySec: 44,
    hmacSignature: '921bfac8270102aaef0912440192837bc901a',
    idempotencyKey: 'idemp_live_9821036_delayed',
    retryAttempts: 0,
    requestId: 'req_razorpay_9821036',
    ledgerHash: 'sha256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    timeline: [
      { step: 'Order Created', status: 'completed', timestamp: '13:58:00', details: 'Order ₹8,999 initiated' },
      { step: 'Payment Initiated', status: 'completed', timestamp: '13:58:05', details: 'Netbanking checkout' },
      { step: 'Razorpay Processing', status: 'completed', timestamp: '13:58:08', details: 'Bank debited' },
      { step: 'Webhook Received', status: 'completed', timestamp: '13:58:52', details: 'WEBHOOK DELAYED: arrived +44s late; client poll reconciled early' },
      { step: 'HMAC-SHA256 Verification', status: 'completed', timestamp: '13:58:52', details: 'Late webhook signature valid' },
      { step: 'Idempotency Check', status: 'completed', timestamp: '13:58:52', details: 'Reconciled via active poller' },
      { step: 'Payment Confirmed', status: 'completed', timestamp: '13:58:53', details: 'Order marked PAID' },
    ],
  },
  {
    id: 'obs_04',
    orderId: 'order_RVL_9821037',
    paymentId: 'pay_RVL_8834915',
    amount: 1249900,
    currency: 'INR',
    state: 'EXECUTION_UNKNOWN',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya.d@gmail.com',
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
    latencyMs: 15000,
    failureReason: 'ETIMEDOUT: Connection dropped during gateway response handshake',
    idempotencyKey: 'idemp_live_9821037_unk',
    retryAttempts: 2,
    recoveryState: 'EXECUTION_UNKNOWN: Guardrail prevented double charge; awaiting status resolution',
    requestId: 'req_razorpay_9821037',
    timeline: [
      { step: 'Order Created', status: 'completed', timestamp: '13:42:01', details: 'Order for ₹12,499' },
      { step: 'Payment Initiated', status: 'completed', timestamp: '13:42:05', details: 'Checkout form submitted' },
      { step: 'Network Timeout', status: 'failed', timestamp: '13:42:20', details: 'Connection timed out before confirmation' },
      { step: 'State Machine Intercept', status: 'in_progress', timestamp: '13:42:20', details: 'State set to EXECUTION_UNKNOWN rather than Blind Retry' },
      { step: 'Gateway Verification', status: 'pending', timestamp: '—', details: 'Ready for 1-click status recovery query' },
    ],
  },
  {
    id: 'obs_05',
    orderId: 'order_RVL_9821038',
    paymentId: 'pay_RVL_8834916',
    amount: 349900,
    currency: 'INR',
    state: 'HMAC_FAILURE',
    customerName: 'Karan Patel',
    customerEmail: 'karan.patel@yahoo.com',
    createdAt: new Date(Date.now() - 65 * 60000).toISOString(),
    latencyMs: 95,
    failureReason: 'SECURITY_ALERT: Payload digest does not match secret HMAC (possible tampered webhook)',
    hmacSignature: 'INVALID_SIGNATURE_MISMATCH_EXPECTED_902f',
    idempotencyKey: 'idemp_live_9821038_bad_sig',
    retryAttempts: 0,
    requestId: 'req_razorpay_9821038',
    timeline: [
      { step: 'Webhook Received', status: 'completed', timestamp: '13:17:02', details: 'POST /api/webhooks/razorpay' },
      { step: 'HMAC-SHA256 Verification', status: 'failed', timestamp: '13:17:02', details: 'CRYPTOGRAPHIC VERIFICATION FAILED: Rejected immediately (HTTP 400)' },
      { step: 'Security Logged', status: 'completed', timestamp: '13:17:03', details: 'Incident flagged in security audit trail' },
    ],
  },
  {
    id: 'obs_06',
    orderId: 'order_RVL_9821039',
    paymentId: 'pay_RVL_8834912',
    amount: 449900,
    currency: 'INR',
    state: 'IDEMPOTENCY_DUPLICATE',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@gmail.com',
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    latencyMs: 18,
    idempotencyKey: 'idemp_live_9821034_capture',
    retryAttempts: 0,
    requestId: 'req_razorpay_9821039_replay',
    timeline: [
      { step: 'Webhook Received', status: 'completed', timestamp: '14:21:12', details: 'Razorpay delivery retry received' },
      { step: 'Idempotency Check', status: 'failed', timestamp: '14:21:12', details: 'DUPLICATE EVENT: Key idemp_live_9821034_capture already processed' },
      { step: 'Zero-Action Acknowledged', status: 'completed', timestamp: '14:21:12', details: 'Returned HTTP 200 without duplicate database mutation' },
    ],
  },
  {
    id: 'obs_07',
    orderId: 'order_RVL_9821040',
    paymentId: 'pay_RVL_8834918',
    amount: 549900,
    currency: 'INR',
    state: 'RECOVERY',
    customerName: 'Rahul Verma',
    customerEmail: 'rahul.v@gmail.com',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    latencyMs: 240,
    idempotencyKey: 'idemp_live_9821040_rec',
    retryAttempts: 2,
    recoveryState: 'RECOVERY IN PROGRESS: Attempt 2 of 3; gateway status polled',
    requestId: 'req_razorpay_9821040',
    timeline: [
      { step: 'Order Created', status: 'completed', timestamp: '14:18:00', details: 'Order for ₹5,499' },
      { step: 'Gateway Disconnect', status: 'failed', timestamp: '14:18:15', details: 'Packet loss during bank redirect' },
      { step: 'Recovery Triggered', status: 'in_progress', timestamp: '14:18:45', details: 'Exponential backoff poll: Querying Razorpay order status' },
      { step: 'Pending Confirmation', status: 'pending', timestamp: '—', details: 'Will resolve to SUCCESS upon bank acknowledgement' },
    ],
  },
];

export default function PaymentObservabilityPage() {
  const [events, setEvents] = useState<ObservabilityEvent[]>(PRESET_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<ObservabilityEvent>(PRESET_EVENTS[0]);
  const [filterState, setFilterState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { success, error, info } = useToast();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRecover = async (event: ObservabilityEvent) => {
    setIsRecovering(true);
    info('Reconciling Payment', `Querying Razorpay gateway for ${event.orderId}...`);
    try {
      // Simulate real recovery resolving EXECUTION_UNKNOWN
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const updated = events.map((ev) => {
        if (ev.id === event.id) {
          return {
            ...ev,
            state: 'SUCCESS' as PaymentState,
            timeline: [
              ...ev.timeline.slice(0, 3),
              { step: 'Gateway Polled', status: 'completed' as const, timestamp: 'Just now', details: 'Resolved via Razorpay GET /v1/orders/[id]' },
              { step: 'Payment Confirmed', status: 'completed' as const, timestamp: 'Just now', details: 'Order marked PAID: status resolved safely' },
            ],
          };
        }
        return ev;
      });

      setEvents(updated);
      setSelectedEvent((prev) => (prev.id === event.id ? { ...prev, state: 'SUCCESS' } : prev));
      success('Recovery Successful', `Order ${event.orderId} successfully resolved and verified.`);
    } catch {
      error('Recovery Error', 'Failed to recover payment state');
    } finally {
      setIsRecovering(false);
    }
  };

  const filteredEvents = events.filter((ev) => {
    const matchesFilter = filterState === 'ALL' || ev.state === filterState;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      ev.orderId.toLowerCase().includes(q) ||
      (ev.paymentId && ev.paymentId.toLowerCase().includes(q)) ||
      ev.customerName.toLowerCase().includes(q) ||
      ev.idempotencyKey.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const getStateBadge = (state: PaymentState) => {
    switch (state) {
      case 'SUCCESS':
        return <span className="badge badge-success text-[0.625rem]">SUCCESS ✓</span>;
      case 'FAILURE':
        return <span className="badge badge-error text-[0.625rem]">FAILED ✗</span>;
      case 'DELAYED_WEBHOOK':
        return <span className="badge badge-warning text-[0.625rem]">DELAYED WEBHOOK</span>;
      case 'EXECUTION_UNKNOWN':
        return <span className="badge badge-warning text-[0.625rem] bg-amber-950/40 text-amber-300 border-amber-500/40">EXECUTION UNKNOWN</span>;
      case 'HMAC_FAILURE':
        return <span className="badge badge-error text-[0.625rem]">VERIFICATION FAILED</span>;
      case 'IDEMPOTENCY_DUPLICATE':
        return <span className="badge badge-neutral text-[0.625rem]">DUPLICATE EVENT</span>;
      case 'RECOVERY':
        return <span className="badge badge-ai text-[0.625rem]">RECOVERY IN PROGRESS</span>;
    }
  };

  return (
    <div className="relative">
      <FloatingCommerceObjects intensity="transactions" />

      {/* ── Page Header ────────────────────────────────────── */}
      <PageHeader
        badgeText="FINTECH OBSERVABILITY • RAZORPAY TEST MODE"
        badgeVariant="success"
        badgeIcon={<Activity size={12} />}
        title="Payment"
        italicAccent="Observability"
        description="Trace every payment from order creation to cryptographic verification. Complete visibility into webhook latency, idempotency protection, and automated failure recovery."
        actions={
          <div className="flex items-center gap-2">
            <span className="badge badge-fintech text-[0.6875rem] py-1 px-2.5">
              <ShieldCheck size={12} className="mr-1" /> HMAC-SHA256 Strict
            </span>
          </div>
        }
      />

      {/* ── 3-Column Observability Architecture ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── Column 1: Payment Event Stream (4 cols) ─────────── */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Stream Controls */}
          <div className="card p-3 bg-[var(--bg-secondary)] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs font-bold text-[var(--text-primary)]">
                Payment Stream ({filteredEvents.length})
              </span>
              <span className="text-[0.625rem] text-[var(--text-tertiary)] uppercase font-mono">Live Ingestion</span>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[var(--bg-tertiary)] rounded-[var(--radius-sm)] border border-[var(--border-primary)]">
              <Search size={13} className="text-[var(--text-tertiary)] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Order, Payment, Customer..."
                className="bg-transparent border-none outline-none text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] w-full font-body"
              />
            </div>

            {/* State Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[0.6875rem]">
              {['ALL', 'SUCCESS', 'FAILURE', 'EXECUTION_UNKNOWN', 'HMAC_FAILURE'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterState(st)}
                  className={`px-2 py-0.5 rounded-[var(--radius-sm)] whitespace-nowrap font-mono transition-colors border-none cursor-pointer ${
                    filterState === st
                      ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] font-bold'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white'
                  }`}
                >
                  {st === 'ALL' ? 'ALL' : st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Event Stream List */}
          <div className="flex flex-col gap-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredEvents.map((ev) => {
              const isSelected = selectedEvent.id === ev.id;
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`card p-3 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[var(--bg-tertiary)] border-[#00C076] shadow-sm'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-primary)] hover:border-[var(--text-tertiary)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-[var(--text-primary)] truncate">
                      {ev.orderId}
                    </span>
                    {getStateBadge(ev.state)}
                  </div>

                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-heading font-extrabold text-[var(--text-primary)]">
                      {formatCurrency(ev.amount)}
                    </span>
                    <span className="text-[0.6875rem] text-[var(--text-tertiary)]">
                      {formatDateTime(ev.createdAt).slice(11, 19)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[0.6875rem] text-[var(--text-secondary)] pt-1 border-t border-[var(--border-secondary)]">
                    <span className="truncate">{ev.customerName}</span>
                    <span className="font-mono text-[var(--text-tertiary)]">{ev.latencyMs}ms</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Column 2: Selected Payment Lifecycle Timeline (4 cols) ─ */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="card p-4 bg-[var(--bg-secondary)] h-full flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-secondary)]">
              <div>
                <span className="badge badge-neutral text-[0.625rem] font-mono">LIFECYCLE TIMELINE</span>
                <h3 className="font-heading text-sm font-bold text-[var(--text-primary)] mt-1">
                  {selectedEvent.orderId}
                </h3>
              </div>
              {getStateBadge(selectedEvent.state)}
            </div>

            {/* Special Callouts for Critical States */}
            {selectedEvent.state === 'EXECUTION_UNKNOWN' && (
              <div className="p-3 mb-4 rounded-[var(--radius-md)] bg-amber-950/20 border border-amber-500/40 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
                  <AlertTriangle size={14} /> EXECUTION_UNKNOWN Handled
                </div>
                <p className="text-[0.6875rem] text-amber-200/90 leading-relaxed mb-2.5">
                  Connection timed out before bank response. Rather than blindly charging the customer again, Revolve AI safely halted and flagged for query reconciliation.
                </p>
                <Button
                  variant="fintech"
                  size="sm"
                  onClick={() => handleRecover(selectedEvent)}
                  isLoading={isRecovering}
                  style={{ width: '100%' }}
                >
                  <RotateCcw size={12} /> Recover Status via Razorpay API
                </Button>
              </div>
            )}

            {selectedEvent.state === 'HMAC_FAILURE' && (
              <div className="p-3 mb-4 rounded-[var(--radius-md)] bg-red-950/20 border border-red-500/40 text-xs">
                <div className="flex items-center gap-2 text-red-300 font-bold mb-1">
                  <ShieldAlert size={14} /> Cryptographic Signature Mismatch
                </div>
                <p className="text-[0.6875rem] text-red-200/90 leading-relaxed">
                  Incoming payload signature could not be verified against the merchant webhook secret. Event was intercepted and rejected with HTTP 400.
                </p>
              </div>
            )}

            {selectedEvent.state === 'IDEMPOTENCY_DUPLICATE' && (
              <div className="p-3 mb-4 rounded-[var(--radius-md)] bg-neutral-900 border border-neutral-700 text-xs">
                <div className="flex items-center gap-2 text-neutral-200 font-bold mb-1">
                  <Copy size={14} /> Duplicate Webhook Replay Ignored
                </div>
                <p className="text-[0.6875rem] text-neutral-400 leading-relaxed">
                  Razorpay delivered duplicate notification for an already verified payment. Zero duplicate balance mutations occurred.
                </p>
              </div>
            )}

            {selectedEvent.state === 'DELAYED_WEBHOOK' && (
              <div className="p-3 mb-4 rounded-[var(--radius-md)] bg-amber-950/20 border border-amber-500/40 text-xs">
                <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
                  <Clock size={14} /> Delayed Webhook (+{selectedEvent.webhookDelaySec}s)
                </div>
                <p className="text-[0.6875rem] text-amber-200/90 leading-relaxed">
                  Webhook took {selectedEvent.webhookDelaySec} seconds to deliver. Client-side optimistic checkout poller successfully reconciled state prior to webhook arrival.
                </p>
              </div>
            )}

            {/* Stepper Timeline */}
            <div className="flex-1 flex flex-col gap-3.5 relative pl-4 border-l-2 border-[var(--border-primary)] ml-2">
              {selectedEvent.timeline.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Step Dot */}
                  <div
                    className={`absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--bg-secondary)] flex items-center justify-center ${
                      item.status === 'completed'
                        ? 'bg-[#00C076]'
                        : item.status === 'failed'
                        ? 'bg-red-500'
                        : item.status === 'in_progress'
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-[var(--text-tertiary)]'
                    }`}
                  />
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold ${
                        item.status === 'completed'
                          ? 'text-[var(--text-primary)]'
                          : item.status === 'failed'
                          ? 'text-red-400'
                          : item.status === 'in_progress'
                          ? 'text-amber-300'
                          : 'text-[var(--text-tertiary)]'
                      }`}>
                        {item.step}
                      </span>
                      <span className="font-mono text-[0.625rem] text-[var(--text-tertiary)]">{item.timestamp}</span>
                    </div>
                    {item.details && (
                      <p className="text-[0.6875rem] text-[var(--text-secondary)] mt-0.5 leading-tight">
                        {item.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Column 3: Payment Detail Inspector (4 cols) ─────── */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="card p-4 bg-[var(--bg-secondary)] h-full flex flex-col gap-4 overflow-y-auto max-h-[700px]">
            <div className="pb-3 border-b border-[var(--border-secondary)]">
              <span className="text-[0.625rem] uppercase font-bold tracking-wider text-[var(--text-tertiary)]">
                Detail Inspector
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-heading text-base font-extrabold text-[var(--text-primary)]">
                  {formatCurrency(selectedEvent.amount)}
                </span>
                <span className="font-mono text-xs text-[var(--text-secondary)]">
                  INR · Test Mode
                </span>
              </div>
            </div>

            {/* Section 1: Payment Identifiers */}
            <div>
              <div className="text-[0.625rem] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5">
                1. Payment Identifiers
              </div>
              <div className="p-2.5 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)] flex flex-col gap-2 text-xs">
                <div>
                  <span className="text-[0.625rem] text-[var(--text-tertiary)]">Razorpay Order ID</span>
                  <div className="flex items-center justify-between font-mono text-[0.6875rem] text-[var(--text-primary)] mt-0.5">
                    <span className="truncate">{selectedEvent.orderId}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedEvent.orderId, 'ord')}
                      className="p-1 text-[var(--text-tertiary)] hover:text-white bg-transparent border-none cursor-pointer"
                    >
                      {copiedId === 'ord' ? <Check size={11} className="text-[#00C076]" /> : <Copy size={11} />}
                    </button>
                  </div>
                </div>

                {selectedEvent.paymentId && (
                  <div>
                    <span className="text-[0.625rem] text-[var(--text-tertiary)]">Payment ID</span>
                    <div className="flex items-center justify-between font-mono text-[0.6875rem] text-[var(--text-primary)] mt-0.5">
                      <span className="truncate">{selectedEvent.paymentId}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedEvent.paymentId!, 'pay')}
                        className="p-1 text-[var(--text-tertiary)] hover:text-white bg-transparent border-none cursor-pointer"
                      >
                        {copiedId === 'pay' ? <Check size={11} className="text-[#00C076]" /> : <Copy size={11} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Security & Cryptography */}
            <div>
              <div className="text-[0.625rem] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5 flex items-center justify-between">
                <span>2. Security &amp; Cryptography</span>
                <Lock size={10} />
              </div>
              <div className="p-2.5 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)] flex flex-col gap-2 text-xs">
                <div>
                  <span className="text-[0.625rem] text-[var(--text-tertiary)]">HMAC-SHA256 Signature</span>
                  <div className="font-mono text-[0.625rem] text-[var(--text-secondary)] word-break break-all mt-0.5 bg-[var(--bg-secondary)] p-1.5 rounded-[var(--radius-sm)]">
                    {selectedEvent.hmacSignature || 'HMAC_VERIFIED_ON_INGESTION'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[0.6875rem] pt-1">
                  <span className="text-[var(--text-secondary)]">Verification Engine</span>
                  <span className="font-mono text-[#00C076] font-bold">SHA256 Digest ✓</span>
                </div>
              </div>
            </div>

            {/* Section 3: Reliability & Idempotency */}
            <div>
              <div className="text-[0.625rem] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5 flex items-center justify-between">
                <span>3. Reliability &amp; Idempotency</span>
                <Key size={10} />
              </div>
              <div className="p-2.5 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)] flex flex-col gap-1.5 text-xs">
                <div>
                  <span className="text-[0.625rem] text-[var(--text-tertiary)]">Idempotency Key</span>
                  <div className="font-mono text-[0.6875rem] text-[var(--text-primary)] truncate mt-0.5">
                    {selectedEvent.idempotencyKey}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[0.6875rem] pt-1 border-t border-[var(--border-secondary)]">
                  <span className="text-[var(--text-secondary)]">Duplicate Detection</span>
                  <span className="font-mono text-[#00C076] font-semibold">Enabled</span>
                </div>

                <div className="flex items-center justify-between text-[0.6875rem]">
                  <span className="text-[var(--text-secondary)]">Retry Counter</span>
                  <span className="font-mono text-[var(--text-primary)]">{selectedEvent.retryAttempts} attempts</span>
                </div>
              </div>
            </div>

            {/* Section 4: Audit Trace */}
            <div>
              <div className="text-[0.625rem] font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5">
                4. Immutable Audit Trace
              </div>
              <div className="p-2.5 bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] border border-[var(--border-primary)] flex flex-col gap-1.5 text-xs font-mono">
                <div>
                  <span className="text-[0.625rem] text-[var(--text-tertiary)] font-sans">Request ID</span>
                  <div className="text-[0.6875rem] text-[var(--text-primary)] truncate">{selectedEvent.requestId}</div>
                </div>

                {selectedEvent.ledgerHash && (
                  <div>
                    <span className="text-[0.625rem] text-[var(--text-tertiary)] font-sans">Ledger Hash</span>
                    <div className="text-[0.5625rem] text-[#6EE7B7] break-all">{selectedEvent.ledgerHash}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
