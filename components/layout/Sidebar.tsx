'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  FileCheck2,
  BookOpenCheck,
  Map,
  MessageSquareHeart,
  Trophy,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  BookMarked,
  Tv,
} from 'lucide-react';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { userRole, dict, activeStudent, language } = useEduPulse();

  const adminLinks = [
    { href: '/admin', label: dict.nav.dashboard, icon: LayoutDashboard },
    { href: '/admin/students', label: dict.nav.students, icon: Users },
    { href: '/admin/sessions', label: dict.nav.sessions, icon: CalendarCheck },
    { href: '/admin/quizzes', label: dict.nav.quizzes, icon: FileCheck2 },
    { href: '/admin/assignments', label: dict.nav.assignments, icon: BookOpenCheck },
    { href: '/admin/curriculum', label: dict.nav.curriculum, icon: Map },
    { href: '/admin/feedback', label: dict.nav.feedback, icon: MessageSquareHeart },
  ];

  const studentLinks = [
    { href: '/student', label: dict.nav.dashboard, icon: LayoutDashboard },
    { href: '/student/quizzes/quiz_1', label: dict.nav.quizzes, icon: FileCheck2 },
    { href: '/student/assignments', label: dict.nav.assignments, icon: BookOpenCheck },
    { href: '/student/sessions/sess_1', label: 'المحاضرة التفاعلية (Slides)', icon: Tv },
    { href: '/student/scorecard', label: dict.nav.scorecard, icon: Trophy },
  ];

  const links = userRole === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 shrink-0 glass-panel border-r ltr:border-r rtl:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          
          {/* Active User Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-900/40 via-slate-900/40 to-slate-800/40 border border-brand-500/20 flex items-center gap-3">
            {userRole === 'admin' ? (
              <>
                <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 truncate">{dict.nav.admin}</h4>
                  <p className="text-[11px] text-brand-400 font-medium">{dict.nav.adminPortal}</p>
                </div>
              </>
            ) : (
              <>
                <img
                  src={activeStudent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                  alt={activeStudent?.name}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500 shrink-0"
                />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-100 truncate">{activeStudent?.name}</h4>
                  <p className="text-[11px] text-emerald-400 font-medium truncate">{activeStudent?.grade}</p>
                </div>
              </>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </div>
                  {isActive && <ChevronRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info badge */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span className="font-semibold">{dict.platformTitle}</span>
          <span className="bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-md font-mono text-[10px]">v1.0</span>
        </div>
      </aside>
    </>
  );
};
