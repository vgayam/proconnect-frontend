import { NextRequest } from 'next/server';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const COOKIE_NAME = 'proconnect_token';

/**
 * GET /api/professionals/me/bookings/stream
 * Proxies the backend SSE stream to the browser.
 * We resolve the professionalId from /api/professionals/me first,
 * then pipe the backend SSE through to the client.
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Resolve professionalId
  const meRes = await fetch(`${API_URL}/api/professionals/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!meRes.ok) return new Response('Unauthorized', { status: 401 });
  const me = await meRes.json();

  // Open SSE stream from backend and pipe it through
  const backendRes = await fetch(
    `${API_URL}/api/inquiries/professionals/${me.id}/stream`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    }
  );

  if (!backendRes.ok || !backendRes.body) {
    return new Response('Stream unavailable', { status: 502 });
  }

  return new Response(backendRes.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // disables Nginx/Vercel buffering
    },
  });
}
