'use client';

import React, { useState, useEffect } from 'react';
import { Student } from '@/types/edupulse';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { ShieldX, Clock, AlertOctagon, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const BanShield: React.FC<{ student: Student; children: React.ReactNode }> = ({ student, children }) => {
  const { dict } = useEduPulse();
  const ban = student.banDetails;

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!ban || !ban.active || ban.type === 'perm' || !ban.endDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(ban.endDate!).getTime() - new Date().getTime();
      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [ban]);

  // If no ban or ban is not active, render normal children
  if (!ban || !ban.active) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full p-8 rounded-3xl bg-slate-900/90 border border-rose-500/30 shadow-2xl backdrop-blur-2xl text-center space-y-6 glow-rose"
      >
        {/* Animated Warning Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-500 animate-pulse shadow-lg">
          <ShieldX className="w-10 h-10" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">{dict.banShield.alertTitle}</h2>
          <p className="text-sm text-slate-400 mt-2">
            {ban.type === 'perm' ? dict.banShield.permanentBanText : dict.banShield.temporaryBanText}
          </p>
        </div>

        {/* Live Countdown Timer for Temp Ban */}
        {ban.type === 'temp' && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/20">
            {isExpired ? (
              <p className="text-sm font-bold text-emerald-400">{dict.banShield.expiredText}</p>
            ) : (
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/30">
                  <span className="block text-2xl font-black text-rose-400 font-mono">{timeLeft?.days ?? 0}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{dict.banShield.days}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/30">
                  <span className="block text-2xl font-black text-rose-400 font-mono">{timeLeft?.hours ?? 0}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{dict.banShield.hours}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/30">
                  <span className="block text-2xl font-black text-rose-400 font-mono">{timeLeft?.minutes ?? 0}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{dict.banShield.minutes}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/30">
                  <span className="block text-2xl font-black text-rose-400 font-mono">{timeLeft?.seconds ?? 0}</span>
                  <span className="text-[11px] text-slate-400 font-medium">{dict.banShield.seconds}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ban Reason */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-right rtl:text-right ltr:text-left space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{dict.banShield.reasonLabel}</span>
          </div>
          <p className="text-sm font-semibold text-rose-200">{ban.reason}</p>
          <div className="text-[11px] text-slate-500 pt-1">
            من قِبَل: <span className="text-slate-400">{ban.appliedBy}</span> | تاريخ القرار: {new Date(ban.startDate).toLocaleDateString('ar-EG')}
          </div>
        </div>

        {/* Contact info */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <HelpCircle className="w-4 h-4 text-brand-400" />
          <span>{dict.banShield.contactAdmin}</span>
        </div>
      </motion.div>
    </div>
  );
};
