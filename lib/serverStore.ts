import { Student, Quiz, RecordedVideo, ActiveLiveStream } from '@/types/edupulse';
import { initialStudents, initialQuizzes, initialVideos } from '@/lib/seedData';

declare global {
  var __edupulse_students_store: Student[] | undefined;
  var __edupulse_quizzes_store: Quiz[] | undefined;
  var __edupulse_videos_store: RecordedVideo[] | undefined;
  var __edupulse_live_store: ActiveLiveStream | undefined;
}

// Global Node Process Memory Singletons
if (!globalThis.__edupulse_students_store) {
  globalThis.__edupulse_students_store = [...initialStudents];
}
if (!globalThis.__edupulse_quizzes_store) {
  globalThis.__edupulse_quizzes_store = [...initialQuizzes];
}
if (!globalThis.__edupulse_videos_store) {
  globalThis.__edupulse_videos_store = [...initialVideos];
}
if (!globalThis.__edupulse_live_store) {
  globalThis.__edupulse_live_store = {
    isLive: false,
    title: 'بث مباشر تفاعلي أونلاين 🔴',
    grade: 'all',
    meetingUrl: '',
  };
}

// --- LIVE STREAM STORE ---
export function getGlobalActiveLiveStream(): ActiveLiveStream {
  return (
    globalThis.__edupulse_live_store || {
      isLive: false,
      title: 'بث مباشر تفاعلي أونلاين 🔴',
      grade: 'all',
      meetingUrl: '',
    }
  );
}

export function setGlobalActiveLiveStream(liveData: Partial<ActiveLiveStream>): ActiveLiveStream {
  const current = getGlobalActiveLiveStream();
  const updated: ActiveLiveStream = {
    ...current,
    ...liveData,
    startedAt: liveData.isLive ? new Date().toISOString() : undefined,
  };
  globalThis.__edupulse_live_store = updated;
  return updated;
}

// --- STUDENTS STORE ---
export function getGlobalStudents(): Student[] {
  return globalThis.__edupulse_students_store || [];
}

export function addGlobalStudent(student: Student): Student[] {
  const store = getGlobalStudents();
  const existingIndex = store.findIndex(
    (s) => s.id === student.id || (s.email && s.email.toLowerCase() === student.email.toLowerCase())
  );

  if (existingIndex >= 0) {
    store[existingIndex] = { ...store[existingIndex], ...student };
  } else {
    globalThis.__edupulse_students_store = [student, ...store];
  }

  return getGlobalStudents();
}

export function updateGlobalStudent(student: Student): Student[] {
  const store = getGlobalStudents();
  globalThis.__edupulse_students_store = store.map((s) => (s.id === student.id ? student : s));
  return getGlobalStudents();
}

export function deleteGlobalStudent(studentId: string): Student[] {
  const store = getGlobalStudents();
  globalThis.__edupulse_students_store = store.filter((s) => s.id !== studentId);
  return getGlobalStudents();
}

// --- QUIZZES STORE ---
export function getGlobalQuizzes(): Quiz[] {
  return globalThis.__edupulse_quizzes_store || [];
}

export function addGlobalQuiz(quiz: Quiz): Quiz[] {
  const store = getGlobalQuizzes();
  globalThis.__edupulse_quizzes_store = [quiz, ...store];
  return getGlobalQuizzes();
}

export function toggleGlobalQuizStatus(quizId: string): Quiz[] {
  const store = getGlobalQuizzes();
  globalThis.__edupulse_quizzes_store = store.map((q) => (q.id === quizId ? { ...q, isOpen: !q.isOpen } : q));
  return getGlobalQuizzes();
}

export function deleteGlobalQuiz(quizId: string): Quiz[] {
  const store = getGlobalQuizzes();
  globalThis.__edupulse_quizzes_store = store.filter((q) => q.id !== quizId);
  return getGlobalQuizzes();
}

// --- VIDEOS STORE ---
export function getGlobalVideos(): RecordedVideo[] {
  return globalThis.__edupulse_videos_store || [];
}

export function addGlobalVideo(video: RecordedVideo): RecordedVideo[] {
  const store = getGlobalVideos();
  globalThis.__edupulse_videos_store = [video, ...store];
  return getGlobalVideos();
}

export function deleteGlobalVideo(videoId: string): RecordedVideo[] {
  const store = getGlobalVideos();
  globalThis.__edupulse_videos_store = store.filter((v) => v.id !== videoId);
  return getGlobalVideos();
}
