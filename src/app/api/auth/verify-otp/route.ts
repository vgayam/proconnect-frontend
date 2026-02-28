import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const COOKIE_NAME = 'proconnect_token';
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Call Render backend server-to-server (no cross-domain cookie issues)
  const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  // Extract JWT from the backend's Set-Cookie header
  const setCookieHeader = res.headers.get('set-cookie') || '';
  const tokenMatch = setCookieHeader.match(/proconnect_token=([^;]+)/);
  const token = tokenMatch?.[1];

  const response = NextResponse.json(data, { status: 200 });

  if (token) {
    // Set cookie on same domain (Vercel) — readable by Next.js middleware
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',   // same-domain: lax is fine and more compatible than none
      maxAge: THIRTY_DAYS,
      path: '/',
    });
  }

  return response;
}
