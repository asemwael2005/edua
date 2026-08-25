'use client';

import React from 'react';
import Link from 'next/link';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { BanShield } from '@/components/BanShield';
import { isMatchingGrade } from '@/lib/gradeUtils';
import { FileCheck2, Clock, CheckCircle2, Play, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentQuizzesIndexPage() {
  const { dict, quizzes, quizSubmissions, activeStudent, students } = useEduPulse();

  const currentStudent = activeStudent || students[0];
  if (!currentStudent) return null;

  // Filter quizzes strictly for current student's grade level
  const filteredQuizzes = quizzes.filter((q) => isMatchingGrade(q.grade, currentStudent.grade));

  return (
    <BanShield student={currentStudent}>
      <div className="space-y-8 pb-12">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <FileCheck2 className="w-7 h-7 text-purple-500" />
              <span>استوديو الاختبارات التفاعلية</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              الاختبارات الإلكترونية والتقييم الفوري المخصص لـ ({currentStudent.grade})
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold font-mono self-start sm:self-auto">
            {currentStudent.grade}
          </span>
        </div>

        {/* Quizzes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredQuizzes.length === 0 ? (
            <div className="col-span-full p-12 text-center rounded-3xl glass-panel border space-y-2">
              <FileCheck2 className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">لا توجد اختبارات إلكترونية متاحة لصفك الدراسي حالياً</h4>
              <p className="text-xs text-slate-500">سيتم إضافة اختبارات جديدة لـ {currentStudent.grade} قريباً</p>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => {
              const mySubmission = quizSubmissions.find(
                (s) => s.quizId === quiz.id && s.studentId === currentStudent.id
              );

              return (
                <div
                  key={quiz.id}
                  className="p-6 rounded-3xl glass-panel border space-y-4 hover:border-purple-500/40 transition duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
                        {quiz.subject}
                      </span>

                      {mySubmission ? (
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تم الأداء ({mySubmission.percentage}%)</span>
                        </span>
                      ) : quiz.isOpen ? (
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                          متاح الآن 🚀
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-400 text-[11px] font-bold">
                          مغلق حالياً
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-white leading-snug">{quiz.title}</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      المدة: {quiz.durationMinutes} دقيقة | عدد الأسئلة: {quiz.questions.length} سؤال | {quiz.grade}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                    {mySubmission ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          النتيجة: {mySubmission.totalScore} / {mySubmission.maxScore} نقطة
                        </span>

                        <Link
                          href={`/student/quizzes/${quiz.id}`}
                          className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center gap-1.5 transition"
                        >
                          <Award className="w-4 h-4 text-purple-400" />
                          <span>مراجعة الإجابات والحلول 📊</span>
                        </Link>
                      </div>
                    ) : (
                      <Link
                        href={`/student/quizzes/${quiz.id}`}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs text-center shadow-lg transition flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>بدء هذا الاختبار الآن</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </BanShield>
  );
}
