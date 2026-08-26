export type BanType = 'temp' | 'perm';

export interface BanDetails {
  active: boolean;
  type: BanType;
  startDate: string; // ISO String
  endDate?: string;  // ISO String (optional for permanent)
  reason: string;
  appliedBy: string;
}

export interface ActiveLiveStream {
  isLive: boolean;
  title: string;
  grade: string;
  meetingUrl: string;
  startedAt?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'master_admin' | 'assistant';
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  parentPhone: string;
  studentPhone: string;
  grade: string;
  attendanceRate: number; // percentage e.g. 92
  totalPoints: number;    // cumulative score
  password?: string;      // Student password / PIN
  banDetails?: BanDetails;
  joinedDate: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface Slide {
  id: string;
  slideNumber: number;
  title: string;
  content: string;
  bulletPoints?: string[];
  codeOrDiagram?: string;
  notes?: string;
}

export interface StudentSlideProgress {
  studentId: string;
  currentSlide: number;
  lastUpdated: string;
}

export interface Session {
  id: string;
  title: string;
  subject: string;
  grade: string;
  date: string;
  time: string;
  room: string;
  description: string;
  slides: Slide[];
  attendance: Record<string, AttendanceStatus>; // studentId -> status
  studentProgress: Record<string, number>;      // studentId -> slideNumber
  isLive?: boolean;
  liveMeetingUrl?: string; // Zoom / Meet / Jitsi link
  videoUrl?: string;       // Uploaded video MP4 or YouTube embed
}

export interface RecordedVideo {
  id: string;
  title: string;
  subject: string;
  grade: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: string;
  description: string;
  createdAt: string;
  viewsCount: number;
}

export type QuestionType = 'mcq' | 'true_false';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // for mcq
  correctAnswer: number | boolean; // index for mcq, boolean for true_false
  explanation: string;
  points: number;
}

export interface QuizSubmissionAnswer {
  questionId: string;
  selectedAnswer: number | boolean | null;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  studentId: string;
  submittedAt: string;
  answers: QuizSubmissionAnswer[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeSpentSeconds: number;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  durationMinutes: number;
  scheduledStart: string; // ISO
  scheduledEnd: string;   // ISO
  isOpen: boolean;        // Manual toggle
  questions: Question[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  content: string;
  attachmentUrl?: string;
  status: 'submitted' | 'graded';
  score?: number;
  teacherFeedback?: string;
  gradedAt?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  grade: string;
  description: string;
  deadline: string; // ISO
  maxScore: number;
  createdAt: string;
}

export interface CurriculumMilestone {
  id: string;
  title: string;
  subject: string;
  grade: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  progressPercent: number;
  topics: string[];
  estimatedWeeks: string;
}

export interface SessionFeedback {
  id: string;
  sessionId: string;
  sessionTitle: string;
  studentId: string;
  studentName: string;
  rating: number; // 1-5
  tags: string[];
  comment: string;
  submittedAt: string;
}

export interface GradeLog {
  id: string;
  studentId: string;
  studentName: string;
  amount: number; // positive for bonus, negative for deduction
  type: 'bonus' | 'deduction';
  reason: string;
  adminName: string;
  date: string;
}
