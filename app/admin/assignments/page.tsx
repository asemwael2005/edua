'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { Assignment, AssignmentSubmission } from '@/types/edupulse';
import {
  BookOpenCheck,
  Plus,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  MessageSquare,
  X,
  FileText,
  User,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AssignmentsAdminPage() {
  const {
    dict,
    assignments,
    createAssignment,
    deleteAssignment,
    assignmentSubmissions,
    gradeSubmission,
    students,
  } = useEduPulse();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [deleteConfirmAssignment, setDeleteConfirmAssignment] = useState<Assignment | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('الرياضيات');
  const [grade, setGrade] = useState('الصف الأول الثانوي (Grade 10)');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16));
  const [maxScore, setMaxScore] = useState(20);

  // Grade Form State
  const [gradeScore, setGradeScore] = useState(20);
  const [teacherFeedback, setTeacherFeedback] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    createAssignment({
      title,
      subject,
      grade,
      description,
      deadline: new Date(deadline).toISOString(),
      maxScore,
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    gradeSubmission(selectedSubmission.id, gradeScore, teacherFeedback);
    setSelectedSubmission(null);
    setTeacherFeedback('');
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmAssignment) return;
    deleteAssignment(deleteConfirmAssignment.id);
    setDeleteConfirmAssignment(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <BookOpenCheck className="w-7 h-7 text-amber-500" />
            <span>{dict.assignments.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">{dict.assignments.subtitle}</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{dict.assignments.createAssignment}</span>
        </button>
      </div>

      {/* Assignments Roster */}
      <div className="space-y-6">
        {assignments.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border space-y-3">
            <BookOpenCheck className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-300">لا توجد واجبات مضافة حالياً</h4>
            <p className="text-xs text-slate-500">اضغط على "إسناد واجب دراسي جديد" لإضافة أول واجب للصفوف</p>
          </div>
        ) : (
          assignments.map((asgn) => {
            const subs = assignmentSubmissions.filter((s) => s.assignmentId === asgn.id);

            return (
              <div key={asgn.id} className="p-6 rounded-3xl glass-panel border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-white">{asgn.title}</h3>
                    <span className="text-xs text-slate-400">المادة: {asgn.subject} | {asgn.grade} | الدرجة الكلية: {asgn.maxScore}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-mono font-bold bg-amber-950/50 px-3 py-1.5 rounded-xl border border-amber-500/20">
                      <Calendar className="w-4 h-4" />
                      <span>الموعد النهائي: {new Date(asgn.deadline).toLocaleDateString('ar-EG')}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmAssignment(asgn)}
                      className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1 transition"
                      title="مسح هذا الواجب"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف 🗑️</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{asgn.description}</p>

                {/* Submissions List */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    تسليمات الطلاب ({subs.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {subs.map((sub) => {
                      const st = students.find((s) => s.id === sub.studentId);
                      const isGraded = sub.status === 'graded';

                      return (
                        <div
                          key={sub.id}
                          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <img src={st?.avatar} alt={st?.name} className="w-9 h-9 rounded-xl object-cover" />
                            <div>
                              <span className="block text-xs font-bold text-white">{st?.name}</span>
                              <span className="text-[10px] text-slate-400">
                                تاريخ التسليم: {new Date(sub.submittedAt).toLocaleDateString('ar-EG')}
                              </span>
                            </div>
                          </div>

                          <div>
                            {isGraded ? (
                              <div className="text-left font-mono">
                                <span className="block text-xs font-bold text-emerald-400">{sub.score} / {asgn.maxScore}</span>
                                <span className="text-[10px] text-slate-400">تم التصحيح</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedSubmission(sub);
                                  setGradeScore(asgn.maxScore);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition"
                              >
                                {dict.assignments.gradeSubmission}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- CONFIRM DELETE ASSIGNMENT MODAL --- */}
      <AnimatePresence>
        {deleteConfirmAssignment && (
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
                  <h3 className="text-base font-extrabold text-white">تأكيد مسح الواجب نهائياً 🗑️</h3>
                  <p className="text-xs text-rose-300 mt-0.5 font-bold">{deleteConfirmAssignment.title}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                سيتم حذف هذا الواجب نهائياً مع جميع إجابات وتسليمات الطلاب المتعلقة به. هل أنت أصلًا متأكد من الحذف؟
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmAssignment(null)}
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
                  <span>نعم، مسح الواجب 🗑️</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- GRADE SUBMISSION MODAL --- */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold">{dict.assignments.gradeSubmission}</h3>
                <button onClick={() => setSelectedSubmission(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-amber-400">حل الطالب:</span>
                <p className="text-slate-200 italic">"{selectedSubmission.content}"</p>
              </div>

              <form onSubmit={handleGradeSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-300">{dict.assignments.enterScore}</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">ملاحظات المعلم وتقييمه</label>
                  <textarea
                    rows={3}
                    value={teacherFeedback}
                    onChange={(e) => setTeacherFeedback(e.target.value)}
                    placeholder="ملاحظات تفصيلية لتوجيه الطالب..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/20"
                  >
                    حفظ التقييم والملاحظات
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CREATE ASSIGNMENT MODAL --- */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold">{dict.assignments.createAssignment}</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-300">عنوان الواجب</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: واجب الدرس 3 - التطبيقات الهندسية"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
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

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300">تاريخ التسليم النهائي</label>
                    <input
                      type="datetime-local"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300">الدرجة الكلية</label>
                    <input
                      type="number"
                      value={maxScore}
                      onChange={(e) => setMaxScore(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">تفاصيل المسائل والمطلوب</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اكتب التوجيهات والمسائل المطلوبة من الكتاب المدرسي..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
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
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/20"
                  >
                    حفظ وإسناد الواجب
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
