'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const HeroDataGrid: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // Grid node definitions representing Revolve AI's autonomous pipeline
  const nodes = [
    { id: 'node-catalog', x: 220, y: 140, label: 'CATALOG_SYNC', color: '#00C076' },
    { id: 'node-policy', x: 600, y: 80, label: 'POLICY_GATE', color: '#818CF8' },
    { id: 'node-ledger', x: 980, y: 160, label: 'HMAC_LEDGER', color: '#00C076' },
    { id: 'node-aux-1', x: 380, y: 260, label: '', color: '#FFFFFF' },
    { id: 'node-aux-2', x: 820, y: 280, label: '', color: '#FFFFFF' },
  ];

  // Pipeline connector paths
  const connectorPath1 = 'M 220 140 L 600 80';
  const connectorPath2 = 'M 600 80 L 980 160';
  const connectorPath3 = 'M 380 260 L 600 80 L 820 280';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {/* Subtle radial dark ambient gradient for lighting depth */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[520px] opacity-30"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(0, 192, 118, 0.09) 0%, rgba(99, 102, 241, 0.05) 35%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* SVG Responsive Grid System with Smooth Radial Fade Mask */}
      <svg
        className="w-full h-full min-h-[580px] max-h-[760px] opacity-90"
        viewBox="0 0 1200 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          {/* Radial mask that softly feathers the grid lines out toward the edges & bottom */}
          <radialGradient id="hero-grid-fade" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* Grid pattern with ~4% white opacity lines (1px) */}
          <pattern
            id="hero-grid-pattern"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* 1. Animated Grid Fill */}
        <motion.rect
          width="100%"
          height="100%"
          fill="url(#hero-grid-pattern)"
          mask="url(#hero-grid-fade)"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: 'top center' }}
        />

        {/* 2. Pipeline Connector Lines (Draw-in on load, ~15-20% white opacity) */}
        <g mask="url(#hero-grid-fade)">
          {/* Path 1: Catalog -> Policy */}
          <motion.path
            d={connectorPath1}
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth="1"
            strokeDasharray="4 4"
            fill="none"
            initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.8, delay: 0.4, ease: 'easeOut' }}
          />

          {/* Path 2: Policy -> Razorpay Ledger */}
          <motion.path
            d={connectorPath2}
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth="1"
            strokeDasharray="4 4"
            fill="none"
            initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.8, delay: 0.6, ease: 'easeOut' }}
          />

          {/* Path 3: Auxiliary telemetry branch */}
          <motion.path
            d={connectorPath3}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
            strokeDasharray="2 4"
            fill="none"
            initial={shouldReduceMotion ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2.2, delay: 0.7, ease: 'easeOut' }}
          />
        </g>

        {/* 3. Grid Intersection Plus / Cross Markers */}
        <g mask="url(#hero-grid-fade)">
          {[
            { x: 160, y: 80 },
            { x: 320, y: 80 },
            { x: 480, y: 80 },
            { x: 720, y: 80 },
            { x: 880, y: 80 },
            { x: 1040, y: 80 },
            { x: 240, y: 160 },
            { x: 400, y: 160 },
            { x: 560, y: 160 },
            { x: 720, y: 160 },
            { x: 880, y: 160 },
            { x: 160, y: 240 },
            { x: 480, y: 240 },
            { x: 720, y: 240 },
            { x: 1040, y: 240 },
          ].map((pt, i) => (
            <motion.g
              key={`cross-${i}`}
              initial={shouldReduceMotion ? { opacity: 0.25 } : { opacity: 0 }}
              animate={{ opacity: [0.15, 0.35, 0.15] }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 3.5,
                      repeat: Infinity,
                      delay: (i % 5) * 0.4,
                      ease: 'easeInOut',
                    }
              }
            >
              {/* Subtle cross / plus mark 8px */}
              <line
                x1={pt.x - 4}
                y1={pt.y}
                x2={pt.x + 4}
                y2={pt.y}
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1"
              />
              <line
                x1={pt.x}
                y1={pt.y - 4}
                x2={pt.x}
                y2={pt.y + 4}
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1"
              />
            </motion.g>
          ))}
        </g>

        {/* 4. Active Pipeline Node Points with Subtle Breathing Glow */}
        <g mask="url(#hero-grid-fade)">
          {nodes.map((node, i) => (
            <g key={node.id}>
              {/* Subtle ambient pulse ring */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="7"
                fill="none"
                stroke={node.color}
                initial={shouldReduceMotion ? { opacity: 0.2, scale: 1 } : { opacity: 0, scale: 0.8 }}
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.2 }
                    : {
                        opacity: [0.1, 0.35, 0.1],
                        scale: [1, 1.25, 1],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 3.2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: 'easeInOut',
                      }
                }
              />

              {/* Core node dot */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="2.5"
                fill={node.color}
                initial={shouldReduceMotion ? { opacity: 0.6 } : { opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.2 }}
              />

              {/* Faint technical label if present */}
              {node.label && (
                <motion.text
                  x={node.x}
                  y={node.y + 16}
                  textAnchor="middle"
                  fill="rgba(255, 255, 255, 0.28)"
                  fontSize="8"
                  fontFamily="var(--font-mono, monospace)"
                  letterSpacing="0.08em"
                  initial={shouldReduceMotion ? { opacity: 0.4 } : { opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ duration: 1, delay: 0.8 + i * 0.2 }}
                >
                  {node.label}
                </motion.text>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
