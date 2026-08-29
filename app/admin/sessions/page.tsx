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
  const { dict, sessions, students, markAttendance, updateSlideProgress, createSession, updateSession, deleteSession } = useEduPulse();

  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'attendance' | 'slides'>('attendance');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
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
  const [isPublished, setIsPublished] = useState(true);
  const [accessScope, setAccessScope] = useState<'all' | 'specific'>('all');
  const [allowedStudentIds, setAllowedStudentIds] = useState<string[]>([]);

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

  const handleOpenEditSession = (sess: Session) => {
    setEditingSession(sess);
    setTitle(sess.title);
    setSubject(sess.subject);
    setGrade(sess.grade);
    setDate(sess.date);
    setTime(sess.time);
    setRoom(sess.room);
    setDescription(sess.description);
    setSlidesList(sess.slides || []);
    setIsPublished(sess.isPublished !== false);
    if (sess.allowedStudentIds && sess.allowedStudentIds.length > 0) {
      setAccessScope('specific');
      setAllowedStudentIds(sess.allowedStudentIds);
    } else {
      setAccessScope('all');
      setAllowedStudentIds([]);
    }
    setIsCreateModalOpen(true);
  };

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

    const payload = {
      title,
      subject,
      grade,
      date,
      time,
      room,
      description,
      slides: slidesList,
      isPublished,
      allowedStudentIds: accessScope === 'specific' ? allowedStudentIds : [],
    };

    if (editingSession) {
      updateSession({
        ...editingSession,
        ...payload,
      });
    } else {
      createSession(payload);
    }

    setIsCreateModalOpen(false);
    setEditingSession(null);
    setTitle('');
    setDescription('');
    setAllowedStudentIds([]);
    setAccessScope('all');
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
            <>
              <button
                type="button"
                onClick={() => handleOpenEditSession(selectedSession)}
                className="px-3.5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/40 font-bold text-xs flex items-center gap-1.5 transition shadow"
                title="تعديل المحاضرة وتخصيص صلاحيات الطلاب"
              >
                <span>تحديد من يراه 🎯</span>
              </button>

              <button
                type="button"
                onClick={() => setDeleteConfirmSession(selectedSession)}
                className="px-3.5 py-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/90 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1.5 transition shadow"
                title="مسح هذه المحاضرة"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>مسح المحاضرة 🗑️</span>
              </button>
            </>
          )}

          <button
            onClick={() => {
              setEditingSession(null);
              setTitle('');
              setDescription('');
              setAllowedStudentIds([]);
              setAccessScope('all');
              setIsCreateModalOpen(true);
            }}
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
          className={`pb-3 flex items-center gap-2 transition border-b-2 ${
            activeTab === 'attendance'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{dict.sessions.attendanceSheet}</span>
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          className={`pb-3 flex items-center gap-2 transition border-b-2 ${
            activeTab === 'slides'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>{dict.sessions.slideViewer} ({slides.length})</span>
        </button>
      </div>

      {/* TAB 1: ATTENDANCE TRACKER */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-4">
              <span>المكان: <strong className="text-white">{selectedSession?.room}</strong></span>
              <span>الموعد: <strong className="text-white">{selectedSession?.time}</strong></span>
              <span>المرحلة: <strong className="text-emerald-400">{selectedSession?.grade}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> حافز بونص التزام
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => {
              const status = selectedSession?.attendance[student.id] || 'none';

              return (
                <div
                  key={student.id}
                  className="p-4 rounded-3xl glass-panel border space-y-3 flex flex-col justify-between hover:border-emerald-500/30 transition"
                >
                  <div className="flex items-center gap-3">
                    <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-2xl object-cover" />
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{student.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">نسبة الحضور: {student.attendanceRate}%</span>
                    </div>
                  </div>

                  {/* Attendance Controls */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleMark(student.id, 'present')}
                      className={`p-2 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition ${
                        status === 'present'
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>حاضر 🟢</span>
                    </button>

                    <button
                      onClick={() => handleMark(student.id, 'late')}
                      className={`p-2 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition ${
                        status === 'late'
                          ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>متأخر 🟡</span>
                    </button>

                    <button
                      onClick={() => handleMark(student.id, 'absent')}
                      className={`p-2 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition ${
                        status === 'absent'
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>غائب 🔴</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE PRESENTATION VIEWER */}
      {activeTab === 'slides' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

      {/* --- CREATE / EDIT SESSION MODAL --- */}
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
                <h3 className="text-base font-extrabold">
                  {editingSession ? 'تعديل المحاضرة والتحكم في صلاحيات الوصول 🎯' : 'إنشاء جلسة/محاضرة تعليمية جديدة'}
                </h3>
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
                    <label className="text-slate-300">توقيت المحاضرة</label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="17:00 - 19:30"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300">القاعة / الغرفة</label>
                    <input
                      type="text"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
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
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
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
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      <span>طلاب محددون فقط 🎯 ({allowedStudentIds.length} طالب)</span>
                    </button>
                  </div>

                  {accessScope === 'specific' && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-800">
                      <p className="text-[11px] text-emerald-300 font-semibold">حدد الطلاب المسموح لهم برؤية وحضور هذه المحاضرة:</p>
                      <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                        {students.map((st) => {
                          const isChecked = allowedStudentIds.includes(st.id);
                          return (
                            <label
                              key={st.id}
                              className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs transition ${
                                isChecked ? 'bg-emerald-950/60 border-emerald-500/50 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400'
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
                                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
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
                  <label className="text-slate-300">وصف وفكرة الجلسة</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="وصف مختصر لموضوع الجلسة..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                {/* Slides Builder Section */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <h4 className="font-extrabold text-emerald-400">إعداد شرائح العرض السريعة (Slides):</h4>

                  <div className="space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <input
                      type="text"
                      placeholder="عنوان الشريحة..."
                      value={slideTitle}
                      onChange={(e) => setSlideTitle(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                    <textarea
                      rows={2}
                      placeholder="محتوى الشريحة والشرح الرئيسية..."
                      value={slideContent}
                      onChange={(e) => setSlideContent(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                    <input
                      type="text"
                      placeholder="نقاط فرعية (افصل بينها بفصلات)..."
                      value={slideBullet}
                      onChange={(e) => setSlideBullet(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddSlide}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow"
                    >
                      إضافة الشريحة لقائمة العرض ({slidesList.length})
                    </button>
                  </div>
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
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold shadow-lg shadow-emerald-500/20 transition"
                  >
                    {editingSession ? 'حفظ التعديلات والصلاحيات 💾' : 'حفظ وإنشاء الجلسة 🚀'}
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
