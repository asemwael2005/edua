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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SessionsAdminPage() {
  const { dict, sessions, students, markAttendance, updateSlideProgress } = useEduPulse();

  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || 'sess_1');
  const [activeTab, setActiveTab] = useState<'attendance' | 'slides'>('attendance');

  // Presentation viewer state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const selectedSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  const handleMark = (studentId: string, status: AttendanceStatus) => {
    if (!selectedSession) return;
    markAttendance(selectedSession.id, studentId, status);
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

        {/* Session Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedSessionId}
            onChange={(e) => {
              setSelectedSessionId(e.target.value);
              setCurrentSlideIndex(0);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-800 gap-4 text-sm font-extrabold">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'attendance'
              ? 'border-brand-500 text-brand-400'
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
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>{dict.sessions.slideViewer}</span>
        </button>
      </div>

      {/* TAB 1: QUICK-MARK ATTENDANCE SHEET */}
      {activeTab === 'attendance' && selectedSession && (
        <div className="space-y-4">
          
          {/* Session Summary Bar */}
          <div className="p-5 rounded-3xl glass-panel border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">{selectedSession.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                المادة: <span className="text-brand-400 font-semibold">{selectedSession.subject}</span> | الموعد: {selectedSession.date} ({selectedSession.time}) | القاعة: {selectedSession.room}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold font-mono">
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
                  {students.map((st) => {
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
                                className="h-full bg-brand-500 rounded-full"
                                style={{
                                  width: `${(currentSlidePos / (selectedSession.slides.length || 1)) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-mono text-brand-300 font-bold">
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
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SLIDE DECK & LIVE STUDENT PROGRESS TRACKER */}
      {activeTab === 'slides' && selectedSession && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Slide Presentation Viewer */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900 border border-brand-500/30 shadow-2xl space-y-6 min-h-[420px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Slide Header Controls */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-brand-400 font-mono">
                  شريحة {currentSlideIndex + 1} من {slides.length}
                </span>
                <h3 className="text-sm font-extrabold text-white">{currentSlide?.title}</h3>
                <span className="px-2.5 py-1 rounded-lg bg-brand-950 text-brand-300 text-[11px] font-mono">
                  عروض إديو بلس
                </span>
              </div>

              {/* Slide Body */}
              <div className="space-y-4 py-4 flex-1">
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{currentSlide?.content}</p>

                {currentSlide?.codeOrDiagram && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-brand-500/30 text-cyan-300 font-mono text-xs overflow-x-auto">
                    <code>{currentSlide.codeOrDiagram}</code>
                  </div>
                )}

                {currentSlide?.bulletPoints && currentSlide.bulletPoints.length > 0 && (
                  <ul className="space-y-2 pt-2">
                    {currentSlide.bulletPoints.map((bp, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />
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
                        idx === currentSlideIndex ? 'w-6 bg-brand-500' : 'bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={currentSlideIndex === slides.length - 1}
                  onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-xs font-bold text-white flex items-center gap-1.5 transition shadow-lg"
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
                <FileText className="w-4 h-4 text-brand-400" />
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
                        <span className={`text-[11px] font-mono font-bold ${isFinished ? 'text-emerald-400' : 'text-brand-400'}`}>
                          شريحة {pos} / {slides.length}
                        </span>
                      </div>

                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            isFinished ? 'bg-emerald-500' : 'bg-brand-500'
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

    </div>
  );
}
