'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { HeroDataGrid } from '@/components/landing/hero-data-grid';
import { HeroVideoBg } from '@/components/landing/hero-video-bg';

export interface HeroScrollContainerProps {
  children?: React.ReactNode;
}

export const HeroScrollContainer: React.FC<HeroScrollContainerProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, shouldReduceMotion ? 1 : 0.2]);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center pt-24 pb-20 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28 overflow-hidden bg-black">
      {/* ─── LAYER 1: VIDEO BACKGROUND WITH MULTI-DIRECTION VIGNETTE ─── */}
      <HeroVideoBg />

      {/* ─── LAYER 2: AMBIENT ANIMATED DATA GRID BACKGROUND ─────────── */}
      <HeroDataGrid />

      {/* ─── LAYER 3: HERO EDITORIAL COPY & CALLS TO ACTION ─────────── */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="max-w-[1200px] mx-auto px-6 text-center relative z-10"
      >
        {/* Eyebrow / Tag: Clean Status Pill */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 mb-8 md:mb-10 max-w-full"
        >
          <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 rounded-full border border-[#262626] bg-[#0D0D0D]/90 backdrop-blur-md text-xs font-mono text-[#A6A6A6] shadow-sm max-w-full flex-wrap justify-center">
            <span className="w-2 h-2 rounded-full bg-[#00C076] animate-pulse shrink-0" />
            <span className="uppercase tracking-widest text-[0.625rem] sm:text-[0.6875rem] font-medium text-[#888888] shrink-0">
              Autonomous Commerce OS
            </span>
            <span className="text-[#333333] hidden sm:inline">•</span>
            <span className="text-[#00C076] font-medium text-[0.6875rem] sm:text-xs">
              Razorpay Test Mode Connected
            </span>
          </div>
        </motion.div>

        {/* Large Display Headline with clean two-line break and no orphaned words */}
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-balance text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] font-extrabold tracking-[-0.035em] leading-[1.08] max-w-5xl mx-auto mb-6 text-white drop-shadow-sm"
        >
          AI That Grows Your Commerce Revenue.
          <br className="hidden sm:inline" />{' '}
          <span className="font-editorial text-[#F0F3F6] font-normal italic inline-block mt-1">
            You Stay in Full Control.
          </span>
        </motion.h1>

        {/* Short, Concrete Supporting Description (max-w-[680px]) with high contrast */}
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="text-base sm:text-lg md:text-xl text-[#CCCCCC] max-w-[680px] mx-auto mb-10 md:mb-12 leading-relaxed font-normal"
        >
          Revolve AI is an AI-native commerce operating system for merchants. It discovers high-ROI revenue opportunities, explains every decision with concrete basket evidence, strictly enforces merchant safety policies, and executes bounded checkouts through Razorpay with cryptographic verification.
        </motion.p>

        {/* Dual Action CTAs: One Primary, One Secondary */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 flex-wrap mb-16 md:mb-24 lg:mb-28"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/overview"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/95 transition-all shadow-lg hover:shadow-white/10"
            >
              <span>Launch Live Workspace</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <a
              href="#product-showcase"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-[#333333] bg-[#0D0D0D] text-white hover:text-white hover:border-[#666666] font-medium text-sm transition-all"
            >
              <span>Explore Interactive Tour</span>
              <span className="text-white/60">↓</span>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ─── OPTIONAL CHILD WRAPPER (CONTAINED & SEPARATED IF PROVIDED) ── */}
      {children && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="max-w-[1280px] mx-auto px-6 mt-16 md:mt-24 relative z-20"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};
