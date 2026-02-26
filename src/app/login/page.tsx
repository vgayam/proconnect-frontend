'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { requestOtp, verifyOtp } from '@/lib/auth';

type Step = 'email' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await requestOtp(email.trim().toLowerCase());
      setMessage(res.message);
      setStep('otp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setError('');
    setLoading(true);
    try {
      const res = await requestOtp(email.trim().toLowerCase());
      setMessage(res.message);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(email.trim().toLowerCase(), otp.trim());
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600">
            <span className="text-3xl">🔗</span>
            ProConnect
          </Link>
          <p className="mt-2 text-gray-500 text-sm">Professional portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 'email' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
              <p className="text-gray-500 text-sm mb-6">
                Enter your registered email to receive a one-time code.
              </p>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Sending OTP…
                    </span>
                  ) : (
                    'Send verification code'
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => { setStep('email'); setOtp(''); setError(''); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Go back"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
                  <p className="text-gray-500 text-sm">Code sent to <span className="font-medium text-gray-700">{email}</span></p>
                </div>
              </div>

              {message && (
                <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">
                  ✓ {message}
                </p>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    6-digit verification code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    autoFocus
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-center tracking-[0.5em] text-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Verifying…
                    </span>
                  ) : (
                    'Verify & sign in'
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Didn&apos;t receive a code?{' '}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-blue-600 hover:underline font-medium disabled:opacity-50"
                  >
                    Resend
                  </button>
                </p>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Not a professional?{' '}
          <Link href="/" className="text-blue-600 hover:underline">
            Find professionals
          </Link>
        </p>
      </div>
    </main>
  );
}
