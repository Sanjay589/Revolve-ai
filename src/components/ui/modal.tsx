'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  maxWidth,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sizeWidthMap = {
    sm: '420px',
    md: '540px',
    lg: '680px',
    xl: '840px',
  };

  const computedMaxWidth = maxWidth || sizeWidthMap[size];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="overlay" onClick={onClose} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: 16,
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="editorial-card"
            style={{
              width: '100%',
              maxWidth: computedMaxWidth,
              background: 'var(--bg-secondary)',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || description) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  {title && <h3 className="font-heading" style={{ fontSize: '1.1875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>}
                  {description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 4 }}>
                      {description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost btn-icon"
                  aria-label="Close modal"
                  style={{ padding: 6, borderRadius: 'var(--radius-sm)' }}
                >
                  <X size={18} />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
