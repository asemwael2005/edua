'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, dictionary } from '@/lib/dictionary';
import {
  Student,
  Session,
  Quiz,
  Assignment,
  CurriculumMilestone,
  SessionFeedback,
  GradeLog,
  AssignmentSubmission,
  QuizSubmission,
  AttendanceStatus,
  BanDetails,
  RecordedVideo,
  AdminUser,
  ActiveLiveStream,
} from '@/types/edupulse';
import {
  initialStudents,
  initialSessions,
  initialQuizzes,
  initialAssignments,
  initialAssignmentSubmissions,
  initialCurriculum,
  initialFeedback,
  initialGradeLogs,
  initialQuizSubmissions,
  initialVideos,
} from '@/lib/seedData';

type Theme = 'light' | 'dark';
type UserRole = 'admin' | 'student';

interface EduPulseContextType {
  language: Language;
  theme: Theme;
  userRole: UserRole;
  activeStudentId: string;
  activeStudent: Student | undefined;
  dict: typeof dictionary['ar'];
  
  // Admin Authentication Security
  isAdminAuthenticated: boolean;
  adminPassword: string;
  adminUsers: AdminUser[];
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (newPass: string) => void;
  addAdminUser: (admin: Omit<AdminUser, 'id' | 'createdAt'>) => void;

  students: Student[];
  sessions: Session[];
  quizzes: Quiz[];
  assignments: Assignment[];
  assignmentSubmissions: AssignmentSubmission[];
  quizSubmissions: QuizSubmission[];
  curriculum: CurriculumMilestone[];
  feedback: SessionFeedback[];
  gradeLogs: GradeLog[];
  videos: RecordedVideo[];
  activeLiveStream: ActiveLiveStream | null;

  // Toast / notification state
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;

  // Setters
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setUserRole: (role: UserRole) => void;
  setActiveStudentId: (id: string) => void;

  // Actions
  addStudent: (student: Omit<Student, 'id' | 'joinedDate' | 'attendanceRate' | 'totalPoints'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;
  applyBan: (studentId: string, banDetails: BanDetails) => void;
  liftBan: (studentId: string) => void;
  adjustGrade: (studentId: string, amount: number, type: 'bonus' | 'deduction', reason: string, adminName?: string) => void;
  markAttendance: (sessionId: string, studentId: string, status: AttendanceStatus) => void;
  updateSlideProgress: (sessionId: string, studentId: string, slideNumber: number) => void;
  createSession: (sessionData: Omit<Session, 'id' | 'attendance' | 'studentProgress'>) => void;
  deleteSession: (sessionId: string) => void;
  createQuiz: (quiz: Omit<Quiz, 'id'>) => void;
  toggleQuizStatus: (quizId: string) => void;
  deleteQuiz: (quizId: string) => void;
  submitQuiz: (submission: Omit<QuizSubmission, 'id' | 'submittedAt'>) => void;
  createAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  deleteAssignment: (assignmentId: string) => void;
  submitAssignment: (assignmentId: string, studentId: string, content: string) => void;
  gradeSubmission: (submissionId: string, score: number, feedback: string) => void;
  addCurriculumMilestone: (milestone: Omit<CurriculumMilestone, 'id'>) => void;
  updateCurriculumMilestone: (milestone: CurriculumMilestone) => void;
  deleteCurriculumMilestone: (milestoneId: string) => void;
  addSessionFeedback: (feedback: Omit<SessionFeedback, 'id' | 'submittedAt'>) => void;
  deleteSessionFeedback: (feedbackId: string) => void;
  addVideo: (videoData: Omit<RecordedVideo, 'id' | 'createdAt' | 'viewsCount'>) => void;
  deleteVideo: (videoId: string) => void;
  updateLiveStream: (sessionId: string, isLive: boolean, meetingUrl: string, grade?: string, title?: string) => void;
  resetToDefaultData: () => void;
  clearAllData: () => void;
}

const EduPulseContext = createContext<EduPulseContextType | undefined>(undefined);

const STORAGE_PREFIX = 'edupulse_v1_';

export const EduPulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Config state
  const [language, setLanguageState] = useState<Language>('ar');
  const [theme, setThemeState] = useState<Theme>('dark');
  const [userRole, setUserRoleState] = useState<UserRole>('student'); // default to student for security!
  const [activeStudentId, setActiveStudentIdState] = useState<string>('std_2');

