'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import {
  ShieldCheck,
  KeyRound,
  UserPlus,
  Lock,
  CheckCircle,
  AlertCircle,
  Users,
  Shield,
  Sparkles,
  X,
  Mail,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSettingsPage() {
  const { adminPassword, changeAdminPassword, adminUsers, addAdminUser } = useEduPulse();

  // Change Password Form State
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  // Add Co-Admin Modal State
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'master_admin' | 'assistant'>('assistant');

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);

    if (currentPassInput !== adminPassword) {
      setPassError('كلمة السر الحالية غير صحيحة');
      return;
    }

    if (newPassInput.length < 4) {
      setPassError('كلمة السر الجديدة يجب أن تكون 4 خانات على الأقل');
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setPassError('كلمة السر الجديدة وتأكيدها غير متطابقان');
      return;
    }

    changeAdminPassword(newPassInput);
    setPassSuccess(true);
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
  };

  const handleAddCoAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) return;

    addAdminUser({
      name: newAdminName,
      email: newAdminEmail,
      role: newAdminRole,
    });

    setIsAddAdminModalOpen(false);
    setNewAdminName('');
    setNewAdminEmail('');
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-brand-400" />
            <span>إعدادات أمان الإدارة والمسؤولين</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">تغيير كلمة سر الإدارة، إضافة أدمن جديد، وإدارة صلاحيات المساعدين</p>
        </div>

        <button
          onClick={() => setIsAddAdminModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 shrink-0 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة مسؤول/مساعد جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CARD 1: CHANGE ADMIN PASSWORD */}
        <div className="p-6 rounded-3xl glass-panel border space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">تغيير كلمة سر الإدارة</h3>
              <p className="text-xs text-slate-400">تحديث الرقم السري الخاص بفتح لوحة الإدارة</p>
            </div>
          </div>

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs font-semibold">
            {passSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تم تحديث كلمة سر الإدارة بنجاح!</span>
              </div>
            )}

            {passError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-slate-300">كلمة السر الحالية</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={currentPassInput}
                  onChange={(e) => setCurrentPassInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full ltr:pl-9 rtl:pr-9 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">كلمة السر الجديدة</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  placeholder="أدخل كلمة السر الجديدة..."
                  className="w-full ltr:pl-9 rtl:pr-9 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">تأكيد كلمة السر الجديدة</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassInput}
                  onChange={(e) => setConfirmPassInput(e.target.value)}
                  placeholder="أعد كتابة كلمة السر جديدة..."
                  className="w-full ltr:pl-9 rtl:pr-9 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold shadow-lg transition"
            >
              تحديث وحفظ كلمة السر
            </button>
          </form>
        </div>

        {/* CARD 2: CO-ADMINS & ASSISTANTS ROSTER */}
        <div className="p-6 rounded-3xl glass-panel border space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-950/80 border border-brand-500/30 text-brand-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">طاقم الإدارة والمساعدين ({adminUsers.length})</h3>
              <p className="text-xs text-slate-400">قائمة الأشخاص المصرح لهم بالدخول للوحة التحكم</p>
            </div>
          </div>

          <div className="space-y-3">
            {adminUsers.map((adm) => (
              <div
                key={adm.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-brand-400 flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white">{adm.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{adm.email}</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono ${
                    adm.role === 'master_admin'
                      ? 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {adm.role === 'master_admin' ? 'مدير المنصة Master' : 'مساعد الإدارة Assistant'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- ADD CO-ADMIN MODAL --- */}
      <AnimatePresence>
        {isAddAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-brand-500/30 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-white">إضافة مسؤول/مساعد جديد للإدارة</h3>
                <button onClick={() => setIsAddAdminModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCoAdminSubmit} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className="text-slate-300">اسم المسؤول / المساعد</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      placeholder="مثال: أ. محمد عبدالفتاح (مساعد رياضيات)"
                      className="w-full ltr:pl-9 rtl:pr-9 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300">البريد الإلكتروني أو الهاتف</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="assistant@edupulse.edu"
                      className="w-full ltr:pl-9 rtl:pr-9 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300">دور الصلاحية</label>
                  <select
                    value={newAdminRole}
                    onChange={(e: any) => setNewAdminRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="assistant">مساعد إدارة (تصحيح واجبات وحضور)</option>
                    <option value="master_admin">مسؤول كامل (Full Admin)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddAdminModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg"
                  >
                    إضافة المسؤول
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
