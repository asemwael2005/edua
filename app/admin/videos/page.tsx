'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { FileUpload } from '@/components/ui/FileUpload';
import { RecordedVideo } from '@/types/edupulse';
import {
  Video,
  Plus,
  Play,
  Clock,
  Eye,
  Trash2,
  X,
  Film,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEmbedVideoUrl } from '@/lib/videoUtils';

export default function AdminVideosPage() {
  const { videos, addVideo, deleteVideo, showToast } = useEduPulse();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<RecordedVideo | null>(null);

  // New Video Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('الرياضيات التطبيقية');
  const [grade, setGrade] = useState('الصف الأول الثانوي (Grade 10)');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('01:30:00');
  const [description, setDescription] = useState('');

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      showToast('يرجى كتابة عنوان الفيديو وإرفاق رابط أو ملف الفيديو', 'error');
      return;
    }

    addVideo({
      title: title.trim(),
      subject: subject.trim(),
      grade,
      videoUrl: videoUrl.trim(),
      duration: duration.trim() || '01:00:00',
      description: description.trim() || 'فيديو شرح المحاضرة متاح لمتابعة ومراجعة الدرس.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
    });

    setIsAddModalOpen(false);
    setTitle('');
    setVideoUrl('');
    setDescription('');
    showToast('تم رفع ونشر فيديو المحاضرة للطلاب بنجاح 📹');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Video className="w-7 h-7 text-rose-500" />
            <span>مكتبة المحاضرات وتسجيلات الدروس 📹</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">رفع ونشر فيديوهات الشروحات والتسجيلات للطلاب في جميع المراحل الدراسية</p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs shadow-lg shadow-rose-500/20 flex items-center gap-2 shrink-0 transition"
        >
          <Plus className="w-4 h-4" />
          <span>رفع فيديو درس جديد 🎬</span>
        </button>
      </div>

      {/* 📹 RECORDED VIDEO LECTURES GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-rose-400" />
            <span>الفيديوهات والدروس المنشورة ({videos.length})</span>
          </h3>
        </div>

        {videos.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border space-y-3">
            <Film className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-300">لا توجد تسجيلات فيديوهات مضافة بعد</h4>
            <p className="text-xs text-slate-500">اضغط على زر "رفع فيديو درس جديد 🎬" بالأعلى ونزل أول فيديو لمادتك الدراسية</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid) => (
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
                        onClick={() => setPreviewVideo(vid)}
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
                  <button
                    type="button"
                    onClick={() => deleteVideo(vid.id)}
                    className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 text-rose-300 transition flex items-center gap-1"
                    title="مسح هذا الفيديو"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف 🗑️</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewVideo(vid)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>تشغيل الفيديو 🎬</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- ADD NEW RECORDED VIDEO MODAL --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-lg w-full p-6 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <Video className="w-5 h-5 text-rose-500" />
                  <span>رفع ونشر فيديو درس جديد للطلاب</span>
                </h3>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVideo} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-300">عنوان الفيديو أو الدرس</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: فيديو شرح: الجبر والمعادلات التربيعية"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Video Upload or Video Link */}
                <div className="space-y-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="text-slate-300 font-bold block">طريقة رفع الفيديو</label>

                  <div className="space-y-2">
                    <FileUpload
                      onUploadSuccess={(fileData) => {
                        setVideoUrl(fileData.url);
                      }}
                      accept="video/*"
                      label="رفع فيديو من جهازك (MP4 / WebM)"
                      hint="يدعم صيغ الفيديو المختلفة (MP4, WebM, MOV, AVI)"
                    />

                    <div className="text-center text-[10px] text-slate-500 font-bold">أو أدخل رابط الفيديو أونلاين:</div>

                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="رابط يوتيوب (youtube.com) أو Google Drive أو رابط MP4..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:border-rose-500 focus:outline-none"
                    />
                  </div>
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
                      <option value="all">جميع المراحل الدراسية 🌐 (متاح للجميع)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">مدة الفيديو</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="01:30:00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">وصف وفهرس الفيديو</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اكتب التوضيحات وفهرس محتوى الدرس..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20 flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>نشر الفيديو للطلاب 🎬</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PREVIEW VIDEO PLAYER MODAL --- */}
      <AnimatePresence>
        {previewVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-3xl w-full p-6 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-4 text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-extrabold">{previewVideo.title}</h3>
                  <span className="text-xs text-rose-400 font-mono">{previewVideo.subject} - {previewVideo.grade}</span>
                </div>
                <button type="button" onClick={() => setPreviewVideo(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Box */}
              <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
                {(() => {
                  const { embedUrl, isIframe } = getEmbedVideoUrl(previewVideo.videoUrl);
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

              <p className="text-xs text-slate-300 leading-relaxed">{previewVideo.description}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
