'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { ShieldCheck, Lock, ArrowRight, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdminAuthenticated, loginAdmin, dict, language } = useEduPulse();
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState(false);

  if (isAdminAuthenticated) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(inputPassword);
    if (!success) {
      setError(true);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 rounded-3xl bg-slate-900/95 border border-brand-500/30 shadow-2xl backdrop-blur-2xl text-center space-y-6 glow-indigo"
      >
        <div className="w-16 h-16 mx-auto rounded-3xl bg-brand-950 border border-brand-500/40 flex items-center justify-center text-brand-400 text-2xl font-bold shadow-xl">
          <Lock className="w-8 h-8 text-brand-400 animate-pulse" />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">منطقة خاصة بإدارة المركز</h2>
          <p className="text-xs text-slate-400 mt-1">
            هذه المنطقة محمية بكلمة سر الإدارة (كلمة السر الافتراضية: <span className="font-mono text-brand-300 font-bold">admin123</span>)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div className="space-y-1.5 text-right rtl:text-right ltr:text-left">
            <label className="text-slate-300">أدخل كلمة سر مسؤول الإدارة</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setError(false);
                }}
                placeholder="••••••••"
                className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-brand-500 text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-extrabold text-sm shadow-xl shadow-brand-500/20 transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>تأكيد ودخول لوحة التحكم</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800">
          <Link
            href="/student"
            className="text-xs text-slate-400 hover:text-white font-semibold transition flex items-center justify-center gap-1.5"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            <span>العودة لبوابة الطالب</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
