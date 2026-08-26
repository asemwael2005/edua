import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { readDatabase, writeDatabase } from '@/lib/db';
import { AssignmentSubmission } from '@/types/edupulse';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { assignmentId, content } = body;

    if (!assignmentId || !content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'محتوى حل الواجب مطلوب' }, { status: 400 });
    }

    const db = readDatabase();
    const targetAssignment = db.assignments.find((a) => a.id === assignmentId);
    if (!targetAssignment) {
      return NextResponse.json({ error: 'الواجب غير موجود' }, { status: 404 });
    }

    // Check for duplicate submission
    const existingIndex = db.assignmentSubmissions.findIndex(
      (s) => s.assignmentId === assignmentId && s.studentId === session.userId
    );

    if (existingIndex >= 0) {
      db.assignmentSubmissions[existingIndex] = {
        ...db.assignmentSubmissions[existingIndex],
        content,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
      };
    } else {
      const submission: AssignmentSubmission = {
        id: `asgn_sub_${Date.now()}`,
        assignmentId,
        studentId: session.userId,
        content,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
      };
      db.assignmentSubmissions = [submission, ...db.assignmentSubmissions];
    }

    writeDatabase(db);

    return NextResponse.json({
      success: true,
      message: 'تم تسليم حل الواجب وحفظه في قاعدة البيانات بنجاح وإرساله للمعلم للتصحيح',
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'خطأ في تسليم الواجب' }, { status: 500 });
  }
}
