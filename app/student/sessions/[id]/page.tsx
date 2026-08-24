'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { BanShield } from '@/components/BanShield';
import {
  Tv,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Star,
  CheckCircle,
  MessageSquare,
  Sparkles,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentSessionViewerPage() {
  const params = useParams();
  const { dict, sessions, activeStudent, updateSlideProgress, addSessionFeedback } = useEduPulse();

  const sessionId = (params?.id as string) || 'sess_1';
  const targetSession = sessions.find((s) => s.id === sessionId) || sessions[0];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(
    targetSession?.studentProgress[activeStudent?.id || ''] ? targetSession.studentProgress[activeStudent?.id || ''] - 1 : 0
  );

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['شرح ممتاز', 'سلايدات واضحة']);

  // Auto-sync slide progress to context & LocalStorage
  useEffect(() => {
    if (!targetSession || !activeStudent) return;
    const currentSlideNum = currentSlideIndex + 1;
    updateSlideProgress(targetSession.id, activeStudent.id, currentSlideNum);
  }, [currentSlideIndex]);

  if (!activeStudent || !targetSession) return null;

  const slides = targetSession.slides || [];
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;

    addSessionFeedback({
      sessionId: targetSession.id,
      sessionTitle: targetSession.title,
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      rating,
      tags: selectedTags,
      comment,
    });

    setIsFeedbackOpen(false);
    setComment('');
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <BanShield student={activeStudent}>
      <div className={`space-y-6 pb-12 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
        
        {/* Header */}
        <div className="p-6 rounded-3xl glass-panel border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-400 font-mono">عارض السلايدات والملزومة التعليمية</span>
            <h1 className="text-xl font-extrabold text-white">{targetSession.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/uploads/calculus_booklet.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition shadow"
            >
              <Sparkles className="w-4 h-4" />
              <span>تحميل ملزمة المحاضرة (PDF)</span>
            </a>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{isFullscreen ? dict.slides.exitFullscreen : dict.slides.fullscreen}</span>
            </button>

            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition"
            >
              <Star className="w-4 h-4" />
              <span>{dict.slides.submitFeedback}</span>
            </button>
          </div>
        </div>

        {/* Presentation Slide Box */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-brand-500/30 shadow-2xl space-y-6 min-h-[460px] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Slide Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-brand-400 font-mono">
              شريحة {currentSlideIndex + 1} من {slides.length}
            </span>
            <h2 className="text-base font-extrabold text-white">{currentSlide?.title}</h2>
            <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 text-xs font-mono font-bold">
              {dict.slides.progressSaved}
            </span>
          </div>

          {/* Slide Body */}
          <div className="space-y-4 py-6 flex-1">
            <p className="text-base text-slate-100 leading-relaxed font-medium">{currentSlide?.content}</p>

            {currentSlide?.codeOrDiagram && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-brand-500/30 text-cyan-300 font-mono text-xs overflow-x-auto">
                <code>{currentSlide.codeOrDiagram}</code>
              </div>
            )}

            {currentSlide?.bulletPoints && currentSlide.bulletPoints.length > 0 && (
              <ul className="space-y-2.5 pt-2">
                {currentSlide.bulletPoints.map((bp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Slide Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              disabled={currentSlideIndex === 0}
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1.5 transition"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
              <span>{dict.slides.prev}</span>
            </button>

            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentSlideIndex ? 'w-8 bg-brand-500' : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            <button
              disabled={currentSlideIndex === slides.length - 1}
              onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1.5 transition shadow-lg"
            >
              <span>{dict.slides.next}</span>
              <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        </div>

        {/* --- FEEDBACK MODAL --- */}
        <AnimatePresence>
          {isFeedbackOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-white">{dict.feedback.ratingPrompt}</h3>
                  <button onClick={() => setIsFeedbackOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs font-semibold">
                  {/* Star Rating Select */}
                  <div className="flex items-center justify-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 transition transform hover:scale-125"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Feature Tags */}
                  <div className="space-y-1.5">
                    <label className="text-slate-300">{dict.feedback.tagsLabel}</label>
                    <div className="flex flex-wrap gap-2">
                      {['شرح ممتاز', 'سلايدات واضحة', 'تفاعل عالي', 'حل مسائل امتحانات', 'محتوى قوي'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-xl font-bold transition ${
                            selectedTags.includes(tag)
                              ? 'bg-brand-600 text-white shadow'
                              : 'bg-slate-950 border border-slate-800 text-slate-400'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="space-y-1">
                    <label className="text-slate-300">ملاحظاتك وانطباعك (إجباري)</label>
                    <textarea
                      required
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={dict.feedback.commentPlaceholder}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsFeedbackOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/20"
                    >
                      {dict.feedback.submitFeedback}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </BanShield>
  );
}
