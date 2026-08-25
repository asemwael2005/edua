import { Student } from '@/types/edupulse';
import { initialStudents } from '@/lib/seedData';

// Global server-side persistent in-memory student store
let globalStudentsStore: Student[] = [...initialStudents];

export function getGlobalStudents(): Student[] {
  return globalStudentsStore;
}

export function addGlobalStudent(student: Student): Student[] {
  // Check if student already exists by ID or email
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
