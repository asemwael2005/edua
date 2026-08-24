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
  Calendar,
  Phone,
  Mail,
  UserCheck,
  History,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentsManagementPage() {
  const {
    dict,
    students,
    addStudent,
    updateStudent,
    applyBan,
    liftBan,
    adjustGrade,
    gradeLogs,
    sessions,
    quizSubmissions,
    assignmentSubmissions,
  } = useEduPulse();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [banStudent, setBanStudent] = useState<Student | null>(null);
  const [adjustStudent, setAdjustStudent] = useState<Student | null>(null);
  const [profileStudent, setProfileStudent] = useState<Student | null>(null);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    parentPhone: '',
    studentPhone: '',
    grade: 'الصف الثالث الثانوي (Grade 12)',
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
      s.parentPhone.includes(searchQuery);

    const matchesGrade = gradeFilter === 'all' || s.grade.includes(gradeFilter);
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? !s.banDetails?.active
        : s.banDetails?.active;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  // Handle Add/Edit Submit
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        ...formData,
      });
      setEditingStudent(null);
    } else {
      addStudent(formData);
      setIsAddModalOpen(false);
    }

    setFormData({
      name: '',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      parentPhone: '',
      studentPhone: '',
      grade: 'الصف الثالث الثانوي (Grade 12)',
    });
  };

  // Open Edit Modal
  const openEdit = (st: Student) => {
    setEditingStudent(st);
    setFormData({
      name: st.name,
      email: st.email,
      avatar: st.avatar,
      parentPhone: st.parentPhone,
      studentPhone: st.studentPhone,
      grade: st.grade,
    });
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
          <p className="text-xs text-slate-400 mt-1">{dict.students.subtitle}</p>
        </div>

        <button
          onClick={() => {
            setEditingStudent(null);
            setFormData({
              name: '',
              email: '',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
              parentPhone: '',
              studentPhone: '',
              grade: 'الصف الثالث الثانوي (Grade 12)',
            });
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 shrink-0 transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{dict.students.addStudentTitle}</span>
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
            placeholder={dict.students.searchPlaceholder}
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
                <th className="py-3.5 px-4">{dict.students.grade}</th>
                <th className="py-3.5 px-4">{dict.students.parentPhone}</th>
                <th className="py-3.5 px-4">{dict.students.attendanceRate}</th>
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

                      {/* Grade */}
                      <td className="py-3.5 px-4 text-slate-300">{st.grade}</td>

                      {/* Parent Phone */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{st.parentPhone}</td>

                      {/* Attendance % */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                st.attendanceRate >= 90
                                  ? 'bg-emerald-500'
                                  : st.attendanceRate >= 75
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${st.attendanceRate}%` }}
                            />
                          </div>
                          <span className="font-mono text-slate-300 font-bold">{st.attendanceRate}%</span>
                        </div>
                      </td>

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
                              {st.banDetails?.type === 'perm' ? 'محظور دائمياً' : 'محظور مؤقتاً'}
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
                          {/* Grade Adjust */}
                          <button
                            onClick={() => setAdjustStudent(st)}
                            title={dict.students.adjustGrade}
                            className="p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition"
                          >
                            <Award className="w-4 h-4" />
                          </button>

                          {/* Ban Control */}
                          <button
                            onClick={() => setBanStudent(st)}
                            title={dict.students.manageBan}
                            className={`p-2 rounded-xl transition ${
                              isBanned
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                            }`}
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>

                          {/* Full Profile */}
                          <button
                            onClick={() => setProfileStudent(st)}
                            title={dict.students.viewProfile}
                            className="p-2 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => openEdit(st)}
                            title={dict.students.editStudentTitle}
                            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                          >
                            <Edit className="w-4 h-4" />
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
                  {editingStudent ? dict.students.editStudentTitle : dict.students.addStudentTitle}
                </h3>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingStudent(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

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

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300">{dict.students.studentPhone}</label>
                    <input
                      type="text"
                      value={formData.studentPhone}
                      onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500 font-mono"
                      placeholder="+20 11..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300">{dict.students.parentPhone}</label>
                    <input
                      type="text"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500 font-mono"
                      placeholder="+20 10..."
                    />
                  </div>
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

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingStudent(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    {dict.students.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-500/20"
                  >
                    {dict.students.save}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: BAN ENGINE MODAL --- */}
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
                  <span>{dict.banEngine.title}</span>
                </div>
                <button onClick={() => setBanStudent(null)} className="p-1.5 text-slate-400 hover:text-white">
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
                    onClick={() => {
                      liftBan(banStudent.id);
                      setBanStudent(null);
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition mt-2"
                  >
                    {dict.banEngine.liftBan}
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
                    {dict.banEngine.tempBan}
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
                    {dict.banEngine.permBan}
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
                    {dict.banEngine.applyBan}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 3: GRADE ADJUSTMENT MODAL --- */}
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
                <button onClick={() => setAdjustStudent(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Student info */}
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

      {/* --- MODAL 4: COMPREHENSIVE STUDENT PROFILE DRAWER/MODAL --- */}
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
              {/* Profile Header */}
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
                  </div>
                </div>
                <button onClick={() => setProfileStudent(null)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-800 gap-2 overflow-x-auto text-xs font-bold">
                {[
                  { id: 'overview', label: dict.profileDrawer.tabOverview },
                  { id: 'attendance', label: dict.profileDrawer.tabAttendance },
                  { id: 'quizzes', label: dict.profileDrawer.tabQuizzes },
                  { id: 'assignments', label: dict.profileDrawer.tabAssignments },
                  { id: 'ledger', label: dict.profileDrawer.tabLedger },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setProfileTab(tab.id as any)}
                    className={`pb-3 px-3 border-b-2 transition shrink-0 ${
                      profileTab === tab.id
                        ? 'border-brand-500 text-brand-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Overview */}
              {profileTab === 'overview' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                      <span className="block text-xl font-extrabold text-amber-400 font-mono">{profileStudent.totalPoints}</span>
                      <span className="text-[11px] text-slate-400">إجمالي النقاط</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                      <span className="block text-xl font-extrabold text-emerald-400 font-mono">{profileStudent.attendanceRate}%</span>
                      <span className="text-[11px] text-slate-400">نسبة الحضور</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                      <span className="block text-xl font-extrabold text-brand-400 font-mono">
                        {profileStudent.banDetails?.active ? 'محظور' : 'نشط'}
                      </span>
                      <span className="text-[11px] text-slate-400">حالة الحساب</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="font-bold text-slate-200">بيانات التواصل</h4>
                    <p className="text-slate-400">هاتف الطالب: <span className="font-mono text-slate-200">{profileStudent.studentPhone}</span></p>
                    <p className="text-slate-400">هاتف ولي الأمر: <span className="font-mono text-slate-200">{profileStudent.parentPhone}</span></p>
                    <p className="text-slate-400">تاريخ الانضمام: <span className="font-mono text-slate-200">{profileStudent.joinedDate}</span></p>
                  </div>
                </div>
              )}

              {/* Tab 2: Attendance History */}
              {profileTab === 'attendance' && (
                <div className="space-y-3 text-xs">
                  {sessions.map((sess) => {
                    const status = sess.attendance[profileStudent.id] || 'absent';
                    const slidePos = sess.studentProgress[profileStudent.id] || 0;

                    return (
                      <div key={sess.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-slate-200">{sess.title}</h5>
                          <p className="text-[11px] text-slate-400">{sess.date} | {sess.room}</p>
                          <p className="text-[10px] text-brand-400 mt-1">السلايد الحالية: {slidePos} / {sess.slides.length}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-xl font-bold ${
                          status === 'present' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                        }`}>
                          {status === 'present' ? 'حاضر' : status === 'late' ? 'متأخر' : 'غائب'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 3: Quizzes */}
              {profileTab === 'quizzes' && (
                <div className="space-y-3 text-xs">
                  {quizSubmissions.filter((q) => q.studentId === profileStudent.id).map((sub) => (
                    <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-slate-200">الاختبار الإلكتروني</h5>
                        <p className="text-[11px] text-slate-400">التاريخ: {new Date(sub.submittedAt).toLocaleDateString('ar-EG')}</p>
                      </div>
                      <div className="text-left font-mono">
                        <span className="block text-sm font-extrabold text-amber-400">{sub.totalScore} / {sub.maxScore}</span>
                        <span className="text-[10px] text-slate-400">{sub.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Assignments */}
              {profileTab === 'assignments' && (
                <div className="space-y-3 text-xs">
                  {assignmentSubmissions.filter((a) => a.studentId === profileStudent.id).map((sub) => (
                    <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">الواجب الدراسي</span>
                        <span className="text-amber-400 font-mono font-bold">{sub.score ? `${sub.score} درجة` : 'قيد التصحيح'}</span>
                      </div>
                      <p className="text-slate-400 italic">"{sub.content}"</p>
                      {sub.teacherFeedback && (
                        <p className="text-emerald-300 font-semibold pt-1 border-t border-slate-800">ملاحظات المعلم: {sub.teacherFeedback}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Grade Adjustment Ledger */}
              {profileTab === 'ledger' && (
                <div className="space-y-3 text-xs">
                  {gradeLogs.filter((g) => g.studentId === profileStudent.id).map((log) => (
                    <div key={log.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-200 block">{log.reason}</span>
                        <span className="text-[10px] text-slate-400">{log.adminName} | {new Date(log.date).toLocaleDateString('ar-EG')}</span>
                      </div>
                      <span className={`font-mono font-extrabold text-sm ${log.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {log.amount > 0 ? `+${log.amount}` : log.amount} ن
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
