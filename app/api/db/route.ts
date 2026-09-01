import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase, DatabaseSchema } from '@/lib/db';
import { isMatchingGrade } from '@/lib/gradeUtils';

export async function GET() {
  try {
    const db = readDatabase();
    return NextResponse.json({ success: true, db });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, table, item, id, isLive, meetingUrl, title, grade } = body;
    const db = readDatabase();

    if (action === 'updateLiveStream') {
      db.activeLiveStream = {
        isLive: Boolean(isLive),
        meetingUrl: meetingUrl || '',
        title: title || 'بث مباشر تفاعلي أونلاين 🔴',
        grade: grade || 'all',
        startedAt: isLive ? new Date().toISOString() : undefined,
      };
      writeDatabase(db);
      return NextResponse.json({ success: true, db });
    }

    if (!table || !(table in db)) {
      return NextResponse.json({ error: 'Invalid database table' }, { status: 400 });
    }

    const tableKey = table as keyof DatabaseSchema;

    if (action === 'create' && item) {
      // Add new item to front of array
      (db[tableKey] as any[]) = [item, ...(db[tableKey] as any[])];
      writeDatabase(db);
      return NextResponse.json({ success: true, db });
    }

    if (action === 'update' && item && item.id) {
      (db[tableKey] as any[]) = (db[tableKey] as any[]).map((existing: any) =>
        existing.id === item.id ? { ...existing, ...item } : existing
      );
      writeDatabase(db);
      return NextResponse.json({ success: true, db });
    }

    if (action === 'delete' && id) {
      (db[tableKey] as any[]) = (db[tableKey] as any[]).filter((existing: any) => existing.id !== id);

      // Cascade deletes if applicable
      if (tableKey === 'quizzes') {
        db.quizSubmissions = db.quizSubmissions.filter((s) => s.quizId !== id);
      } else if (tableKey === 'assignments') {
        db.assignmentSubmissions = db.assignmentSubmissions.filter((s) => s.assignmentId !== id);
      } else if (tableKey === 'students') {
        db.quizSubmissions = db.quizSubmissions.filter((s) => s.studentId !== id);
        db.assignmentSubmissions = db.assignmentSubmissions.filter((s) => s.studentId !== id);
      }

      writeDatabase(db);
      return NextResponse.json({ success: true, db });
    }

    if (action === 'toggle' && id && tableKey === 'quizzes') {
      db.quizzes = db.quizzes.map((q) => (q.id === id ? { ...q, isOpen: !q.isOpen } : q));
      writeDatabase(db);
      return NextResponse.json({ success: true, db });
    }

    if (action === 'resetQuizSubmission' && body.quizId && body.studentId) {
      db.quizSubmissions = db.quizSubmissions.filter(
        (s) => !(s.quizId === body.quizId && s.studentId === body.studentId)
      );
      writeDatabase(db);
      return NextResponse.json({ success: true, db });
    }

    if (action === 'openSingleQuizOnly' && body.quizId) {
      const target = db.quizzes.find((q) => q.id === body.quizId);
      if (target) {
        db.quizzes = db.quizzes.map((q) => {
          if (q.id === body.quizId) return { ...q, isOpen: true };
          if (isMatchingGrade(q.grade, target.grade)) return { ...q, isOpen: false };
          return q;
        });
        writeDatabase(db);
      }
      return NextResponse.json({ success: true, db });
    }

    return NextResponse.json({ error: 'Invalid database action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mutate database' }, { status: 500 });
  }
}
