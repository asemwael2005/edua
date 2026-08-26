import { Student, Quiz, RecordedVideo } from '@/types/edupulse';
import { initialStudents, initialQuizzes, initialVideos } from '@/lib/seedData';

// Persistent Server-side In-memory Stores
let globalStudentsStore: Student[] = [...initialStudents];
let globalQuizzesStore: Quiz[] = [...initialQuizzes];
let globalVideosStore: RecordedVideo[] = [...initialVideos];

// --- STUDENTS STORE ---
export function getGlobalStudents(): Student[] {
  return globalStudentsStore;
}

export function addGlobalStudent(student: Student): Student[] {
  const existingIndex = globalStudentsStore.findIndex(
    (s) => s.id === student.id || (s.email && s.email.toLowerCase() === student.email.toLowerCase())
  );

  if (existingIndex >= 0) {
    globalStudentsStore[existingIndex] = { ...globalStudentsStore[existingIndex], ...student };
  } else {
    globalStudentsStore = [student, ...globalStudentsStore];
  }

  return globalStudentsStore;
}

export function updateGlobalStudent(student: Student): Student[] {
  globalStudentsStore = globalStudentsStore.map((s) => (s.id === student.id ? student : s));
  return globalStudentsStore;
}

export function deleteGlobalStudent(studentId: string): Student[] {
  globalStudentsStore = globalStudentsStore.filter((s) => s.id !== studentId);
  return globalStudentsStore;
}

// --- QUIZZES STORE ---
export function getGlobalQuizzes(): Quiz[] {
  return globalQuizzesStore;
}

export function addGlobalQuiz(quiz: Quiz): Quiz[] {
  globalQuizzesStore = [quiz, ...globalQuizzesStore];
  return globalQuizzesStore;
}

export function toggleGlobalQuizStatus(quizId: string): Quiz[] {
  globalQuizzesStore = globalQuizzesStore.map((q) => (q.id === quizId ? { ...q, isOpen: !q.isOpen } : q));
  return globalQuizzesStore;
}

export function deleteGlobalQuiz(quizId: string): Quiz[] {
  globalQuizzesStore = globalQuizzesStore.filter((q) => q.id !== quizId);
  return globalQuizzesStore;
}

// --- VIDEOS STORE ---
export function getGlobalVideos(): RecordedVideo[] {
  return globalVideosStore;
}

export function addGlobalVideo(video: RecordedVideo): RecordedVideo[] {
  globalVideosStore = [video, ...globalVideosStore];
  return globalVideosStore;
}

export function deleteGlobalVideo(videoId: string): RecordedVideo[] {
  globalVideosStore = globalVideosStore.filter((v) => v.id !== videoId);
  return globalVideosStore;
}
