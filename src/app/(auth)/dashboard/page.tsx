'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMe, logout, type AuthProfessional } from '@/lib/auth';
import { Pencil, Eye, LogOut, Loader2, Phone, Users, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface DashboardStats {
  contactRevealsThisWeek: number;
  contactRevealsAllTime: number;
  totalLeads: number;
  leadEmails: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthProfessional | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [showLeads, setShowLeads] = useState(false);

  useEffect(() => {
    getMe().then((profile) => {
      if (!profile) { router.push('/login'); return; }
      setMe(profile);
      setIsAvailable(profile.isAvailable ?? true);
      setLoading(false);
    });
  }, [router]);

  useEffect(() => {
    if (!me) return;
    fetch('/api/professionals/me/stats')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setStats(d); })
      .catch(() => {});
  }, [me]);

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

  function handleCopyLink() {
    if (!me) return;
    const url = `${window.location.origin}/professionals/${me.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
      <div className="w-full max-w-sm space-y-4">
        {/* Main Card */}
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

            {/* Share profile link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 w-full px-5 py-2.5 border border-dashed border-gray-300 hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-xl transition"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Link copied!' : 'Copy profile link'}
            </button>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition mt-2"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Your Activity</h2>
          {stats ? (
            <div className="space-y-3">
              {/* Contact reveals this week */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-primary-500 shrink-0" />
                  Contact reveals this week
                </div>
                <span className="text-sm font-bold text-gray-900">{stats.contactRevealsThisWeek}</span>
              </div>

              {/* Total leads */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-primary-500 shrink-0" />
                  Total unique leads
                </div>
                <span className="text-sm font-bold text-gray-900">{stats.totalLeads}</span>
              </div>

              {/* Lead emails list */}
              {stats.leadEmails.length > 0 && (
                <div className="pt-1 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowLeads((v) => !v)}
                    className="flex items-center justify-between w-full text-xs font-medium text-primary-600 hover:text-primary-700 py-1"
                  >
                    <span>View lead emails ({stats.leadEmails.length})</span>
                    {showLeads ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                  {showLeads && (
                    <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                      {stats.leadEmails.map((email) => (
                        <div key={email} className="flex items-center justify-between gap-2 px-2 py-1.5 bg-gray-50 rounded-lg">
                          <span className="text-xs text-gray-700 truncate">{email}</span>
                          <a
                            href={`mailto:${email}`}
                            className="text-xs text-primary-600 hover:underline shrink-0"
                          >
                            Email
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {stats.totalLeads === 0 && (
                <p className="text-xs text-gray-400 pt-1">
                  No leads yet. Share your profile to get discovered!
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-6 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to site */}
        <p className="text-center text-sm text-gray-400">
          <Link href="/" className="hover:text-primary-600 transition">← Back to ProConnect</Link>
        </p>
      </div>
    </div>
  );
}