// =============================================================================
// AUTH API — professional OTP login helpers
// All calls go through Next.js API routes (/api/auth/*) so cookies are
// set on the same domain (Vercel) instead of cross-domain from Render.
// =============================================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface AuthProfessional {
  id: number;
  displayName: string;
  email: string;
  slug: string;
  isAvailable: boolean;
  isVerified: boolean;
  avatarUrl?: string;
  headline?: string;
}

/** Step 1 — request OTP (proxied through Next.js API route) */
export async function requestOtp(email: string): Promise<{ message: string }> {
  const res = await fetch('/api/auth/request-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to send OTP');
  }
  return res.json();
}

/** Step 2 — verify OTP, Next.js API route sets same-domain HttpOnly cookie */
export async function verifyOtp(email: string, otp: string): Promise<AuthProfessional> {
  const res = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Invalid or expired OTP');
  }
  return res.json();
}

/** Fetch the currently logged-in professional */
export async function getMe(): Promise<AuthProfessional | null> {
  const res = await fetch('/api/auth/me', { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

/** Log out — clears the cookie via Next.js API route */
export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}

/** Direct backend call with Bearer token (for server components / dashboard) */
export async function getMeFromBackend(token: string): Promise<AuthProfessional | null> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}
