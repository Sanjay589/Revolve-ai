'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface WordProps {
  children: string;
  range: [number, number];
  progress: any;
  shouldReduceMotion: boolean | null;
}

const Word: React.FC<WordProps> = ({ children, range, progress, shouldReduceMotion }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const color = useTransform(progress, range, ['hsl(0, 0%, 35%)', 'hsl(0, 0%, 100%)']);

  if (shouldReduceMotion) {
    return <span className="inline-block mr-[0.28em] text-white opacity-100">{children}</span>;
  }

  return (
    <motion.span
      style={{ opacity, color }}
      className="inline-block mr-[0.28em] transition-colors duration-75"
    >
      {children}
    </motion.span>
  );
};

export interface EditorialWordRevealProps {
  quote?: string;
  authorName?: string;
  authorRole?: string;
  authorCompany?: string;
}

export const EditorialWordReveal: React.FC<EditorialWordRevealProps> = ({
  quote = "In automated commerce, speed without policy guardrails is catastrophic. Revolve AI ensures every single autonomous payment action is mathematically bounded and cryptographically verified before a single rupee moves.",
  authorName = "Razorpay Hackathon Architecture Audit",
  authorRole = "Verified Zero-Trust Commerce Spec",
  authorCompany = "Apex Gear Co.",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.4'],
  });

  const words = quote.split(' ');

  return (
    <section ref={containerRef} className="py-24 md:py-36 px-6 max-w-5xl mx-auto">
      {/* Decorative large opening quotation mark */}
      <div className="font-editorial text-7xl md:text-8xl text-[#333333] select-none leading-none mb-6">
        “
      </div>

      {/* Large editorial quote text */}
      <div className="font-heading text-2xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.25] mb-12">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Word
              key={i}
              range={[start, end]}
              progress={scrollYProgress}
              shouldReduceMotion={shouldReduceMotion}
            >
              {word}
            </Word>
          );
        })}
      </div>

      {/* Attribution */}
      <div className="flex items-center gap-4 pt-6 border-t border-[#222222]">
        <div className="w-11 h-11 rounded-full bg-[#141414] border border-[#333333] flex items-center justify-center text-[#00C076] font-bold text-sm shadow-sm">
          <ShieldCheck size={20} />
        </div>
        <div>
          <div className="font-heading text-sm font-semibold text-white tracking-tight">
            {authorName}
          </div>
          <div className="text-xs text-[#A6A6A6]">
            {authorRole} • <span className="text-white/60">{authorCompany}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
