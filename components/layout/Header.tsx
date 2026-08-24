'use client';

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import {
  Globe,
  Sun,
  Moon,
  ShieldCheck,
  GraduationCap,
  RotateCcw,
  UserCheck,
  Menu,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export const Header: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    userRole,
    setUserRole,
    activeStudentId,
    setActiveStudentId,
    students,
    activeStudent,
    dict,
    resetToDefaultData,
  } = useEduPulse();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href={userRole === 'admin' ? '/admin' : '/student'} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-purple flex items-center justify-center text-white shadow-lg glow-indigo transition transform group-hover:scale-105">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-500 via-accent-cyan to-brand-400 bg-clip-text text-transparent">
                {dict.brandName}
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                {dict.platformTitle}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Quick Switch Role Pill */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-200/60 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-800">
          <Link
            href="/admin"
            onClick={() => setUserRole('admin')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              userRole === 'admin'
                ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{dict.nav.adminPortal}</span>
          </Link>

          <Link
            href="/student"
            onClick={() => setUserRole('student')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              userRole === 'student'
                ? 'bg-gradient-to-r from-accent-emerald to-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{dict.nav.studentPortal}</span>
          </Link>
        </div>

        {/* Controls Right */}
        <div className="flex items-center gap-2.5">

          {/* Student Quick Account Selector (for testing student ban/portal) */}
          {userRole === 'student' && (
            <div className="flex items-center gap-1.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl px-2.5 py-1">
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <select
                value={activeStudentId}
                onChange={(e) => setActiveStudentId(e.target.value)}
                className="bg-transparent text-xs text-emerald-300 font-semibold focus:outline-none cursor-pointer max-w-[140px] sm:max-w-[180px] truncate"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.name} {s.banDetails?.active ? '(محظور 🚫)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Login / Logout */}
          <Link
            href="/login"
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
            title="تسجيل الدخول"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">دخول الحساب</span>
          </Link>

          {/* Reset Mock Data */}
          <button
            onClick={resetToDefaultData}
            title={language === 'ar' ? 'إعادة ضبط البيانات' : 'Reset Mock Data'}
            className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition"
          >
            <Globe className="w-4 h-4 text-brand-400" />
            <span>{language === 'ar' ? 'EN' : 'العربية'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            aria-label="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-700" />}
          </button>
        </div>

      </div>
    </header>
  );
};
