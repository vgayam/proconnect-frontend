import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { professionalId, customerName, customerEmail, customerPhone, preferredDate, preferredTime, note } = body;

  if (!professionalId || !customerName || !customerEmail || !preferredDate || !preferredTime) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  // POST to backend inquiry endpoint (reuses existing BookingInquiry entity)
  const res = await fetch(`${API_URL}/api/inquiries/professionals/${professionalId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name:  customerName,
      email: customerEmail,
      phone: customerPhone ?? null,
      preferredDate,
      preferredTime,
      note: note ?? null,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ message: err.message || 'Booking failed' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
