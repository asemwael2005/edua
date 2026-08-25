import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { initialAssignments } from '@/lib/seedData';
import { AssignmentSubmission } from '@/types/edupulse';

const serverAssignmentSubmissions: AssignmentSubmission[] = [];

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

    const targetAssignment = initialAssignments.find((a) => a.id === assignmentId);
    if (!targetAssignment) {
      return NextResponse.json({ error: 'الواجب غير موجود' }, { status: 404 });
    }

    // Server-side Deadline Check
    const deadlineDate = new Date(targetAssignment.dueDate);
    const now = new Date();
    if (now > deadlineDate) {
      return NextResponse.json({ error: 'عذراً، انتهى الموعد المحدد لتسليم هذا الواجب' }, { status: 400 });
    }

    // Check for duplicate submission
    const existingIndex = serverAssignmentSubmissions.findIndex(
      (s) => s.assignmentId === assignmentId && s.studentId === session.userId
    );

    if (existingIndex >= 0) {
      serverAssignmentSubmissions[existingIndex] = {
        ...serverAssignmentSubmissions[existingIndex],
        content,
        submittedAt: new Date().toISOString(),
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
      serverAssignmentSubmissions.push(submission);
    }

    return NextResponse.json({
      success: true,
      message: 'تم تسليم حل الواجب بنجاح وإرساله للمعلم للتصحيح',
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'خطأ في تسليم الواجب' }, { status: 500 });
  }
}
