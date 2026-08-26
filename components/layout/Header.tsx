'use client';

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import {
  Globe,
  Sun,
  Moon,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  RotateCcw,
  UserCheck,
  Menu,
  Sparkles,
  LogOut,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const pathname = usePathname();
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
    isAdminAuthenticated,
    logoutAdmin,
    showToast,
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

        {/* Admin Protection Badge or Locked Access */}
        <div className="hidden lg:flex items-center gap-2">
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-2 bg-brand-950/80 border border-brand-500/40 px-3 py-1.5 rounded-2xl text-xs font-extrabold text-brand-300">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>إدارة المركز مفعّلة</span>
              <button
                onClick={logoutAdmin}
                className="ltr:ml-2 rtl:mr-2 p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition"
                title="قفل صلاحيات الإدارة وتسجيل الخروج"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>لوحة الإدارة 🔒</span>
            </Link>
          )}
        </div>

        {/* Controls Right */}
        <div className="flex items-center gap-2.5">



          {/* Logout Button */}
          <button
            onClick={async () => {
              try {
                await fetch('/api/auth/logout', { method: 'POST' });
              } catch (e) {}
              logoutAdmin();
              setUserRole('student');
              showToast('تم تسجيل الخروج بنجاح 🚪');
            }}
            className="p-2 rounded-xl border border-rose-500/30 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
            title="تسجيل الخروج من الحساب"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">خروج 🚪</span>
          </button>

          {/* Login Link */}
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
