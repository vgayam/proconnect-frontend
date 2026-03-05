import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;

    const res = await fetch(`${BACKEND_URL}/api/inquiries/cancel/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to cancel booking' },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Cancel booking error:', error);
    return NextResponse.json(
      { message: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}

// GET to check if token is valid
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;

    // For now, we'll just return success - the POST will validate
    // In a real app, you'd have a separate endpoint to validate the token
    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid token' },
      { status: 400 }
    );
  }
}
