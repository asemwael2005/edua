import { NextResponse } from 'next/server';
import { getGlobalQuizzes, addGlobalQuiz, toggleGlobalQuizStatus, deleteGlobalQuiz } from '@/lib/serverStore';

export async function GET() {
  const quizzes = getGlobalQuizzes();
  return NextResponse.json({ quizzes });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.action === 'toggle') {
      const updated = toggleGlobalQuizStatus(body.quizId);
      return NextResponse.json({ success: true, quizzes: updated });
    }

    const updated = addGlobalQuiz(body.quiz);
    return NextResponse.json({ success: true, quizzes: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process quiz action' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get('id');
    if (!quizId) return NextResponse.json({ error: 'Quiz ID required' }, { status: 400 });

    const updated = deleteGlobalQuiz(quizId);
    return NextResponse.json({ success: true, quizzes: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete quiz' }, { status: 500 });
  }
}
