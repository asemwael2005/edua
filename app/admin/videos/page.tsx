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
  const { videos, addVideo, updateVideo, deleteVideo, showToast, students } = useEduPulse();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<RecordedVideo | null>(null);
  const [previewVideo, setPreviewVideo] = useState<RecordedVideo | null>(null);

  // New Video Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('الرياضيات التطبيقية');
  const [grade, setGrade] = useState('الصف الأول الثانوي (Grade 10)');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('01:30:00');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [accessScope, setAccessScope] = useState<'all' | 'specific'>('all');
  const [allowedStudentIds, setAllowedStudentIds] = useState<string[]>([]);

  const handleOpenEditVideo = (vid: RecordedVideo) => {
    setEditingVideo(vid);
    setTitle(vid.title);
    setSubject(vid.subject);
    setGrade(vid.grade);
    setVideoUrl(vid.videoUrl);
    setDuration(vid.duration || '01:00:00');
    setDescription(vid.description || '');
    setIsPublished(vid.isPublished !== false);
    if (vid.allowedStudentIds && vid.allowedStudentIds.length > 0) {
      setAccessScope('specific');
      setAllowedStudentIds(vid.allowedStudentIds);
    } else {
      setAccessScope('all');
      setAllowedStudentIds([]);
    }
    setIsAddModalOpen(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      showToast('يرجى كتابة عنوان الفيديو وإرفاق رابط أو ملف الفيديو', 'error');
      return;
    }

    const payload = {
      title: title.trim(),
      subject: subject.trim(),
      grade,
      videoUrl: videoUrl.trim(),
      duration: duration.trim() || '01:00:00',
      description: description.trim() || 'فيديو شرح المحاضرة متاح لمتابعة ومراجعة الدرس.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
      isPublished,
      allowedStudentIds: accessScope === 'specific' ? allowedStudentIds : [],
    };

    if (editingVideo) {
      updateVideo({
        ...editingVideo,
        ...payload,
      });
      showToast('تم تحديث بيانات وفيديو المحاضرة والصلاحيات بنجاح ✏️');
    } else {
      addVideo(payload);
      showToast('تم رفع ونشر فيديو المحاضرة للطلاب بنجاح 📹');
    }

    setIsAddModalOpen(false);
    setEditingVideo(null);
    setTitle('');
    setVideoUrl('');
    setDescription('');
    setAllowedStudentIds([]);
    setAccessScope('all');
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
          <p className="text-xs text-slate-400 mt-1">رفع ونشر فيديوهات الشروحات والتسجيلات للطلاب وتحديد صلاحيات الوصول</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingVideo(null);
            setTitle('');
            setVideoUrl('');
            setDescription('');
            setAllowedStudentIds([]);
            setAccessScope('all');
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 flex items-center gap-2 shrink-0 transition"
        >
          <Plus className="w-4 h-4" />
          <span>رفع فيديو جديد 🎥</span>
        </button>
      </div>

      {/* Videos Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Film className="w-5 h-5 text-rose-400" />
          <span>الفيديوهات والتسجيلات المتاحة بالمنصة ({videos.length}):</span>
        </h3>

        {videos.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border border-dashed border-slate-800 space-y-3">
            <Video className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-400">لا توجد فيديوهات مرفوعة حتى الآن.</p>
            <p className="text-xs text-slate-500">اضغط على زر "رفع فيديو جديد" لإضافة أول فيديو شروحات للطلاب.</p>
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

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditVideo(vid)}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 font-bold text-xs transition flex items-center gap-1"
                      title="تحديد وتخصيص الطلاب المسموح لهم بمشاهدة الفيديو"
                    >
                      <span>تحديد من يراه 🎯</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteVideo(vid.id)}
                      className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 text-rose-300 transition"
                      title="مسح هذا الفيديو"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPreviewVideo(vid)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>تشغيل 🎬</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- ADD / EDIT RECORDED VIDEO MODAL --- */}
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
                  <span>{editingVideo ? 'تعديل الفيديو والتحكم في صلاحيات الوصول 🎯' : 'إضافة وتثبيت فيديو جديد 📹'}</span>
                </h3>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVideo} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-300">عنوان الفيديو / الدرس</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: الشرح التفصيلي لدرس التفاضل والتكامل - المحاضرة 1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Upload or Link Input */}
                <div className="space-y-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="text-slate-300 font-bold block">ملف/رابط الفيديو</label>
                  
                  <div className="space-y-3">
                    <FileUpload
                      onUploadSuccess={(fileData) => {
                        setVideoUrl(fileData.url);
                        showToast('تم رفع ملف الفيديو بنجاح! 🚀');
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
                    <label className="text-slate-300">الصف الدراسي المستهدف (صلاحية الوصول)</label>
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
                  <label className="text-slate-300">مدة الفيديو الرقمية</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="مثال: 01:25:00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div className="space-y-1 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="text-slate-300 font-bold block">حالة النشر والظهور للطلاب 👁️</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPublished(true)}
                      className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition ${
                        isPublished
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      <span>متاح ومؤكد للطلاب 🟢</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPublished(false)}
                      className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition ${
                        !isPublished
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-500/20'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      <span>مخفي (مسودة للإدارة فقط) 🔒</span>
                    </button>
                  </div>
                </div>

                {/* Per-Student Access Control (تحديد الطلاب المسموح لهم) */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="text-slate-300 font-bold block">تحديد إمكانية المشاهدة والوصول 👤 (تخصيص طلاب محددين)</label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setAccessScope('all')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                        accessScope === 'all'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      <span>جميع طلاب الصف 🌐</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccessScope('specific')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition ${
                        accessScope === 'specific'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      <span>طلاب محددون فقط 🎯 ({allowedStudentIds.length} طالب)</span>
                    </button>
                  </div>

                  {accessScope === 'specific' && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-800">
                      <p className="text-[11px] text-rose-300 font-semibold">حدد الطلاب المسموح لهم بمشاهدة هذا الفيديو:</p>
                      <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                        {students.map((st) => {
                          const isChecked = allowedStudentIds.includes(st.id);
                          return (
                            <label
                              key={st.id}
                              className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs transition ${
                                isChecked ? 'bg-rose-950/60 border-rose-500/50 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setAllowedStudentIds([...allowedStudentIds, st.id]);
                                    } else {
                                      setAllowedStudentIds(allowedStudentIds.filter((id) => id !== st.id));
                                    }
                                  }}
                                  className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                                />
                                <span className="font-bold">{st.name}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500">{st.grade}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">وصف وفكرة الفيديو</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="وصف مختصر لمكونات ومواضيع شرح الفيديو..."
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
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold shadow-lg shadow-rose-500/30 transition"
                  >
                    {editingVideo ? 'حفظ التعديلات والصلاحيات 💾' : 'حفظ ونشر الفيديو 🚀'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- VIDEO PLAYER MODAL --- */}
      <AnimatePresence>
        {previewVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl w-full p-6 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-rose-400 font-mono block">
                    {previewVideo.subject} | {previewVideo.grade}
                  </span>
                  <h3 className="text-base font-extrabold text-white">{previewVideo.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewVideo(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Frame */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
                {getEmbedVideoUrl(previewVideo.videoUrl).isIframe ? (
                  <iframe
                    src={getEmbedVideoUrl(previewVideo.videoUrl).embedUrl}
                    title={previewVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={previewVideo.videoUrl} controls autoPlay className="w-full h-full object-contain" />
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
