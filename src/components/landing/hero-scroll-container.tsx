'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { HeroDataGrid } from '@/components/landing/hero-data-grid';

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

  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, shouldReduceMotion ? 1 : 0.1]);

  return (
    <div ref={containerRef} className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-black">
      {/* ─── AMBIENT ANIMATED DATA GRID BACKGROUND ──────────────── */}
      <HeroDataGrid />

      {/* ─── HERO EDITORIAL COPY & CALLS TO ACTION ──────────────── */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="max-w-[1140px] mx-auto px-6 text-center relative z-10"
      >
        {/* Eyebrow / Tag with liquid-glass styling and generous top margin below navbar */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mt-2 sm:mt-4 mb-6 md:mb-8"
        >
          <div className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2.5 text-xs font-semibold text-white/90 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00C076] animate-pulse" />
            <span className="tracking-wide uppercase text-[0.6875rem] text-[#A6A6A6]">
              Autonomous Commerce OS
            </span>
            <span className="text-white/30">•</span>
            <span className="text-[#00C076] font-mono font-medium">Razorpay Test Mode Connected</span>
          </div>
        </motion.div>

        {/* Large Display Headline with text-balance and clean two-line break */}
        <motion.h1
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-balance text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[4.25rem] font-extrabold tracking-[-0.035em] leading-[1.12] max-w-5xl mx-auto mb-6 text-white"
        >
          AI That Grows Your Commerce Revenue.
          <br className="hidden sm:inline" />{' '}
          <span className="font-editorial text-[#F0F3F6] font-normal italic inline-block">
            You Stay in Full Control.
          </span>
        </motion.h1>

        {/* Supporting Description */}
        <motion.p
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-[#A6A6A6] max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed font-normal"
          style={{ color: 'var(--text-hero-sub)' }}
        >
          Revolve AI is an AI-native commerce operating system for merchants. It discovers high-ROI revenue opportunities, explains every decision with concrete basket evidence, strictly enforces merchant safety policies, and executes bounded checkouts through Razorpay with cryptographic verification.
        </motion.p>

        {/* Live System Status Indicator - cleanly above CTAs with mb-6 */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="inline-flex items-center gap-4 px-5 py-2 rounded-full border border-[#333333] bg-[#0D0D0D]/90 backdrop-blur-md mb-6 md:mb-8 text-xs text-[#A6A6A6] flex-wrap justify-center shadow-md"
        >
          <span className="flex items-center gap-2 text-[#00C076] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C076]" />
            AI Intelligence Active
          </span>
          <span className="text-white/20 hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5 text-white/80">
            <ShieldCheck size={14} className="text-[#00C076]" />
            Policy Interceptor: ₹10k max/tx
          </span>
          <span className="text-white/20 hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5 text-white/80">
            <CreditCard size={14} className="text-[#818CF8]" />
            HMAC-SHA256 Ledger
          </span>
        </motion.div>

        {/* Primary and Secondary Action CTAs - generous vertical separation mb-12 md:mb-16 above preview container */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-4 flex-wrap mb-12 md:mb-16"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/overview"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/95 transition-all shadow-lg"
            >
              <span>Launch Live Workspace</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <a
              href="#product-tour"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-[#333333] bg-[#0D0D0D] text-white/90 hover:text-white hover:border-[#555555] font-medium text-sm transition-all"
            >
              <span>Explore Interactive Tour</span>
              <span className="text-white/40">↓</span>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ─── PRODUCT VISUALIZATION / PREVIEW CONTAINER ────────────── */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="max-w-[1240px] mx-auto px-6 relative z-20"
      >
        {children}
      </motion.div>
    </div>
  );
};
