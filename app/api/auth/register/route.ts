import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, setSessionCookieInResponse } from '@/lib/auth';
import { addGlobalStudent, getGlobalStudents } from '@/lib/serverStore';
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

    // Egyptian phone validation
    const cleanPhone = parentPhone.replace(/[\s\-\(\)]/g, '');
    if (!/^(?:\+20|0)?1[0125]\d{8}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'رقم هاتف ولي الأمر غير صحيح (يجب أن يكون رقم مصري مكون من 11 رقم)' },
        { status: 400 }
      );
    }

    // Check if email already registered
    const existing = getGlobalStudents().find(
      (s) => s.email && s.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (existing) {
      return NextResponse.json(
        { error: 'هذا البريد الإلكتروني مسجل بالفعل على المنصة، يرجى تسجيل الدخول' },
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

    // Save to global server store
    addGlobalStudent(newStudent);

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
