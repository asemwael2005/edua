'use client';

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, toastType } = useEduPulse();

  if (!toastMessage) return null;

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  const borderMap = {
    success: 'border-emerald-500/30 bg-emerald-950/80 text-emerald-100',
    error: 'border-rose-500/30 bg-rose-950/80 text-rose-100',
    info: 'border-cyan-500/30 bg-cyan-950/80 text-cyan-100',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-6 ltr:right-6 rtl:left-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-xl shadow-2xl ${borderMap[toastType]}`}
      >
        {iconMap[toastType]}
        <span className="text-sm font-medium">{toastMessage}</span>
      </motion.div>
    </AnimatePresence>
  );
};
