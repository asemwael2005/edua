'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { BanShield } from '@/components/BanShield';
import { RecordedVideo } from '@/types/edupulse';
import { isMatchingGrade } from '@/lib/gradeUtils';
import { getEmbedVideoUrl } from '@/lib/videoUtils';
import { Video, Play, Eye, X, Film, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentVideosPage() {
  const { videos, students, activeStudent } = useEduPulse();
  const [selectedVideo, setSelectedVideo] = useState<RecordedVideo | null>(null);

  const currentStudent = activeStudent || students[0];
  if (!currentStudent) return null;

  // Display all uploaded videos (showing grade-matching videos first)
  const displayedVideos = [...videos].sort((a, b) => {
    const matchA = isMatchingGrade(a.grade, currentStudent.grade) ? 1 : 0;
    const matchB = isMatchingGrade(b.grade, currentStudent.grade) ? 1 : 0;
    return matchB - matchA;
  });

  return (
    <BanShield student={currentStudent}>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Video className="w-7 h-7 text-rose-500" />
              <span>مكتبة المحاضرات والدروس المسجلة 📹</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              مشاهدة شروحات الدروس والتسجيلات المصورة الخاصة بصفك الدراسي ({currentStudent.grade})
            </p>
          </div>

          <span className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold font-mono self-start sm:self-auto">
            {currentStudent.grade}
          </span>
        </div>

        {/* 📹 RECORDED LECTURES LIBRARY */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-rose-400" />
              <span>دروس الفيديو والتمارين الشارحة ({displayedVideos.length})</span>
            </h3>
          </div>

          {displayedVideos.length === 0 ? (
            <div className="p-12 text-center rounded-3xl glass-panel border space-y-3">
              <Film className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">لا توجد تسجيلات فيديوهات مضافة بعد</h4>
              <p className="text-xs text-slate-500">سيقوم المعلم بنشر دروس فيديوهات مادتك الدراسية هنا قريباً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedVideos.map((vid) => (
                <div
                  key={vid.id}
                  className="p-4 rounded-3xl glass-panel border space-y-3 hover:border-rose-500/40 transition duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Thumbnail / Video Banner */}
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 group">
                      <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-90 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => setSelectedVideo(vid)}
                          className="w-12 h-12 rounded-2xl bg-rose-600/90 text-white flex items-center justify-center shadow-xl glow-rose transform group-hover:scale-110 transition"
                        >
                          <Play className="w-5 h-5 ltr:translate-x-0.5 rtl:-translate-x-0.5" />
                        </button>
                      </div>
                      <span className="absolute bottom-2 ltr:right-2 rtl:left-2 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-mono font-bold">
                        {vid.duration}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-rose-400 font-mono">
                        <span>{vid.subject}</span>
                        <span className="text-slate-400 font-sans">{vid.grade}</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-2 mt-0.5">{vid.title}</h4>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">{vid.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Eye className="w-3.5 h-3.5 text-slate-500" /> {vid.viewsCount} مشاهدة
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedVideo(vid)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>مشاهدة الفيديو 🎬</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- STUDENT VIDEO PLAYER MODAL --- */}
        <AnimatePresence>
          {selectedVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-3xl w-full p-6 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-4 text-white"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold">{selectedVideo.title}</h3>
                    <span className="text-xs text-rose-400 font-mono">{selectedVideo.subject} - {selectedVideo.grade}</span>
                  </div>
                  <button type="button" onClick={() => setSelectedVideo(null)} className="p-1.5 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Video Player Box */}
                <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
                  {(() => {
                    const { embedUrl, isIframe } = getEmbedVideoUrl(selectedVideo.videoUrl);
                    return isIframe ? (
                      <iframe
                        src={embedUrl}
                        className="w-full h-full border-0"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : (
                      <video src={embedUrl} controls autoPlay className="w-full h-full object-contain" />
                    );
                  })()}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{selectedVideo.description}</p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </BanShield>
  );
}
