'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { Quiz, Question, QuestionType } from '@/types/edupulse';
import {
  FileCheck2,
  Plus,
  Clock,
  Calendar,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Trash2,
  Eye,
  Award,
  AlertTriangle,
  X,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizzesAdminPage() {
  const { dict, quizzes, createQuiz, toggleQuizStatus, quizSubmissions, students } = useEduPulse();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [analyticsQuiz, setAnalyticsQuiz] = useState<Quiz | null>(null);

  // New Quiz Form State
  const [quizTitle, setQuizTitle] = useState('');
  const [quizSubject, setQuizSubject] = useState('الرياضيات');
  const [quizGrade, setQuizGrade] = useState('الصف الأول الثانوي (Grade 10)');
  const [quizDuration, setQuizDuration] = useState(15);
  const [quizStart, setQuizStart] = useState(new Date().toISOString().slice(0, 16));
  const [quizEnd, setQuizEnd] = useState(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16));

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q_new_1',
      text: 'إذا كان مميز المعادلة التربيعية س² - 6س + ك = 0 يقع في حقيقيين متساويين، فإن قيمة ك تساوي:',
      type: 'mcq',
      options: ['9', '6', '36', '-9'],
      correctAnswer: 0,
      explanation: 'المميز ب² - 4أ جـ = 0  =>  (-6)² - 4(1)(ك) = 0  =>  36 - 4ك = 0  =>  ك = 9.',
      points: 5,
    },
  ]);

  // Question Creator Temp State
  const [tempQText, setTempQText] = useState('');
  const [tempQType, setTempQType] = useState<QuestionType>('mcq');
  const [tempOpt1, setTempOpt1] = useState('');
  const [tempOpt2, setTempOpt2] = useState('');
  const [tempOpt3, setTempOpt3] = useState('');
  const [tempOpt4, setTempOpt4] = useState('');
  const [tempCorrect, setTempCorrect] = useState<number>(0);
  const [tempExplanation, setTempExplanation] = useState('');

  const handleAddQuestion = () => {
    if (!tempQText) return;

    const newQ: Question = {
      id: `q_${Date.now()}`,
      text: tempQText,
      type: tempQType,
      options: tempQType === 'mcq' ? [tempOpt1, tempOpt2, tempOpt3, tempOpt4] : ['صح (True)', 'خطأ (False)'],
      correctAnswer: tempQType === 'mcq' ? tempCorrect : tempCorrect === 0,
      explanation: tempExplanation,
      points: 5,
    };

    setQuestions([...questions, newQ]);
    setTempQText('');
    setTempOpt1('');
    setTempOpt2('');
    setTempOpt3('');
    setTempOpt4('');
    setTempCorrect(0);
    setTempExplanation('');
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle || questions.length === 0) return;

    createQuiz({
      title: quizTitle,
      subject: quizSubject,
      grade: quizGrade,
      durationMinutes: quizDuration,
      scheduledStart: new Date(quizStart).toISOString(),
      scheduledEnd: new Date(quizEnd).toISOString(),
      isOpen: true,
      questions,
    });

    setIsCreateModalOpen(false);
    setQuizTitle('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <FileCheck2 className="w-7 h-7 text-purple-500" />
            <span>{dict.quizzes.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">إنشاء الاختبارات وتحديد الإجابات النموذجية لكل صف دراسي</p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center gap-2 shrink-0 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{dict.quizzes.createQuiz}</span>
        </button>
      </div>

      {/* Quiz List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => {
          const subs = quizSubmissions.filter((s) => s.quizId === quiz.id);

          return (
            <div
              key={quiz.id}
              className="p-6 rounded-3xl glass-panel border space-y-4 hover:border-purple-500/40 transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-purple-950/80 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
                    {quiz.subject} | {quiz.grade}
                  </span>

                  {/* Open / Close Manual Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleQuizStatus(quiz.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                      quiz.isOpen
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {quiz.isOpen ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-rose-400" />}
                    <span>{quiz.isOpen ? dict.quizzes.open : dict.quizzes.closed}</span>
                  </button>
                </div>

                <h3 className="text-base font-extrabold text-white">{quiz.title}</h3>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>المدة: {quiz.durationMinutes} دقيقة</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>الأسئلة: {quiz.questions.length} سؤال</span>
                  </div>
                </div>
              </div>

              {/* Footer Analytics Shortcut */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  إجمالي التسليمات: <span className="text-white font-bold font-mono">{subs.length} طالب</span>
                </span>

                <button
                  type="button"
                  onClick={() => setAnalyticsQuiz(quiz)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>{dict.quizzes.viewSubmissions}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- CREATE QUIZ MODAL --- */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl w-full p-6 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-extrabold">{dict.quizzes.createQuiz}</h3>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveQuiz} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-300">عنوان الاختبار</label>
                  <input
                    type="text"
                    required
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="مثال: اختبار الجبر والمعادلات - الصف الأول الثانوي"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300">المادة الدراسية</label>
                    <input
                      type="text"
                      value={quizSubject}
                      onChange={(e) => setQuizSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300">الصف الدراسي المستهدف</label>
                    <select
                      value={quizGrade}
                      onChange={(e) => setQuizGrade(e.target.value)}
                      className="w-full px-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-[11px]"
                    >
                      <option value="الصف الأول الثانوي (Grade 10)">الصف الأول الثانوي (Grade 10)</option>
                      <option value="الصف الثاني الثانوي (Grade 11)">الصف الثاني الثانوي (Grade 11)</option>
                      <option value="الصف الثالث الثانوي (Grade 12)">الصف الثالث الثانوي (Grade 12)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300">{dict.quizzes.durationMinutes}</label>
                    <input
                      type="number"
                      value={quizDuration}
                      onChange={(e) => setQuizDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Question Creator Widget */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="font-extrabold text-purple-300 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-purple-400" />
                    <span>إضافة سؤال جديد وتحديد الإجابة النموذجية 🌟</span>
                  </h4>
                  
                  <div className="space-y-1">
                    <label className="text-slate-400">نوع السؤال</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTempQType('mcq')}
                        className={`p-2 rounded-xl border font-bold transition ${
                          tempQType === 'mcq'
                            ? 'bg-purple-950 border-purple-500 text-purple-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        اختيار من متعدد (MCQ)
                      </button>

                      <button
                        type="button"
                        onClick={() => setTempQType('true_false')}
                        className={`p-2 rounded-xl border font-bold transition ${
                          tempQType === 'true_false'
                            ? 'bg-purple-950 border-purple-500 text-purple-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        صح أم خطأ (True / False)
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={tempQText}
                    onChange={(e) => setTempQText(e.target.value)}
                    placeholder="نص السؤال..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />

                  {tempQType === 'mcq' ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={tempOpt1}
                          onChange={(e) => setTempOpt1(e.target.value)}
                          placeholder="الخيار الأول (أ)"
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                        />
                        <input
                          type="text"
                          value={tempOpt2}
                          onChange={(e) => setTempOpt2(e.target.value)}
                          placeholder="الخيار الثاني (ب)"
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                        />
                        <input
                          type="text"
                          value={tempOpt3}
                          onChange={(e) => setTempOpt3(e.target.value)}
                          placeholder="الخيار الثالث (ج)"
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                        />
                        <input
                          type="text"
                          value={tempOpt4}
                          onChange={(e) => setTempOpt4(e.target.value)}
                          placeholder="الخيار الرابع (د)"
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                        />
                      </div>

                      {/* Correct Option Selector for MCQ */}
                      <div className="space-y-1 pt-1">
                        <label className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" />
                          <span>اختر الخيار الصحيح (الإجابة النموذجية 🌟):</span>
                        </label>
                        <select
                          value={tempCorrect}
                          onChange={(e) => setTempCorrect(Number(e.target.value))}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-emerald-500/60 text-emerald-300 font-bold focus:outline-none"
                        >
                          <option value={0}>الخيار الأول (أ): {tempOpt1 || 'أ'}</option>
                          <option value={1}>الخيار الثاني (ب): {tempOpt2 || 'ب'}</option>
                          <option value={2}>الخيار الثالث (ج): {tempOpt3 || 'ج'}</option>
                          <option value={3}>الخيار الرابع (د): {tempOpt4 || 'د'}</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    /* Correct Option Selector for True / False */
                    <div className="space-y-1 pt-1">
                      <label className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        <span>اختر الإجابة النموذجية الصحيحة:</span>
                      </label>
                      <select
                        value={tempCorrect}
                        onChange={(e) => setTempCorrect(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-emerald-500/60 text-emerald-300 font-bold focus:outline-none"
                      >
                        <option value={0}>صح (True) 🟢</option>
                        <option value={1}>خطأ (False) 🔴</option>
                      </select>
                    </div>
                  )}

                  <textarea
                    rows={2}
                    value={tempExplanation}
                    onChange={(e) => setTempExplanation(e.target.value)}
                    placeholder="الشرح والتفسير التفصيلي للإجابة ليظهر للطالب عند الإجابة..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow"
                  >
                    إضافة السؤال لقائمة أسئلة الاختبار ({questions.length})
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold shadow-lg"
                  >
                    حفظ ونشر الاختبار
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SUBMISSION ANALYTICS MODAL --- */}
      <AnimatePresence>
        {analyticsQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl w-full p-6 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-extrabold">{analyticsQuiz.title}</h3>
                  <p className="text-xs text-slate-400">تحليل نتائج الإجابات والأخطاء الشائعة</p>
                </div>
                <button type="button" onClick={() => setAnalyticsQuiz(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Submissions List */}
              <div className="space-y-3">
                {quizSubmissions
                  .filter((s) => s.quizId === analyticsQuiz.id)
                  .map((sub) => {
                    const st = students.find((s) => s.id === sub.studentId);

                    return (
                      <div key={sub.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={st?.avatar} alt={st?.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <h4 className="text-xs font-bold text-white">{st?.name}</h4>
                            <span className="text-[10px] text-slate-400 font-mono">
                              الوقت المستغرق: {Math.round(sub.timeSpentSeconds / 60)} دقيقة
                            </span>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <span className="block text-sm font-black text-amber-400">{sub.totalScore} / {sub.maxScore}</span>
                          <span className="text-[10px] text-emerald-400 font-bold">{sub.percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
