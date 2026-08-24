'use client';

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { MessageSquareHeart, Star, ThumbsUp, Sparkles, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeedbackCenterPage() {
  const { dict, feedback } = useEduPulse();

  const avgRating = (
    feedback.reduce((acc, f) => acc + f.rating, 0) / (feedback.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <MessageSquareHeart className="w-7 h-7 text-rose-500" />
          <span>{dict.feedback.title}</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">{dict.feedback.subtitle}</p>
      </div>

      {/* Aggregate Rating Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Overall Rating Score */}
        <div className="p-6 rounded-3xl glass-panel border flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-4xl font-black text-amber-400 font-mono">{avgRating}</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400">{dict.feedback.avgRating}</span>
        </div>

        {/* Total Reviews */}
        <div className="p-6 rounded-3xl glass-panel border flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-4xl font-black text-brand-400 font-mono">{feedback.length}</span>
          <span className="text-xs font-bold text-slate-400">{dict.feedback.totalReviews}</span>
        </div>

        {/* Satisfaction Index */}
        <div className="p-6 rounded-3xl glass-panel border flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-4xl font-black text-emerald-400 font-mono">98%</span>
          <span className="text-xs font-bold text-slate-400">مؤشر رضا الطلاب عن جودة الشرح</span>
        </div>

      </div>

      {/* Student Reviews Feed */}
      <div className="p-6 rounded-3xl glass-panel border space-y-4">
        <h3 className="text-base font-extrabold text-white">{dict.feedback.studentReviews}</h3>

        <div className="space-y-4">
          {feedback.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white">{item.studentName}</h4>
                  <span className="text-[11px] text-slate-400">{item.sessionTitle}</span>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg bg-brand-950 text-brand-300 border border-brand-500/20 text-[10px] font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-200 italic leading-relaxed">"{item.comment}"</p>

              <span className="block text-[10px] text-slate-500 font-mono text-left rtl:text-left ltr:text-right">
                {new Date(item.submittedAt).toLocaleDateString('ar-EG')}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
