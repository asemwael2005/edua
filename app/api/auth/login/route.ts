import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, setSessionCookieInResponse } from '@/lib/auth';
import { initialStudents } from '@/lib/seedData';
import { getGlobalStudents } from '@/lib/serverStore';

const SERVER_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role, password, studentCode, customStudents } = body;

    if (role === 'admin') {
      if (!password || password !== SERVER_ADMIN_PASSWORD) {
        return NextResponse.json(
          { error: 'كلمة سر الإدارة غير صحيحة' },
          { status: 401 }
        );
      }

      const token = await createSessionToken({
        userId: 'adm_1',
        role: 'admin',
        name: 'الأستاذ عاصم وائل (Master Admin)',
        email: 'admin@edupulse.edu',
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: 'adm_1',
          role: 'admin',
          name: 'الأستاذ عاصم وائل (Master Admin)',
          email: 'admin@edupulse.edu',
        },
      });

      setSessionCookieInResponse(response, token);
      return response;
    }

    if (role === 'student') {
      if (!studentCode) {
        return NextResponse.json(
          { error: 'يرجى كتابة كود الطالب أو البريد' },
          { status: 400 }
        );
      }

      // Combine server store students, client payload students, and initial seed students
      const serverStudents = getGlobalStudents();
      const clientStudents = Array.isArray(customStudents) ? customStudents : [];
      const allStudents = [...serverStudents, ...clientStudents, ...initialStudents];

      const foundStudent = allStudents.find(
        (s: any) =>
          (s.email && s.email.toLowerCase().includes(studentCode.toLowerCase())) ||
          (s.studentPhone && s.studentPhone.includes(studentCode)) ||
          (s.parentPhone && s.parentPhone.includes(studentCode)) ||
          (s.name && s.name.toLowerCase().includes(studentCode.toLowerCase())) ||
          (s.id && s.id.toLowerCase() === studentCode.toLowerCase())
      );

      if (!foundStudent) {
        return NextResponse.json(
          { error: 'كود الطالب غير مسجل على المنصة' },
          { status: 401 }
        );
      }

      // Verify student password if set on student account
      if (foundStudent.password && password && foundStudent.password !== password) {
        return NextResponse.json(
          { error: 'كلمة السر الخاصة بالطالب غير صحيحة' },
          { status: 401 }
        );
      }

      const token = await createSessionToken({
        userId: foundStudent.id,
        role: 'student',
        name: foundStudent.name,
        email: foundStudent.email,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: foundStudent.id,
          role: 'student',
          name: foundStudent.name,
          email: foundStudent.email,
        },
      });

      setSessionCookieInResponse(response, token);
      return response;
    }

    return NextResponse.json({ error: 'دور المستخدم غير معروف' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: 'خطأ في معالجة طلب الدخول' }, { status: 500 });
  }
}
