'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { BanShield } from '@/components/BanShield';
import { RecordedVideo } from '@/types/edupulse';
import { Video, Radio, Play, Clock, Eye, Sparkles, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentVideosPage() {
  const { dict, videos, sessions, activeStudent } = useEduPulse();
  const [selectedVideo, setSelectedVideo] = useState<RecordedVideo | null>(null);

  if (!activeStudent) return null;

  const activeLiveSession = sessions.find((s) => s.isLive);

  return (
    <BanShield student={activeStudent}>
      <div className="space-y-8 pb-12">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Video className="w-7 h-7 text-rose-500" />
            <span>تسجيلات المحاضرات والغرفة الحية</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">مشاهدة إعادة المحاضرات والانضمام للبث المباشر أونلاين</p>
        </div>

        {/* 🔴 LIVE BROADCAST ALERT FOR STUDENTS */}
        {activeLiveSession && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-red-950 border border-rose-500/50 shadow-2xl space-y-4 glow-rose"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-600/90 text-white flex items-center justify-center font-bold animate-pulse shadow-lg">
                  <Radio className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-mono font-bold animate-pulse">
                    مباشر الآن 🔴 LIVE
                  </span>
                  <h3 className="text-lg font-extrabold text-white mt-1">{activeLiveSession.title}</h3>
                  <p className="text-xs text-slate-300">بدأ المعلم البث المباشر للمحاضرة الآن. اضغط للانضمام مباشرة.</p>
                </div>
              </div>

              {activeLiveSession.liveMeetingUrl && (
                <a
                  href={activeLiveSession.liveMeetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-xl shadow-rose-500/30 flex items-center gap-2 shrink-0 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>انضمام للبث المباشر الآن</span>
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* 📹 RECORDED LECTURES LIBRARY */}
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-white">مكتبة فيديوهات وإعادة المحاضرات</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="p-4 rounded-3xl glass-panel border space-y-3 hover:border-rose-500/40 transition duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 group">
                    <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-90 group-hover:opacity-100 transition">
                      <button
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
                    <span className="text-[10px] font-bold text-rose-400 font-mono">{vid.subject}</span>
                    <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-2">{vid.title}</h4>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">{vid.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Eye className="w-3.5 h-3.5 text-slate-500" /> {vid.viewsCount} مشاهدة
                  </span>

                  <button
                    onClick={() => setSelectedVideo(vid)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 transition shadow"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>مشاهدة الفيديو</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
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
                  <h3 className="text-base font-extrabold">{selectedVideo.title}</h3>
                  <button onClick={() => setSelectedVideo(null)} className="p-1.5 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Video Player Box */}
                <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
                  {selectedVideo.videoUrl.includes('youtube') || selectedVideo.videoUrl.includes('embed') ? (
                    <iframe
                      src={selectedVideo.videoUrl}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <video src={selectedVideo.videoUrl} controls className="w-full h-full" />
                  )}
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
