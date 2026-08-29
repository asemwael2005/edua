import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, setSessionCookieInResponse } from '@/lib/auth';
import { initialStudents } from '@/lib/seedData';
import { getGlobalStudents } from '@/lib/serverStore';
import { readDatabase } from '@/lib/db';
import { normalizePhone } from '@/lib/phoneUtils';

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
      if (!studentCode || !studentCode.toString().trim()) {
        return NextResponse.json(
          { error: 'يرجى كتابة رقم الهاتف أو البريد الإلكتروني' },
          { status: 400 }
        );
      }

      const rawInput = studentCode.toString().trim();
      const normInputPhone = normalizePhone(rawInput);
      const normInputQuery = rawInput.toLowerCase();

      // Combine server DB students, server store students, client payload students, and initial seed students
      let dbStudents: any[] = [];
      try {
        dbStudents = readDatabase().students || [];
      } catch (e) {}

      const serverStudents = getGlobalStudents();
      const clientStudents = Array.isArray(customStudents) ? customStudents : [];
      const allStudents = [...dbStudents, ...serverStudents, ...clientStudents, ...initialStudents];

      const foundStudent = allStudents.find((s: any) => {
        if (!s) return false;
        const normStPhone = normalizePhone(s.studentPhone);
        const normPrPhone = normalizePhone(s.parentPhone);

        // Check phone matching with normalized digits
        if (normInputPhone && normInputPhone.length >= 6) {
          if (normStPhone && (normStPhone.includes(normInputPhone) || normInputPhone.includes(normStPhone))) return true;
          if (normPrPhone && (normPrPhone.includes(normInputPhone) || normInputPhone.includes(normPrPhone))) return true;
        }

        // Check email, ID, or name match
        if (s.email && s.email.toLowerCase().trim() === normInputQuery) return true;
        if (s.id && s.id.toLowerCase() === normInputQuery) return true;
        if (s.name && s.name.toLowerCase().includes(normInputQuery)) return true;

        return false;
      });

      if (!foundStudent) {
        return NextResponse.json(
          { error: 'رقم الهاتف أو كود الطالب غير مسجل على المنصة، يرجى إنشاء حساب جديد' },
          { status: 401 }
        );
      }

      // Password verification (handles Arabic keyboard digits & whitespace)
      if (foundStudent.password && password) {
        const savedPass = foundStudent.password.toString().trim();
        const inputPass = password.toString().trim();
        const normSavedPass = normalizePhone(savedPass) || savedPass;
        const normInputPass = normalizePhone(inputPass) || inputPass;

        if (savedPass !== inputPass && normSavedPass !== normInputPass) {
          return NextResponse.json(
            { error: 'كلمة المرور غير صحيحة، يرجى التثبت والربط مجدداً' },
            { status: 401 }
          );
        }
      }

      const token = await createSessionToken({
        userId: foundStudent.id,
        role: 'student',
        name: foundStudent.name,
        email: foundStudent.email,
        grade: foundStudent.grade,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: foundStudent.id,
          role: 'student',
          name: foundStudent.name,
          email: foundStudent.email,
          grade: foundStudent.grade,
        },
        student: foundStudent,
      });

      setSessionCookieInResponse(response, token);
      return response;
    }

    return NextResponse.json({ error: 'دور المستخدم غير معروف' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: 'خطأ في معالجة طلب الدخول' }, { status: 500 });
  }
}
