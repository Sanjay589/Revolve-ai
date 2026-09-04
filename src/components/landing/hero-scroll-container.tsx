'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';

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

  const contentY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, shouldReduceMotion ? 1 : 0]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -80]);

  return (
    <div ref={containerRef} className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Subtle radial ambient gradient behind hero for dark depth */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(0, 192, 118, 0.08) 0%, rgba(99, 102, 241, 0.04) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="max-w-[1180px] mx-auto px-6 text-center relative z-10"
      >
        {/* Eyebrow / Tag with liquid-glass styling */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <div className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2.5 text-xs font-semibold text-white/90">
            <span className="w-2 h-2 rounded-full bg-[#00C076] animate-pulse" />
            <span className="tracking-wide uppercase text-[0.6875rem] text-[#A6A6A6]">
              Autonomous Commerce OS
            </span>
            <span className="text-white/30">•</span>
            <span className="text-[#00C076] font-mono font-medium">Razorpay Test Mode Connected</span>
          </div>
        </motion.div>

        {/* Large Display Headline */}
        <motion.h1
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold tracking-[-0.035em] leading-[1.05] max-w-5xl mx-auto mb-6 text-white"
        >
          AI That Grows Your Commerce Revenue.{' '}
          <span className="font-editorial text-[#F0F3F6] font-normal italic block sm:inline">
            You Stay in Full Control.
          </span>
        </motion.h1>

        {/* Supporting Description */}
        <motion.p
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-[#A6A6A6] max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          style={{ color: 'var(--text-hero-sub)' }}
        >
          Revolve AI is an AI-native commerce operating system for merchants. It discovers high-ROI revenue opportunities, explains every decision with concrete basket evidence, strictly enforces merchant safety policies, and executes bounded checkouts through Razorpay with cryptographic verification.
        </motion.p>

        {/* Live System Status Indicator */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="inline-flex items-center gap-4 px-5 py-2 rounded-full border border-[#333333] bg-[#0D0D0D]/80 backdrop-blur-md mb-10 text-xs text-[#A6A6A6] flex-wrap justify-center shadow-md"
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

        {/* Primary and Secondary Action CTAs */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-4 flex-wrap mb-16"
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

      {/* Product Visualization / Preview Container with Parallax */}
      <motion.div
        style={{ y: visualY }}
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="max-w-[1240px] mx-auto px-6 relative z-20"
      >
        {children}
      </motion.div>
    </div>
  );
};
