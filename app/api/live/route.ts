import { NextResponse } from 'next/server';
import { getGlobalActiveLiveStream, setGlobalActiveLiveStream } from '@/lib/serverStore';
import { readDatabase, writeDatabase } from '@/lib/db';

export async function GET() {
  try {
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

    // 2. Update persistent file store
    try {
      const db = readDatabase();
      db.activeLiveStream = liveData;
      writeDatabase(db);
    } catch (e) {
      console.warn('Could not persist live stream to DB file:', e);
    }

    return NextResponse.json({ success: true, live: liveData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update live stream status' }, { status: 500 });
  }
}
