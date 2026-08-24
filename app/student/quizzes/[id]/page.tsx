'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { BanShield } from '@/components/BanShield';
import { QuizSubmissionAnswer } from '@/types/edupulse';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function InteractiveQuizPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { dict, quizzes, activeStudent, submitQuiz, showToast } = useEduPulse();

  const quizId = (params?.id as string) || 'quiz_1';
  const targetQuiz = quizzes.find((q) => q.id === quizId) || quizzes[0];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number | boolean | null>>({});
  const [secondsLeft, setSecondsLeft] = useState((targetQuiz?.durationMinutes || 20) * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

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

  if (!activeStudent || !targetQuiz) return null;

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
      studentId: activeStudent.id,
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

  return (
    <BanShield student={activeStudent}>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        
        {/* Header Bar */}
        <div className="p-6 rounded-3xl glass-panel border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-purple-400 font-mono">اختبار إلكتروني موقّت</span>
            <h1 className="text-xl font-extrabold text-white">{targetQuiz.title}</h1>
          </div>

          {!isSubmitted && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 font-mono font-black text-lg">
              <Clock className="w-5 h-5 text-rose-400 animate-pulse" />
              <span>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {!isSubmitted ? (
          /* ACTIVE EXAM UI */
          <div className="space-y-6">
            
            {/* Question Navigator Pills */}
            <div className="flex items-center gap-2 overflow-x-auto p-2 rounded-2xl bg-slate-900 border border-slate-800">
              {targetQuiz.questions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCurrent = idx === currentQIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`w-9 h-9 rounded-xl font-extrabold text-xs transition flex items-center justify-center font-mono ${
                      isCurrent
                        ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-400'
                        : isAnswered
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
              className="p-8 rounded-3xl glass-panel border space-y-6 min-h-[320px] flex flex-col justify-between"
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

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                          className={`w-full p-4 rounded-2xl border text-right rtl:text-right ltr:text-left text-xs font-extrabold transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-purple-950/80 border-purple-500 text-purple-200 shadow-lg'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{opt}</span>
                          <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono">
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
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      صح (True)
                    </button>

                    <button
                      onClick={() => handleSelectOption(currentQuestion.id, false)}
                      className={`p-4 rounded-2xl border text-center font-extrabold text-xs transition ${
                        selectedAnswers[currentQuestion.id] === false
                          ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      خطأ (False)
                    </button>
                  </div>
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
                    تسليم الاختبار النهائي
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
          /* INSTANT RESULTS BREAKDOWN UI */
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            
            {/* Score Banner */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-emerald-500/30 text-center space-y-4 shadow-2xl glow-emerald">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-3xl font-black font-mono">
                {submissionResult.percentage}%
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">{dict.quizzes.scoreResult}</h2>
                <p className="text-sm font-extrabold text-emerald-400 mt-1">
                  {submissionResult.percentage >= 60 ? dict.quizzes.passed : dict.quizzes.failed}
                </p>
              </div>

              <div className="inline-flex items-center gap-4 px-5 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-slate-300">
                <span>الدرجة: {submissionResult.totalScore} / {submissionResult.maxScore}</span>
                <span>الوقت: {Math.round(submissionResult.timeSpentSeconds / 60)} دقيقة</span>
              </div>
            </div>

            {/* Answer Breakdown Details */}
            <div className="p-6 rounded-3xl glass-panel border space-y-4">
              <h3 className="text-base font-extrabold text-white">{dict.quizzes.breakdownTitle}</h3>

              <div className="space-y-4">
                {targetQuiz.questions.map((q, idx) => {
                  const ans = submissionResult.answers.find((a: any) => a.questionId === q.id);
                  const isCorrect = ans?.isCorrect;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border space-y-2 text-xs font-semibold ${
                        isCorrect ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-rose-950/30 border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">س {idx + 1}: {q.text}</span>
                        {isCorrect ? (
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold">إجابة صحيحة (+{q.points})</span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-400 font-bold">إجابة خاطئة (0)</span>
                        )}
                      </div>

                      <p className="text-slate-300">
                        {dict.quizzes.explanationLabel} <span className="text-brand-300">{q.explanation}</span>
                      </p>
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
