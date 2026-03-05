"use client";

// =============================================================================
// BOOKING MODAL  — 4-step flow
//   1. pick   → choose date + time
//   2. form   → name / email / phone / note
//   3. otp    → enter verification code sent to email
//   4. done   → success
// =============================================================================

import { useState, useEffect, useRef } from "react";
import { X, Calendar, Clock, User, Mail, Phone, MapPin, CheckCircle, Loader2, AlertCircle, ShieldCheck, LocateFixed, Briefcase } from "lucide-react";
import type { Service } from "@/types";

interface BookingModalProps {
  professionalId: string | number;
  professionalName: string;
  services: Service[];
  isOpen: boolean;
  onClose: () => void;
}

function buildSlots() {
  const slots: { date: string; label: string; times: string[] }[] = [];
  const now = new Date();
  for (let d = 0; d < 7; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d + 1);
    const dateStr = day.toISOString().split("T")[0];
    const label = day.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    const times: string[] = [];
    for (let h = 9; h <= 19; h++) times.push(`${String(h).padStart(2, "0")}:00`);
    slots.push({ date: dateStr, label, times });
  }
  return slots;
}

const SLOTS = buildSlots();

export function BookingModal({ professionalId, professionalName, services, isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<"pick" | "form" | "otp" | "done">("pick");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote]       = useState("");
  const [otp, setOtp]     = useState("");
  const [sending, setSending]     = useState(false); // sending OTP
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const geocodedRef = useRef(false); // only auto-fill once per open
  const coordsRef = useRef<{ lat: number; lng: number } | null>(null); // store raw coords

  // When the customer reaches the form step, auto-fill their address from GPS
  useEffect(() => {
    if (step !== "form" || geocodedRef.current || !navigator.geolocation) return;
    geocodedRef.current = true;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        coordsRef.current = { lat: coords.latitude, lng: coords.longitude };
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          if (res.ok) {
            const data = await res.json();
            const a = data.address || {};
            const parts = [
              a.house_number && a.road ? `${a.house_number} ${a.road}` : a.road,
              a.neighbourhood || a.suburb || a.village,
              a.city || a.town || a.county,
              a.state,
            ].filter(Boolean);
            if (parts.length > 0) setAddress(parts.join(", "));
          }
        } catch { /* silently ignore */ } finally {
          setGeoLoading(false);
        }
      },
      () => setGeoLoading(false), // denied / unavailable
      { timeout: 8_000, maximumAge: 120_000 }
    );
  }, [step]);

  function refetchGeo() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        coordsRef.current = { lat: coords.latitude, lng: coords.longitude };
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          if (res.ok) {
            const data = await res.json();
            const a = data.address || {};
            const parts = [
              a.house_number && a.road ? `${a.house_number} ${a.road}` : a.road,
              a.neighbourhood || a.suburb || a.village,
              a.city || a.town || a.county,
              a.state,
            ].filter(Boolean);
            if (parts.length > 0) setAddress(parts.join(", "));
          }
        } catch { /* ignore */ } finally {
          setGeoLoading(false);
        }
      },
      () => setGeoLoading(false),
      { timeout: 8_000, maximumAge: 0 }
    );
  }

  if (!isOpen) return null;

  function handleClose() {
    setStep("pick");
    setSelectedDate(""); setSelectedTime("");
    setName(""); setEmail(""); setPhone(""); setAddress(""); setNote(""); setOtp("");
    setError("");
    setGeoLoading(false);
    geocodedRef.current = false;
    coordsRef.current = null;
    onClose();
  }

  /** Step 2 → 3: send OTP */
  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !address.trim()) { setError("Name, email and address are required."); return; }
    setError("");
    setSending(true);
    try {
      const res = await fetch(
        `/api/booking?professionalId=${encodeURIComponent(professionalId)}&email=${encodeURIComponent(email.trim())}`
      );
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Failed to send code.");
      }
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send verification code.");
    } finally {
      setSending(false);
    }
  }

  /** Step 3: verify OTP + submit booking */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!otp.trim()) { setError("Please enter the verification code."); return; }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId,
          customerName:    name.trim(),
          customerEmail:   email.trim(),
          customerPhone:   phone.trim() || null,
          customerAddress: address.trim() || null,
          customerLat:     coordsRef.current?.lat ?? null,
          customerLng:     coordsRef.current?.lng ?? null,
          serviceId:       selectedService,
          preferredDate:   selectedDate,
          preferredTime:   selectedTime,
          note: note.trim() || null,
          otp: otp.trim(),
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || `Error ${res.status}`);
      }
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const slotLabel = SLOTS.find(s => s.date === selectedDate)?.label;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Book a 1-hour slot</h2>
            <p className="text-sm text-gray-500">with {professionalName}</p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Step indicator */}
        {step !== "done" && (
          <div className="flex items-center px-6 pt-4 gap-1.5">
            {(["pick", "form", "otp"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-1.5 flex-1">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors
                  ${step === s ? "bg-primary-600 text-white" :
                    (["pick","form","otp"].indexOf(step) > i) ? "bg-green-500 text-white" :
                    "bg-gray-200 text-gray-400"}`}>
                  {(["pick","form","otp"].indexOf(step) > i) ? "✓" : i + 1}
                </div>
                <span className={`text-xs ${step === s ? "text-gray-800 font-medium" : "text-gray-400"}`}>
                  {s === "pick" ? "Slot" : s === "form" ? "Details" : "Verify"}
                </span>
                {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-1" />}
              </div>
            ))}
          </div>
        )}

        <div className="px-6 py-5">

          {/* ── Done ── */}
          {step === "done" && (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Booking request sent!</h3>
              <p className="text-gray-500 text-sm mb-2">
                <strong>{professionalName}</strong> has been notified of your request for
              </p>
              <p className="text-primary-600 font-semibold text-sm mb-4">
                {slotLabel} at {selectedTime}
              </p>
              <p className="text-gray-400 text-xs mb-6">
                A confirmation has been sent to <strong>{email}</strong>. The professional will reach out to confirm.
              </p>
              <button onClick={handleClose}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition">
                Done
              </button>
            </div>
          )}

          {/* ── Step 1: Pick date & time ── */}
          {step === "pick" && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary-500" /> Choose a date
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {SLOTS.map((slot) => (
                    <button key={slot.date} type="button"
                      onClick={() => { setSelectedDate(slot.date); setSelectedTime(""); }}
                      className={`py-2.5 px-1 rounded-xl text-center text-xs font-medium border transition ${
                        selectedDate === slot.date
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary-400"
                      }`}>
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary-500" /> Choose a time
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {SLOTS.find(s => s.date === selectedDate)?.times.map((t) => (
                      <button key={t} type="button" onClick={() => setSelectedTime(t)}
                        className={`py-2 rounded-lg text-sm font-medium border transition ${
                          selectedTime === t
                            ? "bg-primary-600 text-white border-primary-600"
                            : "bg-white text-gray-700 border-gray-200 hover:border-primary-400"
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button type="button" disabled={!selectedDate || !selectedTime}
                onClick={() => setStep("form")}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm rounded-xl transition">
                Continue →
              </button>
            </div>
          )}

          {/* ── Step 2: Contact form ── */}
          {step === "form" && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-primary-50 border border-primary-100 rounded-xl text-sm text-primary-700">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>
                  <strong>{slotLabel}</strong> at <strong>{selectedTime}</strong>
                  <button type="button" onClick={() => setStep("pick")} className="ml-2 text-xs underline text-primary-500">change</button>
                </span>
              </div>

              {/* Service selector (if professional has services) */}
              {services && services.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Briefcase className="inline h-3.5 w-3.5 mr-1" />Service <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <select
                    value={selectedService ?? ""}
                    onChange={(e) => setSelectedService(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                  >
                    <option value="">Select a service (optional)</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} {s.priceRange ? `— ₹${s.priceRange.min.toLocaleString()}${s.priceRange.max ? `-${s.priceRange.max.toLocaleString()}` : '+'}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="inline h-3.5 w-3.5 mr-1" />Your name <span className="text-red-500">*</span>
                </label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="Ravi Kumar"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="inline h-3.5 w-3.5 mr-1" />Email <span className="text-red-500">*</span>
                </label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="ravi@email.com"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="inline h-3.5 w-3.5 mr-1" />Phone <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    <MapPin className="inline h-3.5 w-3.5 mr-1" />Your address <span className="text-red-500">*</span>
                  </label>
                  <button type="button" onClick={refetchGeo} disabled={geoLoading}
                    className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 disabled:opacity-50 transition">
                    {geoLoading
                      ? <Loader2 className="h-3 w-3 animate-spin" />
                      : <LocateFixed className="h-3 w-3" />}
                    {geoLoading ? "Detecting…" : "Use my location"}
                  </button>
                </div>
                <div className="relative">
                  <input type="text" required value={address} onChange={e => setAddress(e.target.value)}
                    placeholder={geoLoading ? "Detecting your location…" : "123 Main St, Hyderabad, Telangana"}
                    disabled={geoLoading}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 disabled:bg-gray-50 disabled:text-gray-400" />
                  {geoLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400 animate-spin" />
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">So the professional knows where to come</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea rows={3} value={note} onChange={e => setNote(e.target.value)}
                  placeholder="Describe what you need help with…"
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400" />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep("pick")}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition">
                  ← Back
                </button>
                <button type="submit" disabled={sending}
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2">
                  {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending code…</> : "Send verification code →"}
                </button>
              </div>
            </form>
          )}

          {/* ── Step 3: OTP ── */}
          {step === "otp" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 mb-3">
                  <ShieldCheck className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Check your email</h3>
                <p className="text-sm text-gray-500 mt-1">
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Verification code</label>
                <input
                  type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6}
                  value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000" autoFocus
                  className="w-full px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
                </div>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => { setStep("form"); setOtp(""); setError(""); }}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition">
                  ← Back
                </button>
                <button type="submit" disabled={submitting || otp.length < 6}
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Confirming…</> : "Confirm Booking"}
                </button>
              </div>

              <p className="text-center text-xs text-gray-400">
                Didn&apos;t receive it?{" "}
                <button type="button" onClick={() => handleRequestOtp({ preventDefault: () => {} } as React.FormEvent)}
                  className="text-primary-600 hover:underline font-medium">
                  Resend code
                </button>
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
