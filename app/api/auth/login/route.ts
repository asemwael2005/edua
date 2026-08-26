import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, setSessionCookieInResponse } from '@/lib/auth';
import { initialStudents } from '@/lib/seedData';
import { getGlobalStudents } from '@/lib/serverStore';
import { readDatabase } from '@/lib/db';

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
      if (!studentCode || !studentCode.trim()) {
        return NextResponse.json(
          { error: 'يرجى كتابة رقم الهاتف أو البريد الإلكتروني' },
          { status: 400 }
        );
      }

      const query = studentCode.trim().toLowerCase();
      const cleanPhone = query.replace(/[\s\-\(\)]/g, '');

      // Combine server DB students, server store students, client payload students, and initial seed students
      let dbStudents: any[] = [];
      try {
        dbStudents = readDatabase().students || [];
      } catch (e) {}

      const serverStudents = getGlobalStudents();
      const clientStudents = Array.isArray(customStudents) ? customStudents : [];
      const allStudents = [...dbStudents, ...serverStudents, ...clientStudents, ...initialStudents];

      const foundStudent = allStudents.find(
        (s: any) =>
          (s.studentPhone && s.studentPhone.replace(/[\s\-\(\)]/g, '').includes(cleanPhone)) ||
          (s.parentPhone && s.parentPhone.replace(/[\s\-\(\)]/g, '').includes(cleanPhone)) ||
          (s.email && s.email.toLowerCase().includes(query)) ||
          (s.name && s.name.toLowerCase().includes(query)) ||
          (s.id && s.id.toLowerCase() === query)
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
