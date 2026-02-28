import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const INVALID: object = { valid: false, professionalName: null, professionalId: null, message: "Could not reach the server. Please try again." };

async function safeJson(res: Response): Promise<object> {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : INVALID;
  } catch {
    return INVALID;
  }
}

/** GET /api/review/[token] — validate token and return professional name */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    const res = await fetch(`${API_URL}/api/reviews/token/${token}`, { cache: "no-store" });
    const data = await safeJson(res);
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch {
    return NextResponse.json(INVALID, { status: 200 });
  }
}

/** POST /api/review/[token] — submit review */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    const body = await req.json();
    const res = await fetch(`${API_URL}/api/reviews/token/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await safeJson(res);
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Could not reach the server. Please try again." }, { status: 503 });
  }
}
