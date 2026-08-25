'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { BanShield } from '@/components/BanShield';
import { Assignment } from '@/types/edupulse';
import { isMatchingGrade } from '@/lib/gradeUtils';
import { BookOpenCheck, Upload, Calendar, CheckCircle2, Clock, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentAssignmentsPage() {
  const { dict, assignments, assignmentSubmissions, submitAssignment, activeStudent } = useEduPulse();

  const [submitModalAsgn, setSubmitModalAsgn] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');

  if (!activeStudent) return null;

  // Filter assignments strictly for active student's grade level
  const filteredAssignments = assignments.filter((a) => isMatchingGrade(a.grade, activeStudent.grade));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitModalAsgn || !submissionContent) return;

    submitAssignment(submitModalAsgn.id, activeStudent.id, submissionContent);
    setSubmitModalAsgn(null);
    setSubmissionContent('');
  };

  return (
    <BanShield student={activeStudent}>
      <div className="space-y-6 pb-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <BookOpenCheck className="w-7 h-7 text-amber-500" />
              <span>{dict.assignments.title}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">تنسيق التكليفات المخصصة لـ ({activeStudent.grade})</p>
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold font-mono self-start sm:self-auto">
            {activeStudent.grade}
          </span>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {filteredAssignments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl glass-panel border space-y-2">
              <BookOpenCheck className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-300">لا توجد واجبات مطلوبة لصفك الدراسي حالياً</h4>
              <p className="text-xs text-slate-500">سيتم تنبيهك فور إضافة المعلم تكليفات جديدة لـ {activeStudent.grade}</p>
            </div>
          ) : (
            filteredAssignments.map((asgn) => {
              const mySubmission = assignmentSubmissions.find(
                (s) => s.assignmentId === asgn.id && s.studentId === activeStudent.id
              );

              return (
                <div key={asgn.id} className="p-6 rounded-3xl glass-panel border space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-extrabold text-white">{asgn.title}</h3>
                      <span className="text-xs text-slate-400">المادة: {asgn.subject} | الصف: {asgn.grade} | الدرجة الكلية: {asgn.maxScore}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-amber-400 font-mono font-bold bg-amber-950/50 px-3 py-1.5 rounded-xl border border-amber-500/20">
                      <Calendar className="w-4 h-4" />
                      <span>الموعد النهائي: {new Date(asgn.deadline).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{asgn.description}</p>

                  {/* Submission Status Box */}
                  <div className="pt-2">
                    {mySubmission ? (
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>تم تسليم الواجب</span>
                          </span>

                          <span className="font-mono text-amber-400 font-bold">
                            {mySubmission.score !== undefined ? `الدرجة: ${mySubmission.score} / ${asgn.maxScore}` : 'قيد التصحيح'}
                          </span>
                        </div>

                        <p className="text-slate-300 italic">"{mySubmission.content}"</p>

                        {mySubmission.teacherFeedback && (
                          <div className="p-3 rounded-xl bg-slate-950 border border-brand-500/30 text-brand-300 font-semibold pt-2 mt-2">
                            {dict.assignments.teacherFeedback} {mySubmission.teacherFeedback}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setSubmitModalAsgn(asgn)}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg transition flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{dict.assignments.submitSolution}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* --- SUBMISSION MODAL --- */}
        <AnimatePresence>
          {submitModalAsgn && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-white">{dict.assignments.submitSolution}</h3>
                  <button onClick={() => setSubmitModalAsgn(null)} className="p-1.5 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1">
                    <label className="text-slate-300">أدخل نص الإجابة أو رابط الملف/PDF</label>
                    <textarea
                      required
                      rows={5}
                      value={submissionContent}
                      onChange={(e) => setSubmissionContent(e.target.value)}
                      placeholder="قم بإدخال خطوات الحل والتوضيحات بالتفصيل..."
                      className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSubmitModalAsgn(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/20"
                    >
                      إرسال الحل الآن
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </BanShield>
  );
}
