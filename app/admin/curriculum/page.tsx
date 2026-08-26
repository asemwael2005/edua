'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { CurriculumMilestone } from '@/types/edupulse';
import { Map, CheckCircle2, Clock, Sparkles, BookOpen, ChevronLeft, Trash2, AlertTriangle, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CurriculumRoadmapPage() {
  const { dict, curriculum, addCurriculumMilestone, deleteCurriculumMilestone } = useEduPulse();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmMilestone, setDeleteConfirmMilestone] = useState<CurriculumMilestone | null>(null);

  // Form State for New Milestone
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('الرياضيات');
  const [grade, setGrade] = useState('الصف الأول الثانوي (Grade 10)');
  const [status, setStatus] = useState<'completed' | 'in_progress' | 'upcoming'>('in_progress');
  const [progressPercent, setProgressPercent] = useState(0);
  const [estimatedWeeks, setEstimatedWeeks] = useState('3 أسابيع');
  const [topicsInput, setTopicsInput] = useState('');

  const totalProgress = Math.round(
    curriculum.reduce((acc, c) => acc + c.progressPercent, 0) / (curriculum.length || 1)
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const topics = topicsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addCurriculumMilestone({
      title,
      subject,
      grade,
      status,
      progressPercent,
      estimatedWeeks,
      topics: topics.length > 0 ? topics : ['مفاهيم الوحدة الأساسية', 'تمارين وتطبيقات عملية'],
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setTopicsInput('');
    setProgressPercent(0);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmMilestone) return;
    deleteCurriculumMilestone(deleteConfirmMilestone.id);
    setDeleteConfirmMilestone(null);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Map className="w-7 h-7 text-cyan-500" />
            <span>{dict.curriculum.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">{dict.curriculum.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 shrink-0 transition"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة وحدة في الخطة الدراسية 🎯</span>
        </button>
      </div>

      {/* Overall Progress Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30 shadow-2xl space-y-4 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">{dict.curriculum.overallProgress}</h3>
              <p className="text-xs text-slate-400">إنجاز الخطة الزمنية للمنهج الدراسي</p>
            </div>
          </div>
          <span className="text-3xl font-black text-cyan-400 font-mono">{totalProgress}%</span>
        </div>

        <div className="h-3.5 w-full bg-slate-950 rounded-full p-0.5 border border-cyan-500/20 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-cyan-500 to-brand-500 rounded-full"
          />
        </div>
      </motion.div>

      {/* Timeline Milestones list */}
      <div className="space-y-6 relative before:absolute before:inset-y-0 ltr:before:left-6 rtl:before:right-6 before:w-0.5 before:bg-slate-800">
        {curriculum.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border space-y-3">
            <Map className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-300">لا توجد وحدات بالخطة الدراسية حالياً</h4>
            <p className="text-xs text-slate-500">اضغط على زر "إضافة وحدة في الخطة الدراسية" لبدء إضافة فصول المنهج</p>
          </div>
        ) : (
          curriculum.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            const isInProgress = item.status === 'in_progress';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative ltr:pl-14 rtl:pr-14"
              >
                {/* Timeline Icon Badge */}
                <div
                  className={`absolute ltr:left-3.5 rtl:right-3.5 top-5 -translate-x-1/2 rtl:translate-x-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-white'
                      : isInProgress
                      ? 'bg-cyan-500 border-cyan-400 text-white animate-pulse'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}
                >
                  {idx + 1}
                </div>

                {/* Content Box */}
                <div className="p-6 rounded-3xl glass-panel border space-y-4 hover:border-cyan-500/40 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                      <span className="text-xs text-slate-400">المدة التقديرية: {item.estimatedWeeks} | {item.subject} | {item.grade}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-bold font-mono ${
                          isCompleted
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : isInProgress
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                            : 'bg-slate-950 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {isCompleted ? dict.curriculum.completed : isInProgress ? dict.curriculum.inProgress : dict.curriculum.upcoming}
                      </span>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmMilestone(item)}
                        className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 text-rose-300 transition"
                        title="مسح هذه الوحدة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar per chapter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>نسبة إتمام الفصل</span>
                      <span className="font-mono">{item.progressPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-cyan-500' : 'bg-slate-700'
                        }`}
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Topics list */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-slate-400 mb-2">{dict.curriculum.topics}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.topics.map((topic, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* --- CREATE MILESTONE MODAL --- */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold">إضافة وحدة جديدة للخطة الدراسية</h3>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-300">عنوان الوحدة / الفصل الدراسي</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: الوحدة الرابعة: الهندسة الفراغية والمنتجهات"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300">المادة الدراسية</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300">الصف الدراسي المستهدف</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-2 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-[11px]"
                    >
                      <option value="الصف الأول الثانوي (Grade 10)">الصف الأول الثانوي (Grade 10)</option>
                      <option value="الصف الثاني الثانوي (Grade 11)">الصف الثاني الثانوي (Grade 11)</option>
                      <option value="الصف الثالث الثانوي (Grade 12)">الصف الثالث الثانوي (Grade 12)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300">حالة الإنجاز</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-[11px]"
                    >
                      <option value="in_progress">قيد التنفيذ (In Progress)</option>
                      <option value="upcoming">قادمة (Upcoming)</option>
                      <option value="completed">مكتملة (Completed)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300">نسبة الإتمام %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={progressPercent}
                      onChange={(e) => setProgressPercent(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300">المدة التقديرية</label>
                    <input
                      type="text"
                      value={estimatedWeeks}
                      onChange={(e) => setEstimatedWeeks(e.target.value)}
                      placeholder="4 أسابيع"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">مواضيع الدرس (افصل بينها بفاصلة ,)</label>
                  <textarea
                    rows={3}
                    value={topicsInput}
                    onChange={(e) => setTopicsInput(e.target.value)}
                    placeholder="مثال: المتجهات في الفراغ, معادلة الخط المستقيم, معادلة المستوى..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
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
                    className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20"
                  >
                    حفظ وإضافة الوحدة
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CONFIRM DELETE MILESTONE MODAL --- */}
      <AnimatePresence>
        {deleteConfirmMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-rose-500/40 shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-bold text-xl shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">تأكيد مسح وحدة المنهج نهائياً 🗑️</h3>
                  <p className="text-xs text-rose-300 mt-0.5 font-bold">{deleteConfirmMilestone.title}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                سيتم إزالة هذه الوحدة الدراسية من الخطة الزمنية للمنهج. هل أنت متأكد من الحذف؟
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmMilestone(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-500/30 transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>نعم، مسح الوحدة 🗑️</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
