'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { Session, AttendanceStatus, Slide } from '@/types/edupulse';
import { FileUpload } from '@/components/ui/FileUpload';
import {
  CalendarCheck,
  Plus,
  Tv,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Users,
  Eye,
  Edit,
  Save,
  BookOpen,
  Sparkles,
  Download,
  FileText,
  X,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SessionsAdminPage() {
  const { dict, sessions, students, markAttendance, updateSlideProgress, createSession, deleteSession } = useEduPulse();

  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'attendance' | 'slides'>('attendance');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmSession, setDeleteConfirmSession] = useState<Session | null>(null);

  // Presentation viewer state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // New Session Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('الرياضيات');
  const [grade, setGrade] = useState('الصف الأول الثانوي (Grade 10)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('17:00 - 19:30');
  const [room, setRoom] = useState('القاعة الرئيسية A1');
  const [description, setDescription] = useState('');

  // Slides State for new session
  const [slidesList, setSlidesList] = useState<Slide[]>([
    {
      id: 'sld_1',
      slideNumber: 1,
      title: 'مقدمة المحاضرة والأهداف التعلمية',
      content: 'أهلاً بكم في هذه المحاضرة. سنتناول اليوم أهم المفاهيم والتطبيقات العملية.',
      bulletPoints: ['مراجعة سريعة للمفاهيم الأساسية', 'حل التمارين النموذجية'],
    },
  ]);

  const [slideTitle, setSlideTitle] = useState('');
  const [slideContent, setSlideContent] = useState('');
  const [slideBullet, setSlideBullet] = useState('');

  const selectedSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  const handleMark = (studentId: string, status: AttendanceStatus) => {
    if (!selectedSession) return;
    markAttendance(selectedSession.id, studentId, status);
  };

  const handleAddSlide = () => {
    if (!slideTitle || !slideContent) return;

    const newSlide: Slide = {
      id: `sld_${Date.now()}`,
      slideNumber: slidesList.length + 1,
      title: slideTitle,
      content: slideContent,
      bulletPoints: slideBullet ? slideBullet.split(',').map((b) => b.trim()) : [],
    };

    setSlidesList([...slidesList, newSlide]);
    setSlideTitle('');
    setSlideContent('');
    setSlideBullet('');
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || slidesList.length === 0) return;

    createSession({
      title,
      subject,
      grade,
      date,
      time,
      room,
      description,
      slides: slidesList,
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmSession) return;
    deleteSession(deleteConfirmSession.id);
    setDeleteConfirmSession(null);
    if (sessions.length > 1) {
      const remaining = sessions.filter((s) => s.id !== deleteConfirmSession.id);
      setSelectedSessionId(remaining[0]?.id || '');
    }
  };

  const slides = selectedSession?.slides || [];
  const currentSlide = slides[currentSlideIndex] || slides[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <CalendarCheck className="w-7 h-7 text-emerald-500" />
            <span>{dict.sessions.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">{dict.sessions.subtitle}</p>
        </div>

        {/* Session Selector, Delete Button & Create Button */}
        <div className="flex items-center gap-3 flex-wrap">
          {sessions.length > 0 && (
            <select
              value={selectedSessionId}
              onChange={(e) => {
                setSelectedSessionId(e.target.value);
                setCurrentSlideIndex(0);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.date})
                </option>
              ))}
            </select>
          )}

          {selectedSession && (
            <button
              type="button"
              onClick={() => setDeleteConfirmSession(selectedSession)}
              className="px-3.5 py-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/90 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1.5 transition shadow"
              title="مسح هذه المحاضرة"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>مسح المحاضرة 🗑️</span>
            </button>
          )}

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0 transition"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء جلسة جديدة</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-800 gap-4 text-sm font-extrabold">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'attendance'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{dict.sessions.attendanceSheet}</span>
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'slides'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>{dict.sessions.slideViewer}</span>
        </button>
      </div>

      {/* TAB 1: QUICK-MARK ATTENDANCE SHEET */}
      {activeTab === 'attendance' && (
        selectedSession ? (
          <div className="space-y-4">
            
            {/* Session Summary Bar */}
            <div className="p-5 rounded-3xl glass-panel border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">{selectedSession.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  المادة: <span className="text-emerald-400 font-semibold">{selectedSession.subject}</span> | الموعد: {selectedSession.date} ({selectedSession.time}) | القاعة: {selectedSession.room}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-bold font-mono">
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    حاضر: {Object.values(selectedSession.attendance).filter((s) => s === 'present').length}
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300">
                    غائب: {Object.values(selectedSession.attendance).filter((s) => s === 'absent').length}
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300">
                    متأخر: {Object.values(selectedSession.attendance).filter((s) => s === 'late').length}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmSession(selectedSession)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>مسح 🗑️</span>
                </button>
              </div>
            </div>

            {/* Quick Mark Attendance Table */}
            <div className="rounded-3xl glass-panel border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right rtl:text-right ltr:text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                      <th className="py-3.5 px-4">الطالب</th>
                      <th className="py-3.5 px-4">الصف الدراسي</th>
                      <th className="py-3.5 px-4">تقدم السلايدات الحية</th>
                      <th className="py-3.5 px-4 text-center">كشف تسجيل الحضور الفوري</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs font-semibold">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400">
                          لا يوجد طلاب مسجلين بالمنصة حالياً. قم بإضافة طلاب من قسم "إدارة الطلاب".
                        </td>
                      </tr>
                    ) : (
                      students.map((st) => {
                        const status = selectedSession.attendance[st.id] || 'absent';
                        const currentSlidePos = selectedSession.studentProgress[st.id] || 0;

                        return (
                          <tr key={st.id} className="hover:bg-slate-800/30 transition">
                            {/* Student */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img src={st.avatar} alt={st.name} className="w-9 h-9 rounded-xl object-cover" />
                                <div>
                                  <span className="block font-bold text-white">{st.name}</span>
                                  <span className="text-[11px] text-slate-400">{st.email}</span>
                                </div>
                              </div>
                            </td>

                            {/* Grade */}
                            <td className="py-3.5 px-4 text-slate-300">{st.grade}</td>

                            {/* Live Slide Progress */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 rounded-full bg-slate-800 overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{
                                      width: `${(currentSlidePos / (selectedSession.slides.length || 1)) * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-[11px] font-mono text-emerald-300 font-bold">
                                  شريحة {currentSlidePos} / {selectedSession.slides.length}
                                </span>
                              </div>
                            </td>

                            {/* Attendance Toggle Buttons */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center justify-center gap-2">
                                {/* Present */}
                                <button
                                  onClick={() => handleMark(st.id, 'present')}
                                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                                    status === 'present'
                                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                      : 'bg-slate-900 text-slate-400 hover:text-emerald-400 border border-slate-800'
                                  }`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>حاضر</span>
                                </button>

                                {/* Late */}
                                <button
                                  onClick={() => handleMark(st.id, 'late')}
                                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                                    status === 'late'
                                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                                      : 'bg-slate-900 text-slate-400 hover:text-amber-400 border border-slate-800'
                                  }`}
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>متأخر</span>
                                </button>

                                {/* Excused */}
                                <button
                                  onClick={() => handleMark(st.id, 'excused')}
                                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                                    status === 'excused'
                                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                                      : 'bg-slate-900 text-slate-400 hover:text-cyan-400 border border-slate-800'
                                  }`}
                                >
                                  <HelpCircle className="w-3.5 h-3.5" />
                                  <span>معذور</span>
                                </button>

                                {/* Absent */}
                                <button
                                  onClick={() => handleMark(st.id, 'absent')}
                                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                                    status === 'absent'
                                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                                      : 'bg-slate-900 text-slate-400 hover:text-rose-400 border border-slate-800'
                                  }`}
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>غائب</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl glass-panel border space-y-3">
            <CalendarCheck className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">لا توجد جلسات مضافة حالياً</h3>
            <p className="text-xs text-slate-400">اضغط على زر "إنشاء جلسة جديدة" بالأعلى لإضافة المحاضرة الأولى.</p>
          </div>
        )
      )}

      {/* TAB 2: SLIDE DECK & LIVE STUDENT PROGRESS TRACKER */}
      {activeTab === 'slides' && selectedSession && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Slide Presentation Viewer */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl space-y-6 min-h-[420px] flex flex-col justify-between relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Slide Header Controls */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  شريحة {currentSlideIndex + 1} من {slides.length}
                </span>
                <h3 className="text-sm font-extrabold text-white">{currentSlide?.title}</h3>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 text-[11px] font-mono">
                  عروض إديو بلس
                </span>
              </div>

              {/* Slide Body */}
              <div className="space-y-4 py-4 flex-1">
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{currentSlide?.content}</p>

                {currentSlide?.codeOrDiagram && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-cyan-300 font-mono text-xs overflow-x-auto">
                    <code>{currentSlide.codeOrDiagram}</code>
                  </div>
                )}

                {currentSlide?.bulletPoints && currentSlide.bulletPoints.length > 0 && (
                  <ul className="space-y-2 pt-2">
                    {currentSlide.bulletPoints.map((bp, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Slide Footer Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  disabled={currentSlideIndex === 0}
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1.5 transition"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  <span>{dict.slides.prev}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentSlideIndex ? 'w-6 bg-emerald-500' : 'bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={currentSlideIndex === slides.length - 1}
                  onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1.5 transition shadow-lg"
                >
                  <span>{dict.slides.next}</span>
                  <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                </button>
              </div>
            </div>
          </div>

          {/* Live Student Slide Tracker Drawer & Real File Upload */}
          <div className="space-y-6">
            
            {/* Real File Upload Section */}
            <div className="p-6 rounded-3xl glass-panel border space-y-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>رفع ملزمة المحاضرة الحقيقية (PDF/Slides)</span>
              </h3>
              <FileUpload
                onUploadSuccess={(fileData) => {
                  alert(`تم رفع الملف بنجاح: ${fileData.name}\nالرابط: ${fileData.url}`);
                }}
                label="اختر ملزمة PDF أو العرض التقديمي لرفعه للمركز"
              />
            </div>

            <div className="p-6 rounded-3xl glass-panel border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{dict.sessions.liveStudentTracker}</span>
                </h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-md font-mono animate-pulse">
                  مباشر LIVE
                </span>
              </div>

              <div className="space-y-3">
                {students.map((st) => {
                  const pos = selectedSession.studentProgress[st.id] || 0;
                  const isFinished = pos === slides.length;

                  return (
                    <div key={st.id} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img src={st.avatar} alt={st.name} className="w-7 h-7 rounded-lg object-cover" />
                          <span className="text-xs font-bold text-slate-200 truncate max-w-[120px]">{st.name}</span>
                        </div>
                        <span className={`text-[11px] font-mono font-bold ${isFinished ? 'text-emerald-400' : 'text-emerald-400'}`}>
                          شريحة {pos} / {slides.length}
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            isFinished ? 'bg-emerald-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${(pos / (slides.length || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* --- CONFIRM DELETE SESSION MODAL --- */}
      <AnimatePresence>
        {deleteConfirmSession && (
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
                  <h3 className="text-base font-extrabold text-white">تأكيد مسح المحاضرة نهائياً 🗑️</h3>
                  <p className="text-xs text-rose-300 mt-0.5 font-bold">{deleteConfirmSession.title}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                سيتم حذف هذه المحاضرة نهائياً مع كافة كشوف تسجيل الحضور وسلايدات العرض المرتبطة بها. هل أنت متأكد من الحذف؟
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmSession(null)}
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
                  <span>نعم، مسح المحاضرة 🗑️</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CREATE NEW SESSION MODAL --- */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl w-full p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold">إنشاء جلسة/محاضرة تعليمية جديدة</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSession} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-300">عنوان المحاضرة</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: المحاضرة 1: التفاضل والتكامل الضمني"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
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

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300">تاريخ المحاضرة</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300">الوقت</label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300">القاعة / المكان</label>
                    <input
                      type="text"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">وصف وملاحظات المحاضرة</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اكتب الأهداف والمسائل التي سيتم حلها..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                {/* Dynamic Slide Builder */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="font-extrabold text-emerald-400">إضافة سلايد/شريحة تفاعلية للعرض</h4>
                  
                  <input
                    type="text"
                    value={slideTitle}
                    onChange={(e) => setSlideTitle(e.target.value)}
                    placeholder="عنوان الشريحة (مثال: قانون الاشتقاق الضمني)..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />

                  <textarea
                    rows={2}
                    value={slideContent}
                    onChange={(e) => setSlideContent(e.target.value)}
                    placeholder="محتوى الشريحة والشرح التفصيلي..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />

                  <input
                    type="text"
                    value={slideBullet}
                    onChange={(e) => setSlideBullet(e.target.value)}
                    placeholder="نقاط الشريحة (افصل بينها بفاصلة ,)..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />

                  <button
                    type="button"
                    onClick={handleAddSlide}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
                  >
                    إضافة الشريحة لقائمة العرض ({slidesList.length})
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20"
                  >
                    حفظ ونشر المحاضرة
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
