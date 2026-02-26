// =============================================================================
// AUTH API — professional OTP login helpers
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

/** Step 1 — request OTP to be sent to email */
export async function requestOtp(email: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/auth/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to send OTP');
  }
  return res.json();
}

/** Step 2 — verify OTP, backend sets HttpOnly cookie on success */
export async function verifyOtp(email: string, otp: string): Promise<AuthProfessional> {
  const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Invalid or expired OTP');
  }
  return res.json();
}

/** Fetch the currently logged-in professional (reads JWT cookie) */
export async function getMe(): Promise<AuthProfessional | null> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

/** Log out — clears the JWT cookie on the backend */
export async function logout(): Promise<void> {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
