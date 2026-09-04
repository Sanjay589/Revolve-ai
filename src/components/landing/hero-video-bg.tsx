'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export const HeroVideoBg: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (shouldReduceMotion && videoRef.current) {
      videoRef.current.pause();
    } else if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [shouldReduceMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none flex items-center justify-center"
    >
      {!shouldReduceMotion ? (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* ─── 1. VIDEO ELEMENT (NATIVE 748x418 / 16:9) ───────────── */}
          {/*
            Requirements respected:
            - Object-cover with object-center preserves native aspect ratio without distortion
            - Sized responsively to naturally fit the hero without pushing content or causing overflow
            - Subtle opacity: ~30% on mobile, ~35% on tablet, ~42% on desktop
            - Darkened significantly with contrast and saturation calibration for deep emerald tones
            - Never increases page width or creates unexpected spacing
          */}
          <video
            ref={videoRef}
            src="/videos/commerce-flow.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            className="w-full h-full object-cover object-center max-w-[1440px] opacity-30 sm:opacity-35 md:opacity-40 lg:opacity-45"
            style={{
              filter: 'brightness(0.6) contrast(1.15) saturate(0.85)',
              mixBlendMode: 'screen',
            }}
          />

          {/* ─── 2. RESTRAINED VIGNETTE & BLEND OVERLAYS ───────────── */}
          {/* Center Radial Mask: softly darkens behind the hero headline for 100% readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 75% 65% at 50% 48%, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.42) 45%, rgba(0, 0, 0, 0.88) 75%, #000000 100%)',
            }}
          />

          {/* Top Edge Fade into Nav */}
          <div
            className="absolute top-0 inset-x-0 h-28 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, #000000 0%, transparent 100%)',
            }}
          />

          {/* Bottom Edge Fade into Workspace Preview */}
          <div
            className="absolute bottom-0 inset-x-0 h-36 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
            }}
          />

          {/* Left & Right Edge Seamless Blends */}
          <div
            className="absolute inset-y-0 left-0 w-16 sm:w-32 lg:w-48 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, #000000 0%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-16 sm:w-32 lg:w-48 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, #000000 0%, transparent 100%)',
            }}
          />
        </div>
      ) : (
        /* Reduced motion fallback: Static subtle radial glow */
        <div
          className="w-[800px] h-[400px] pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #00C076 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      )}
    </div>
  );
};
