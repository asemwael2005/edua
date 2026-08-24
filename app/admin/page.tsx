'use client';

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import {
  Users,
  CalendarCheck,
  Award,
  BookOpenCheck,
  UserPlus,
  PlusCircle,
  FilePlus,
  ArrowUpRight,
  TrendingUp,
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
  
  const avgAttendance = Math.round(
    students.reduce((acc, s) => acc + s.attendanceRate, 0) / (students.length || 1)
  );

  const avgQuizScore = quizSubmissions.length
    ? Math.round(quizSubmissions.reduce((acc, q) => acc + q.percentage, 0) / quizSubmissions.length)
    : 85;

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
                <p className="text-xs text-slate-400">مقارنة نسب الحضور والتفاعل عبر المحاضرات الأخيرة</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-brand-400 text-xs font-mono font-bold">
                أحدث 4 أسابيع
              </span>
            </div>

            {/* Custom SVG / Bar Chart Representation */}
            <div className="space-y-4 pt-2">
              {[
                { label: 'المحاضرة 5: التفاضل والتكامل', percent: 96, color: 'from-brand-500 to-indigo-600' },
                { label: 'المحاضرة 4: الفيزياء الحديثة', percent: 88, color: 'from-accent-purple to-purple-700' },
                { label: 'المحاضرة 3: الميكانيكا المتقدمة', percent: 92, color: 'from-emerald-500 to-teal-600' },
                { label: 'المحاضرة 2: الجبر والهندسة الفراغية', percent: 84, color: 'from-amber-500 to-orange-600' },
              ].map((item, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>{item.label}</span>
                    <span className="font-mono">{item.percent}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                    />
                  </div>
                </div>
              ))}
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

        {/* Right Column: Top Performers & Recent Feedback */}
        <div className="space-y-6">
          
          {/* Top Performers Card */}
          <div className="p-6 rounded-3xl glass-panel border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{dict.metrics.topPerformers}</h3>
              <Link href="/student/scorecard" className="text-xs text-brand-400 font-semibold hover:underline flex items-center gap-1">
                عرض الكشف <ChevronLeft className={`w-3.5 h-3.5 ${language === 'ar' ? '' : 'rotate-180'}`} />
              </Link>
            </div>

            <div className="space-y-3">
              {topPerformers.map((student, idx) => (
                <div
                  key={student.id}
                  className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-brand-500/20 text-brand-400 text-xs font-black flex items-center justify-center font-mono">
                      #{idx + 1}
                    </span>
                    <img src={student.avatar} alt={student.name} className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[130px]">{student.name}</h4>
                      <span className="text-[10px] text-slate-400">{student.grade}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-black text-amber-400 font-mono">{student.totalPoints} ن</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{student.attendanceRate}% حضور</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Feedback Reviews Widget */}
          <div className="p-6 rounded-3xl glass-panel border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{dict.metrics.recentFeedback}</h3>
              <Link href="/admin/feedback" className="text-xs text-brand-400 font-semibold hover:underline">
                الجميع ({feedback.length})
              </Link>
            </div>

            <div className="space-y-3">
              {feedback.slice(0, 3).map((fb) => (
                <div key={fb.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{fb.studentName}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 italic">"{fb.comment}"</p>
                  <span className="block text-[10px] text-slate-500 font-medium truncate">{fb.sessionTitle}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
