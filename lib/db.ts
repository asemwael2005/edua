import fs from 'fs';
import path from 'path';
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
  RecordedVideo,
} from '@/types/edupulse';
import {
  initialStudents,
  initialSessions,
  initialQuizzes,
  initialAssignments,
  initialCurriculum,
  initialFeedback,
  initialGradeLogs,
  initialQuizSubmissions,
  initialAssignmentSubmissions,
} from '@/lib/seedData';

export interface DatabaseSchema {
  students: Student[];
  sessions: Session[];
  quizzes: Quiz[];
  assignments: Assignment[];
  curriculum: CurriculumMilestone[];
  feedback: SessionFeedback[];
  gradeLogs: GradeLog[];
  quizSubmissions: QuizSubmission[];
  assignmentSubmissions: AssignmentSubmission[];
  videos: RecordedVideo[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'database.json');

// Get default initial database state
function getDefaultDatabaseState(): DatabaseSchema {
  return {
    students: initialStudents,
    sessions: initialSessions,
    quizzes: initialQuizzes,
    assignments: initialAssignments,
    curriculum: initialCurriculum,
    feedback: initialFeedback,
    gradeLogs: initialGradeLogs,
    quizSubmissions: initialQuizSubmissions,
    assignmentSubmissions: initialAssignmentSubmissions,
    videos: [], // Initial videos start empty as requested
  };
}

// In-memory fallback cache for serverless environments (Vercel)
let inMemoryDB: DatabaseSchema | null = null;

// Read Database
export function readDatabase(): DatabaseSchema {
  try {
    if (inMemoryDB) {
      return inMemoryDB;
    }

    if (fs.existsSync(DB_FILE_PATH)) {
      const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(fileContent);
      inMemoryDB = {
        students: Array.isArray(parsed.students) ? parsed.students : initialStudents,
        sessions: Array.isArray(parsed.sessions) ? parsed.sessions : initialSessions,
        quizzes: Array.isArray(parsed.quizzes) ? parsed.quizzes : initialQuizzes,
        assignments: Array.isArray(parsed.assignments) ? parsed.assignments : initialAssignments,
        curriculum: Array.isArray(parsed.curriculum) ? parsed.curriculum : initialCurriculum,
        feedback: Array.isArray(parsed.feedback) ? parsed.feedback : initialFeedback,
        gradeLogs: Array.isArray(parsed.gradeLogs) ? parsed.gradeLogs : initialGradeLogs,
        quizSubmissions: Array.isArray(parsed.quizSubmissions) ? parsed.quizSubmissions : initialQuizSubmissions,
        assignmentSubmissions: Array.isArray(parsed.assignmentSubmissions) ? parsed.assignmentSubmissions : initialAssignmentSubmissions,
        videos: Array.isArray(parsed.videos) ? parsed.videos : [],
      };
      return inMemoryDB!;
    }
  } catch (error) {
    console.warn('Could not read db file, using default state:', error);
  }

  inMemoryDB = getDefaultDatabaseState();
  return inMemoryDB;
}

// Write Database
export function writeDatabase(data: DatabaseSchema): void {
  inMemoryDB = data;
  try {
    const dirPath = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.warn('Could not write database to disk (operating in serverless memory):', error);
  }
}
