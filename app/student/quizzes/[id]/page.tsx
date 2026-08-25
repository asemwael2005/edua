'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { BanShield } from '@/components/BanShield';
import { QuizSubmissionAnswer } from '@/types/edupulse';
import { isMatchingGrade } from '@/lib/gradeUtils';
import {
  Clock,
  CheckCircle2,
  HelpCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Check,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function InteractiveQuizPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { dict, quizzes, activeStudent, students, submitQuiz, quizSubmissions } = useEduPulse();

  const currentStudent = activeStudent || students[0];

  const rawQuizId = (params?.id as string) || 'quiz_1';
  const cleanQuizId = rawQuizId.split('/')[0];

  const gradeQuizzes = currentStudent ? quizzes.filter((q) => isMatchingGrade(q.grade, currentStudent.grade)) : quizzes;
  const targetQuiz =
    quizzes.find((q) => q.id === rawQuizId || q.id === cleanQuizId) ||
    gradeQuizzes[0] ||
    quizzes[0];

  // Check if student already submitted this quiz before
  const existingSubmission = quizSubmissions.find(
    (s) => s.quizId === targetQuiz?.id && currentStudent && s.studentId === currentStudent.id
  );

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | boolean | null>>({});
  const [secondsLeft, setSecondsLeft] = useState((targetQuiz?.durationMinutes || 15) * 60);
  const [isSubmitted, setIsSubmitted] = useState(!!existingSubmission);
  const [submissionResult, setSubmissionResult] = useState<any>(existingSubmission || null);

  // Timer countdown effect
  useEffect(() => {
    if (isSubmitted || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, secondsLeft]);

  if (!currentStudent || !targetQuiz) return null;

  const currentQuestion = targetQuiz.questions[currentQIndex];

  const handleSelectOption = (questionId: string, val: number | boolean) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  };

  const handleFinalSubmit = () => {
    let totalScore = 0;
    let maxScore = 0;

    const answersList: QuizSubmissionAnswer[] = targetQuiz.questions.map((q) => {
      maxScore += q.points;
      const userChoice = selectedAnswers[q.id];
      const isCorrect = userChoice === q.correctAnswer;
      const pointsEarned = isCorrect ? q.points : 0;
      totalScore += pointsEarned;

      return {
        questionId: q.id,
        selectedAnswer: userChoice ?? null,
        isCorrect,
        pointsEarned,
      };
    });

    const percentage = Math.round((totalScore / (maxScore || 1)) * 100);

    const result = {
      quizId: targetQuiz.id,
      studentId: currentStudent.id,
      answers: answersList,
      totalScore,
      maxScore,
      percentage,
      timeSpentSeconds: targetQuiz.durationMinutes * 60 - secondsLeft,
    };

    setSubmissionResult(result);
    setIsSubmitted(true);
    submitQuiz(result);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // Instant per-question evaluation helper
  const hasAnsweredCurrent = selectedAnswers[currentQuestion.id] !== undefined;
  const userChoiceCurrent = selectedAnswers[currentQuestion.id];
  const isCurrentCorrect = userChoiceCurrent === currentQuestion.correctAnswer;

  let currentCorrectText = '';
  if (currentQuestion.type === 'mcq' && currentQuestion.options) {
    currentCorrectText = currentQuestion.options[Number(currentQuestion.correctAnswer)] || '';
  } else if (currentQuestion.type === 'true_false') {
    currentCorrectText = currentQuestion.correctAnswer ? 'صح (True)' : 'خطأ (False)';
  }

  return (
    <BanShield student={currentStudent}>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        
        {/* Header Bar */}
        <div className="p-6 rounded-3xl glass-panel border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 font-mono">
              <Link href="/student/quizzes" className="hover:underline text-slate-400">الاختبارات الإلكترونية</Link>
              <span>/</span>
              <span>{targetQuiz.grade}</span>
            </div>
            <h1 className="text-xl font-extrabold text-white mt-1">{targetQuiz.title}</h1>
          </div>

          {!isSubmitted && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono font-black text-lg shrink-0">
              <Clock className="w-5 h-5 text-purple-400 animate-pulse" />
              <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {!isSubmitted ? (
          /* ACTIVE EXAM WITH CLEAN INSTANT FEEDBACK */
          <div className="space-y-6">
            
            {/* Question Navigator Pills */}
            <div className="flex items-center gap-2 overflow-x-auto p-2 rounded-2xl bg-slate-900 border border-slate-800">
              {targetQuiz.questions.map((q, idx) => {
                const isAns = selectedAnswers[q.id] !== undefined;
                const isCurr = idx === currentQIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`w-9 h-9 rounded-xl font-extrabold text-xs transition flex items-center justify-center font-mono ${
                      isCurr
                        ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-400'
                        : isAns
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Current Question Card */}
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 sm:p-8 rounded-3xl glass-panel border space-y-6 min-h-[340px] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    السؤال {currentQIndex + 1} من {targetQuiz.questions.length}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-mono text-xs font-bold">
                    {currentQuestion.points} نقاط
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-white leading-relaxed">{currentQuestion.text}</h3>

                {/* MCQ Options */}
                {currentQuestion.type === 'mcq' && currentQuestion.options && (
                  <div className="space-y-3 pt-2">
                    {currentQuestion.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
                      const isCorrectChoice = optIdx === currentQuestion.correctAnswer;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                          className={`w-full p-4 rounded-2xl border text-right rtl:text-right ltr:text-left text-xs font-extrabold transition flex items-center justify-between ${
                            isSelected
                              ? isCorrectChoice
                                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-lg ring-1 ring-emerald-400'
                                : 'bg-purple-950/90 border-purple-500 text-purple-200 shadow-lg ring-1 ring-purple-400'
                              : hasAnsweredCurrent && isCorrectChoice
                              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{opt}</span>
                          <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-mono font-bold ${
                            isSelected
                              ? isCorrectChoice
                                ? 'bg-emerald-600 border-emerald-400 text-white'
                                : 'bg-purple-600 border-purple-400 text-white'
                              : 'border-slate-700 text-slate-400'
                          }`}>
                            {['أ', 'ب', 'ج', 'د'][optIdx]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* True / False Options */}
                {currentQuestion.type === 'true_false' && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button
                      onClick={() => handleSelectOption(currentQuestion.id, true)}
                      className={`p-4 rounded-2xl border text-center font-extrabold text-xs transition ${
                        selectedAnswers[currentQuestion.id] === true
                          ? currentQuestion.correctAnswer === true
                            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-lg ring-1 ring-emerald-400'
                            : 'bg-purple-950/90 border-purple-500 text-purple-300 shadow-lg ring-1 ring-purple-400'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      صح (True)
                    </button>

                    <button
                      onClick={() => handleSelectOption(currentQuestion.id, false)}
                      className={`p-4 rounded-2xl border text-center font-extrabold text-xs transition ${
                        selectedAnswers[currentQuestion.id] === false
                          ? currentQuestion.correctAnswer === false
                            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-lg ring-1 ring-emerald-400'
                            : 'bg-purple-950/90 border-purple-500 text-purple-300 shadow-lg ring-1 ring-purple-400'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      خطأ (False)
                    </button>
                  </div>
                )}

                {/* --- ⚡ CLEAN INSTANT FEEDBACK & SOLUTION BOX (NO RED BANNERS) --- */}
                {hasAnsweredCurrent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border border-slate-800 bg-slate-950 space-y-3 pt-4 font-sans text-xs"
                  >
                    {isCurrentCorrect ? (
                      <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-extrabold flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>إجابة صحيحة (+{currentQuestion.points} نقاط) 🎉</span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold space-y-1">
                        <span className="text-[10px] text-slate-400 block font-sans">الإجابة النموذجية الصحيحة 🌟:</span>
                        <span className="font-extrabold text-sm underline">{currentCorrectText}</span>
                      </div>
                    )}

                    {currentQuestion.explanation && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-brand-500/30 text-brand-200 space-y-1">
                        <div className="flex items-center gap-1.5 text-brand-400 font-bold">
                          <BookOpen className="w-4 h-4" />
                          <span>💡 الشرح والخطوات التفصيلية للحل:</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed pt-1">{currentQuestion.explanation}</p>
                      </div>
                    )}
                  </motion.div>
                )}

              </div>

              {/* Bottom Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1 transition"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  <span>السابق</span>
                </button>

                {currentQIndex === targetQuiz.questions.length - 1 ? (
                  <button
                    onClick={handleFinalSubmit}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition"
                  >
                    تسليم الاختبار المكتمل 🚀
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQIndex((prev) => Math.min(targetQuiz.questions.length - 1, prev + 1))}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition shadow-lg"
                  >
                    <span>السؤال التالي</span>
                    <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          /* INSTANT RESULTS BREAKDOWN & DETAILED CORRECTIONS UI */
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            
            {/* Score Banner */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 text-center space-y-4 shadow-2xl glow-emerald">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-3xl font-black font-mono shadow-inner">
                {submissionResult?.percentage || 0}%
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">{dict.quizzes.scoreResult}</h2>
                <p className="text-sm font-extrabold text-emerald-400 mt-1">
                  {(submissionResult?.percentage || 0) >= 60 ? 'ممتاز! لقد اجتزت الاختبار بنجاح 🎉' : 'تم أداء الاختبار وحفظ النتائج 🔄'}
                </p>
              </div>

              <div className="inline-flex items-center gap-4 px-5 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-slate-300">
                <span>الدرجة: {submissionResult?.totalScore || 0} / {submissionResult?.maxScore || 0}</span>
                <span>•</span>
                <span>الأسئلة الصحيحة: {submissionResult?.answers.filter((a: any) => a.isCorrect).length} من {targetQuiz.questions.length}</span>
              </div>
            </div>

            {/* Answer Breakdown Details */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>تفيصيل الإجابات والتصحيح النموذجية لكل سؤال 📊</span>
                </h3>

                <Link
                  href="/student/quizzes"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  <span>العودة للألعاب والاختبارات</span>
                </Link>
              </div>

              <div className="space-y-6">
                {targetQuiz.questions.map((q, idx) => {
                  const ans = submissionResult?.answers.find((a: any) => a.questionId === q.id);
                  const isCorrect = ans?.isCorrect;
                  const userChoice = ans?.selectedAnswer;

                  // Get text representation of student selection vs correct choice
                  let studentAnswerText = 'لم يجاوب الطالب';
                  let correctAnswerText = '';

                  if (q.type === 'mcq' && q.options) {
                    correctAnswerText = q.options[Number(q.correctAnswer)] || '';
                    if (typeof userChoice === 'number') {
                      studentAnswerText = q.options[userChoice] || '';
                    }
                  } else if (q.type === 'true_false') {
                    correctAnswerText = q.correctAnswer ? 'صح (True)' : 'خطأ (False)';
                    if (typeof userChoice === 'boolean') {
                      studentAnswerText = userChoice ? 'صح (True)' : 'خطأ (False)';
                    }
                  }

                  return (
                    <div
                      key={q.id}
                      className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 space-y-4 text-xs font-semibold shadow-lg"
                    >
                      {/* Question Header & Correctness Badge */}
                      <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                        <span className="font-extrabold text-sm text-white leading-relaxed">
                          س {idx + 1}: {q.text}
                        </span>

                        {isCorrect ? (
                          <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shrink-0 flex items-center gap-1">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>إجابة صحيحة (+{q.points} ن)</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 font-bold shrink-0">
                            درجة السؤال: 0 من {q.points}
                          </span>
                        )}
                      </div>

                      {/* Choices Comparison Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                        {/* Student Selected Choice */}
                        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300">
                          <span className="text-[10px] text-slate-400 block font-sans">إجابتك التي اخترتها:</span>
                          <span className="font-bold text-sm mt-0.5 block">{studentAnswerText}</span>
                        </div>

                        {/* Correct Answer Choice */}
                        <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200">
                          <span className="text-[10px] text-emerald-400 block font-sans">الإجابة الصحيحة النموذجية 🌟:</span>
                          <span className="font-bold text-sm mt-0.5 block">{correctAnswerText}</span>
                        </div>
                      </div>

                      {/* Solution Explanation */}
                      {q.explanation && (
                        <div className="p-4 rounded-2xl bg-slate-950 border border-brand-500/30 text-brand-200 space-y-1">
                          <div className="flex items-center gap-1.5 text-brand-400 font-bold">
                            <BookOpen className="w-4 h-4" />
                            <span>💡 الشرح التفصيلي للحل وتفسير الإجابة:</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed pt-1 font-sans">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </BanShield>
  );
}
