import { NextRequest, NextResponse } from 'next/server';
import { getGlobalStudents, addGlobalStudent, updateGlobalStudent, deleteGlobalStudent } from '@/lib/serverStore';

// GET /api/admin/students -> Return all server students
export async function GET() {
  return NextResponse.json({ students: getGlobalStudents() });
}

// POST /api/admin/students -> Add or Update a student server-side
export async function POST(request: NextRequest) {
  try {
    const student = await request.json();
    if (!student || !student.id || !student.name) {
      return NextResponse.json({ error: 'بيانات الطالب غير مكتملة' }, { status: 400 });
    }

    const updatedList = addGlobalStudent(student);
    return NextResponse.json({ success: true, students: updatedList });
  } catch (e) {
    return NextResponse.json({ error: 'خطأ في حفظ الطالب بالسيرفر' }, { status: 500 });
  }
}

// PUT /api/admin/students -> Update student
export async function PUT(request: NextRequest) {
  try {
    const student = await request.json();
    if (!student || !student.id) {
      return NextResponse.json({ error: 'بيانات الطالب غير مكتملة' }, { status: 400 });
    }

    const updatedList = updateGlobalStudent(student);
    return NextResponse.json({ success: true, students: updatedList });
  } catch (e) {
    return NextResponse.json({ error: 'خطأ في تحديث الطالب بالسيرفر' }, { status: 500 });
  }
}

// DELETE /api/admin/students?id=studentId -> Delete student
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'كود الطالب مطلوب للحذف' }, { status: 400 });
    }

    const updatedList = deleteGlobalStudent(id);
    return NextResponse.json({ success: true, students: updatedList });
  } catch (e) {
    return NextResponse.json({ error: 'خطأ في حذف الطالب من السيرفر' }, { status: 500 });
  }
}
