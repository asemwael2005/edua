'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { CurriculumMilestone } from '@/types/edupulse';
import { Map, CheckCircle2, Clock, Sparkles, BookOpen, ChevronLeft, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CurriculumRoadmapPage() {
  const { dict, curriculum, updateCurriculumMilestone, deleteCurriculumMilestone } = useEduPulse();
  const [deleteConfirmMilestone, setDeleteConfirmMilestone] = useState<CurriculumMilestone | null>(null);

  const totalProgress = Math.round(
    curriculum.reduce((acc, c) => acc + c.progressPercent, 0) / (curriculum.length || 1)
  );

  const handleConfirmDelete = () => {
    if (!deleteConfirmMilestone) return;
    deleteCurriculumMilestone(deleteConfirmMilestone.id);
    setDeleteConfirmMilestone(null);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <Map className="w-7 h-7 text-cyan-500" />
          <span>{dict.curriculum.title}</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">{dict.curriculum.subtitle}</p>
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
                      <span className="text-xs text-slate-400">المدة التقديرية: {item.estimatedWeeks}</span>
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
