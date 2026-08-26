import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getGlobalActiveLiveStream, setGlobalActiveLiveStream } from '@/lib/serverStore';
import { readDatabase, writeDatabase } from '@/lib/db';

const LIVE_COOKIE_NAME = 'edupulse_active_live';

export async function GET() {
  try {
    // 1. Try reading live status from HTTP Cookie (ensures 100% Vercel serverless sync)
    const cookieStore = cookies();
    const liveCookie = cookieStore.get(LIVE_COOKIE_NAME);

    if (liveCookie && liveCookie.value) {
      try {
        const parsed = JSON.parse(decodeURIComponent(liveCookie.value));
        if (parsed && typeof parsed.isLive === 'boolean') {
          return NextResponse.json({ success: true, live: parsed });
        }
      } catch (e) {}
    }

    // 2. Fallback to Database File & Server Memory Store
    const db = readDatabase();
    const live = db.activeLiveStream || getGlobalActiveLiveStream();
    return NextResponse.json({ success: true, live });
  } catch (error) {
    const live = getGlobalActiveLiveStream();
    return NextResponse.json({ success: true, live });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { isLive, meetingUrl, title, grade } = body;

    const liveData = {
      isLive: Boolean(isLive),
      meetingUrl: meetingUrl || '',
      title: title || 'بث مباشر تفاعلي أونلاين 🔴',
      grade: grade || 'all',
      startedAt: isLive ? new Date().toISOString() : undefined,
    };

    // 1. Update in-memory server store
    setGlobalActiveLiveStream(liveData);

    // 2. Update Database File
    try {
      const db = readDatabase();
      db.activeLiveStream = liveData;
      writeDatabase(db);
    } catch (e) {
      console.warn('Could not persist live stream to DB file:', e);
    }

    // 3. Set global HTTP cookie on response for instant cross-lambda Vercel sync
    const response = NextResponse.json({ success: true, live: liveData });
    response.cookies.set({
      name: LIVE_COOKIE_NAME,
      value: encodeURIComponent(JSON.stringify(liveData)),
      httpOnly: false,
      path: '/',
      maxAge: 86400 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update live stream status' }, { status: 500 });
  }
}
