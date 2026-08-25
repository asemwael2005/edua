'use client';

import React, { useState } from 'react';
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
  ChevronLeft,
  BookMarked,
  Tv,
  Video,
  Radio,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { userRole, dict, activeStudent, language } = useEduPulse();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminLinks = [
    { href: '/admin', label: dict.nav.dashboard, icon: LayoutDashboard },
    { href: '/admin/students', label: dict.nav.students, icon: Users },
    { href: '/admin/sessions', label: dict.nav.sessions, icon: CalendarCheck },
    { href: '/admin/videos', label: 'تسجيلات المحاضرات والبث', icon: Video },
    { href: '/admin/quizzes', label: dict.nav.quizzes, icon: FileCheck2 },
    { href: '/admin/assignments', label: dict.nav.assignments, icon: BookOpenCheck },
    { href: '/admin/curriculum', label: dict.nav.curriculum, icon: Map },
    { href: '/admin/feedback', label: dict.nav.feedback, icon: MessageSquareHeart },
    { href: '/admin/settings', label: 'إعدادات الأمان والمسؤولين', icon: ShieldCheck },
  ];

  const studentLinks = [
    { href: '/student', label: dict.nav.dashboard, icon: LayoutDashboard },
    { href: '/student/videos', label: 'تسجيلات المحاضرات والبث', icon: Video },
    { href: '/student/quizzes/quiz_1', label: dict.nav.quizzes, icon: FileCheck2 },
    { href: '/student/assignments', label: dict.nav.assignments, icon: BookOpenCheck },
    { href: '/student/sessions/sess_1', label: 'المحاضرة التفاعلية (Slides)', icon: Tv },
    { href: '/student/scorecard', label: dict.nav.scorecard, icon: Trophy },
  ];

  const links = userRole === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] shrink-0 glass-panel border-x border-slate-200 dark:border-slate-800/80 flex flex-col justify-between p-3.5 transition-all duration-300 ${
          isCollapsed ? 'md:w-20' : 'md:w-64'
        } ${
          isOpen ? 'translate-x-0 w-64' : 'ltr:-translate-x-full rtl:translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-5">
          
          {/* Active User Card & Desktop Toggle Button */}
          <div className="flex items-center justify-between gap-2">
            <div className={`p-3 rounded-2xl bg-gradient-to-br from-brand-950/60 via-slate-900/60 to-slate-800/60 border border-brand-500/30 flex items-center gap-3 w-full overflow-hidden ${
              isCollapsed ? 'justify-center p-2.5' : ''
            }`}>
              {userRole === 'admin' ? (
                <>
                  <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  {!isCollapsed && (
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-extrabold text-white truncate">{dict.nav.admin}</h4>
                      <p className="text-[10px] text-brand-400 font-semibold">{dict.nav.adminPortal}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <img
                    src={activeStudent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                    alt={activeStudent?.name}
                    className="w-9 h-9 rounded-xl object-cover border-2 border-emerald-500 shrink-0"
                  />
                  {!isCollapsed && (
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-100 truncate">{activeStudent?.name}</h4>
                      <p className="text-[10px] text-emerald-400 font-medium truncate">{activeStudent?.grade}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Collapse/Expand Toggle (Desktop) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition shrink-0"
              title={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
            >
              {isCollapsed ? (
                <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
              ) : (
                <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
              )}
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-14rem)] pr-0.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  title={link.label}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isCollapsed ? 'justify-center px-2' : 'justify-between'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {!isCollapsed && <span className="truncate">{link.label}</span>}
                  </div>

                  {!isCollapsed && isActive && (
                    <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180 text-white/80 shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Brand Info */}
        {!isCollapsed && (
          <div className="pt-3 border-t border-slate-800/80 text-center">
            <div className="text-[10px] text-slate-500 font-mono font-bold">
              EduPulse Platform v1.0 • 2026
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
