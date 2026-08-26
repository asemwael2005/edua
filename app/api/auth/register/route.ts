import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, setSessionCookieInResponse } from '@/lib/auth';
import { addGlobalStudent, getGlobalStudents } from '@/lib/serverStore';
import { readDatabase, writeDatabase } from '@/lib/db';
import { normalizePhone } from '@/lib/phoneUtils';
import { Student } from '@/types/edupulse';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, parentPhone, studentPhone, grade, password } = body;

    if (!name || !name.trim() || !email || !email.trim() || !password || !password.trim()) {
      return NextResponse.json(
        { error: 'يرجى كتابة الاسم والبريد الإلكتروني وكلمة المرور' },
        { status: 400 }
      );
    }

    if (!parentPhone || !parentPhone.trim()) {
      return NextResponse.json(
        { error: 'رقم هاتف ولي الأمر مطلوب إجبارياً' },
        { status: 400 }
      );
    }

    // Convert Arabic numerals & normalize phones
    const normParent = normalizePhone(parentPhone);
    const normStudent = normalizePhone(studentPhone || parentPhone);

    if (normParent.length < 10) {
      return NextResponse.json(
        { error: 'رقم هاتف ولي الأمر غير صحيح (يجب أن يكون رقم مصري مكون من 11 رقم)' },
        { status: 400 }
      );
    }

    // Check if phone or email already registered in DB or server store
    let existingStudents: Student[] = [];
    try {
      existingStudents = readDatabase().students || [];
    } catch (e) {}
    const allKnownStudents = [...existingStudents, ...getGlobalStudents()];

    const existing = allKnownStudents.find(
      (s) =>
        (s.email && s.email.toLowerCase() === email.toLowerCase().trim()) ||
        (s.parentPhone && normalizePhone(s.parentPhone) === normParent) ||
        (s.studentPhone && normalizePhone(s.studentPhone) === normStudent)
    );

    if (existing) {
      return NextResponse.json(
        { error: 'رقم الهاتف أو البريد الإلكتروني مسجل بالفعل على المنصة، يرجى تسجيل الدخول مباشرة' },
        { status: 400 }
      );
    }

    const studentId = `std_${Date.now()}`;
    const newStudent: Student = {
      id: studentId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      parentPhone: parentPhone.trim(),
      studentPhone: (studentPhone || '').trim(),
      grade: grade || 'الصف الثالث الثانوي (Grade 12)',
      attendanceRate: 100,
      totalPoints: 100,
      password: password.trim(),
      joinedDate: new Date().toISOString().split('T')[0],
    };

    // Save to global server store & server Database
    addGlobalStudent(newStudent);
    try {
      const db = readDatabase();
      const existingIdx = db.students.findIndex((s) => s.id === newStudent.id || s.email === newStudent.email);
      if (existingIdx >= 0) {
        db.students[existingIdx] = newStudent;
      } else {
        db.students = [newStudent, ...db.students];
      }
      writeDatabase(db);
    } catch (e) {
      console.warn('Database write error on register:', e);
    }

    // Create Session Token and Cookie
    const token = await createSessionToken({
      userId: newStudent.id,
      role: 'student',
      name: newStudent.name,
      email: newStudent.email,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newStudent.id,
        role: 'student',
        name: newStudent.name,
        email: newStudent.email,
      },
      student: newStudent,
    });

    setSessionCookieInResponse(response, token);
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'خطأ أثناء تسجيل حساب الطالب الجديد' }, { status: 500 });
  }
}
