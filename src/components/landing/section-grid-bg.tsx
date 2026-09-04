'use client';

import React from 'react';

interface SectionGridBgProps {
  opacity?: number;
  highlightColor?: string;
  hasCrosshairs?: boolean;
}

export const SectionGridBg: React.FC<SectionGridBgProps> = ({
  opacity = 0.04,
  highlightColor = '#00C076',
  hasCrosshairs = true,
}) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {/* Subtle radial ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[450px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${highlightColor}0D 0%, transparent 70%)`,
          filter: 'blur(90px)',
        }}
      />

      {/* SVG 1px Repeating Grid Pattern */}
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <pattern
            id="section-subtle-grid"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#section-subtle-grid)" />

        {/* Crosshair markers in corners if enabled */}
        {hasCrosshairs && (
          <g opacity="0.25">
            {/* Top Left */}
            <line x1="28" y1="32" x2="36" y2="32" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="32" y1="28" x2="32" y2="36" stroke="#FFFFFF" strokeWidth="1" />

            {/* Top Right */}
            <line x1="1404" y1="32" x2="1412" y2="32" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="1408" y1="28" x2="1408" y2="36" stroke="#FFFFFF" strokeWidth="1" />

            {/* Bottom Left */}
            <line x1="28" y1="400" x2="36" y2="400" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="32" y1="396" x2="32" y2="404" stroke="#FFFFFF" strokeWidth="1" />

            {/* Bottom Right */}
            <line x1="1404" y1="400" x2="1412" y2="400" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="1408" y1="396" x2="1408" y2="404" stroke="#FFFFFF" strokeWidth="1" />
          </g>
        )}
      </svg>
    </div>
  );
};
