'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMe, logout, type AuthProfessional } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// ─── types ───────────────────────────────────────────────────────────────────

interface ProfileForm {
  firstName: string;
  lastName: string;
  displayName: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  whatsapp: string;
  avatarUrl: string;
  city: string;
  state: string;
  country: string;
  remote: boolean;
  hourlyRateMin: string;
  hourlyRateMax: string;
  currency: string;
}

const DEFAULT_FORM: ProfileForm = {
  firstName: '', lastName: '', displayName: '', headline: '', bio: '',
  email: '', phone: '', whatsapp: '', avatarUrl: '',
  city: '', state: '', country: 'India', remote: false,
  hourlyRateMin: '', hourlyRateMax: '', currency: 'INR',
};

// ─── component ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [professional, setProfessional] = useState<AuthProfessional | null>(null);
  const [form, setForm] = useState<ProfileForm>(DEFAULT_FORM);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');

  // Load current user
  useEffect(() => {
    getMe().then(me => {
      if (!me) {
        router.push('/login');
        return;
      }
      setProfessional(me);
      setIsAvailable(me.isAvailable ?? true);
      // Load full profile for the edit form
      fetchFullProfile(me.id);
    });
  }, [router]);

  async function fetchFullProfile(id: number) {
    try {
      const res = await fetch(`${API_URL}/api/professionals/${id}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const loc = data.location ?? {};
        setForm({
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          displayName: data.displayName ?? '',
          headline: data.headline ?? '',
          bio: data.bio ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          whatsapp: data.whatsapp ?? '',
          avatarUrl: data.avatarUrl ?? '',
          city: loc.city ?? data.city ?? '',
          state: loc.state ?? data.state ?? '',
          country: loc.country ?? data.country ?? 'India',
          remote: loc.remote ?? data.remote ?? false,
          hourlyRateMin: data.hourlyRateMin != null ? String(data.hourlyRateMin) : '',
          hourlyRateMax: data.hourlyRateMax != null ? String(data.hourlyRateMax) : '',
          currency: data.currency ?? 'INR',
        });
      }
    } finally {
      setLoadingProfile(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setSaveError('');
    setSaveSuccess(false);

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      displayName: form.displayName || `${form.firstName} ${form.lastName}`.trim(),
      headline: form.headline,
      bio: form.bio,
      email: form.email,
      phone: form.phone || null,
      whatsapp: form.whatsapp || null,
      avatarUrl: form.avatarUrl || null,
      location: {
        city: form.city,
        state: form.state,
        country: form.country,
        remote: form.remote,
      },
      hourlyRateMin: form.hourlyRateMin ? parseFloat(form.hourlyRateMin) : null,
      hourlyRateMax: form.hourlyRateMax ? parseFloat(form.hourlyRateMax) : null,
      currency: form.currency,
    };

    try {
      const res = await fetch(`${API_URL}/api/professionals/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Error ${res.status}`);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleToggleAvailability() {
    setTogglingAvailability(true);
    const newValue = !isAvailable;
    try {
      const res = await fetch(`${API_URL}/api/professionals/me/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isAvailable: newValue }),
      });
      if (res.ok) {
        setIsAvailable(newValue);
      }
    } finally {
      setTogglingAvailability(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  function field(key: keyof ProfileForm) {
    return {
      value: form[key] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [key]: e.target.value })),
    };
  }

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-blue-600">
            <span>🔗</span> ProConnect
          </Link>
          <div className="flex items-center gap-4">
            {/* Availability toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:inline">Available</span>
              <button
                onClick={handleToggleAvailability}
                disabled={togglingAvailability}
                aria-pressed={isAvailable}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                  isAvailable ? 'bg-green-500' : 'bg-gray-300'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    isAvailable ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-xs font-medium ${isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                {isAvailable ? 'Open' : 'Closed'}
              </span>
            </div>

            {professional && (
              <Link
                href={`/professionals/${professional.id}`}
                className="text-sm text-blue-600 hover:underline hidden sm:inline"
                target="_blank"
              >
                View profile ↗
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome bar */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back{professional?.displayName ? `, ${professional.displayName.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your professional profile and availability.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {(['profile', 'account'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'profile' ? '📝 Profile' : '⚙️ Account'}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Basic info */}
            <Section title="Basic Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First name" required>
                  <input {...field('firstName')} required className={inputCls} />
                </Field>
                <Field label="Last name" required>
                  <input {...field('lastName')} required className={inputCls} />
                </Field>
                <Field label="Display name">
                  <input {...field('displayName')} placeholder="Defaults to first + last name" className={inputCls} />
                </Field>
                <Field label="Avatar URL">
                  <input {...field('avatarUrl')} placeholder="https://…" className={inputCls} />
                </Field>
              </div>
              <Field label="Headline" required>
                <input {...field('headline')} required placeholder="e.g. Full-stack developer with 5 years experience" className={inputCls} />
              </Field>
              <Field label="Bio">
                <textarea {...field('bio')} rows={5} placeholder="Tell clients about yourself, your experience, and what makes you unique…" className={inputCls} />
              </Field>
            </Section>

            {/* Location */}
            <Section title="Location">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="City" required>
                  <input {...field('city')} required className={inputCls} />
                </Field>
                <Field label="State">
                  <input {...field('state')} className={inputCls} />
                </Field>
                <Field label="Country">
                  <input {...field('country')} className={inputCls} />
                </Field>
              </div>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remote}
                  onChange={e => setForm(f => ({ ...f, remote: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Available for remote work</span>
              </label>
            </Section>

            {/* Contact */}
            <Section title="Contact Info">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Email">
                  <input {...field('email')} type="email" className={inputCls} readOnly disabled
                    title="Email cannot be changed here. Contact support." />
                </Field>
                <Field label="Phone">
                  <input {...field('phone')} type="tel" placeholder="+91 98765 43210" className={inputCls} />
                </Field>
                <Field label="WhatsApp">
                  <input {...field('whatsapp')} type="tel" placeholder="+91 98765 43210" className={inputCls} />
                </Field>
              </div>
            </Section>

            {/* Rates */}
            <Section title="Hourly Rate">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Min rate">
                  <input {...field('hourlyRateMin')} type="number" min="0" step="0.01" placeholder="500" className={inputCls} />
                </Field>
                <Field label="Max rate">
                  <input {...field('hourlyRateMax')} type="number" min="0" step="0.01" placeholder="1500" className={inputCls} />
                </Field>
                <Field label="Currency">
                  <select {...field('currency')} className={inputCls}>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </Field>
              </div>
            </Section>

            {/* Save */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                {savingProfile ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Saving…
                  </span>
                ) : 'Save changes'}
              </button>

              {saveSuccess && (
                <p className="text-sm text-green-600 font-medium">✓ Profile updated!</p>
              )}
              {saveError && (
                <p className="text-sm text-red-600">{saveError}</p>
              )}
            </div>
          </form>
        )}

        {/* Account tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <Section title="Account">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email address</p>
                    <p className="text-sm text-gray-500">{professional?.email}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Login email</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Verification status</p>
                    <p className="text-sm text-gray-500">
                      {professional?.isVerified ? 'Your profile is verified' : 'Not yet verified'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    professional?.isVerified
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {professional?.isVerified ? '✓ Verified' : 'Pending'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Availability</p>
                    <p className="text-sm text-gray-500">
                      Currently <strong>{isAvailable ? 'open to new clients' : 'not accepting new clients'}</strong>
                    </p>
                  </div>
                  <button
                    onClick={handleToggleAvailability}
                    disabled={togglingAvailability}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isAvailable
                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    } disabled:opacity-50`}
                  >
                    {isAvailable ? 'Set unavailable' : 'Set available'}
                  </button>
                </div>
              </div>
            </Section>

            <Section title="Danger zone">
              <div className="p-4 border border-red-200 rounded-xl bg-red-50">
                <p className="text-sm text-red-700 mb-3">
                  Sign out of your dashboard on this device.
                </p>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Sign out
                </button>
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const inputCls =
  'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white disabled:bg-gray-100 disabled:text-gray-500';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
