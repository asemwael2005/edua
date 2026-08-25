'use client';

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { BanShield } from '@/components/BanShield';
import { isMatchingGrade } from '@/lib/gradeUtils';
import {
  GraduationCap,
  CalendarCheck,
  Award,
  Trophy,
  BookOpenCheck,
  FileCheck2,
  Tv,
  ChevronLeft,
  Sparkles,
  Clock,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function StudentDashboardPage() {
  const {
    dict,
    activeStudent,
    students,
    quizzes,
    assignments,
    sessions,
    curriculum,
    assignmentSubmissions,
    quizSubmissions,
    language,
  } = useEduPulse();

  if (!activeStudent) return null;

  // Filter content strictly for the student's grade level
  const gradeStudents = students.filter((s) => isMatchingGrade(s.grade, activeStudent.grade));
  const sortedGradeStudents = [...gradeStudents].sort((a, b) => b.totalPoints - a.totalPoints);
  const studentRank = sortedGradeStudents.findIndex((s) => s.id === activeStudent.id) + 1 || 1;

  const gradeQuizzes = quizzes.filter((q) => isMatchingGrade(q.grade, activeStudent.grade));
  const activeQuiz = gradeQuizzes.find((q) => q.isOpen) || gradeQuizzes[0] || quizzes[0];

  const gradeAssignments = assignments.filter((a) => isMatchingGrade(a.grade, activeStudent.grade));
  const activeAssignment = gradeAssignments[0] || assignments[0];

  const gradeSessions = sessions.filter((s) => isMatchingGrade(s.grade, activeStudent.grade));
  const activeSession = gradeSessions[0] || sessions[0];

  return (
    <BanShield student={activeStudent}>
      <div className="space-y-8 pb-12">
        
        {/* Welcome Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/30 shadow-2xl text-white glow-emerald"
        >
          <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={activeStudent.avatar}
                alt={activeStudent.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl shrink-0"
              />
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{activeStudent.grade}</span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight">أهلاً بك يا {activeStudent.name} 👋</h1>
                <p className="text-xs text-slate-300">مرحباً بك في منصة إديo بلس. تم تخصيص المحتوى بالكامل لـ ({activeStudent.grade}).</p>
              </div>
            </div>

            {activeQuiz && (
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/student/quizzes/${activeQuiz.id}`}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs shadow-lg transition flex items-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>بدء اختبار الصف الخاص بك</span>
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Student Personal KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Attendance % */}
          <div className="p-5 rounded-2xl glass-panel border space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>{dict.metrics.attendanceRate}</span>
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-3xl font-black text-white font-mono">{activeStudent.attendanceRate}%</span>
            <p className="text-[11px] text-emerald-400 font-bold">نسبة انضباط ممتازة</p>
          </div>

          {/* Cumulative Score */}
          <div className="p-5 rounded-2xl glass-panel border space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>{dict.scorecard.ledgerTitle}</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-3xl font-black text-amber-400 font-mono">{activeStudent.totalPoints} ن</span>
            <p className="text-[11px] text-slate-400">إجمالي البونص والدرجات</p>
          </div>

          {/* Leaderboard Rank within Grade */}
          <div className="p-5 rounded-2xl glass-panel border space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>{dict.scorecard.yourRank} (دفعة الصف)</span>
              <Trophy className="w-4 h-4 text-brand-400" />
            </div>
            <span className="text-3xl font-black text-brand-400 font-mono">المركز #{studentRank}</span>
            <p className="text-[11px] text-slate-400">من إجمالي {gradeStudents.length} طلاب بدفعتك</p>
          </div>

          {/* Upcoming Deadlines */}
          <div className="p-5 rounded-2xl glass-panel border space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>الموعد القادم</span>
              <Clock className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-sm font-bold text-white truncate block">
              {activeAssignment?.title || 'تكليفات الصف التفاعلية'}
            </span>
            <p className="text-[11px] text-rose-400 font-semibold">محتوى مخصص لصفك الدراسي</p>
          </div>

        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Active Quiz Card for Grade */}
          {activeQuiz && (
            <div className="p-6 rounded-3xl glass-panel border space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
                    اختبار خاص بصفك
                  </span>
                  <Clock className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-base font-extrabold text-white">{activeQuiz.title}</h3>
                <p className="text-xs text-slate-300">
                  {activeQuiz.grade} | {activeQuiz.durationMinutes} دقيقة | {activeQuiz.questions.length} أسئلة
                </p>
              </div>

              <Link
                href={`/student/quizzes/${activeQuiz.id}`}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs text-center shadow-lg transition block"
              >
                {dict.quizzes.startQuiz}
              </Link>
            </div>
          )}

          {/* Interactive Presentation Deck Card */}
          {activeSession && (
            <div className="p-6 rounded-3xl glass-panel border space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-brand-950 text-brand-300 border border-brand-500/30 text-xs font-bold font-mono">
                    سلايدات محاضرتك
                  </span>
                  <Tv className="w-4 h-4 text-brand-400" />
                </div>
                <h3 className="text-base font-extrabold text-white">{activeSession.title}</h3>
                <p className="text-xs text-slate-300">{activeSession.grade} | شرح وسلايدات تفاعلية</p>
              </div>

              <Link
                href={`/student/sessions/${activeSession.id}`}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs text-center shadow-lg transition block"
              >
                فتح السلايدات الآن
              </Link>
            </div>
          )}

          {/* Pending Assignment Card */}
          {activeAssignment && (
            <div className="p-6 rounded-3xl glass-panel border space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-amber-950 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                    واجب صفك الدراسي
                  </span>
                  <BookOpenCheck className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-base font-extrabold text-white">{activeAssignment.title}</h3>
                <p className="text-xs text-slate-300">{activeAssignment.grade} | الدرجة: {activeAssignment.maxScore} نقطة</p>
              </div>

              <Link
                href="/student/assignments"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs text-center shadow-lg transition block"
              >
                تقديم الحل
              </Link>
            </div>
          )}

        </div>

      </div>
    </BanShield>
  );
}
