import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/** Step 1 – send OTP to booker's email */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const professionalId = searchParams.get('professionalId');
  const email = searchParams.get('email');

  if (!professionalId || !email) {
    return NextResponse.json({ message: 'professionalId and email are required' }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/inquiries/professionals/${professionalId}/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  } catch (err) {
    console.error('[booking/request-otp] fetch failed:', err);
    return NextResponse.json({ message: 'Could not reach booking service.' }, { status: 502 });
  }

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

/** Step 2 – verify OTP + create booking */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { professionalId, customerName, customerEmail, customerPhone,
          customerAddress, customerLat, customerLng, preferredDate, preferredTime, note, otp } = body;

  if (!professionalId || !customerName || !customerEmail || !preferredDate || !preferredTime || !otp) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/inquiries/professionals/${professionalId}/verify-and-book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:         customerName,
        email:        customerEmail,
        phone:        customerPhone ?? null,
        address:      customerAddress ?? null,
        customerLat:  customerLat ?? null,
        customerLng:  customerLng ?? null,
        preferredDate,
        preferredTime,
        note:         note ?? null,
        otp,
      }),
    });
  } catch (fetchErr) {
    console.error('[booking] fetch to backend failed:', fetchErr);
    return NextResponse.json({ message: 'Could not reach booking service. Please try again.' }, { status: 502 });
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('[booking] backend error:', res.status, err);
    return NextResponse.json({ message: err.message || `Booking failed (${res.status})` }, { status: res.status });
  }

  const data = await res.json().catch(() => ({ ok: true }));
  return NextResponse.json(data);
}
