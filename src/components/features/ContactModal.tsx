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
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I found you on ProConnect and I'm interested in your services.`)}`}
                />
              )}
              {/* WhatsApp button using phone if no separate whatsapp field */}
              {!contact.whatsapp && contact.phone && (
                <a
                  href={`https://wa.me/${contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I found you on ProConnect and I'm interested in your services.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold rounded-lg transition"
                >
                  <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
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
