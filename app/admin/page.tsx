'use client';

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import {
  Users,
  CalendarCheck,
  Award,
  BookOpenCheck,
  TrendingUp,
  UserPlus,
  PlusCircle,
  FilePlus,
  ArrowUpRight,
  Trophy,
  Star,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const {
    dict,
    students,
    sessions,
    quizzes,
    assignments,
    assignmentSubmissions,
    quizSubmissions,
    feedback,
    language,
  } = useEduPulse();

  const activeStudentsCount = students.filter((s) => !s.banDetails?.active).length;

  const avgAttendance = students.length
    ? Math.round(students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length)
    : 0;

  const avgQuizScore = quizSubmissions.length
    ? Math.round(quizSubmissions.reduce((acc, q) => acc + q.percentage, 0) / quizSubmissions.length)
    : 0;

  const pendingAssignmentsCount = assignmentSubmissions.filter((s) => s.status === 'submitted').length;

  const topPerformers = [...students].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 4);

  return (
    <div className="space-y-8 pb-10">
      
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-950 border border-brand-500/30 shadow-2xl text-white glow-indigo"
      >
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{dict.nav.adminPortal}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{dict.platformTitle}</h1>
            <p className="text-sm text-brand-200/80 max-w-xl">{dict.subTitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/students"
              className="px-4 py-2.5 rounded-xl bg-white text-brand-900 hover:bg-brand-50 font-bold text-xs shadow-lg transition flex items-center gap-2 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>{dict.metrics.addStudent}</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Active Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl glass-panel border hover:border-brand-500/40 transition duration-300 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{dict.metrics.activeStudents}</span>
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">{activeStudentsCount}</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">إجمالي طلاب المركز المسجلين بالنظام</p>
        </motion.div>

        {/* Attendance Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl glass-panel border hover:border-emerald-500/40 transition duration-300 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{dict.metrics.attendanceRate}</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">{avgAttendance}%</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +4.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">معدل الانضباط التراكمي بالجلسات</p>
        </motion.div>

        {/* Avg Quiz Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-2xl glass-panel border hover:border-accent-purple/40 transition duration-300 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{dict.metrics.avgQuizScore}</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">{avgQuizScore}%</span>
            <span className="text-xs font-bold text-purple-400">متوسط الأداء</span>
          </div>
          <p className="text-[11px] text-slate-400">تحليل نتائج الاختبارات الإلكترونية</p>
        </motion.div>

        {/* Pending Assignments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl glass-panel border hover:border-amber-500/40 transition duration-300 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{dict.metrics.pendingAssignments}</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
              <BookOpenCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">{pendingAssignmentsCount}</span>
            <span className="text-xs font-bold text-amber-500">تتطلب المراجعة</span>
          </div>
          <p className="text-[11px] text-slate-400">إجابات الطلاب بانتظار تصحيح المعلم</p>
        </motion.div>

      </div>

      {/* Main Grid: Charts & Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visual Analytics & Sessions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Attendance & Performance Visual Bar Breakdown */}
          <div className="p-6 rounded-3xl glass-panel border space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{dict.metrics.attendanceTrend}</h3>
                <p className="text-xs text-slate-400">مقارنة نسب الحضور والتفاعل عبر المحاضرات الفعلية المضافة</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-brand-400 text-xs font-mono font-bold">
                الجلسات المسجلة ({sessions.length})
              </span>
            </div>

            {/* Dynamic Sessions Attendance Chart / Empty State */}
            <div className="space-y-4 pt-2">
              {sessions.length === 0 || students.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-2 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                  <CalendarCheck className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">لا توجد إحصائيات حضور حية بعد</p>
                  <p className="text-[11px] text-slate-500">قم بإضافة المحاضرات والطلاب لبدء احتساب مؤشر الحضور تلقائياً.</p>
                </div>
              ) : (
                sessions.slice(0, 5).map((sess, index) => {
                  const presentCount = Object.values(sess.attendance).filter(
                    (st) => st === 'present' || st === 'late'
                  ).length;
                  const totalSt = students.length || 1;
                  const percent = Math.round((presentCount / totalSt) * 100);

                  const colors = [
                    'from-brand-500 to-indigo-600',
                    'from-accent-purple to-purple-700',
                    'from-emerald-500 to-teal-600',
                    'from-amber-500 to-orange-600',
                  ];
                  const color = colors[index % colors.length];

                  return (
                    <div key={sess.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-300">
                        <span>{sess.title}</span>
                        <span className="font-mono">{percent}%</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className={`h-full rounded-full bg-gradient-to-r ${color}`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="p-6 rounded-3xl glass-panel border space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{dict.metrics.quickActions}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/admin/students"
                className="p-4 rounded-2xl bg-brand-950/40 border border-brand-500/20 hover:border-brand-500/60 hover:bg-brand-900/40 transition text-center space-y-2 group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center group-hover:scale-110 transition">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="block text-xs font-bold text-slate-200">{dict.metrics.addStudent}</span>
              </Link>

              <Link
                href="/admin/sessions"
                className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 hover:border-emerald-500/60 hover:bg-emerald-900/40 transition text-center space-y-2 group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <span className="block text-xs font-bold text-slate-200">{dict.metrics.newSession}</span>
              </Link>

              <Link
                href="/admin/quizzes"
                className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 hover:border-purple-500/60 hover:bg-purple-900/40 transition text-center space-y-2 group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
                  <FilePlus className="w-5 h-5" />
                </div>
                <span className="block text-xs font-bold text-slate-200">{dict.metrics.createQuiz}</span>
              </Link>

              <Link
                href="/admin/assignments"
                className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/20 hover:border-amber-500/60 hover:bg-amber-900/40 transition text-center space-y-2 group"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
                  <BookOpenCheck className="w-5 h-5" />
                </div>
                <span className="block text-xs font-bold text-slate-200">{dict.metrics.createAssignment}</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Right Column: Top Performers & Feedback Feed */}
        <div className="space-y-6">
          
          {/* Top Students Roster / Empty State */}
          <div className="p-6 rounded-3xl glass-panel border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>{dict.metrics.topPerformers}</span>
              </h3>
              <Link href="/admin/students" className="text-xs font-bold text-brand-400 hover:underline flex items-center gap-1">
                <span>عرض الكشف</span>
                <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </Link>
            </div>

            <div className="space-y-3">
              {topPerformers.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-2 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                  <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">لا يوجد طلاب مسجلين بعد</p>
                  <p className="text-[11px] text-slate-500">قم بإضافة الطلاب من قسم "إدارة الطلاب" لرفع كشف المتفوقين تلقائياً.</p>
                </div>
              ) : (
                topPerformers.map((student, rank) => (
                  <div
                    key={student.id}
                    className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-brand-500/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-xl object-cover" />
                        <span
                          className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${
                            rank === 0
                              ? 'bg-amber-500 shadow-md shadow-amber-500/40'
                              : rank === 1
                              ? 'bg-slate-400'
                              : 'bg-amber-700'
                          }`}
                        >
                          {rank + 1}
                        </span>
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-white truncate max-w-[120px]">{student.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">حضور: {student.attendanceRate}%</span>
                      </div>
                    </div>

                    <div className="text-right rtl:text-left ltr:text-right">
                      <span className="text-xs font-extrabold font-mono text-brand-400 block">{student.totalPoints}</span>
                      <span className="text-[9px] text-slate-500">نقطة تميز</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Latest Student Feedback Feed / Empty State */}
          <div className="p-6 rounded-3xl glass-panel border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span>أحدث آراء وتقييمات الطلاب</span>
              </h3>
              <Link href="/admin/feedback" className="text-xs font-bold text-brand-400 hover:underline">
                الجميع ({feedback.length})
              </Link>
            </div>

            <div className="space-y-3">
              {feedback.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                  لا توجد تقييمات مسجلة من الطلاب حتى الآن.
                </div>
              ) : (
                feedback.slice(0, 3).map((fb) => (
                  <div key={fb.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{fb.studentName}</span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: fb.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{fb.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
