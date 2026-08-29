import { NextRequest, NextResponse } from 'next/server';
import { getSession, createSessionToken, setSessionCookieInResponse } from '@/lib/auth';
import { readDatabase, writeDatabase } from '@/lib/db';
import { getGlobalStudents } from '@/lib/serverStore';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'student') {
      return NextResponse.json({ error: 'غير مصرح للقيام بهذة العملية' }, { status: 401 });
    }

    const body = await request.json();
    const { grade } = body;

    if (!grade || !grade.trim()) {
      return NextResponse.json({ error: 'الصف الدراسي الجديد مطلوب' }, { status: 400 });
    }

    const cleanGrade = grade.trim();

    // 1. Update in Database JSON file
    try {
      const db = readDatabase();
      const stIdx = db.students.findIndex((s) => s.id === session.userId);
      if (stIdx >= 0) {
        db.students[stIdx].grade = cleanGrade;
        writeDatabase(db);
      }
    } catch (e) {
      console.warn('Database write error on grade update:', e);
    }

    // 2. Update in server memory store
    const globalStudents = getGlobalStudents();
    const stGlobal = globalStudents.find((s) => s.id === session.userId);
    if (stGlobal) {
      stGlobal.grade = cleanGrade;
    }

    // 3. Re-issue JWT Session Token with new grade
    const newToken = await createSessionToken({
      userId: session.userId,
      role: 'student',
      name: session.name,
      email: session.email,
      grade: cleanGrade,
    });

    const response = NextResponse.json({
      success: true,
      grade: cleanGrade,
      message: 'تم تحديث الصف الدراسي بنجاح',
    });

    setSessionCookieInResponse(response, newToken);
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'فشل تحديث الصف الدراسي' }, { status: 500 });
  }
}
