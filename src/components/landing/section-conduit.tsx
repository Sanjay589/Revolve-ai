'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface SectionConduitProps {
  label?: string;
  color?: string;
  height?: number;
}

export const SectionConduit: React.FC<SectionConduitProps> = ({
  label = 'DATA_BUS_CONDUIT',
  color = '#00C076',
  height = 96,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="w-full flex flex-col items-center justify-center pointer-events-none select-none my-2"
    >
      <svg
        width="160"
        height={height}
        viewBox={`0 0 160 ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Vertical Guide Line */}
        <line
          x1="80"
          y1="0"
          x2="80"
          y2={height}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Animated Flowing Packet */}
        <motion.line
          x1="80"
          y1="0"
          x2="80"
          y2="28"
          stroke={color}
          strokeWidth="2.5"
          initial={shouldReduceMotion ? false : { y1: 0, y2: 28 }}
          animate={shouldReduceMotion ? false : { y1: height - 28, y2: height }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'linear',
          }}
          opacity="0.85"
        />

        {/* Center Junction Node Marker */}
        <g transform={`translate(80, ${height / 2})`}>
          {/* Outer Ring */}
          <circle
            cx="0"
            cy="0"
            r="10"
            fill="#0A0A0A"
            stroke={color}
            strokeWidth="1.2"
            opacity="0.8"
          />
          {/* Inner Dot */}
          <circle cx="0" cy="0" r="3" fill={color} />

          {/* Junction Badge Pill */}
          {label && (
            <g transform="translate(18, -9)">
              <rect
                x="0"
                y="0"
                width={label.length * 6.5 + 16}
                height="18"
                rx="4"
                fill="#0D0D0D"
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="1"
              />
              <circle cx="8" cy="9" r="2" fill={color} />
              <text
                x="14"
                y="12.5"
                fill="#FFFFFF"
                fillOpacity="0.85"
                fontSize="8"
                fontWeight="600"
                fontFamily="var(--font-mono, monospace)"
                letterSpacing="0.08em"
              >
                {label}
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
