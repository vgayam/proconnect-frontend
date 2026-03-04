"use client";

// =============================================================================
// BOOKING MODAL
// =============================================================================
// Lets a client book a 1-hour slot with a professional.
// On success the backend sends email notifications to both parties.
// =============================================================================

import { useState } from "react";
import { X, Calendar, Clock, User, Mail, Phone, CheckCircle, Loader2, AlertCircle } from "lucide-react";

interface BookingModalProps {
  professionalId: string | number;
  professionalName: string;
  isOpen: boolean;
  onClose: () => void;
}

// Build next 7 days × 8 hourly slots
function buildSlots() {
  const slots: { date: string; label: string; times: string[] }[] = [];
  const now = new Date();
  for (let d = 0; d < 7; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d + 1);
    const dateStr = day.toISOString().split("T")[0];
    const label = day.toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short",
    });
    const times: string[] = [];
    for (let h = 9; h <= 19; h++) {
      times.push(`${String(h).padStart(2, "0")}:00`);
    }
    slots.push({ date: dateStr, label, times });
  }
  return slots;
}

const SLOTS = buildSlots();

export function BookingModal({ professionalId, professionalName, isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<"pick" | "form" | "done">("pick");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [phone, setPhone]   = useState("");
  const [note, setNote]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]   = useState("");

  if (!isOpen) return null;

  function handleClose() {
    setStep("pick");
    setSelectedDate(""); setSelectedTime("");
    setName(""); setEmail(""); setPhone(""); setNote("");
    setError("");
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) { setError("Name and email are required."); return; }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professionalId,
          customerName:  name.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim() || null,
          preferredDate: selectedDate,
          preferredTime: selectedTime,
          note: note.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Error ${res.status}`);
      }
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

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

        <div className="px-6 py-5">
          {/* ── Step: Done ── */}
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
                {SLOTS.find(s => s.date === selectedDate)?.label} at {selectedTime}
              </p>
              <p className="text-gray-400 text-xs mb-6">
                A confirmation has been sent to <strong>{email}</strong>. The professional will reach out to confirm.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition"
              >
                Done
              </button>
            </div>
          )}

          {/* ── Step: Pick date & time ── */}
          {step === "pick" && (
            <div className="space-y-5">
              {/* Date picker */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary-500" /> Choose a date
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {SLOTS.map((slot) => (
                    <button
                      key={slot.date}
                      type="button"
                      onClick={() => { setSelectedDate(slot.date); setSelectedTime(""); }}
                      className={`py-2.5 px-1 rounded-xl text-center text-xs font-medium border transition ${
                        selectedDate === slot.date
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary-400"
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time picker */}
              {selectedDate && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary-500" /> Choose a time
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {SLOTS.find(s => s.date === selectedDate)?.times.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`py-2 rounded-lg text-sm font-medium border transition ${
                          selectedTime === t
                            ? "bg-primary-600 text-white border-primary-600"
                            : "bg-white text-gray-700 border-gray-200 hover:border-primary-400"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep("form")}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm rounded-xl transition"
              >
                Continue →
              </button>
            </div>
          )}

          {/* ── Step: Contact form ── */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-primary-50 border border-primary-100 rounded-xl text-sm text-primary-700">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>
                  <strong>{SLOTS.find(s => s.date === selectedDate)?.label}</strong> at <strong>{selectedTime}</strong>
                  <button type="button" className="ml-2 text-xs underline text-primary-500" onClick={() => setStep("pick")}>
                    change
                  </button>
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="inline h-3.5 w-3.5 mr-1" />Your name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="Ravi Kumar"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="inline h-3.5 w-3.5 mr-1" />Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="ravi@email.com"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="inline h-3.5 w-3.5 mr-1" />Phone <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  rows={3} value={note} onChange={e => setNote(e.target.value)}
                  placeholder="Describe what you need help with…"
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep("pick")}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition">
                  ← Back
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Confirm Booking"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
