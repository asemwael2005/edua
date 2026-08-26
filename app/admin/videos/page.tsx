'use client';

import React, { useState, useEffect } from 'react';
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
  Square,
  Film,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// URL Normalization & Security Validation Helper
export const normalizeAndValidateUrl = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;
  let trimmed = url.trim();
  if (!trimmed) return null;

  // Reject malicious pseudo-protocols
  if (/^(javascript|data|file|vbscript):/i.test(trimmed)) {
    return null;
  }

  // Auto-prefix missing http/https protocol
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return null;
  } catch (e) {
    return null;
  }
};

export default function AdminVideosPage() {
  const { dict, videos, addVideo, deleteVideo, sessions, activeLiveStream, updateLiveStream, showToast } = useEduPulse();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<RecordedVideo | null>(null);

  // Live Stream Controls State
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || 'all');
  const [meetingUrl, setMeetingUrl] = useState<string>(activeLiveStream?.meetingUrl || 'https://meet.google.com/abc-defg-hij');

  // Sync selected session's live URL whenever selection or activeLiveStream changes
  const selectedSession = sessions.find((s) => s.id === selectedSessionId);
  const isLiveActive = activeLiveStream?.isLive || sessions.some((s) => s.isLive);

  useEffect(() => {
    if (selectedSession && selectedSession.liveMeetingUrl) {
      setMeetingUrl(selectedSession.liveMeetingUrl);
    } else if (activeLiveStream && activeLiveStream.meetingUrl) {
      setMeetingUrl(activeLiveStream.meetingUrl);
    }
  }, [selectedSessionId, sessions, activeLiveStream]);

  // New Video Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('الرياضيات التطبيقية');
  const [grade, setGrade] = useState('الصف الأول الثانوي (Grade 10)');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('01:30:00');
  const [description, setDescription] = useState('');

  // Start Live Stream & Launch Notification to Students
  const handleStartLiveStream = (openInNewTab = false) => {
    // 1. Retrieve & Validate URL
    const urlToValidate = meetingUrl || selectedSession?.liveMeetingUrl || '';
    if (!urlToValidate.trim()) {
      showToast('يرجى كتابة رابط البث المباشر أولاً', 'error');
      return;
    }

    const validUrl = normalizeAndValidateUrl(urlToValidate);
    if (!validUrl) {
      showToast('رابط البث المباشر غير صالح (يرجى التأكد من كتابة الرابط بشكل صحيح)', 'error');
      return;
    }

    // 2. Determine target grade & title
    const selectedSession = sessions.find((s) => s.id === selectedSessionId);
    let targetGrade = 'all';
    let liveTitle = 'بث مباشر تفاعلي أونلاين 🔴';

    if (selectedSession) {
      targetGrade = selectedSession.grade;
      liveTitle = selectedSession.title;
    } else if (selectedSessionId.startsWith('grade_')) {
      targetGrade = selectedSessionId.replace('grade_', '');
      liveTitle = `بث مباشر لـ (${targetGrade}) 🔴`;
    }

    const targetId = selectedSessionId || 'all';
    updateLiveStream(targetId, true, validUrl, targetGrade, liveTitle);

    showToast('تم تفعيل وإثبات البث المباشر أونلاين لجميع الطلاب بنجاح 🔴');

    // 3. Open meeting link in new tab if requested
    if (openInNewTab) {
      try {
        window.open(validUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.warn('Popup blocked by browser, but live stream is active');
      }
    }
  };

  // Stop Live Stream
  const handleStopLiveStream = () => {
    const targetId = selectedSessionId || sessions[0]?.id || 'all';
    updateLiveStream(targetId, false, meetingUrl);
  };

  // Open Live Meeting Link directly without toggling status
  const handleOpenLinkDirectly = () => {
    const validUrl = normalizeAndValidateUrl(meetingUrl || selectedSession?.liveMeetingUrl || '');
    if (!validUrl) {
      showToast('رابط البث المباشر غير صالح', 'error');
      return;
    }

    window.open(validUrl, '_blank', 'noopener,noreferrer');
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
          <p className="text-xs text-slate-400 mt-1">إدارة غرف البث المباشر الحية ورفع تسجيلة الفيديوهات للطلاب</p>
        </div>

        <button
          type="button"
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
                    مباشر الآن 🔴 LIVE
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-300">بدء محاضرة تفاعلية حية وإرسال الإشعار لجميع الطلاب ليظهر في بوابتهم فوراً</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isLiveActive ? (
              <button
                type="button"
                onClick={handleStopLiveStream}
                className="px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-xl transition flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                <Square className="w-4 h-4 text-rose-400" />
                <span>إيقاف البث المباشر</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleStartLiveStream(false)}
                className="px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-xl transition flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/30"
              >
                <Radio className="w-4 h-4" />
                <span>بدء البث المباشر الآن 🔴</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenLinkDirectly}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
              title="فتح رابط البث في تبويب جديد"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
          <div className="space-y-1.5">
            <label className="text-slate-300">اختر المحاضرة أو الصف المستهدف للبث</label>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white cursor-pointer focus:border-rose-500 focus:outline-none"
            >
              <option value="all">جميع الطلاب والصفوف 🌐 (أونلاين لجميع المراحل)</option>
              <option value="grade_الصف الأول الثانوي (Grade 10)">الصف الأول الثانوي (Grade 10) 🥇</option>
              <option value="grade_الصف الثاني الثانوي (Grade 11)">الصف الثاني الثانوي (Grade 11) 🥈</option>
              <option value="grade_الصف الثالث الثانوي (Grade 12)">الصف الثالث الثانوي (Grade 12) 🥉</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  محاضرة: {s.title} ({s.grade}) {s.isLive ? '🔴' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300">رابط بث الغرفة (Zoom / Google Meet / YouTube Live)</label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-500 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="مثال: https://meet.google.com/abc-defg-hij أو zoom.us/j/123456"
                className="w-full ltr:pl-9 rtl:pr-9 ltr:pr-3 rtl:pl-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 📹 RECORDED VIDEO LECTURES GRID */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-white">مكتبة المحاضرات والدروس المسجلة ({videos.length})</h3>

        {videos.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border space-y-3">
            <Film className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-300">لا توجد تسجيلات فيديوهات مضافة بعد</h4>
            <p className="text-xs text-slate-500">اضغط على زر "رفع تسجيل فيديو جديد" بالأعلى ونزل أول فيديو لمادتك الدراسية</p>
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
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>معاينة التسجيل</span>
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
                <h3 className="text-base font-extrabold">رفع ونشر تسجيل فيديو محتوى مادة</h3>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
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
                    placeholder="مثال: تسجيل المحاضرة: الجبر والمعادلات التربيعية"
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
                      hint="يدعم صيغ الفيديو المختلفة (MP4, WebM, MOV, AVI)"
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
                <button type="button" onClick={() => setPreviewVideo(null)} className="p-1.5 text-slate-400 hover:text-white">
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
