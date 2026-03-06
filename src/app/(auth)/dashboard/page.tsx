'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMe, logout, type AuthProfessional } from '@/lib/auth';
import { Pencil, Eye, LogOut, Loader2, Phone, Users, Copy, Check, Share2, CalendarDays, Clock, CheckCircle, XCircle, MapPin, Bell, Zap } from 'lucide-react';
import { useBookingStream, type BroadcastJob } from '@/hooks/useBookingStream';

interface Booking {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  preferredDate?: string;
  preferredTime?: string;
  note?: string;
  status: string;
  createdAt: string;
  /** "INQUIRY" (direct booking) | "JOB_POST" (broadcast job accepted by this pro) */
  sourceType?: string;
  /** The real PK in the source table — use this for cancel/status calls */
  sourceId?: number;
}

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
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [broadcastJobs, setBroadcastJobs] = useState<BroadcastJob[]>([]);
  const [acceptingJobId, setAcceptingJobId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [newBookingAlert, setNewBookingAlert] = useState(false);
  const bookingCountRef = useRef<number | null>(null);

  // Smart polling: every 10s when tab is visible, paused when hidden
  useEffect(() => {
    if (!me) return;
    let interval: ReturnType<typeof setInterval>;

    function poll() {
      if (document.hidden) return; // skip when tab not visible

      // Poll bookings
      fetch('/api/professionals/me/bookings')
        .then((r) => r.ok ? r.json() : [])
        .then((d: Booking[]) => {
          if (!Array.isArray(d)) return;
          setBookings(d);
          // Show alert badge if count increased since last poll
          if (bookingCountRef.current !== null && d.length > bookingCountRef.current) {
            setNewBookingAlert(true);
          }
          bookingCountRef.current = d.length;
        })
        .catch(() => {});

      // Poll open broadcast jobs — multi-server safe (reads from DB)
      fetch('/api/job/open')
        .then((r) => r.ok ? r.json() : [])
        .then((jobs: BroadcastJob[]) => {
          if (!Array.isArray(jobs)) return;
          setBroadcastJobs(jobs);
        })
        .catch(() => {});
    }

    poll(); // immediate on mount
    interval = setInterval(poll, 10_000);
    document.addEventListener('visibilitychange', poll);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', poll);
    };
  }, [me]);

  // Background GPS update — push professional's live location every 60s
  useEffect(() => {
    if (!me) return;
    if (!navigator.geolocation) return;

    function pushLocation() {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          fetch('/api/professionals/me/location', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: coords.latitude, lng: coords.longitude }),
          }).catch(() => {});
        },
        () => {}, // silently ignore permission denied / unavailable
        { timeout: 10_000, maximumAge: 60_000 }
      );
    }

    pushLocation(); // run once immediately on login
    const interval = setInterval(pushLocation, 60_000);
    return () => clearInterval(interval);
  }, [me]);

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

  async function handleBookingStatus(booking: Booking, status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED') {
    // JOB_POST bookings are already ACCEPTED — only COMPLETED makes sense, but no status endpoint yet
    if (booking.sourceType === 'JOB_POST') return;

    const res = await fetch(`/api/booking/${booking.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setBookings((prev) =>
        prev ? prev.map((b) => (b.id === booking.id ? { ...b, status } : b)) : prev
      );
    }
  }

  // SSE: receive real-time new-booking and new-job events
  const handleNewBookingSSE = useCallback((booking: Booking) => {
    setBookings((prev) => {
      if (!prev) return [booking];
      if (prev.some((b) => b.id === booking.id)) return prev;
      setNewBookingAlert(true);
      return [booking, ...prev];
    });
  }, []);

  useBookingStream(!!me, handleNewBookingSSE);

  async function handleAcceptJob(jobId: number) {
    if (!me || acceptingJobId === jobId) return;
    setAcceptingJobId(jobId);
    try {
      const res = await fetch(`/api/job/${jobId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        // Remove from the list — job is taken
        setBroadcastJobs((prev) => prev.filter((j) => j.id !== jobId));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || 'Could not accept this job. It may have already been taken.');
        // Also remove from list — no point showing it
        setBroadcastJobs((prev) => prev.filter((j) => j.id !== jobId));
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setAcceptingJobId(null);
    }
  }

  function handleCopyLink() {
    if (!me) return;
    const url = `${window.location.origin}/professionals/${me.id}`;
    // Use native Web Share API on mobile (WhatsApp, SMS, etc.)
    if (navigator.share) {
      navigator.share({
        title: `${me.displayName} on ProConnect`,
        text: `Check out ${me.displayName}'s professional profile on ProConnect`,
        url,
      }).catch(() => {}); // user cancelled — ignore
      return;
    }
    // Fallback: copy to clipboard on desktop
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

  const pendingCount  = bookings?.filter((b) => b.status === 'PENDING').length ?? 0;
  const acceptedCount = bookings?.filter((b) => b.status === 'ACCEPTED').length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-white px-4 py-10">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* ── Top row: Profile + Stats side by side on md+ ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-8 flex flex-col items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold select-none shadow-lg">
                {initials}
              </div>
              {/* Online dot */}
              <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${isAvailable ? 'bg-green-400' : 'bg-gray-300'}`} />
            </div>

            {/* Name + email */}
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">{me?.displayName ?? 'Your Profile'}</h1>
              <p className="text-xs text-gray-400 mt-0.5">{me?.email}</p>
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
                <p className={`text-xs font-semibold ${isAvailable ? 'text-green-700' : 'text-gray-500'}`}>
                  {isAvailable ? 'Visible in search' : 'Hidden from search'}
                </p>
                <p className="text-xs text-gray-400">
                  {isAvailable ? 'Clients can discover you' : 'Profile is paused'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 w-full">
              <Link
                href="/list-service?edit=true"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition"
              >
                <Pencil className="h-4 w-4" /> Edit Profile
              </Link>

              {me && (
                <Link
                  href={`/professionals/${me.id}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl transition"
                >
                  <Eye className="h-4 w-4" /> View Public Profile
                </Link>
              )}

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-dashed border-gray-300 hover:bg-gray-50 text-gray-500 text-sm font-medium rounded-xl transition"
              >
                {copied
                  ? <Check className="h-4 w-4 text-green-600" />
                  : 'share' in navigator
                    ? <Share2 className="h-4 w-4" />
                    : <Copy className="h-4 w-4" />
                }
                {copied ? 'Link copied!' : 'Share profile'}
              </button>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>

          {/* Right column: Stats + Quick Summary */}
          <div className="md:col-span-2 flex flex-col gap-6">

            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-5">Your Activity</h2>
              {stats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-50 rounded-xl px-4 py-4 flex flex-col gap-1">
                    <Phone className="h-5 w-5 text-primary-500" />
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.contactRevealsThisWeek}</p>
                    <p className="text-xs text-gray-500">Contact reveals this week</p>
                  </div>
                  <div className="bg-primary-50 rounded-xl px-4 py-4 flex flex-col gap-1">
                    <Users className="h-5 w-5 text-primary-500" />
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalLeads}</p>
                    <p className="text-xs text-gray-500">Total unique leads</p>
                  </div>
                  {stats.contactRevealsAllTime !== undefined && (
                    <div className="bg-gray-50 rounded-xl px-4 py-4 flex flex-col gap-1">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.contactRevealsAllTime}</p>
                      <p className="text-xs text-gray-500">All-time reveals</p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl px-4 py-4 flex flex-col gap-1">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                    <p className="text-2xl font-bold text-gray-900 mt-1">{bookings?.length ?? '—'}</p>
                    <p className="text-xs text-gray-500">Total bookings</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              )}
              {stats?.totalLeads === 0 && (
                <p className="text-xs text-gray-400 mt-4">
                  No leads yet — share your profile to get discovered!
                </p>
              )}
            </div>

            {/* Booking summary pills */}
            {bookings !== null && bookings.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-700">
                  <Clock className="h-3.5 w-3.5" /> {pendingCount} Pending
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-green-700">
                  <CheckCircle className="h-3.5 w-3.5" /> {acceptedCount} Accepted
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold text-gray-500">
                  <CalendarDays className="h-3.5 w-3.5" /> {bookings.length} Total
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Broadcast Jobs section ── */}
        {broadcastJobs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-primary-100 px-6 py-6">
            <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Nearby Job Requests
              <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                {broadcastJobs.length}
              </span>
              <span className="ml-auto text-xs text-gray-400 font-normal">First to accept gets the job</span>
            </h2>
            <div className="space-y-3">
              {broadcastJobs.map((job) => (
                <div key={job.id} className="flex items-start justify-between gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-800">{job.customerName}</span>
                      <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full font-medium">{job.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{job.description}</p>
                    {job.address && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{job.address}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAcceptJob(job.id)}
                    disabled={acceptingJobId === job.id}
                    className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60"
                  >
                    {acceptingJobId === job.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <CheckCircle className="h-4 w-4" />}
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Bookings section (full width) ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6">
          <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary-500" />
            Booking Requests
            {bookings && bookings.length > 0 && (
              <span className="ml-auto text-xs font-medium text-gray-400">{bookings.length} total</span>
            )}
          </h2>

          {newBookingAlert && (
            <div
              onClick={() => setNewBookingAlert(false)}
              className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 cursor-pointer select-none"
            >
              <Bell className="h-4 w-4 shrink-0" />
              <span className="font-medium">New booking received!</span>
              <span className="ml-auto text-xs text-green-500">Dismiss</span>
            </div>
          )}

          {bookings === null ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <CalendarDays className="h-10 w-10 text-gray-200" />
              <p className="text-sm text-gray-400 font-medium">No booking requests yet</p>
              <p className="text-xs text-gray-400">Share your profile to start receiving bookings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bookings.map((b) => {
                const isPending    = b.status === 'PENDING';
                const isAccepted   = b.status === 'ACCEPTED';
                const isRejected   = b.status === 'REJECTED';
                const isCompleted  = b.status === 'COMPLETED';
                const isCancelled  = b.status === 'CANCELLED';

                // Initials for the booking customer
                const customerInitials = (b.customerName ?? '')
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((w: string) => w[0].toUpperCase())
                  .join('') || '?';

                return (
                  <div
                    key={b.id}
                    className={`relative flex flex-col gap-3 p-5 rounded-2xl border text-sm transition-shadow hover:shadow-md ${
                      isAccepted  ? 'border-green-200 bg-gradient-to-br from-green-50 to-white' :
                      isRejected  ? 'border-red-100 bg-gradient-to-br from-red-50 to-white' :
                      isCompleted ? 'border-blue-100 bg-gradient-to-br from-blue-50 to-white' :
                      isCancelled ? 'border-gray-300 bg-gradient-to-br from-gray-100 to-white opacity-70' :
                      'border-gray-200 bg-gradient-to-br from-gray-50 to-white'
                    }`}
                  >
                    {/* Status stripe */}
                    <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${
                      isAccepted  ? 'bg-green-400' :
                      isRejected  ? 'bg-red-300' :
                      isCompleted ? 'bg-blue-400' :
                      isCancelled ? 'bg-gray-400' :
                      'bg-amber-300'
                    }`} />

                    {/* Header: avatar + name + badge */}
                    <div className="flex items-center gap-3 pl-2">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                        isAccepted  ? 'bg-green-500' :
                        isRejected  ? 'bg-gray-400' :
                        isCompleted ? 'bg-blue-500' :
                        isCancelled ? 'bg-gray-300' :
                        'bg-primary-500'
                      }`}>
                        {customerInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{b.customerName}</p>
                        <p className="text-xs text-gray-400 truncate">{b.customerEmail}</p>
                      </div>
                      {isPending && (
                        <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                          Pending
                        </span>
                      )}
                      {isAccepted && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle className="h-3 w-3" /> Accepted
                        </span>
                      )}
                      {isRejected && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-100 px-2 py-0.5 rounded-full shrink-0">
                          <XCircle className="h-3 w-3" /> Rejected
                        </span>
                      )}
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle className="h-3 w-3" /> Completed
                        </span>
                      )}
                      {isCancelled && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full shrink-0">
                          <XCircle className="h-3 w-3" /> Cancelled
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="pl-2 space-y-1.5">
                      {b.customerPhone && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <a href={`tel:${b.customerPhone}`} className="hover:text-primary-600 transition">{b.customerPhone}</a>
                        </div>
                      )}
                      {b.customerAddress && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span>{b.customerAddress}</span>
                        </div>
                      )}
                      {(b.preferredDate || b.preferredTime) && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-primary-600">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          {b.preferredDate}{b.preferredDate && b.preferredTime ? ' · ' : ''}{b.preferredTime}
                        </div>
                      )}
                      {b.note && (
                        <p className="text-xs text-gray-400 italic bg-white/60 rounded-lg px-2.5 py-1.5 border border-gray-100">
                          &ldquo;{b.note}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Accept / Reject — only for direct bookings */}
                    {isPending && b.sourceType !== 'JOB_POST' && (
                      <div className="flex gap-2 pl-2 pt-1">
                        <button
                          onClick={() => handleBookingStatus(b, 'ACCEPTED')}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => handleBookingStatus(b, 'REJECTED')}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-xl transition"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    )}

                    {/* Mark Complete */}
                    {isAccepted && (
                      <div className="pl-2 pt-1">
                        <button
                          onClick={() => handleBookingStatus(b, 'COMPLETED')}
                          className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Mark Complete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Back to site */}
        <p className="text-center text-sm text-gray-400 pb-4">
          <Link href="/" className="hover:text-primary-600 transition">← Back to ProConnect</Link>
        </p>
      </div>
    </div>
  );
}