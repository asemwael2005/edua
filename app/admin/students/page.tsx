'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { Student, BanDetails } from '@/types/edupulse';
import {
  Users,
  Search,
  Filter,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Award,
  Edit,
  Eye,
  Trash2,
  X,
  PlusCircle,
  MinusCircle,
  KeyRound,
  Copy,
  Check,
  AlertCircle,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { isValidEgyptianPhone } from '@/lib/phoneUtils';

export default function StudentsManagementPage() {
  const {
    dict,
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    applyBan,
    liftBan,
    adjustGrade,
    showToast,
  } = useEduPulse();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [banStudent, setBanStudent] = useState<Student | null>(null);
  const [deleteTargetStudent, setDeleteTargetStudent] = useState<Student | null>(null);
  const [adjustStudent, setAdjustStudent] = useState<Student | null>(null);
  const [profileStudent, setProfileStudent] = useState<Student | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    parentPhone: '',
    studentPhone: '',
    grade: 'الصف الثالث الثانوي (Grade 12)',
    password: '',
  });

  // Ban Form state
  const [banType, setBanType] = useState<'perm' | 'temp'>('temp');
  const [banStartDate, setBanStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [banEndDate, setBanEndDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16)
  );
  const [banReason, setBanReason] = useState('');
  const [banAppliedBy, setBanAppliedBy] = useState('إدارة المركز');

  // Grade Adjust Form state
  const [adjustType, setAdjustType] = useState<'bonus' | 'deduction'>('bonus');
  const [adjustAmount, setAdjustAmount] = useState(5);
  const [adjustReason, setAdjustReason] = useState('');

  // Profile Drawer active tab
  const [profileTab, setProfileTab] = useState<'overview' | 'attendance' | 'quizzes' | 'assignments' | 'ledger'>('overview');

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentPhone.includes(searchQuery) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = gradeFilter === 'all' || s.grade.includes(gradeFilter);
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? !s.banDetails?.active
        : s.banDetails?.active;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  // Generate random password/PIN
  const generatePassword = () => {
    const chars = '1234567890abcdefghijklmnopqrstuvwxyz';
    let res = '';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: res }));
  };

  // Quick Temporary Pause / Suspend Toggle
  const toggleQuickPause = (st: Student) => {
    if (st.banDetails?.active) {
      liftBan(st.id);
    } else {
      const details: BanDetails = {
        active: true,
        type: 'temp',
        startDate: new Date().toISOString(),
        reason: 'تجميد حساب الطالب مؤقتاً من قِبل الإدارة',
        appliedBy: 'إدارة المركز',
      };
      applyBan(st.id, details);
    }
  };

  // Handle Add/Edit Submit
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('يرجى كتابة اسم الطالب والبريد الإلكتروني');
      return;
    }

    // Mandatory Parent Phone Validation
    if (!formData.parentPhone.trim()) {
      setFormError('رقم هاتف ولي الأمر مطلوب إجبارياً لتسجيل الطالب');
      return;
    }

    if (!isValidEgyptianPhone(formData.parentPhone)) {
      setFormError('رقم هاتف ولي الأمر غير صحيح! يجب أن يكون رقم مصري مكون من 11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015 (مثال: 01012345678)');
      return;
    }

    // Student Phone Validation (if provided)
    if (formData.studentPhone.trim() && !isValidEgyptianPhone(formData.studentPhone)) {
      setFormError('رقم هاتف الطالب غير صحيح! يرجى كتابة رقم مصري مكون من 11 رقم');
      return;
    }

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        ...formData,
      });
      setEditingStudent(null);
    } else {
      addStudent({
        ...formData,
        password: formData.password || '123456',
      });
      setIsAddModalOpen(false);
    }

    setFormData({
      name: '',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      parentPhone: '',
      studentPhone: '',
      grade: 'الصف الثالث الثانوي (Grade 12)',
      password: '',
    });
  };

  // Open Edit Modal
  const openEdit = (st: Student) => {
    setEditingStudent(st);
    setFormError(null);
    setFormData({
      name: st.name,
      email: st.email,
      avatar: st.avatar,
      parentPhone: st.parentPhone,
      studentPhone: st.studentPhone,
      grade: st.grade,
      password: st.password || '123456',
    });
  };

  // Copy text helper
  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('تم نسخ كود/كلمة سر الطالب للمحافظة');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Ban Submit
  const handleApplyBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banStudent || !banReason) return;

    const details: BanDetails = {
      active: true,
      type: banType,
      startDate: new Date(banStartDate).toISOString(),
      endDate: banType === 'temp' ? new Date(banEndDate).toISOString() : undefined,
      reason: banReason,
      appliedBy: banAppliedBy,
    };

    applyBan(banStudent.id, details);
    setBanStudent(null);
    setBanReason('');
  };

  // Handle Confirm Delete
  const handleConfirmDelete = () => {
    if (!deleteTargetStudent) return;
    deleteStudent(deleteTargetStudent.id);
    setDeleteTargetStudent(null);
  };

  // Handle Grade Adjust Submit
  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustStudent || !adjustReason || adjustAmount <= 0) return;

    adjustGrade(adjustStudent.id, adjustAmount, adjustType, adjustReason, 'إدارة المركز');
    setAdjustStudent(null);
    setAdjustReason('');
    setAdjustAmount(5);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-brand-500" />
            <span>{dict.students.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">إدارة حسابات الطلاب، التوقيف المؤقت، التعديل، والحذف النهائى</p>
        </div>

        <button
          onClick={() => {
            setEditingStudent(null);
            setFormError(null);
            setFormData({
              name: '',
              email: '',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
              parentPhone: '',
              studentPhone: '',
              grade: 'الصف الثالث الثانوي (Grade 12)',
              password: Math.random().toString(36).substring(2, 8),
            });
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 shrink-0 transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة طالب جديد وتوليد حساب 🔑</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-4 rounded-2xl glass-panel border flex flex-col md:flex-row items-center gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم الطالب، البريد، الكود، أو هاتف ولي الأمر..."
            className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full md:w-auto py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">{dict.students.filterGrade}</option>
            <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
            <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
            <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">{dict.students.filterStatus}</option>
            <option value="active">{dict.students.active}</option>
            <option value="banned">{dict.students.banned}</option>
          </select>
        </div>

      </div>

      {/* Student Directory Table / Cards */}
      <div className="rounded-3xl glass-panel border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right ltr:text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">الطالب</th>
                <th className="py-3.5 px-4">بيانات الحساب والسر 🔑</th>
                <th className="py-3.5 px-4">{dict.students.grade}</th>
                <th className="py-3.5 px-4">هاتف ولي الأمر</th>
                <th className="py-3.5 px-4">{dict.students.points}</th>
                <th className="py-3.5 px-4">الحالة والضوابط</th>
                <th className="py-3.5 px-4 text-center">{dict.students.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs font-semibold">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    لا يوجد طلاب مطابقين لخيارات البحث
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const isBanned = st.banDetails?.active;
                  const stPass = st.password || '123456';

                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition duration-200"
                    >
                      {/* Avatar & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatar}
                            alt={st.name}
                            className={`w-10 h-10 rounded-2xl object-cover border-2 shrink-0 ${
                              isBanned ? 'border-rose-500 grayscale' : 'border-emerald-500'
                            }`}
                          />
                          <div>
                            <span className="block font-bold text-slate-900 dark:text-white">{st.name}</span>
                            <span className="text-[11px] text-slate-400 font-normal">{st.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Login Credentials & Copy */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-sans">كود:</span>
                            <span className="text-brand-400 font-bold">{st.id}</span>
                            <button
                              type="button"
                              onClick={() => copyText(st.id, `id_${st.id}`)}
                              className="p-1 rounded text-slate-500 hover:text-white"
                              title="نسخ كود الطالب"
                            >
                              {copiedId === `id_${st.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-sans">السر:</span>
                            <span className="text-emerald-400 font-bold">{stPass}</span>
                            <button
                              type="button"
                              onClick={() => copyText(stPass, `pass_${st.id}`)}
                              className="p-1 rounded text-slate-500 hover:text-white"
                              title="نسخ كلمة السر"
                            >
                              {copiedId === `pass_${st.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Grade */}
                      <td className="py-3.5 px-4 text-slate-300">{st.grade}</td>

                      {/* Parent Phone */}
                      <td className="py-3.5 px-4 text-emerald-400 font-mono font-bold">{st.parentPhone || 'غير مسجل'}</td>

                      {/* Points */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-bold font-mono border border-amber-500/20">
                          {st.totalPoints} ن
                        </span>
                      </td>

                      {/* Ban Status */}
                      <td className="py-3.5 px-4">
                        {isBanned ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[11px] font-bold">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                            <span>
                              {st.banDetails?.type === 'perm' ? 'محظور دائمياً' : 'موقوف مؤقتاً'}
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>نشط بالمركز</span>
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Quick Pause / Resume Toggle */}
                          <button
                            type="button"
                            onClick={() => toggleQuickPause(st)}
                            title={isBanned ? 'إعادة تفعيل الحساب' : 'توقيف وتجميد الحساب مؤقتاً'}
                            className={`p-2 rounded-xl transition ${
                              isBanned
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                            }`}
                          >
                            {isBanned ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                          </button>

                          {/* Grade Adjust */}
                          <button
                            type="button"
                            onClick={() => setAdjustStudent(st)}
                            title={dict.students.adjustGrade}
                            className="p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition"
                          >
                            <Award className="w-4 h-4" />
                          </button>

                          {/* Ban Control */}
                          <button
                            type="button"
                            onClick={() => setBanStudent(st)}
                            title="إعدادات الحظر المتقدمة"
                            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>

                          {/* Full Profile */}
                          <button
                            type="button"
                            onClick={() => setProfileStudent(st)}
                            title={dict.students.viewProfile}
                            className="p-2 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Details */}
                          <button
                            type="button"
                            onClick={() => openEdit(st)}
                            title={dict.students.editStudentTitle}
                            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Student Account */}
                          <button
                            type="button"
                            onClick={() => setDeleteTargetStudent(st)}
                            title="مسح وحذف حساب الطالب نهائياً"
                            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* --- MODAL 1: ADD / EDIT STUDENT MODAL --- */}
      <AnimatePresence>
        {(isAddModalOpen || editingStudent) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-white">
                  {editingStudent ? dict.students.editStudentTitle : 'إضافة حساب طالب جديد 🔑'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingStudent(null);
                    setFormError(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveStudent} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-300">{dict.students.name}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    placeholder="مثال: أحمد محمد علي"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">{dict.students.email}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    placeholder="ahmed@edupulse.edu"
                  />
                </div>

                {/* Parent Phone (Mandatory + Validated) */}
                <div className="space-y-1">
                  <label className="text-rose-400 font-bold flex items-center gap-1">
                    <span>هاتف ولي الأمر (إجباري 🔴)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500 font-mono font-bold"
                    placeholder="مثال: 01012345678 أو 011..."
                  />
                  <p className="text-[10px] text-slate-400">يجب إدخال رقم مصري صحيح مكون من 11 رقم يبدأ بـ 010, 011, 012, 015</p>
                </div>

                {/* Password / Login Code field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                      <span>كلمة سر / كود دخول الطالب</span>
                    </label>

                    <button
                      type="button"
                      onClick={generatePassword}
                      className="text-[10px] text-brand-400 hover:text-brand-300 font-bold"
                    >
                      توليد تلقائي 🔑
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold focus:outline-none focus:border-brand-500"
                    placeholder="أدخل كلمة سر دخول الطالب..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300">{dict.students.studentPhone} (اختياري)</label>
                    <input
                      type="text"
                      value={formData.studentPhone}
                      onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500 font-mono"
                      placeholder="01112345678"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300">{dict.students.grade}</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    >
                      <option value="الصف الثالث الثانوي (Grade 12)">الصف الثالث الثانوي (Grade 12)</option>
                      <option value="الصف الثاني الثانوي (Grade 11)">الصف الثاني الثانوي (Grade 11)</option>
                      <option value="الصف الأول الثانوي (Grade 10)">الصف الأول الثانوي (Grade 10)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingStudent(null);
                      setFormError(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    {dict.students.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-500/20"
                  >
                    حفظ الحساب 🔑
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: DELETE STUDENT CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deleteTargetStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-rose-500/40 shadow-2xl space-y-5 text-center glow-rose"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Trash2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-white">تأكيد مسح وحذف حساب الطالب</h3>
                <p className="text-xs text-slate-300 mt-2">
                  هل أنت محقق من إرادة مسح حساب الطالب <strong className="text-rose-400 font-bold">{deleteTargetStudent.name}</strong> ({deleteTargetStudent.id}) نهائياً من المنصة والسيرفر؟
                </p>
                <p className="text-[11px] text-rose-400/80 mt-1 font-semibold">تنبيه: لا يمكن التراجع عن هذا الإجراء بعد الحذف.</p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDeleteTargetStudent(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-500/30"
                >
                  نعم، مسح الحساب نهائياً 🗑️
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 3: BAN ENGINE MODAL --- */}
      <AnimatePresence>
        {banStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-lg w-full p-6 rounded-3xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-5 glow-rose"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-rose-500 font-extrabold text-base">
                  <ShieldAlert className="w-5 h-5" />
                  <span>إعدادات حظر وتوقيف الحساب المتقدمة</span>
                </div>
                <button type="button" onClick={() => setBanStudent(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Target Student Info */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <img src={banStudent.avatar} alt={banStudent.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h4 className="text-sm font-bold text-white">{banStudent.name}</h4>
                  <span className="text-xs text-slate-400">{banStudent.grade}</span>
                </div>
              </div>

              {/* If already banned, offer revoke option */}
              {banStudent.banDetails?.active && (
                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-2">
                  <div className="text-xs font-bold text-rose-300">
                    الحظر مفعّل حالياً: {banStudent.banDetails.type === 'perm' ? 'دائم' : 'مؤقت'}
                  </div>
                  <p className="text-xs text-slate-300">السبب: {banStudent.banDetails.reason}</p>
                  <button
                    type="button"
                    onClick={() => {
                      liftBan(banStudent.id);
                      setBanStudent(null);
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition mt-2"
                  >
                    إلغاء التوقيف وإعادة تفعيل الحساب ▶
                  </button>
                </div>
              )}

              {/* Form to Apply New Ban */}
              <form onSubmit={handleApplyBan} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBanType('temp')}
                    className={`p-3 rounded-2xl border text-center font-bold transition ${
                      banType === 'temp'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    توقيف مؤقت ⏸
                  </button>

                  <button
                    type="button"
                    onClick={() => setBanType('perm')}
                    className={`p-3 rounded-2xl border text-center font-bold transition ${
                      banType === 'perm'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    حظر دائم ⛔
                  </button>
                </div>

                {banType === 'temp' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-300">{dict.banEngine.startDate}</label>
                      <input
                        type="datetime-local"
                        value={banStartDate}
                        onChange={(e) => setBanStartDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300">{dict.banEngine.endDate}</label>
                      <input
                        type="datetime-local"
                        value={banEndDate}
                        onChange={(e) => setBanEndDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500 font-mono"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-slate-300">{dict.banEngine.reason}</label>
                  <textarea
                    required
                    rows={3}
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder={dict.banEngine.reasonPlaceholder}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setBanStudent(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-500/20"
                  >
                    تأكيد التوقيف
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 4: GRADE ADJUSTMENT MODAL --- */}
      <AnimatePresence>
        {adjustStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl space-y-5 glow-indigo"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-base">
                  <Award className="w-5 h-5" />
                  <span>{dict.gradeAdjust.title}</span>
                </div>
                <button type="button" onClick={() => setAdjustStudent(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={adjustStudent.avatar} alt={adjustStudent.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{adjustStudent.name}</h4>
                    <span className="text-xs text-slate-400">{adjustStudent.grade}</span>
                  </div>
                </div>
                <span className="text-sm font-black text-amber-400 font-mono">{adjustStudent.totalPoints} نقطة</span>
              </div>

              <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAdjustType('bonus')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold transition ${
                      adjustType === 'bonus'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-400" />
                    <span>{dict.gradeAdjust.bonus}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('deduction')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold transition ${
                      adjustType === 'deduction'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <MinusCircle className="w-4 h-4 text-rose-400" />
                    <span>{dict.gradeAdjust.deduction}</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">{dict.gradeAdjust.amount}</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300">{dict.gradeAdjust.reason}</label>
                  <textarea
                    required
                    rows={3}
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder={dict.gradeAdjust.reasonPlaceholder}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAdjustStudent(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/20"
                  >
                    {dict.gradeAdjust.submit}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Drawer */}
      <AnimatePresence>
        {profileStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-2xl h-full bg-slate-900 border-r rtl:border-l border-slate-800 p-6 overflow-y-auto space-y-6 text-white"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={profileStudent.avatar}
                    alt={profileStudent.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
                  />
                  <div>
                    <h3 className="text-lg font-extrabold">{profileStudent.name}</h3>
                    <p className="text-xs text-slate-400">{profileStudent.grade} | {profileStudent.email}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs font-mono text-emerald-400">
                      <span>كود الدخول: {profileStudent.id}</span>
                      <span>•</span>
                      <span>السر: {profileStudent.password || '123456'}</span>
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => setProfileStudent(null)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
