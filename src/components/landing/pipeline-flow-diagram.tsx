'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const PipelineFlowDiagram: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const stages = [
    { num: '01', id: 'INGEST', label: 'Catalog Ingestion', color: '#00C076', x: 70 },
    { num: '02', id: 'MODEL', label: 'Margin Models', color: '#818CF8', x: 310 },
    { num: '03', id: 'SYNTHESIS', label: 'Multi-Model AI', color: '#818CF8', x: 550 },
    { num: '04', id: 'INTERCEPT', label: 'Policy Interception', color: '#F59E0B', x: 790 },
    { num: '05', id: 'HMAC_COMMIT', label: 'Razorpay HMAC', color: '#00C076', x: 1030 },
  ];

  return (
    <div className="w-full mb-10 overflow-hidden">
      {/* Telemetry Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-[#0D0D0D] border border-[#262626] mb-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00C076] animate-pulse" />
          <span className="text-white font-semibold tracking-wider">
            PIPELINE_STATUS: 5/5 GATES ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-4 text-[#888888] hidden sm:flex">
          <span>LATENCY: 180ms</span>
          <span>•</span>
          <span>FAILSAFE: ARMED</span>
          <span>•</span>
          <span className="text-[#00C076]">ZERO-TRUST ENFORCED</span>
        </div>
      </div>

      {/* Responsive Animated Conduit Diagram */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-none">
        <svg
          className="w-full min-w-[700px] h-[72px]"
          viewBox="0 0 1100 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Guide Conduit Line */}
          <line
            x1="70"
            y1="36"
            x2="1030"
            y2="36"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />

          {/* Glowing Animated Packet Traveling across the pipeline */}
          <motion.line
            x1="70"
            y1="36"
            x2="170"
            y2="36"
            stroke="#00C076"
            strokeWidth="2.5"
            initial={shouldReduceMotion ? false : { x1: 70, x2: 170 }}
            animate={shouldReduceMotion ? false : { x1: 930, x2: 1030 }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            opacity="0.8"
          />

          {/* Secondary Reverse Verification Pulse */}
          <motion.line
            x1="1030"
            y1="36"
            x2="950"
            y2="36"
            stroke="#818CF8"
            strokeWidth="2"
            initial={shouldReduceMotion ? false : { x1: 1030, x2: 950 }}
            animate={shouldReduceMotion ? false : { x1: 150, x2: 70 }}
            transition={{
              duration: 4.0,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5,
            }}
            opacity="0.5"
          />

          {/* Stage Junction Nodes */}
          {stages.map((stage, idx) => (
            <g key={stage.id} transform={`translate(${stage.x}, 36)`}>
              {/* Pulsing Outer Aura */}
              <motion.circle
                cx="0"
                cy="0"
                r="16"
                fill="none"
                stroke={stage.color}
                strokeWidth="1"
                initial={shouldReduceMotion ? false : { opacity: 0.2, scale: 0.9 }}
                animate={
                  shouldReduceMotion
                    ? false
                    : {
                        opacity: [0.2, 0.55, 0.2],
                        scale: [1, 1.25, 1],
                      }
                }
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  delay: idx * 0.4,
                  ease: 'easeInOut',
                }}
              />

              {/* Node Background Disc */}
              <circle cx="0" cy="0" r="12" fill="#0A0A0A" stroke="#262626" strokeWidth="1.5" />

              {/* Step Number in Center */}
              <text
                x="0"
                y="3.5"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="9"
                fontWeight="700"
                fontFamily="var(--font-mono, monospace)"
              >
                {stage.num}
              </text>

              {/* Stage Pill Tag */}
              <g transform="translate(0, -22)">
                <rect
                  x="-36"
                  y="-8"
                  width="72"
                  height="16"
                  rx="3"
                  fill="#0D0D0D"
                  stroke="rgba(255, 255, 255, 0.16)"
                  strokeWidth="1"
                />
                <circle cx="-28" cy="0" r="2" fill={stage.color} />
                <text
                  x="-22"
                  y="3"
                  fill="#FFFFFF"
                  fillOpacity="0.9"
                  fontSize="7.5"
                  fontWeight="600"
                  fontFamily="var(--font-mono, monospace)"
                  letterSpacing="0.06em"
                >
                  {stage.id}
                </text>
              </g>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
