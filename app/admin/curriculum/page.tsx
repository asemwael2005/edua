'use client';

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { Map, CheckCircle2, Clock, Sparkles, BookOpen, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CurriculumRoadmapPage() {
  const { dict, curriculum, updateCurriculumMilestone } = useEduPulse();

  const totalProgress = Math.round(
    curriculum.reduce((acc, c) => acc + c.progressPercent, 0) / (curriculum.length || 1)
  );

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
        className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30 shadow-2xl space-y-4"
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
        {curriculum.map((item, idx) => {
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
                    ? 'bg-brand-500 border-brand-400 text-white animate-pulse'
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

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold font-mono self-start ${
                      isCompleted
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : isInProgress
                        ? 'bg-brand-950 text-brand-300 border border-brand-500/30'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {isCompleted ? dict.curriculum.completed : isInProgress ? dict.curriculum.inProgress : dict.curriculum.upcoming}
                  </span>
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
                        isCompleted ? 'bg-emerald-500' : isInProgress ? 'bg-brand-500' : 'bg-slate-700'
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
        })}
      </div>

    </div>
  );
}
