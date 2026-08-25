'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { isValidEgyptianPhone } from '@/app/admin/students/page';
import {
  Sparkles,
  Lock,
  User,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  KeyRound,
  AlertCircle,
  Loader2,
  UserPlus,
  Phone,
  Mail,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { students, loginAdmin, setUserRole, setActiveStudentId, dict, language, addStudent } = useEduPulse();

  const redirectParam = searchParams.get('redirect');
  const [activeTab, setActiveTab] = useState<'student_login' | 'student_register' | 'admin_login'>('student_login');
  
  // Login Form States
  const [studentCode, setStudentCode] = useState('');
  const [password, setPassword] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  // Student Registration Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regParentPhone, setRegParentPhone] = useState('');
  const [regStudentPhone, setRegStudentPhone] = useState('');
  const [regGrade, setRegGrade] = useState('الصف الثالث الثانوي (Grade 12)');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if already authenticated on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.authenticated && data.user) {
          const dest = redirectParam && redirectParam.startsWith('/')
            ? decodeURIComponent(redirectParam)
            : data.user.role === 'admin'
            ? '/admin'
            : '/student';
          router.replace(dest);
        }
      })
      .catch(() => {});
  }, [redirectParam, router]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const isAdmin = activeTab === 'admin_login';
    const rawRedirect = searchParams.get('redirect');
    const destination =
      rawRedirect && rawRedirect.startsWith('/')
        ? decodeURIComponent(rawRedirect)
        : isAdmin
        ? '/admin'
        : '/student';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: isAdmin ? 'admin' : 'student',
          password: isAdmin ? adminPasswordInput : password,
          studentCode,
          customStudents: students,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.error ||
            (isAdmin
              ? language === 'ar'
                ? 'كلمة سر الإدارة غير صحيحة.'
                : 'Invalid Admin password.'
              : language === 'ar'
              ? 'كود الطالب أو كلمة المرور غير صحيحة.'
              : 'Invalid student code or password.')
        );
        setIsSubmitting(false);
        return;
      }

      // Sync Client Context State
      if (isAdmin) {
        loginAdmin(adminPasswordInput);
      } else {
        setUserRole('student');
        if (data.user?.id) setActiveStudentId(data.user.id);
      }

      router.replace(destination);
      router.refresh();
    } catch (err) {
      setError(language === 'ar' ? 'حدث خطأ أثناء الاتصال بالخادم' : 'Server connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Student Self-Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('يرجى ملء جميع البيانات الأساسية للطالب');
      return;
    }

    if (!regParentPhone.trim()) {
      setError('رقم هاتف ولي الأمر مطلوب إجبارياً لتسجيل الحساب');
      return;
    }

    if (!isValidEgyptianPhone(regParentPhone)) {
      setError('رقم هاتف ولي الأمر غير صحيح! يجب إدخال رقم مصري مكون من 11 رقم (مثال: 01012345678)');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          parentPhone: regParentPhone,
          studentPhone: regStudentPhone,
          grade: regGrade,
          password: regPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'فشل تسجيل حساب الطالب الجديد');
        setIsSubmitting(false);
        return;
      }

      // Sync client context with newly created student
      if (data.student) {
        addStudent(data.student);
        setActiveStudentId(data.student.id);
      }
      setUserRole('student');

      router.replace('/student');
      router.refresh();
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء حساب الطالب في السيرفر');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-brand-500/30 shadow-2xl backdrop-blur-2xl space-y-6 glow-indigo"
      >
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-purple flex items-center justify-center text-white shadow-xl glow-indigo">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">{dict.brandName}</h1>
          <p className="text-xs text-slate-400 font-medium">منصة إديو بلس التعليمية التفاعلية</p>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-extrabold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student_login');
              setError(null);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-1 transition ${
              activeTab === 'student_login'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>دخول طالب</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('student_register');
              setError(null);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-1 transition ${
              activeTab === 'student_register'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>حساب جديد</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin_login');
              setError(null);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-1 transition ${
              activeTab === 'admin_login'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>الإدارة 🔒</span>
          </button>
        </div>

        {/* 1. STUDENT LOGIN FORM */}
        {activeTab === 'student_login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-slate-300">كود الطالب أو البريد/الهاتف</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="أدخل كود الطالب أو البريد..."
                  className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">كلمة المرور / كود السر</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التحقق والدخول...</span>
                </>
              ) : (
                <>
                  <span>تسجيل دخول الطالب</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 2. STUDENT SELF-REGISTRATION FORM */}
        {activeTab === 'student_register' && (
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-slate-300">اسم الطالب ثلاثي</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="أدخل اسم الطالب..."
                  className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student@edupulse.edu"
                  className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-rose-400 font-bold">هاتف ولي الأمر (إجباري 🔴)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-rose-400 absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={regParentPhone}
                  onChange={(e) => setRegParentPhone(e.target.value)}
                  placeholder="مثال: 01012345678"
                  className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-slate-300">الصف الدراسي</label>
                <select
                  value={regGrade}
                  onChange={(e) => setRegGrade(e.target.value)}
                  className="w-full px-2.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-[11px] focus:outline-none focus:border-purple-500"
                >
                  <option value="الصف الثالث الثانوي (Grade 12)">الصف الثالث الثانوي</option>
                  <option value="الصف الثاني الثانوي (Grade 11)">الصف الثاني الثانوي</option>
                  <option value="الصف الأول الثانوي (Grade 10)">الصف الأول الثانوي</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300">كلمة المرور</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري إنشاء الحساب والتسجيل...</span>
                </>
              ) : (
                <>
                  <span>إنشاء الحساب والدخول الآن 📝</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 3. ADMIN LOGIN FORM */}
        {activeTab === 'admin_login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold">
            <div className="p-3 rounded-2xl bg-brand-950/40 border border-brand-500/30 text-center space-y-1">
              <ShieldCheck className="w-6 h-6 text-brand-400 mx-auto" />
              <h3 className="text-xs font-bold text-white">منطقة محمية بمجلس الإدارة</h3>
              <p className="text-[11px] text-slate-400">يلزم إدخال كلمة سر مسؤول المركز للوصول</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300">كلمة سر مسئول الإدارة</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-extrabold text-sm shadow-xl shadow-brand-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التحقق والوصول...</span>
                </>
              ) : (
                <>
                  <span>دخول لوحة الإدارة 🔒</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </>
              )}
            </button>
          </form>
        )}

      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="flex items-center gap-3 text-brand-500 font-bold">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>جاري تحميل صفحة الدخول والتسجيل...</span>
          </div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
