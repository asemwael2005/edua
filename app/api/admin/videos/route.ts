import { NextResponse } from 'next/server';
import { getGlobalVideos, addGlobalVideo, deleteGlobalVideo } from '@/lib/serverStore';

export async function GET() {
  const videos = getGlobalVideos();
  return NextResponse.json({ videos });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = addGlobalVideo(body.video);
    return NextResponse.json({ success: true, videos: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add video' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('id');
    if (!videoId) return NextResponse.json({ error: 'Video ID required' }, { status: 400 });

    const updated = deleteGlobalVideo(videoId);
    return NextResponse.json({ success: true, videos: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
