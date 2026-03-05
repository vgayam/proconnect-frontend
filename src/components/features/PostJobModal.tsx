"use client";

// =============================================================================
// POST A JOB MODAL
// =============================================================================
// Broadcast job form — completely separate from the direct booking flow.
// Customer describes what they need, we broadcast to nearby professionals.
// =============================================================================

import { useState, useEffect } from "react";
import {
  X, MapPin, Briefcase, FileText, User, Phone, Mail,
  Loader2, CheckCircle, AlertCircle, Navigation,
} from "lucide-react";
import { getCategories, type Category } from "@/lib/api";

interface Props {
  onClose: () => void;
}

interface FormState {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  category: string;
  description: string;
  address: string;
  lat: number | null;
  lng: number | null;
}

const INITIAL: FormState = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  category: "",
  description: "",
  address: "",
  lat: null,
  lng: null,
};

export function PostJobModal({ onClose }: Props) {
  const [form, setForm]               = useState<FormState>(INITIAL);
  const [categories, setCategories]   = useState<Category[]>([]);
  const [detectingLoc, setDetecting]  = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Load categories (same endpoint as home page)
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const set = (field: keyof FormState, value: string | number | null) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Auto-detect location
  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        set("lat", coords.latitude);
        set("lng", coords.longitude);
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          );
          const data = await res.json();
          const addr = [
            data.address?.road,
            data.address?.suburb,
            data.address?.city || data.address?.town,
          ].filter(Boolean).join(", ");
          if (addr) set("address", addr);
        } catch { /* silent */ }
        finally { setDetecting(false); }
      },
      () => setDetecting(false),
      { timeout: 8000 }
    );
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.customerName.trim())  errs.customerName  = "Name is required";
    if (!form.customerEmail.trim()) errs.customerEmail = "Email is required";
    if (!form.category)             errs.category      = "Select a category";
    if (!form.description.trim())   errs.description   = "Describe the work needed";
    if (!form.lat || !form.lng)     errs.address       = "Location is required so we can find nearby professionals";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName:  form.customerName.trim(),
          customerEmail: form.customerEmail.trim(),
          customerPhone: form.customerPhone.trim() || null,
          category:      form.category,
          description:   form.description.trim(),
          address:       form.address.trim() || null,
          lat:           form.lat,
          lng:           form.lng,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Job Posted! 🎉</h2>
          <p className="text-gray-500 text-sm mb-6">
            We&apos;re broadcasting your request to nearby <strong>{form.category}</strong> professionals.
            You&apos;ll get an email as soon as someone accepts.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Post a Job</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              We&apos;ll broadcast to professionals within 5 km — first to accept gets the job.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => { set("customerName", e.target.value); setFieldErrors(p => ({ ...p, customerName: undefined })); }}
                placeholder="Your name"
                className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition
                  ${fieldErrors.customerName ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-primary-200 focus:border-primary-400"}`}
              />
            </div>
            {fieldErrors.customerName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{fieldErrors.customerName}</p>}
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => { set("customerEmail", e.target.value); setFieldErrors(p => ({ ...p, customerEmail: undefined })); }}
                  placeholder="you@email.com"
                  className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition
                    ${fieldErrors.customerEmail ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-primary-200 focus:border-primary-400"}`}
                />
              </div>
              {fieldErrors.customerEmail && <p className="text-xs text-red-500 mt-1">{fieldErrors.customerEmail}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => set("customerPhone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={form.category}
                onChange={(e) => { set("category", e.target.value); setFieldErrors(p => ({ ...p, category: undefined })); }}
                className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition appearance-none bg-white
                  ${fieldErrors.category ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-primary-200 focus:border-primary-400"}`}
              >
                <option value="">Select a category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>
                ))}
              </select>
            </div>
            {fieldErrors.category && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{fieldErrors.category}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe the Work <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => { set("description", e.target.value); setFieldErrors(p => ({ ...p, description: undefined })); }}
                placeholder="e.g. Leaking kitchen pipe, need urgent repair…"
                className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 transition
                  ${fieldErrors.description ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-primary-200 focus:border-primary-400"}`}
              />
            </div>
            {fieldErrors.description && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{fieldErrors.description}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Location <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Address (auto-filled with GPS)"
                  className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition
                    ${fieldErrors.address ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-primary-200 focus:border-primary-400"}`}
                />
              </div>
              <button
                type="button"
                onClick={detectLocation}
                disabled={detectingLoc}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200 rounded-lg transition disabled:opacity-50"
              >
                {detectingLoc
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Navigation className="h-4 w-4" />}
                {detectingLoc ? "Detecting…" : "Use GPS"}
              </button>
            </div>
            {form.lat && form.lng && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Location captured
              </p>
            )}
            {fieldErrors.address && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{fieldErrors.address}</p>}
          </div>

          {/* Info box */}
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 text-xs text-primary-700">
            📡 Your request will be broadcast to all available <strong>{form.category || "matching"}</strong> professionals within 5 km.
            The first one to accept gets the job.
          </div>

          {/* Submit error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition text-gray-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-2.5 text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Posting…</>
                : "📡 Post Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
