// =============================================================================
// CONTACT MODAL COMPONENT
// =============================================================================
// Three-step email → OTP → contact-details flow
// =============================================================================

"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { requestContactOtp, verifyContactOtp, ProfessionalContact } from "@/lib/api";
import type { Professional } from "@/types";

// ─── types ───────────────────────────────────────────────────────────────────

interface ContactModalProps {
  professional: Professional;
  isOpen: boolean;
  onClose: () => void;
}

type Step = "email" | "otp" | "done";

// ─── component ───────────────────────────────────────────────────────────────

export function ContactModal({ professional, isOpen, onClose }: ContactModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [contact, setContact] = useState<ProfessionalContact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset when modal closes
  const handleClose = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setContact(null);
    setError("");
    onClose();
  };

  // Step 1 — send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestContactOtp(professional.id, email);
      setStep("otp");
    } catch (err: any) {
      if (err?.status === 429) {
        setError(err.message || "You have reached the contact view limit. Please try again in 24 hours.");
      } else {
        setError(err.message || "Failed to send verification code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await verifyContactOtp(professional.id, email, otp);
      setContact(data);
      setStep("done");
    } catch (err: any) {
      if (err?.status === 429) {
        setError(err.message || "You have reached the contact view limit. Please try again in 24 hours.");
      } else {
        setError(err.message || "Invalid or expired code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setOtp("");
    setLoading(true);
    try {
      await requestContactOtp(professional.id, email);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  // ─── render ────────────────────────────────────────────────────────────────

  const name =
    professional.displayName ?? `${professional.firstName} ${professional.lastName}`.trim();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Contact ${name}`}>
      <div className="p-6 space-y-5">
        {/* ── Step: email ── */}
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your email address to receive a verification code. We&apos;ll use it
              to reveal {name}&apos;s contact details.
            </p>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                Your email
              </label>
              <Input
                id="contact-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            {error && <ErrorBox message={error} />}

            <Button type="submit" className="w-full" disabled={loading || !email}>
              {loading ? "Sending…" : "Send verification code"}
            </Button>
          </form>
        )}

        {/* ── Step: otp ── */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-gray-600">
              We sent a 6-digit code to <strong>{email}</strong>.
              Enter it below to see {name}&apos;s contact information.
            </p>

            <div>
              <label htmlFor="contact-otp" className="block text-sm font-medium text-gray-700 mb-1">
                Verification code
              </label>
              <Input
                id="contact-otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                autoFocus
              />
            </div>

            {error && <ErrorBox message={error} />}

            <Button type="submit" className="w-full" disabled={loading || otp.length < 6}>
              {loading ? "Verifying…" : "Verify & show contact"}
            </Button>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <button
                type="button"
                onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                className="hover:text-gray-700 underline"
              >
                Change email
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="hover:text-gray-700 underline disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          </form>
        )}

        {/* ── Step: done ── */}
        {step === "done" && contact && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Here are {name}&apos;s contact details. Please reach out respectfully.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {contact.email && (
                <ContactRow
                  icon="✉️"
                  label="Email"
                  value={contact.email}
                  href={`mailto:${contact.email}`}
                />
              )}
              {contact.phone && (
                <ContactRow
                  icon="📞"
                  label="Phone"
                  value={contact.phone}
                  href={`tel:${contact.phone}`}
                />
              )}
              {contact.whatsapp && (
                <ContactRow
                  icon="💬"
                  label="WhatsApp"
                  value={contact.whatsapp}
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                />
              )}
              {!contact.email && !contact.phone && !contact.whatsapp && (
                <p className="text-sm text-gray-500 text-center py-2">
                  No contact details available yet.
                </p>
              )}
            </div>

            <p className="text-xs text-gray-400">
              🔒 Contact details are only shown after email verification and are limited to
              2 views per 24 hours.
            </p>

            <Button variant="outline" className="w-full" onClick={handleClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── sub-components ──────────────────────────────────────────────────────────

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}

function ContactRow({
  icon, label, value, href,
}: {
  icon: string;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:underline truncate block"
        >
          {value}
        </a>
      </div>
    </div>
  );
}
