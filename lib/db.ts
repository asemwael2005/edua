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
  ActiveLiveStream,
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
  activeLiveStream: ActiveLiveStream;
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'database.json');

declare global {
  var __edupulse_inmemory_db: DatabaseSchema | undefined;
}

// Get default initial database state
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
    activeLiveStream: {
      isLive: false,
      title: 'بث مباشر تفاعلي أونلاين',
      grade: 'all',
      meetingUrl: '',
    },
  };
}

// Read Database - Always prioritizing disk data & merging Node process memory to preserve registered students 100%
export function readDatabase(): DatabaseSchema {
  const inMemory = globalThis.__edupulse_inmemory_db || null;
  let diskDB: DatabaseSchema = getDefaultDatabaseState();

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(fileContent);

      diskDB = {
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
        activeLiveStream: parsed.activeLiveStream || {
          isLive: false,
          title: 'بث مباشر تفاعلي أونلاين',
          grade: 'all',
          meetingUrl: '',
        },
      };
    }
  } catch (error) {
    console.warn('Could not read db file, falling back to memory/default:', error);
  }

  // Merge in-memory DB with disk DB so newly added students are NEVER wiped
  if (inMemory) {
    // Merge students
    if (Array.isArray(inMemory.students)) {
      inMemory.students.forEach((memStudent) => {
        if (!diskDB.students.some((s) => s.id === memStudent.id || (s.email && memStudent.email && s.email.toLowerCase() === memStudent.email.toLowerCase()))) {
          diskDB.students.push(memStudent);
        }
      });
    }

    // Merge videos
    if (Array.isArray(inMemory.videos)) {
      inMemory.videos.forEach((memVid) => {
        if (!diskDB.videos.some((v) => v.id === memVid.id)) {
          diskDB.videos.push(memVid);
        }
      });
    }

    // Merge quizzes
    if (Array.isArray(inMemory.quizzes)) {
      inMemory.quizzes.forEach((memQuiz) => {
        if (!diskDB.quizzes.some((q) => q.id === memQuiz.id)) {
          diskDB.quizzes.push(memQuiz);
        }
      });
    }
  }

  globalThis.__edupulse_inmemory_db = diskDB;
  return diskDB;
}

// Write Database
export function writeDatabase(data: DatabaseSchema): void {
  globalThis.__edupulse_inmemory_db = data;
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
