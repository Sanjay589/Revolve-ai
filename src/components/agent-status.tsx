'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { ShieldCheck, Activity, CheckCircle2 } from 'lucide-react';

export interface AgentStatusProps {
  online?: boolean;
}

export const AgentStatus: React.FC<AgentStatusProps> = ({ online = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn btn-ghost btn-sm"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 10px',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: 500,
        }}
      >
        <span className="ai-pulse" />
        <span>{online ? 'Agent Online' : 'Agent Offline'}</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Autonomous AI Agent Status"
        description="Revolve AI real-time engine status & guardrails"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="var(--success)" />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Opportunity Engine Active</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Continuously analyzing products, purchase frequency & checkout co-occurrences.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--ai-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="var(--ai-primary)" />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Policy Guardrails Enforced</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Max ₹10,000 / transaction • Human approval required for all campaigns & automated workflows.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} color="var(--info)" />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Razorpay Test Mode Connected</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Cryptographic HMAC signature verification & webhook idempotency active.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
