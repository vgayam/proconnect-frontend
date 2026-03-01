import { NextRequest, NextResponse } from "next/server";

// Server-only env var (not NEXT_PUBLIC_ — those are build-time only)
// Set API_URL in Vercel environment variables dashboard
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const INVALID = (msg: string) => ({ valid: false, professionalName: null, professionalId: null, message: msg });

async function safeJson(res: Response): Promise<object> {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : INVALID("Empty response from backend.");
  } catch {
    return INVALID("Backend returned non-JSON response.");
  }
}

/** GET /api/review/[token] — validate token and return professional name */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const targetUrl = `${API_URL}/api/reviews/token/${token}`;
  try {
    const res = await fetch(targetUrl, { cache: "no-store" });
    const data = await safeJson(res);
    return NextResponse.json(
      { ...data, _debug_url: targetUrl, _debug_status: res.status },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      INVALID(`Fetch failed: ${errMsg} | URL tried: ${targetUrl}`),
      { status: 200 }
    );
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
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ message: `Could not reach the server: ${errMsg}` }, { status: 503 });
  }
}
