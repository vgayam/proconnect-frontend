'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMe, logout, type AuthProfessional } from '@/lib/auth';

const inputCls = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white disabled:bg-gray-100 disabled:text-gray-500';

interface ProfileForm {
  firstName: string; lastName: string; displayName: string;
  headline: string; bio: string; phone: string; whatsapp: string;
  avatarUrl: string; city: string; state: string; country: string;
  remote: boolean; hourlyRateMin: string; hourlyRateMax: string; currency: string;
}

const EMPTY: ProfileForm = {
  firstName: '', lastName: '', displayName: '', headline: '', bio: '',
  phone: '', whatsapp: '', avatarUrl: '', city: '', state: '',
  country: 'India', remote: false, hourlyRateMin: '', hourlyRateMax: '', currency: 'INR',
};

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthProfessional | null>(null);
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getMe().then(async (me) => {
      if (!me) { router.push('/login'); return; }
      setMe(me);
      setIsAvailable(me.isAvailable ?? true);
      const res = await fetch(`/api/professionals/${me.id}`);
      if (res.ok) {
        const d = await res.json();
        const loc = d.location ?? {};
        setForm({
          firstName: d.firstName ?? '',
          lastName: d.lastName ?? '',
          displayName: d.displayName ?? '',
          headline: d.headline ?? '',
          bio: d.bio ?? '',
          phone: d.phone ?? '',
          whatsapp: d.whatsapp ?? '',
          avatarUrl: d.avatarUrl ?? '',
          city: loc.city ?? d.city ?? '',
          state: loc.state ?? d.state ?? '',
          country: loc.country ?? d.country ?? 'India',
          remote: loc.remote ?? d.remote ?? false,
          hourlyRateMin: d.hourlyRateMin != null ? String(d.hourlyRateMin) : '',
          hourlyRateMax: d.hourlyRateMax != null ? String(d.hourlyRateMax) : '',
          currency: d.currency ?? 'INR',
        });
      }
      setLoading(false);
    });
  }, [router]);

  function f(key: keyof ProfileForm) {
    return {
      value: form[key] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(p => ({ ...p, [key]: e.target.value })),
    };
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const res = await fetch('/api/professionals/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          displayName: form.displayName || `${form.firstName} ${form.lastName}`.trim(),
          headline: form.headline,
          bio: form.bio,
          phone: form.phone || null,
          whatsapp: form.whatsapp || null,
          avatarUrl: form.avatarUrl || null,
          location: { city: form.city, state: form.state, country: form.country, remote: form.remote },
          hourlyRateMin: form.hourlyRateMin ? parseFloat(form.hourlyRateMin) : null,
          hourlyRateMax: form.hourlyRateMax ? parseFloat(form.hourlyRateMax) : null,
          currency: form.currency,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || `Error ${res.status}`);
      }
      setSuccess('Profile saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle() {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-blue-600 text-lg">🔗 ProConnect</Link>
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggle}
              disabled={toggling}
              title={isAvailable ? 'Click to set unavailable' : 'Click to set available'}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isAvailable ? 'bg-green-500' : 'bg-gray-300'
              } disabled:opacity-50`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isAvailable ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
            <span className={`text-xs font-semibold ${isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
              {toggling ? '…' : isAvailable ? 'Available' : 'Unavailable'}
            </span>
            {me && (
              <Link href={`/professionals/${me.id}`} target="_blank"
                className="text-sm text-blue-600 hover:underline hidden sm:inline">
                View profile ↗
              </Link>
            )}
            <button onClick={async () => { await logout(); router.push('/'); }}
              className="text-sm text-gray-400 hover:text-red-600 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            {me?.displayName ? `Hi, ${me.displayName.split(' ')[0]} 👋` : 'Your Profile'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{me?.email}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <Card title="Basic Info">
            <div className="grid grid-cols-2 gap-3">
              <LabelField label="First name *">
                <input {...f('firstName')} required className={inputCls} />
              </LabelField>
              <LabelField label="Last name *">
                <input {...f('lastName')} required className={inputCls} />
              </LabelField>
            </div>
            <LabelField label="Display name">
              <input {...f('displayName')} placeholder="Defaults to first + last" className={inputCls} />
            </LabelField>
            <LabelField label="Headline *">
              <input {...f('headline')} required placeholder="e.g. Electrician with 8 years experience" className={inputCls} />
            </LabelField>
            <LabelField label="Bio">
              <textarea {...f('bio')} rows={4} placeholder="Tell clients about yourself…" className={inputCls} />
            </LabelField>
            <LabelField label="Avatar URL">
              <input {...f('avatarUrl')} placeholder="https://…" className={inputCls} />
            </LabelField>
          </Card>

          <Card title="Location">
            <div className="grid grid-cols-3 gap-3">
              <LabelField label="City *">
                <input {...f('city')} required className={inputCls} />
              </LabelField>
              <LabelField label="State">
                <input {...f('state')} className={inputCls} />
              </LabelField>
              <LabelField label="Country">
                <input {...f('country')} className={inputCls} />
              </LabelField>
            </div>
            <label className="flex items-center gap-2 mt-1 cursor-pointer text-sm text-gray-700">
              <input type="checkbox" checked={form.remote}
                onChange={e => setForm(p => ({ ...p, remote: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600" />
              Available for remote work
            </label>
          </Card>

          <Card title="Contact">
            <div className="grid grid-cols-2 gap-3">
              <LabelField label="Phone">
                <input {...f('phone')} type="tel" placeholder="+91 98765 43210" className={inputCls} />
              </LabelField>
              <LabelField label="WhatsApp">
                <input {...f('whatsapp')} type="tel" placeholder="+91 98765 43210" className={inputCls} />
              </LabelField>
            </div>
          </Card>

          <Card title="Hourly Rate">
            <div className="grid grid-cols-3 gap-3">
              <LabelField label="Min">
                <input {...f('hourlyRateMin')} type="number" min="0" placeholder="500" className={inputCls} />
              </LabelField>
              <LabelField label="Max">
                <input {...f('hourlyRateMax')} type="number" min="0" placeholder="1500" className={inputCls} />
              </LabelField>
              <LabelField label="Currency">
                <select {...f('currency')} className={inputCls}>
                  <option>INR</option><option>USD</option><option>EUR</option><option>GBP</option>
                </select>
              </LabelField>
            </div>
          </Card>

          <div className="flex items-center gap-4 pt-1 pb-8">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-sm transition-colors">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {success && <span className="text-sm text-green-600 font-medium">✓ {success}</span>}
            {error   && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</h2>
      {children}
    </div>
  );
}

function LabelField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
