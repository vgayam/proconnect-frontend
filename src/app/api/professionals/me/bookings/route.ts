import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const COOKIE_NAME = 'proconnect_token';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Decode professionalId from the JWT (backend can also expose /me/bookings directly)
  const meRes = await fetch(`${API_URL}/api/professionals/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!meRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const me = await meRes.json();

  const res = await fetch(`${API_URL}/api/inquiries/professionals/${me.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => []);
  return NextResponse.json(Array.isArray(data) ? data : [], { status: res.ok ? 200 : res.status });
}
