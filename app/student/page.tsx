'use client';

import React, { useState } from 'react';
import { ChangeGradeModal } from '@/components/ChangeGradeModal';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { BanShield } from '@/components/BanShield';
import { isMatchingGrade, isContentVisibleToStudent } from '@/lib/gradeUtils';
import { normalizeAndValidateUrl } from '@/lib/videoUtils';
import { LiveStreamBanner } from '@/components/LiveStreamBanner';
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
  Radio,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function StudentDashboardPage() {
  const [isChangeGradeOpen, setIsChangeGradeOpen] = useState(false);
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
    activeLiveStream,
    language,
  } = useEduPulse();

  const currentStudent = activeStudent || students[0];
  if (!currentStudent) {
    return (
      <div className="p-12 text-center rounded-3xl glass-panel border space-y-5 text-white max-w-lg mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold">مرحباً بك في منصة إديو بلس التعليمية 👋</h3>
          <p className="text-xs text-slate-300">المنصة فارغة وجاهزة للشخص الحقيقي. يرجى تسجيل الدخول أو إنشاء حساب جديد للوصول للمحتوى.</p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-500/30 transition"
        >
          <span>تسجيل الدخول / إنشاء حساب جديد 🔑</span>
        </Link>
      </div>
    );
  }

  // Filter content strictly for the student's grade level and published status
  const gradeStudents = students.filter((s) => isMatchingGrade(s.grade, currentStudent.grade));
  const sortedGradeStudents = [...gradeStudents].sort((a, b) => b.totalPoints - a.totalPoints);
  const studentRank = sortedGradeStudents.findIndex((s) => s.id === currentStudent.id) + 1 || 1;

  const gradeQuizzes = quizzes.filter((q) => isContentVisibleToStudent(q, currentStudent.grade, currentStudent.id));
  const activeQuiz = gradeQuizzes.find((q) => q.isOpen) || gradeQuizzes[0];

  const gradeAssignments = assignments.filter((a) => isContentVisibleToStudent(a, currentStudent.grade, currentStudent.id));
  const activeAssignment = gradeAssignments[0];

  const gradeSessions = sessions.filter((s) => isContentVisibleToStudent(s, currentStudent.grade, currentStudent.id));
  const activeSession = gradeSessions[0];

  return (
    <BanShield student={currentStudent}>
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
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{currentStudent.grade}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsChangeGradeOpen(true)}
                    className="px-2.5 py-0.5 rounded-full bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 text-emerald-200 text-[11px] font-bold transition"
                    title="تعديل أو تغيير الصف الدراسي للحساب"
                  >
                    تعديل المرحلة ✏️
                  </button>
                  <ChangeGradeModal isOpen={isChangeGradeOpen} onClose={() => setIsChangeGradeOpen(false)} />
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight">أهلاً بك يا {currentStudent.name} 👋</h1>
                <p className="text-xs text-slate-300">مرحباً بك في منصة إديو بلس. تم تخصيص المحتوى بالكامل لـ ({currentStudent.grade}).</p>
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
            <span className="text-3xl font-black text-white font-mono">{currentStudent.attendanceRate}%</span>
            <p className="text-[11px] text-emerald-400 font-bold">نسبة انضباط ممتازة</p>
          </div>

          {/* Cumulative Score */}
          <div className="p-5 rounded-2xl glass-panel border space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>{dict.scorecard.ledgerTitle}</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-3xl font-black text-amber-400 font-mono">{currentStudent.totalPoints} ن</span>
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
          
          {/* Active Quiz Cards for Grade */}
          {gradeQuizzes.map((quiz) => (
            <div key={quiz.id} className="p-6 rounded-3xl glass-panel border space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
                    اختبار خاص بصفك 📝
                  </span>
                  <Clock className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-base font-extrabold text-white">{quiz.title}</h3>
                <p className="text-xs text-slate-300">
                  {quiz.grade} | {quiz.durationMinutes} دقيقة | {quiz.questions.length} أسئلة
                </p>
              </div>

              <Link
                href={`/student/quizzes/${quiz.id}`}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs text-center shadow-lg transition block"
              >
                {dict.quizzes.startQuiz} 🚀
              </Link>
            </div>
          ))}

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
