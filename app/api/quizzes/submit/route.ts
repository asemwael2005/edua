import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { initialQuizzes } from '@/lib/seedData';
import { QuizSubmission } from '@/types/edupulse';

// Server-side submission log memory
const serverQuizSubmissions: QuizSubmission[] = [];

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { quizId, answers } = body;

    if (!quizId || !answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'بيانات التسليم غير اكتمال' }, { status: 400 });
    }

    const targetQuiz = initialQuizzes.find((q) => q.id === quizId);
    if (!targetQuiz) {
      return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 444 });
    }

    if (!targetQuiz.isOpen) {
      return NextResponse.json({ error: 'الاختبار مغلق حالياً ولا يقبل إجابات' }, { status: 400 });
    }

    // Check if student has already submitted
    const existingSubmission = serverQuizSubmissions.find(
      (s) => s.quizId === quizId && s.studentId === session.userId
    );

    if (existingSubmission) {
      return NextResponse.json({ error: 'لقد قمت بتسليم هذا الاختبار من قبل' }, { status: 400 });
    }

    // Server-side Score Calculation (Never trust frontend score!)
    let totalScore = 0;
    let maxScore = 0;

    targetQuiz.questions.forEach((q) => {
      maxScore += q.points;
      const studentAns = answers[q.id];

      if (q.type === 'mcq') {
        if (typeof studentAns === 'number' && studentAns === q.correctAnswer) {
          totalScore += q.points;
        }
      } else if (q.type === 'true_false') {
        if (typeof studentAns === 'boolean' && studentAns === q.correctAnswer) {
          totalScore += q.points;
        }
      }
    });

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    const submission: QuizSubmission = {
      id: `qsub_${Date.now()}`,
      quizId,
      studentId: session.userId,
      studentName: session.name || 'طالب',
      answers,
      totalScore,
      maxScore,
      percentage,
      submittedAt: new Date().toISOString(),
    };

    serverQuizSubmissions.push(submission);

    return NextResponse.json({
      success: true,
      submission,
      message: `تم تصحيح الاختبار إلكترونياً بنجاح! درجتك: ${totalScore}/${maxScore}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'خطأ في معالجة تسليم الاختبار' }, { status: 500 });
  }
}
