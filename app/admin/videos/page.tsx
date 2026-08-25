'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { FileUpload } from '@/components/ui/FileUpload';
import { RecordedVideo } from '@/types/edupulse';
import {
  Video,
  Radio,
  Plus,
  Play,
  Clock,
  Eye,
  Link2,
  Tv2,
  Trash2,
  X,
  Sparkles,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminVideosPage() {
  const { dict, videos, addVideo, sessions, updateLiveStream } = useEduPulse();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<RecordedVideo | null>(null);

  // Live Stream Controls
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id || '');
  const [meetingUrl, setMeetingUrl] = useState('https://meet.google.com/abc-defg-hij');
  const [isLiveActive, setIsLiveActive] = useState(false);

  // New Video Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('الرياضيات التطبيقية');
  const [grade, setGrade] = useState('الصف الثالث الثانوي');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('01:30:00');
  const [description, setDescription] = useState('');

  const handleToggleLive = () => {
    if (!selectedSessionId) return;
    const nextStatus = !isLiveActive;
    setIsLiveActive(nextStatus);
    updateLiveStream(selectedSessionId, nextStatus, meetingUrl);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !videoUrl) return;

    addVideo({
      title,
      subject,
      grade,
      videoUrl,
      duration,
      description,
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
    });

    setIsAddModalOpen(false);
    setTitle('');
    setVideoUrl('');
    setDescription('');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Video className="w-7 h-7 text-rose-500" />
            <span>تسجيلات المحاضرات والبث المباشر</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">إدارة غرف البث المباشر رفع تسجيلة الفيديوهات والدروس للطلاب</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 flex items-center gap-2 shrink-0 transition"
        >
          <Plus className="w-4 h-4" />
          <span>رفع تسجيل فيديو جديد</span>
        </button>
      </div>

      {/* 🔴 LIVE STREAM CONTROL PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-red-950 border border-rose-500/40 shadow-2xl space-y-5 glow-rose"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>غرفة البث المباشر أونلاين (Live Stream Room)</span>
                {isLiveActive && (
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-mono font-bold animate-pulse">
                    مباشر 🔴 LIVE
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-300">بدء محاضرة تفاعلية حية وإرسال الإشعار لجميع الطلاب</p>
            </div>
          </div>

          <button
            onClick={handleToggleLive}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-xl transition flex items-center gap-2 shrink-0 ${
              isLiveActive
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/30'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{isLiveActive ? 'إنهاء البث المباشر' : 'بدء البث المباشر الآن 🔴'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
          <div className="space-y-1.5">
            <label className="text-slate-300">اختر المحاضرة المرتبطة بالبث</label>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.date})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300">رابط بث الغرفة (Google Meet / Zoom / YouTube Live)</label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-500 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full ltr:pl-9 rtl:pr-9 ltr:pr-3 rtl:pl-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 📹 RECORDED VIDEO LECTURES GRID */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-white">مكتبة المحاضرات والدروس المسجلة ({videos.length})</h3>

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
                  onClick={() => setPreviewVideo(vid)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs flex items-center gap-1 transition"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>معاينة التسجيل</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- ADD NEW RECORDED VIDEO MODAL --- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-lg w-full p-6 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-white">رفع ونشر تسجيل فيديو محتوى مادة</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVideo} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-300">عنوان التسجيل</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: تسجيل المحاضرة 5: التفاضل والمعدلات الزمنية"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Video Upload or Video Link */}
                <div className="space-y-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="text-slate-300 font-bold block">طريقة إضافة الفيديو</label>

                  <div className="space-y-2">
                    <FileUpload
                      onUploadSuccess={(fileData) => {
                        setVideoUrl(fileData.url);
                      }}
                      accept="video/*"
                      label="رفع فيديو من جهازك (MP4 / WebM)"
                    />

                    <div className="text-center text-[10px] text-slate-500 font-bold">أو أدخل رابط الفيديو أونلاين:</div>

                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="رابط يوتيوب Embed أو رابط MP4..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
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
                    <label className="text-slate-300">مدة الفيديو</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="01:30:00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
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
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20"
                  >
                    نشر التسجيل للطلاب
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
                <h3 className="text-base font-extrabold">{previewVideo.title}</h3>
                <button onClick={() => setPreviewVideo(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player */}
              <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
                {previewVideo.videoUrl.includes('youtube') || previewVideo.videoUrl.includes('embed') ? (
                  <iframe
                    src={previewVideo.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <video src={previewVideo.videoUrl} controls className="w-full h-full" />
                )}
              </div>

              <p className="text-xs text-slate-300">{previewVideo.description}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
