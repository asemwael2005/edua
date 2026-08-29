'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { GraduationCap, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChangeGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangeGradeModal: React.FC<ChangeGradeModalProps> = ({ isOpen, onClose }) => {
  const { activeStudent, students, updateStudent, showToast } = useEduPulse();
  const currentStudent = activeStudent || students[0];

  const [selectedGrade, setSelectedGrade] = useState(
    currentStudent?.grade || 'الصف الأول الثانوي (Grade 10)'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !currentStudent) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Update server cookie & DB
      await fetch('/api/auth/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: selectedGrade }),
      });

      // 2. Update local state
      updateStudent({
        ...currentStudent,
        grade: selectedGrade,
      });

      showToast(`تم تغيير صفك الدراسي بنجاح إلى: ${selectedGrade} 🎓`);
      onClose();
    } catch (err) {
      showToast('حدث خطأ أثناء تغيير الصف الدراسي', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <span>تغيير الصف الدراسي للحساب 🎓</span>
            </h3>
            <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">اسم الطالب المسجل:</span>
              <p className="text-sm font-bold text-white">{currentStudent.name}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block">اختر الصف الدراسي الجديد:</label>
              <div className="space-y-2">
                {[
                  'الصف الأول الثانوي (Grade 10)',
                  'الصف الثاني الثانوي (Grade 11)',
                  'الصف الثالث الثانوي (Grade 12)',
                ].map((g) => {
                  const isSelected = selectedGrade === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGrade(g)}
                      className={`w-full p-3 rounded-2xl border flex items-center justify-between text-xs font-extrabold transition ${
                        isSelected
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{g}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold shadow-lg shadow-emerald-500/20 transition"
              >
                {isSubmitting ? 'جاري التحديث...' : 'حفظ وتطابق المحتوى 🚀'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
