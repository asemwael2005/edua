import { NextResponse } from 'next/server';
import { clearSessionCookieInResponse } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
  clearSessionCookieInResponse(response);
  return response;
}

export async function GET() {
  const response = NextResponse.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
  clearSessionCookieInResponse(response);
  return response;
}
