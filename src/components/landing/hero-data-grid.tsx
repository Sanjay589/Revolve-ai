'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const HeroDataGrid: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // 6 nodes positioned in the outer lateral flanks framing the headline and CTAs
  const nodes = [
    {
      id: 'node-catalog',
      x: 100,
      y: 150,
      label: 'CATALOG_SYNC',
      badgeWidth: 94,
      color: '#00C076',
    },
    {
      id: 'node-affinity',
      x: 80,
      y: 330,
      label: 'AFFINITY_SCAN',
      badgeWidth: 92,
      color: '#818CF8',
    },
    {
      id: 'node-stream',
      x: 100,
      y: 500,
      label: 'BASKET_STREAM',
      badgeWidth: 96,
      color: '#00C076',
    },
    {
      id: 'node-policy-gate',
      x: 1340,
      y: 150,
      label: 'POLICY_GATE',
      badgeWidth: 88,
      color: '#818CF8',
    },
    {
      id: 'node-ledger',
      x: 1360,
      y: 330,
      label: 'HMAC_LEDGER',
      badgeWidth: 90,
      color: '#00C076',
    },
    {
      id: 'node-recovery',
      x: 1340,
      y: 500,
      label: 'EXEC_RECOVERY',
      badgeWidth: 96,
      color: '#F59E0B',
    },
  ];

  // Pipeline connector paths framing the hero
  const connectorArch = 'M 100 150 L 260 65 L 1180 65 L 1340 150';
  const connectorLeftCol = 'M 100 150 L 80 330 L 100 500';
  const connectorRightCol = 'M 1340 150 L 1360 330 L 1340 500';
  const connectorDiagonalLeft = 'M 100 500 L 260 65';
  const connectorDiagonalRight = 'M 1340 500 L 1180 65';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {/* Subtle radial dark ambient gradient for lighting depth */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[650px] opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 25%, rgba(0, 192, 118, 0.14) 0%, rgba(99, 102, 241, 0.08) 45%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* SVG Responsive Grid System calibrated for 1440x680 */}
      <svg
        className="w-full h-full min-h-[580px] max-h-[760px]"
        viewBox="0 0 1440 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMin meet"
      >
        <defs>
          {/* Radial mask specifically for the background grid pattern */}
          <radialGradient id="hero-grid-fade" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* Grid pattern with ~5% white opacity lines (1px) */}
          <pattern
            id="hero-grid-pattern"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* 1. Subtle Background Grid Texture (Gently faded at edges) */}
        <rect
          width="100%"
          height="100%"
          fill="url(#hero-grid-pattern)"
          mask="url(#hero-grid-fade)"
        />

        {/* 2. Grid Intersection Cross Markers (~25-28% white opacity, 10px size) */}
        <g>
          {[
            { x: 140, y: 260 },
            { x: 300, y: 140 },
            { x: 300, y: 340 },
            { x: 1140, y: 140 },
            { x: 1140, y: 340 },
            { x: 1300, y: 260 },
            { x: 220, y: 48 },
            { x: 1220, y: 48 },
            { x: 80, y: 460 },
            { x: 1360, y: 460 },
          ].map((pt, i) => (
            <g key={`cross-${i}`} opacity="0.28">
              <line
                x1={pt.x - 5}
                y1={pt.y}
                x2={pt.x + 5}
                y2={pt.y}
                stroke="#FFFFFF"
                strokeWidth="1"
              />
              <line
                x1={pt.x}
                y1={pt.y - 5}
                x2={pt.x}
                y2={pt.y + 5}
                stroke="#FFFFFF"
                strokeWidth="1"
              />
            </g>
          ))}
        </g>

        {/* 3. Pipeline Connector Lines (Desktop only >= 1280px) */}
        <g className="hidden xl:inline">
          {/* Main Top Architectural Arch */}
          <path
            d={connectorArch}
            stroke="rgba(255, 255, 255, 0.24)"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            fill="none"
          />

          {/* Animated Light Packet flowing through the Arch */}
          <motion.path
            d={connectorArch}
            stroke="#00C076"
            strokeWidth="2"
            strokeDasharray="30 320"
            fill="none"
            initial={shouldReduceMotion ? false : { strokeDashoffset: 500 }}
            animate={shouldReduceMotion ? false : { strokeDashoffset: -500 }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            opacity="0.65"
          />

          {/* Left Column Feed */}
          <path
            d={connectorLeftCol}
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            fill="none"
          />
          <motion.path
            d={connectorLeftCol}
            stroke="#818CF8"
            strokeWidth="2"
            strokeDasharray="25 180"
            fill="none"
            initial={shouldReduceMotion ? false : { strokeDashoffset: 300 }}
            animate={shouldReduceMotion ? false : { strokeDashoffset: -300 }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.5,
            }}
            opacity="0.6"
          />

          {/* Right Column Feed */}
          <path
            d={connectorRightCol}
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            fill="none"
          />
          <motion.path
            d={connectorRightCol}
            stroke="#00C076"
            strokeWidth="2"
            strokeDasharray="25 180"
            fill="none"
            initial={shouldReduceMotion ? false : { strokeDashoffset: 300 }}
            animate={shouldReduceMotion ? false : { strokeDashoffset: -300 }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'linear',
              delay: 1.2,
            }}
            opacity="0.6"
          />

          {/* Diagonal Bracing Conduits */}
          <path
            d={connectorDiagonalLeft}
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            fill="none"
          />
          <path
            d={connectorDiagonalRight}
            stroke="rgba(255, 255, 255, 0.16)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            fill="none"
          />
        </g>

        {/* 4. Active Pipeline Node Markers & High-Contrast Labels (~25-35% opacity + crisp text, desktop xl+ only) */}
        <g className="hidden xl:inline">
          {nodes.map((node, i) => (
            <g key={node.id}>
              {/* Outer Pulse Ring (~11px radius, ~22px diameter, ~25-35% opacity) */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="11"
                fill="none"
                stroke={node.color}
                strokeWidth="1.5"
                initial={shouldReduceMotion ? { opacity: 0.35, scale: 1 } : { opacity: 0.25, scale: 0.95 }}
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.35 }
                    : {
                        opacity: [0.25, 0.55, 0.25],
                        scale: [1, 1.25, 1],
                      }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 3.2,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: 'easeInOut',
                      }
                }
              />

              {/* Middle Concentric Ring (~6.5px radius) */}
              <circle
                cx={node.x}
                cy={node.y}
                r="6.5"
                fill="none"
                stroke={node.color}
                strokeWidth="1"
                opacity="0.5"
              />

              {/* Core Node Solid Dot (~3.5px radius, 7px diameter) */}
              <circle
                cx={node.x}
                cy={node.y}
                r="3.5"
                fill={node.color}
                opacity="0.95"
              />

              {/* Inner High-Contrast White Pip */}
              <circle
                cx={node.x}
                cy={node.y}
                r="1.2"
                fill="#FFFFFF"
                opacity="1"
              />

              {/* High-Contrast Node Label with Dark Pill Backdrop */}
              {node.label && (
                <g>
                  {/* Subtle Dark Pill Background to ensure 100% legibility */}
                  <rect
                    x={node.x - node.badgeWidth / 2}
                    y={node.y + 16}
                    width={node.badgeWidth}
                    height="18"
                    rx="4"
                    fill="#0A0A0A"
                    stroke="rgba(255, 255, 255, 0.18)"
                    strokeWidth="1"
                    opacity="0.95"
                  />

                  {/* Colored status dot inside pill */}
                  <circle
                    cx={node.x - node.badgeWidth / 2 + 8}
                    cy={node.y + 25}
                    r="2"
                    fill={node.color}
                  />

                  {/* Sharp, Legible Monospaced Label */}
                  <text
                    x={node.x + 3}
                    y={node.y + 28.5}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fillOpacity="0.9"
                    fontSize="8.5"
                    fontWeight="600"
                    fontFamily="var(--font-mono, monospace)"
                    letterSpacing="0.08em"
                  >
                    {node.label}
                  </text>
                </g>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
