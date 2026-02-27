'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMe, logout, type AuthProfessional } from '@/lib/auth';
import { Pencil, Eye, LogOut, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthProfessional | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    getMe().then((profile) => {
      if (!profile) { router.push('/login'); return; }
      setMe(profile);
      setIsAvailable(profile.isAvailable ?? true);
      setLoading(false);
    });
  }, [router]);

  async function handleToggle() {
    if (toggling) return;
    setToggling(true);
    const next = !isAvailable;
    try {
      const res = await fetch('/api/professionals/me/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: next }),
      });
      if (res.ok) setIsAvailable(next);
    } finally {
      setToggling(false);
    }
  }

  async function handleSignOut() {
    await logout();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const initials = me
    ? (me.displayName ?? '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('')
    : '?';

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10 flex flex-col items-center gap-6">

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold select-none shadow-md">
            {initials}
          </div>

          {/* Name + email */}
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">{me?.displayName ?? 'Your Profile'}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{me?.email}</p>
          </div>

          {/* Availability toggle */}
          <div
            onClick={handleToggle}
            className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer select-none hover:bg-gray-100 transition"
          >
            <button
              type="button"
              disabled={toggling}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                isAvailable ? 'bg-green-500' : 'bg-gray-300'
              } disabled:opacity-50`}
              aria-label="Toggle availability"
            >
              {toggling ? (
                <Loader2 className="h-3 w-3 animate-spin text-white absolute left-1/2 -translate-x-1/2" />
              ) : (
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  isAvailable ? 'translate-x-6' : 'translate-x-1'
                }`} />
              )}
            </button>
            <div>
              <p className={`text-sm font-semibold ${isAvailable ? 'text-green-700' : 'text-gray-500'}`}>
                {isAvailable ? 'Visible in search' : 'Hidden from search'}
              </p>
              <p className="text-xs text-gray-400">
                {isAvailable ? 'Clients can discover your profile' : 'Your profile is paused'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            <Link
              href="/list-service?edit=true"
              className="flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition"
            >
              <Pencil className="h-4 w-4" /> Edit Profile
            </Link>

            {me && (
              <Link
                href={`/professionals/${me.id}`}
                className="flex items-center justify-center gap-2 w-full px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl transition"
              >
                <Eye className="h-4 w-4" /> View Public Profile
              </Link>
            )}
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition mt-2"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        {/* Back to site */}
        <p className="text-center mt-5 text-sm text-gray-400">
          <Link href="/" className="hover:text-primary-600 transition">← Back to ProConnect</Link>
        </p>
      </div>
    </div>
  );
}