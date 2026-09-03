'use client';

import React, { useMemo } from 'react';

export type MotionIntensity = 'landing' | 'overview' | 'ai' | 'approvals' | 'transactions' | 'minimal';

interface FloatingObjectSpec {
  id: string;
  type: 'rupee' | 'note' | 'coin' | 'card' | 'percent' | 'arrow' | 'receipt' | 'sparkle';
  left: string;
  top: string;
  depth: 'back' | 'mid' | 'front';
  animationClass: string;
  animationDelay: string;
  text?: string;
  rotation?: string;
}

const SPEC_TEMPLATES: Record<MotionIntensity, FloatingObjectSpec[]> = {
  landing: [
    // Reference Image Layer 2: Back Layer (Small notes, low opacity)
    { id: 'l_note_back1', type: 'note', left: '10%', top: '8%', depth: 'back', animationClass: 'anim-float-1', animationDelay: '0s', text: '₹2000', rotation: '-12deg' },
    { id: 'l_note_back2', type: 'note', left: '84%', top: '12%', depth: 'back', animationClass: 'anim-float-3', animationDelay: '2.5s', text: '₹500', rotation: '15deg' },
    { id: 'l_note_back3', type: 'note', left: '46%', top: '5%', depth: 'back', animationClass: 'anim-float-2', animationDelay: '4s', text: '₹2000', rotation: '-6deg' },

    // Reference Image Layer 3: Mid Layer (Medium notes & tokens, multi-directional drift)
    { id: 'l_note_mid1', type: 'note', left: '4%', top: '48%', depth: 'mid', animationClass: 'anim-float-2', animationDelay: '1.2s', text: '₹2000', rotation: '18deg' },
    { id: 'l_note_mid2', type: 'note', left: '90%', top: '42%', depth: 'mid', animationClass: 'anim-float-4', animationDelay: '3.2s', text: '₹2000', rotation: '-14deg' },
    { id: 'l1', type: 'rupee', left: '8%', top: '24%', depth: 'mid', animationClass: 'anim-float-1', animationDelay: '0.5s', text: '₹' },
    { id: 'l4', type: 'percent', left: '88%', top: '28%', depth: 'mid', animationClass: 'anim-float-4', animationDelay: '2s', text: '+24.8%' },
    { id: 'l5', type: 'coin', left: '6%', top: '78%', depth: 'mid', animationClass: 'anim-float-2', animationDelay: '4s' },

    // Reference Image Layer 4: Foreground Layer (Slightly larger notes, soft blur/depth)
    { id: 'l_note_front1', type: 'note', left: '82%', top: '72%', depth: 'front', animationClass: 'anim-float-1', animationDelay: '1.8s', text: '₹2000', rotation: '10deg' },
    { id: 'l_note_front2', type: 'note', left: '14%', top: '86%', depth: 'front', animationClass: 'anim-float-3', animationDelay: '0.8s', text: '₹500', rotation: '-8deg' },
    { id: 'l8', type: 'arrow', left: '76%', top: '88%', depth: 'mid', animationClass: 'anim-float-4', animationDelay: '1.2s', text: '↗' },

    // Reference Image Layer 5: Particles & Sparkle nodes
    { id: 'l9', type: 'sparkle', left: '22%', top: '16%', depth: 'back', animationClass: 'anim-float-1', animationDelay: '3.5s' },
    { id: 'l10', type: 'sparkle', left: '72%', top: '18%', depth: 'back', animationClass: 'anim-float-3', animationDelay: '2.2s' },
    { id: 'l11', type: 'sparkle', left: '50%', top: '92%', depth: 'back', animationClass: 'anim-float-2', animationDelay: '5s' },
  ],
  overview: [
    // Reference Image Inspired Banknotes & Floating Revenue Tokens
    { id: 'o_note_1', type: 'note', left: '3%', top: '12%', depth: 'mid', animationClass: 'anim-float-1', animationDelay: '0s', text: '₹2000', rotation: '-10deg' },
    { id: 'o_note_2', type: 'note', left: '92%', top: '15%', depth: 'mid', animationClass: 'anim-float-2', animationDelay: '1.5s', text: '₹2000', rotation: '14deg' },
    { id: 'o_note_3', type: 'note', left: '94%', top: '62%', depth: 'back', animationClass: 'anim-float-3', animationDelay: '3s', text: '₹500', rotation: '-8deg' },
    { id: 'o_note_4', type: 'note', left: '2%', top: '70%', depth: 'back', animationClass: 'anim-float-4', animationDelay: '2s', text: '₹2000', rotation: '12deg' },
    { id: 'o2', type: 'percent', left: '88%', top: '38%', depth: 'mid', animationClass: 'anim-float-2', animationDelay: '1.8s', text: '+24.8%' },
    { id: 'o5', type: 'coin', left: '8%', top: '90%', depth: 'back', animationClass: 'anim-float-2', animationDelay: '4.5s' },
    { id: 'o6', type: 'rupee', left: '90%', top: '88%', depth: 'mid', animationClass: 'anim-float-1', animationDelay: '1s', text: '₹' },
    { id: 'o7', type: 'sparkle', left: '5%', top: '42%', depth: 'back', animationClass: 'anim-float-3', animationDelay: '2.8s' },
  ],
  ai: [
    { id: 'a_note_1', type: 'note', left: '4%', top: '18%', depth: 'mid', animationClass: 'anim-float-1', animationDelay: '0s', text: '₹2000', rotation: '-8deg' },
    { id: 'a2', type: 'percent', left: '91%', top: '20%', depth: 'mid', animationClass: 'anim-float-2', animationDelay: '1s', text: 'AI ROI' },
    { id: 'a3', type: 'rupee', left: '95%', top: '55%', depth: 'back', animationClass: 'anim-float-3', animationDelay: '2.5s', text: '₹' },
    { id: 'a4', type: 'arrow', left: '3%', top: '58%', depth: 'back', animationClass: 'anim-float-4', animationDelay: '3s', text: '↗' },
    { id: 'a_note_2', type: 'note', left: '92%', top: '80%', depth: 'back', animationClass: 'anim-float-2', animationDelay: '4s', text: '₹500', rotation: '16deg' },
    { id: 'a6', type: 'sparkle', left: '89%', top: '45%', depth: 'mid', animationClass: 'anim-float-1', animationDelay: '1.8s' },
  ],
  approvals: [
    { id: 'ap_note_1', type: 'note', left: '3%', top: '22%', depth: 'back', animationClass: 'anim-float-1', animationDelay: '0s', text: '₹2000', rotation: '-12deg' },
    { id: 'ap2', type: 'card', left: '93%', top: '28%', depth: 'back', animationClass: 'anim-float-2', animationDelay: '2s' },
    { id: 'ap3', type: 'sparkle', left: '94%', top: '75%', depth: 'back', animationClass: 'anim-float-3', animationDelay: '4s' },
    { id: 'ap4', type: 'arrow', left: '3%', top: '78%', depth: 'back', animationClass: 'anim-float-4', animationDelay: '1s', text: '↗' },
  ],
  transactions: [
    { id: 't_note_1', type: 'note', left: '2%', top: '18%', depth: 'back', animationClass: 'anim-float-1', animationDelay: '0s', text: '₹2000', rotation: '-10deg' },
    { id: 't2', type: 'receipt', left: '94%', top: '28%', depth: 'back', animationClass: 'anim-float-3', animationDelay: '2s' },
    { id: 't3', type: 'coin', left: '2%', top: '72%', depth: 'back', animationClass: 'anim-float-2', animationDelay: '3.5s' },
    { id: 't4', type: 'arrow', left: '93%', top: '80%', depth: 'back', animationClass: 'anim-float-4', animationDelay: '1.5s', text: '↗' },
  ],
  minimal: [
    { id: 'm1', type: 'rupee', left: '4%', top: '30%', depth: 'back', animationClass: 'anim-float-1', animationDelay: '0s', text: '₹' },
    { id: 'm2', type: 'sparkle', left: '93%', top: '65%', depth: 'back', animationClass: 'anim-float-3', animationDelay: '2s' },
  ],
};

