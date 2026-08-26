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

// Get default initial database state (100% clean for production)
function getDefaultDatabaseState(): DatabaseSchema {
  return {
    students: [],
    sessions: [],
    quizzes: [],
    assignments: [],
    curriculum: [],
    feedback: [],
    gradeLogs: [],
    quizSubmissions: [],
    assignmentSubmissions: [],
    videos: [],
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
        students: Array.isArray(parsed.students) ? parsed.students : [],
        sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
        quizzes: Array.isArray(parsed.quizzes) ? parsed.quizzes : [],
        assignments: Array.isArray(parsed.assignments) ? parsed.assignments : [],
        curriculum: Array.isArray(parsed.curriculum) ? parsed.curriculum : [],
        feedback: Array.isArray(parsed.feedback) ? parsed.feedback : [],
        gradeLogs: Array.isArray(parsed.gradeLogs) ? parsed.gradeLogs : [],
        quizSubmissions: Array.isArray(parsed.quizSubmissions) ? parsed.quizSubmissions : [],
        assignmentSubmissions: Array.isArray(parsed.assignmentSubmissions) ? parsed.assignmentSubmissions : [],
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
