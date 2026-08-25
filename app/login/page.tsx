'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import {
  Sparkles,
  Lock,
  User,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { students, loginAdmin, setUserRole, setActiveStudentId, dict, language } = useEduPulse();

  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [studentCode, setStudentCode] = useState('');
  const [password, setPassword] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (role === 'admin') {
      const success = loginAdmin(adminPasswordInput);
      if (success) {
        router.push('/admin');
      } else {
        setError(
          language === 'ar'
            ? 'كلمة سر الإدارة غير صحيحة. يرجى إدخال كلمة سر الآدمن.'
            : 'Invalid Admin Password.'
        );
      }
      return;
    }

    // Match student by email, phone, or name
    const foundStudent = students.find(
      (s) =>
        s.email.toLowerCase().includes(studentCode.toLowerCase()) ||
        s.studentPhone.includes(studentCode) ||
        s.name.toLowerCase().includes(studentCode.toLowerCase()) ||
        s.id.toLowerCase() === studentCode.toLowerCase()
    );

    if (foundStudent) {
      setUserRole('student');
      setActiveStudentId(foundStudent.id);
      router.push('/student');
    } else {
      setError(
        language === 'ar'
          ? 'كود الطالب أو كلمة المرور غير صحيحة.'
          : 'Invalid Student Code or password.'
      );
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-brand-500/30 shadow-2xl backdrop-blur-2xl space-y-6 glow-indigo"
      >
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-purple flex items-center justify-center text-white shadow-xl glow-indigo">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">{dict.brandName}</h1>
          <p className="text-xs text-slate-400 font-medium">تسجيل الدخول لمنصة إديو بلس التعليمية</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => {
              setRole('student');
              setError(null);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
              role === 'student'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>بوابة الطالب</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('admin');
              setError(null);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
              role === 'admin'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>بوابة الإدارة</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold">
          {role === 'student' ? (
            <>
              <div className="space-y-1.5">
                <label className="text-slate-300">كود الطالب أو البريد/الهاتف</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    placeholder="أدخل كود الطالب الخاص بك..."
                    className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300">كلمة المرور / كود السر</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-brand-950/40 border border-brand-500/30 text-center space-y-1">
                <ShieldCheck className="w-6 h-6 text-brand-400 mx-auto" />
                <h3 className="text-xs font-bold text-white">منطقة محمية بمجلس الإدارة</h3>
                <p className="text-[11px] text-slate-400">يلزم إدخال كلمة سر مسؤول المركز للوصول</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300">كلمة سر مسئول الإدارة</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-extrabold text-sm shadow-xl shadow-brand-500/20 transition flex items-center justify-center gap-2"
          >
            <span>تأكيد ودخول الحساب</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
