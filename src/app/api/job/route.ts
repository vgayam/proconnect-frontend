import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/** POST /api/job — proxy a broadcast job post to the backend */
export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const res = await fetch(`${API_URL}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[job/post] fetch failed:', err);
    return NextResponse.json({ message: 'Could not reach booking service.' }, { status: 502 });
  }
}