const DEPTH_STYLES = {
  back: {
    opacity: 0.18,
    filter: 'blur(0.5px)',
    scale: 0.75,
  },
  mid: {
    opacity: 0.32,
    filter: 'none',
    scale: 1,
  },
  front: {
    opacity: 0.48,
    filter: 'none',
    scale: 1.2,
  },
};

export const FloatingCommerceObjects: React.FC<{
  intensity?: MotionIntensity;
  className?: string;
}> = ({ intensity = 'overview', className = '' }) => {
  const specs = useMemo(() => SPEC_TEMPLATES[intensity] || SPEC_TEMPLATES.overview, [intensity]);

  return (
    <div
      className={`floating-commerce-wrapper select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Reference Image Layer 1: Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '75%',
          height: '420px',
          background: 'radial-gradient(circle at 50% 40%, rgba(168, 85, 247, 0.09) 0%, rgba(99, 102, 241, 0.05) 45%, transparent 75%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      {specs.map((item) => {
        const depth = DEPTH_STYLES[item.depth];

        return (
          <div
            key={item.id}
            className={`absolute ${item.animationClass}`}
            style={{
              left: item.left,
              top: item.top,
              animationDelay: item.animationDelay,
              opacity: depth.opacity,
              transform: `scale(${depth.scale}) ${item.rotation ? `rotate(${item.rotation})` : ''}`,
              filter: depth.filter,
              transition: 'opacity 0.4s ease',
            }}
          >
            {/* 1. Translucent Indian Banknote Silhouette (from Reference Image) */}
            {item.type === 'note' && (
              <div
                style={{
                  width: 96,
                  height: 52,
                  borderRadius: 5,
                  background: 'linear-gradient(135deg, rgba(216, 180, 254, 0.35) 0%, rgba(243, 232, 255, 0.20) 45%, rgba(192, 132, 252, 0.32) 100%)',
                  border: '1px solid rgba(168, 85, 247, 0.45)',
                  boxShadow: '0 4px 18px rgba(168, 85, 247, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.4)',
                  padding: '4px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Micro lathe-work decorative border frame */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 2,
                    border: '0.75px dashed rgba(168, 85, 247, 0.35)',
                    borderRadius: 3,
                    pointerEvents: 'none',
                  }}
                />

                {/* Top denomination & strip */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      color: 'rgba(126, 34, 206, 0.9)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {item.text || '₹2000'}
                  </span>
                  <div style={{ width: 14, height: 1.5, background: 'rgba(168, 85, 247, 0.4)', borderRadius: 1 }} />
                </div>

                {/* Center watermark circle and emblem line */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: '1px solid rgba(168, 85, 247, 0.35)',
                      background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 80%)',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-end' }}>
                    <div style={{ width: 28, height: 1.5, background: 'rgba(126, 34, 206, 0.25)', borderRadius: 1 }} />
                    <div style={{ width: 18, height: 1, background: 'rgba(126, 34, 206, 0.2)', borderRadius: 1 }} />
                  </div>
                </div>

                {/* Bottom value numeral */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', zIndex: 1 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.5625rem',
                      fontWeight: 700,
                      color: 'rgba(126, 34, 206, 0.75)',
                    }}
                  >
                    RESERVE BANK
                  </span>
                </div>
              </div>
            )}

            {/* 2. Rupee Glyphs */}
            {item.type === 'rupee' && (
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.14) 0%, rgba(99, 102, 241, 0.12) 100%)',
                  border: '1px solid rgba(5, 150, 105, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--fintech-primary)',
                  fontFamily: 'var(--font-heading)',
                  boxShadow: '0 2px 8px rgba(5, 150, 105, 0.08)',
                }}
              >
                ₹
              </div>
            )}

            {/* 3. Mini Payment Card */}
            {item.type === 'card' && (
              <div
                style={{
                  width: 52,
                  height: 34,
                  borderRadius: 6,
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(255, 255, 255, 0.4) 100%)',
                  padding: '5px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 10px rgba(99, 102, 241, 0.08)',
                }}
              >
                <div style={{ width: 8, height: 6, borderRadius: 2, background: 'rgba(217, 119, 6, 0.6)' }} />
                <div style={{ display: 'flex', gap: 3 }}>
                  <div style={{ width: 14, height: 2, borderRadius: 1, background: 'rgba(99, 102, 241, 0.4)' }} />
                  <div style={{ width: 8, height: 2, borderRadius: 1, background: 'rgba(99, 102, 241, 0.25)' }} />
                </div>
              </div>
            )}

            {/* 4. Currency Coin Token */}
            {item.type === 'coin' && (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '1.5px dashed rgba(5, 150, 105, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: 'rgba(5, 150, 105, 0.16)',
                    border: '1px solid rgba(5, 150, 105, 0.4)',
                  }}
                />
              </div>
            )}

            {/* 5. Percentage ROI Token */}
            {item.type === 'percent' && (
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: 9999,
                  border: '1px solid rgba(168, 85, 247, 0.35)',
                  background: 'rgba(243, 232, 255, 0.4)',
                  boxShadow: '0 2px 8px rgba(168, 85, 247, 0.08)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: 'rgb(126, 34, 206)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.02em',
                }}
              >
                {item.text || '%'}
              </div>
            )}

            {/* 6. Growth Arrow */}
            {item.type === 'arrow' && (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: '1px solid rgba(5, 150, 105, 0.3)',
                  background: 'rgba(5, 150, 105, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9375rem',
                  color: 'var(--fintech-primary)',
                  fontWeight: 800,
                }}
              >
                ↗
              </div>
            )}

            {/* 7. Receipt Silhouette */}
            {item.type === 'receipt' && (
              <div
                style={{
                  width: 36,
                  height: 48,
                  borderRadius: 4,
                  border: '1px solid rgba(100, 116, 139, 0.25)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <div style={{ width: '65%', height: 3, background: 'rgba(100, 116, 139, 0.3)', borderRadius: 1 }} />
                <div style={{ width: '85%', height: 2, background: 'rgba(100, 116, 139, 0.2)', borderRadius: 1 }} />
                <div style={{ width: '40%', height: 2, background: 'rgba(100, 116, 139, 0.2)', borderRadius: 1 }} />
                <div style={{ marginTop: 'auto', width: '100%', height: 1, borderTop: '1px dashed rgba(100, 116, 139, 0.3)' }} />
              </div>
            )}

            {/* 8. Geometric Sparkle / Intelligence Node */}
            {item.type === 'sparkle' && (
              <div
                style={{
                  width: 12,
                  height: 12,
                  transform: 'rotate(45deg)',
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.7) 0%, rgba(99, 102, 241, 0.2) 100%)',
                  borderRadius: 2,
                  boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
