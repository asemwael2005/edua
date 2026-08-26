'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { SessionFeedback } from '@/types/edupulse';
import { MessageSquareHeart, Star, ThumbsUp, Sparkles, MessageCircle, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeedbackCenterPage() {
  const { dict, feedback, deleteSessionFeedback } = useEduPulse();
  const [deleteConfirmFb, setDeleteConfirmFb] = useState<SessionFeedback | null>(null);

  const avgRating = (
    feedback.reduce((acc, f) => acc + f.rating, 0) / (feedback.length || 1)
  ).toFixed(1);

  const handleConfirmDelete = () => {
    if (!deleteConfirmFb) return;
    deleteSessionFeedback(deleteConfirmFb.id);
    setDeleteConfirmFb(null);
  };

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
          <span className="text-4xl font-black text-purple-400 font-mono">{feedback.length}</span>
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

        {feedback.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <MessageSquareHeart className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs font-bold">لا توجد تقييمات مضافة حالياً</p>
          </div>
        ) : (
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

                  <div className="flex items-center gap-3">
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

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmFb(item)}
                      className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 text-rose-300 transition"
                      title="مسح هذا التقييم"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-purple-950 text-purple-300 border border-purple-500/20 text-[10px] font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-200 italic leading-relaxed">"{item.comment}"</p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 font-mono">
                  <span>{new Date(item.submittedAt).toLocaleDateString('ar-EG')}</span>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmFb(item)}
                    className="text-rose-400 hover:text-rose-300 font-bold font-sans flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>مسح التقييم 🗑️</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* --- CONFIRM DELETE FEEDBACK MODAL --- */}
      <AnimatePresence>
        {deleteConfirmFb && (
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
                  <h3 className="text-base font-extrabold text-white">تأكيد مسح التقييم نهائياً 🗑️</h3>
                  <p className="text-xs text-rose-300 mt-0.5 font-bold">تقييم الطالب: {deleteConfirmFb.studentName}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                سيتم حذف هذا التقييم والملاحظة بشكل دائم من المنصة. هل أنت متأكد من الحذف؟
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmFb(null)}
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
                  <span>نعم، مسح التقييم 🗑️</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