  // Admin Auth Security State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPasswordState] = useState<string>('admin123');
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: 'adm_1',
      name: 'الأستاذ عاصم وائل (Master Admin)',
      email: 'admin@edupulse.edu',
      role: 'master_admin',
      createdAt: '2025-09-01',
    },
  ]);

  const addAdminUser = (admData: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const newAdmin: AdminUser = {
      ...admData,
      id: `adm_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newAdmin, ...adminUsers];
    setAdminUsers(updated);
    saveState('admin_users', updated);
    showToast(language === 'ar' ? 'تمت إضافة المسؤول/المساعد بنجاح' : 'Co-admin added successfully');
  };

  // Data state
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<AssignmentSubmission[]>(initialAssignmentSubmissions);
  const [quizSubmissions, setQuizSubmissions] = useState<QuizSubmission[]>(initialQuizSubmissions);
  const [curriculum, setCurriculum] = useState<CurriculumMilestone[]>(initialCurriculum);
  const [feedback, setFeedback] = useState<SessionFeedback[]>(initialFeedback);
  const [gradeLogs, setGradeLogs] = useState<GradeLog[]>(initialGradeLogs);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(`${STORAGE_PREFIX}lang`) as Language;
      if (savedLang) setLanguageState(savedLang);

      const savedTheme = localStorage.getItem(`${STORAGE_PREFIX}theme`) as Theme;
      if (savedTheme) setThemeState(savedTheme);

      const savedRole = localStorage.getItem(`${STORAGE_PREFIX}role`) as UserRole;
      if (savedRole) setUserRoleState(savedRole);

      const savedAdminAuth = localStorage.getItem(`${STORAGE_PREFIX}adminAuth`);
      if (savedAdminAuth === 'true') setIsAdminAuthenticated(true);

      const savedAdminPass = localStorage.getItem(`${STORAGE_PREFIX}adminPass`);
      if (savedAdminPass) setAdminPasswordState(savedAdminPass);

      const savedActiveStudent = localStorage.getItem(`${STORAGE_PREFIX}activeStudent`);
      if (savedActiveStudent) setActiveStudentIdState(savedActiveStudent);

      const savedStudents = localStorage.getItem(`${STORAGE_PREFIX}students`);
      if (savedStudents) setStudents(JSON.parse(savedStudents));

      const savedSessions = localStorage.getItem(`${STORAGE_PREFIX}sessions`);
      if (savedSessions) setSessions(JSON.parse(savedSessions));

      const savedQuizzes = localStorage.getItem(`${STORAGE_PREFIX}quizzes`);
      if (savedQuizzes) setQuizzes(JSON.parse(savedQuizzes));

      const savedAssignments = localStorage.getItem(`${STORAGE_PREFIX}assignments`);
      if (savedAssignments) setAssignments(JSON.parse(savedAssignments));

      const savedAsgnSubs = localStorage.getItem(`${STORAGE_PREFIX}asgn_subs`);
      if (savedAsgnSubs) setAssignmentSubmissions(JSON.parse(savedAsgnSubs));

      const savedQuizSubs = localStorage.getItem(`${STORAGE_PREFIX}quiz_subs`);
      if (savedQuizSubs) setQuizSubmissions(JSON.parse(savedQuizSubs));

      const savedCurriculum = localStorage.getItem(`${STORAGE_PREFIX}curriculum`);
      if (savedCurriculum) setCurriculum(JSON.parse(savedCurriculum));

      const savedFeedback = localStorage.getItem(`${STORAGE_PREFIX}feedback`);
      if (savedFeedback) setFeedback(JSON.parse(savedFeedback));

      const savedGradeLogs = localStorage.getItem(`${STORAGE_PREFIX}grade_logs`);
      if (savedGradeLogs) setGradeLogs(JSON.parse(savedGradeLogs));
    } catch (e) {
      console.warn('LocalStorage initial load warning', e);
    }
  }, []);

  // Helper to sync changes directly with Server Database
  const syncDB = (action: 'create' | 'update' | 'delete' | 'toggle', table: string, payload: any) => {
    const body: any = { action, table };
    if (action === 'delete' || action === 'toggle') {
      body.id = payload;
    } else {
      body.item = payload;
    }

    fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch((e) => console.warn('Server DB Mutation warning:', e));
  };

  // Fetch real server Database on mount
  useEffect(() => {
    fetch('/api/db')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.db) {
          const db = data.db;
          if (Array.isArray(db.students)) {
            setStudents((prevLocal) => {
              const mergedMap = new Map<string, Student>();
              db.students.forEach((s) => mergedMap.set(s.id, s));
              prevLocal.forEach((s) => {
                if (!mergedMap.has(s.id)) {
                  mergedMap.set(s.id, s);
                } else {
                  const existing = mergedMap.get(s.id)!;
                  mergedMap.set(s.id, { ...existing, ...s });
                }
              });
              const finalStudents = Array.from(mergedMap.values());
              saveState('students', finalStudents);
              return finalStudents;
            });
          }
          if (Array.isArray(db.sessions)) setSessions(db.sessions);
          if (Array.isArray(db.quizzes)) setQuizzes(db.quizzes);
          if (Array.isArray(db.assignments)) setAssignments(db.assignments);
          if (Array.isArray(db.curriculum)) setCurriculum(db.curriculum);
          if (Array.isArray(db.feedback)) setFeedback(db.feedback);
          if (Array.isArray(db.videos)) {
            setVideos((prevLocal) => {
              const mergedMap = new Map<string, RecordedVideo>();
              db.videos.forEach((v) => mergedMap.set(v.id, v));
              prevLocal.forEach((v) => {
                if (!mergedMap.has(v.id)) mergedMap.set(v.id, v);
              });
              const finalVideos = Array.from(mergedMap.values());
              saveState('videos', finalVideos);
              return finalVideos;
            });
          }
          if (Array.isArray(db.quizSubmissions)) setQuizSubmissions(db.quizSubmissions);
          if (Array.isArray(db.assignmentSubmissions)) setAssignmentSubmissions(db.assignmentSubmissions);
          if (Array.isArray(db.gradeLogs)) setGradeLogs(db.gradeLogs);
          if (db.activeLiveStream) setActiveLiveStream(db.activeLiveStream);
        }
      })
      .catch((err) => console.warn('Server Database sync warning:', err));
  }, []);

  // Real-time 5-second interval poll for Live Stream status across all student clients
  useEffect(() => {
    const checkLive = () => {
      fetch('/api/live')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.live) {
            setActiveLiveStream(data.live);
          }
        })
        .catch(() => {});
    };

    checkLive();
    const interval = setInterval(checkLive, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-sync session from server cookie on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.authenticated && data.user) {
          if (data.user.role === 'student' && data.user.id) {
            setUserRoleState('student');
            setActiveStudentIdState(data.user.id);

            // Ensure logged student exists in state so activeStudent is never null/blank!
            setStudents((prev) => {
              const exists = prev.some((s) => s.id === data.user.id);
              if (!exists) {
                const loggedStudent: Student = {
                  id: data.user.id,
                  name: data.user.name || 'طالب مسجل',
                  email: data.user.email || '',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
                  parentPhone: '',
                  studentPhone: '',
                  grade: 'الصف الثالث الثانوي (Grade 12)',
                  attendanceRate: 100,
                  totalPoints: 100,
                  joinedDate: new Date().toISOString().split('T')[0],
                };
                return [loggedStudent, ...prev];
              }
              return prev;
            });
          } else if (data.user.role === 'admin') {
            setUserRoleState('admin');
            setIsAdminAuthenticated(true);
          }
        }
      })
      .catch(() => {});
  }, []);

  // HTML Attributes sync (lang, dir, theme class)
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', language);
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [language, theme]);

  // Sync to LocalStorage helpers
  const saveState = (key: string, data: any) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, typeof data === 'string' ? data : JSON.stringify(data));
    } catch (e) {
      console.error('LocalStorage save error', e);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveState('lang', lang);
  };

  const setTheme = (th: Theme) => {
    setThemeState(th);
    saveState('theme', th);
  };

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    saveState('role', role);
  };

  const setActiveStudentId = (id: string) => {
    setActiveStudentIdState(id);
    saveState('activeStudent', id);
  };

  // Admin Auth Security Actions
  const loginAdmin = (pass: string): boolean => {
    if (pass === adminPassword) {
      setIsAdminAuthenticated(true);
      setUserRoleState('admin');
      saveState('adminAuth', 'true');
      saveState('role', 'admin');
      showToast(language === 'ar' ? 'تم تسجيل دخول الإدارة بنجاح' : 'Admin logged in successfully');
      return true;
    } else {
      showToast(language === 'ar' ? 'كلمة سر الإدارة غير صحيحة' : 'Invalid admin password', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setUserRoleState('student');
    saveState('adminAuth', 'false');
    saveState('role', 'student');
    showToast(language === 'ar' ? 'تم تسجيل خروج الإدارة وقفل الصلاحيات' : 'Admin logged out & locked');
  };

  const changeAdminPassword = (newPass: string) => {
    if (!newPass || newPass.length < 4) return;
    setAdminPasswordState(newPass);
    saveState('adminPass', newPass);
    showToast(language === 'ar' ? 'تم تغيير كلمة سر الإدارة بنجاح' : 'Admin password updated');
  };

  // Actions
  const addStudent = (stData: Omit<Student, 'id' | 'joinedDate' | 'attendanceRate' | 'totalPoints'>) => {
    const newStudent: Student = {
      ...stData,
      id: `std_${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      attendanceRate: 100,
      totalPoints: 100,
    };
    const updated = [newStudent, ...students];
    setStudents(updated);
    saveState('students', updated);

    syncDB('create', 'students', newStudent);
    showToast(language === 'ar' ? 'تمت إضافة الطالب بنجاح' : 'Student added successfully');
  };

  const updateStudent = (updatedSt: Student) => {
    const updated = students.map((s) => (s.id === updatedSt.id ? updatedSt : s));
    setStudents(updated);
    saveState('students', updated);

    syncDB('update', 'students', updatedSt);
    showToast(language === 'ar' ? 'تم تحديث بيانات الطالب' : 'Student details updated');
  };

  const deleteStudent = (studentId: string) => {
    const updated = students.filter((s) => s.id !== studentId);
    setStudents(updated);
    saveState('students', updated);

    syncDB('delete', 'students', studentId);
    showToast(language === 'ar' ? 'تم حذف حساب الطالب نهائياً من المنصة' : 'Student deleted successfully', 'error');
  };

  const applyBan = (studentId: string, banDetails: BanDetails) => {
    const target = students.find((s) => s.id === studentId);
    if (!target) return;
    const updatedSt = { ...target, banDetails };
    const updated = students.map((s) => (s.id === studentId ? updatedSt : s));
    setStudents(updated);
    saveState('students', updated);

    syncDB('update', 'students', updatedSt);
    showToast(
      language === 'ar'
        ? `تم تطبيق الحظر على الطالب بنجاح (${banDetails.type === 'perm' ? 'دائم' : 'مؤقت'})`
        : `Ban applied to student successfully (${banDetails.type})`,
      'error'
    );
  };

  const liftBan = (studentId: string) => {
    const target = students.find((s) => s.id === studentId);
    if (!target || !target.banDetails) return;
    const updatedSt = { ...target, banDetails: { ...target.banDetails, active: false } };
    const updated = students.map((s) => (s.id === studentId ? updatedSt : s));
    setStudents(updated);
    saveState('students', updated);

    syncDB('update', 'students', updatedSt);
    showToast(language === 'ar' ? 'تم إلغاء الحظر وإعادة تفعيل الحساب' : 'Ban revoked and account restored');
  };

  const adjustGrade = (
    studentId: string,
    amount: number,
    type: 'bonus' | 'deduction',
    reason: string,
    adminName = 'الإدارة'
  ) => {
    const targetStudent = students.find((s) => s.id === studentId);
    if (!targetStudent) return;

    const netAmount = type === 'bonus' ? Math.abs(amount) : -Math.abs(amount);
    const newTotalPoints = Math.max(0, targetStudent.totalPoints + netAmount);

    const updatedStudents = students.map((s) => (s.id === studentId ? { ...s, totalPoints: newTotalPoints } : s));
    setStudents(updatedStudents);
    saveState('students', updatedStudents);

    const newLog: GradeLog = {
      id: `glog_${Date.now()}`,
      studentId,
      studentName: targetStudent.name,
      amount: netAmount,
      type,
      reason,
      adminName,
      date: new Date().toISOString(),
    };

    const updatedLogs = [newLog, ...gradeLogs];
    setGradeLogs(updatedLogs);
    saveState('grade_logs', updatedLogs);

    showToast(
      language === 'ar'
        ? `تم تسجيل ${type === 'bonus' ? 'بونص' : 'خصم'} بقيمة ${Math.abs(amount)} نقطة`
        : `${type === 'bonus' ? 'Bonus' : 'Deduction'} of ${Math.abs(amount)} points logged`
    );
  };

  const markAttendance = (sessionId: string, studentId: string, status: AttendanceStatus) => {
    const updatedSessions = sessions.map((sess) => {
      if (sess.id === sessionId) {
        return {
          ...sess,
          attendance: {
            ...sess.attendance,
            [studentId]: status,
          },
        };
      }
      return sess;
    });
    setSessions(updatedSessions);
    saveState('sessions', updatedSessions);

    // Recalculate attendance rate for student
    recalculateStudentAttendance(studentId, updatedSessions);
  };

  const recalculateStudentAttendance = (studentId: string, currentSessions: Session[]) => {
    let totalPresent = 0;
    let totalCounted = 0;

    currentSessions.forEach((s) => {
      const st = s.attendance[studentId];
      if (st) {
        totalCounted++;
        if (st === 'present' || st === 'late') {
          totalPresent++;
        }
      }
    });

    if (totalCounted > 0) {
      const newRate = Math.round((totalPresent / totalCounted) * 100);
      setStudents((prev) => {
        const next = prev.map((s) => (s.id === studentId ? { ...s, attendanceRate: newRate } : s));
        saveState('students', next);
        return next;
      });
    }
  };

  const updateSlideProgress = (sessionId: string, studentId: string, slideNumber: number) => {
    const updatedSessions = sessions.map((sess) => {
      if (sess.id === sessionId) {
        return {
          ...sess,
          studentProgress: {
            ...sess.studentProgress,
            [studentId]: slideNumber,
          },
        };
      }
      return sess;
    });
    setSessions(updatedSessions);
    saveState('sessions', updatedSessions);
  };

  const createSession = (sessionData: Omit<Session, 'id' | 'attendance' | 'studentProgress'>) => {
    const newSession: Session = {
      ...sessionData,
      id: `sess_${Date.now()}`,
      attendance: {},
      studentProgress: {},
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    saveState('sessions', updated);
    syncDB('create', 'sessions', newSession);
    showToast(language === 'ar' ? 'تمت إضافة المحاضرة/الجلسة التعليمية بنجاح' : 'Session created successfully');
  };

  const deleteSession = (sessionId: string) => {
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    saveState('sessions', updated);
    syncDB('delete', 'sessions', sessionId);
    showToast(language === 'ar' ? 'تم حذف المحاضرة/الجلسة التعليمية بنجاح 🗑️' : 'Session deleted successfully');
  };

  const createQuiz = (quizData: Omit<Quiz, 'id'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz_${Date.now()}`,
    };
    const updated = [newQuiz, ...quizzes];
    setQuizzes(updated);
    saveState('quizzes', updated);
    syncDB('create', 'quizzes', newQuiz);
    showToast(language === 'ar' ? 'تمت إضافة الاختبار الإلكتروني' : 'Quiz created successfully');
  };

  const toggleQuizStatus = (quizId: string) => {
    const updated = quizzes.map((q) => (q.id === quizId ? { ...q, isOpen: !q.isOpen } : q));
    setQuizzes(updated);
    saveState('quizzes', updated);
    syncDB('toggle', 'quizzes', quizId);
    const target = updated.find((q) => q.id === quizId);
    showToast(
      language === 'ar'
        ? `حالة الاختبار الآن: ${target?.isOpen ? 'مفتوح' : 'مغلق'}`
        : `Quiz status: ${target?.isOpen ? 'Open' : 'Closed'}`
    );
  };

  const deleteQuiz = (quizId: string) => {
    const updatedQuizzes = quizzes.filter((q) => q.id !== quizId);
    const updatedSubmissions = quizSubmissions.filter((s) => s.quizId !== quizId);
    setQuizzes(updatedQuizzes);
    setQuizSubmissions(updatedSubmissions);
    saveState('quizzes', updatedQuizzes);
    saveState('quiz_subs', updatedSubmissions);
    syncDB('delete', 'quizzes', quizId);
    showToast(
      language === 'ar' ? 'تم حذف الاختبار الإلكتروني بنجاح 🗑️' : 'Quiz deleted successfully'
    );
  };

  const submitQuiz = (subData: Omit<QuizSubmission, 'id' | 'submittedAt'>) => {
    const newSub: QuizSubmission = {
      ...subData,
      id: `qsub_${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    const updated = [newSub, ...quizSubmissions];
    setQuizSubmissions(updated);
    saveState('quiz_subs', updated);

    // Reward points for total score
    adjustGrade(
      subData.studentId,
      subData.totalScore,
      'bonus',
      `درجة الاختبار الإلكتروني: ${subData.totalScore}/${subData.maxScore}`,
      'النظام الآلي'
    );

    showToast(
      language === 'ar'
        ? `تم تسليم الاختبار بنجاح! درجتك: ${subData.totalScore}/${subData.maxScore}`
        : `Quiz submitted! Your score: ${subData.totalScore}/${subData.maxScore}`
    );
  };

  const createAssignment = (asgnData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAsgn: Assignment = {
      ...asgnData,
      id: `asg_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newAsgn, ...assignments];
    setAssignments(updated);
    saveState('assignments', updated);
    syncDB('create', 'assignments', newAsgn);
    showToast(language === 'ar' ? 'تم إسناد الواجب بنجاح' : 'Assignment created');
  };

  const deleteAssignment = (assignmentId: string) => {
    const updatedAsgns = assignments.filter((a) => a.id !== assignmentId);
    const updatedSubs = assignmentSubmissions.filter((s) => s.assignmentId !== assignmentId);
    setAssignments(updatedAsgns);
    setAssignmentSubmissions(updatedSubs);
    saveState('assignments', updatedAsgns);
    saveState('asgn_subs', updatedSubs);
    syncDB('delete', 'assignments', assignmentId);
    showToast(language === 'ar' ? 'تم حذف الواجب الدراسي بنجاح 🗑️' : 'Assignment deleted');
  };

  const submitAssignment = (assignmentId: string, studentId: string, content: string) => {
    const existingIndex = assignmentSubmissions.findIndex(
      (s) => s.assignmentId === assignmentId && s.studentId === studentId
    );

    let updated: AssignmentSubmission[];
    if (existingIndex >= 0) {
      updated = assignmentSubmissions.map((s, idx) =>
        idx === existingIndex ? { ...s, content, submittedAt: new Date().toISOString(), status: 'submitted' as const } : s
      );
    } else {
      const newSub: AssignmentSubmission = {
        id: `asgn_sub_${Date.now()}`,
        assignmentId,
        studentId,
        content,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
      };
      updated = [newSub, ...assignmentSubmissions];
    }

    setAssignmentSubmissions(updated);
    saveState('asgn_subs', updated);
    showToast(language === 'ar' ? 'تم تسليم حل الواجب بنجاح' : 'Assignment solution submitted');
  };

  const gradeSubmission = (submissionId: string, score: number, feedback: string) => {
    const targetSub = assignmentSubmissions.find((s) => s.id === submissionId);
    if (!targetSub) return;

    const updated = assignmentSubmissions.map((s) =>
      s.id === submissionId
        ? {
            ...s,
            score,
            teacherFeedback: feedback,
            status: 'graded' as const,
            gradedAt: new Date().toISOString(),
          }
        : s
    );

    setAssignmentSubmissions(updated);
    saveState('asgn_subs', updated);

    // Grant bonus points to student
    adjustGrade(targetSub.studentId, score, 'bonus', `تقييم الواجب الدراسي`, 'المعلم');

    showToast(language === 'ar' ? 'تم حفظ تصحيح الواجب والملاحظات' : 'Assignment graded');
  };

  const addCurriculumMilestone = (mData: Omit<CurriculumMilestone, 'id'>) => {
    const newMilestone: CurriculumMilestone = {
      ...mData,
      id: `cur_${Date.now()}`,
    };
    const updated = [...curriculum, newMilestone];
    setCurriculum(updated);
    saveState('curriculum', updated);
    syncDB('create', 'curriculum', newMilestone);
    showToast(language === 'ar' ? 'تمت إضافة الوحدة إلى الخطة الدراسية بنجاح 🎯' : 'Curriculum milestone added');
  };

  const updateCurriculumMilestone = (milestone: CurriculumMilestone) => {
    const updated = curriculum.map((c) => (c.id === milestone.id ? milestone : c));
    setCurriculum(updated);
    saveState('curriculum', updated);
    syncDB('update', 'curriculum', milestone);
    showToast(language === 'ar' ? 'تم تحديث وحدة المنهج الدراسي' : 'Curriculum updated');
  };

  const deleteCurriculumMilestone = (milestoneId: string) => {
    const updated = curriculum.filter((c) => c.id !== milestoneId);
    setCurriculum(updated);
    saveState('curriculum', updated);
    syncDB('delete', 'curriculum', milestoneId);
    showToast(language === 'ar' ? 'تم حذف وحدة المنهج الدراسي بنجاح 🗑️' : 'Curriculum deleted');
  };

  const [videos, setVideos] = useState<RecordedVideo[]>(initialVideos);

  const addVideo = (vData: Omit<RecordedVideo, 'id' | 'createdAt' | 'viewsCount'>) => {
    const newVideo: RecordedVideo = {
      ...vData,
      id: `vid_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      viewsCount: 1,
    };
    const updated = [newVideo, ...videos];
    setVideos(updated);
    saveState('videos', updated);
    syncDB('create', 'videos', newVideo);
    showToast(language === 'ar' ? 'تم رفع ونشر تسجيل المحاضرة بنجاح' : 'Lecture recording added');
  };

  const deleteVideo = (videoId: string) => {
    const updated = videos.filter((v) => v.id !== videoId);
    setVideos(updated);
    saveState('videos', updated);
    syncDB('delete', 'videos', videoId);
    showToast(language === 'ar' ? 'تم حذف تسجيل الفيديو بنجاح 🗑️' : 'Video deleted');
  };

  const [activeLiveStream, setActiveLiveStream] = useState<ActiveLiveStream>({
    isLive: false,
    title: 'بث مباشر تفاعلي أونلاين 🔴',
    grade: 'all',
    meetingUrl: '',
  });

  const updateLiveStream = (sessionId: string, isLive: boolean, meetingUrl: string, grade = 'all', title = 'بث مباشر تفاعلي أونلاين 🔴') => {
    let updated = sessions.map((s) => (s.id === sessionId ? { ...s, isLive, liveMeetingUrl: meetingUrl } : s));

    if (isLive) {
      const hasLive = updated.some((s) => s.isLive);
      if (!hasLive && updated.length > 0) {
        updated[0] = { ...updated[0], isLive: true, liveMeetingUrl: meetingUrl };
      }
    }

    setSessions(updated);
    saveState('sessions', updated);

    const liveState = { isLive, meetingUrl, title, grade, startedAt: isLive ? new Date().toISOString() : undefined };
    setActiveLiveStream(liveState);
    saveState('activeLiveStream', liveState);

    fetch('/api/live', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(liveState),
    }).catch(() => {});

    showToast(
      language === 'ar'
        ? isLive
          ? 'تم تفعيل وإطلاق البث المباشر أونلاين لجميع الطلاب بنجاح 🔴'
          : 'تم إنهاء البث المباشر للمحاضرة'
        : isLive
        ? 'Live stream started 🔴'
        : 'Live stream ended'
    );
  };

  const addSessionFeedback = (fbData: Omit<SessionFeedback, 'id' | 'submittedAt'>) => {
    const newFb: SessionFeedback = {
      ...fbData,
      id: `fb_${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    const updated = [newFb, ...feedback];
    setFeedback(updated);
    saveState('feedback', updated);
    syncDB('create', 'feedback', newFb);
    showToast(language === 'ar' ? 'شكراً لك! تم تسليم تقييمك بنجاح' : 'Thank you! Review submitted');
  };

  const deleteSessionFeedback = (feedbackId: string) => {
    const updated = feedback.filter((f) => f.id !== feedbackId);
    setFeedback(updated);
    saveState('feedback', updated);
    syncDB('delete', 'feedback', feedbackId);
    showToast(language === 'ar' ? 'تم حذف تقييم الطالب بنجاح 🗑️' : 'Feedback deleted');
  };

  const resetToDefaultData = () => {
    setStudents(initialStudents);
    setSessions(initialSessions);
    setQuizzes(initialQuizzes);
    setAssignments(initialAssignments);
    setAssignmentSubmissions(initialAssignmentSubmissions);
    setQuizSubmissions(initialQuizSubmissions);
    setCurriculum(initialCurriculum);
    setFeedback(initialFeedback);
    setGradeLogs(initialGradeLogs);

    localStorage.removeItem(`${STORAGE_PREFIX}students`);
    localStorage.removeItem(`${STORAGE_PREFIX}sessions`);
    localStorage.removeItem(`${STORAGE_PREFIX}quizzes`);
    localStorage.removeItem(`${STORAGE_PREFIX}assignments`);
    localStorage.removeItem(`${STORAGE_PREFIX}asgn_subs`);
    localStorage.removeItem(`${STORAGE_PREFIX}quiz_subs`);
    localStorage.removeItem(`${STORAGE_PREFIX}curriculum`);
    localStorage.removeItem(`${STORAGE_PREFIX}feedback`);
    localStorage.removeItem(`${STORAGE_PREFIX}grade_logs`);

    showToast(language === 'ar' ? 'تمت إعادة ضبط البيانات الافتراضية' : 'Reset to default seed data');
  };

  const clearAllData = () => {
    setStudents([]);
    setSessions([]);
    setQuizzes([]);
    setAssignments([]);
    setAssignmentSubmissions([]);
    setQuizSubmissions([]);
    setCurriculum([]);
    setFeedback([]);
    setGradeLogs([]);

    localStorage.setItem(`${STORAGE_PREFIX}students`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_PREFIX}sessions`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_PREFIX}quizzes`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_PREFIX}assignments`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_PREFIX}asgn_subs`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_PREFIX}quiz_subs`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_PREFIX}curriculum`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_PREFIX}feedback`, JSON.stringify([]));
    localStorage.setItem(`${STORAGE_PREFIX}grade_logs`, JSON.stringify([]));

    showToast(language === 'ar' ? 'تم تفريغ المنصة وتصفير البيانات للاستخدام الحقيقي 🧹' : 'Cleared all data for real production');
  };

  const activeStudent =
    students.find((s) => s.id === activeStudentId) ||
    students[0] ||
    initialStudents[0];

  const dict = dictionary[language];

  return (
    <EduPulseContext.Provider
      value={{
        language,
        theme,
        userRole,
        activeStudentId,
        activeStudent,
        dict,
        isAdminAuthenticated,
        adminPassword,
        adminUsers,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        addAdminUser,
        students,
        sessions,
        quizzes,
        assignments,
        assignmentSubmissions,
        quizSubmissions,
        curriculum,
        feedback,
        gradeLogs,
        videos,
        activeLiveStream,
        toastMessage,
        toastType,
        showToast,
        setLanguage,
        setTheme,
        setUserRole,
        setActiveStudentId,
        addStudent,
        updateStudent,
        deleteStudent,
        applyBan,
        liftBan,
        adjustGrade,
        markAttendance,
        updateSlideProgress,
        createSession,
        deleteSession,
        createQuiz,
        toggleQuizStatus,
        deleteQuiz,
        submitQuiz,
        createAssignment,
        deleteAssignment,
        submitAssignment,
        gradeSubmission,
        updateCurriculumMilestone,
        addCurriculumMilestone,
        deleteCurriculumMilestone,
        addSessionFeedback,
        deleteSessionFeedback,
        addVideo,
        deleteVideo,
        updateLiveStream,
        resetToDefaultData,
        clearAllData,
      }}
    >
      {children}
    </EduPulseContext.Provider>
  );
};

export const useEduPulse = () => {
  const context = useContext(EduPulseContext);
  if (!context) {
    throw new Error('useEduPulse must be used within an EduPulseProvider');
  }
  return context;
};
