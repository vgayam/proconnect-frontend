// =============================================================================
// CONTACT MODAL COMPONENT
// =============================================================================
// Two-step contact flow:
//   Step 1 — Collect visitor name + email/phone → create booking inquiry
//   Step 2 — Show professional's contact details
// =============================================================================

"use client";

import { useState } from "react";
import { Modal, Button, Input } from "@/components/ui";
import { Professional } from "@/types";
import { createInquiry } from "@/lib/api";
import { Mail, Phone, MessageCircle, CheckCircle } from "lucide-react";

export interface ContactModalProps {
  professional: Professional;
  isOpen: boolean;
  onClose: () => void;
}

type Step = "gate" | "details";

/**
 * Contact modal — gates professional contact details behind name + email/phone
 * collection. Creates a booking inquiry so we can send a verified review link later.
 */
export function ContactModal({ professional, isOpen, onClose }: ContactModalProps) {
  const [step, setStep] = useState<Step>("gate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[+\d][\d\s\-().]{6,19}$/;

  const professionalName =
    professional.displayName ??
    `${professional.firstName} ${professional.lastName}`;

  function handleClose() {
    // Reset state on close
    setStep("gate");
    setName("");
    setEmail("");
    setPhone("");
    setError(null);
    setFieldErrors({});
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Per-field validation
    const errs: typeof fieldErrors = {};

    if (!name.trim()) {
      errs.name = "Name is required.";
    }

    const hasEmail = email.trim().length > 0;
    const hasPhone = phone.trim().length > 0;

    if (!hasEmail && !hasPhone) {
      errs.email = "Provide at least an email or phone number.";
    } else {
      if (hasEmail && !EMAIL_RE.test(email.trim())) {
        errs.email = "Enter a valid email address (e.g. you@example.com).";
      }
      if (hasPhone && !PHONE_RE.test(phone.trim())) {
        errs.phone = "Enter a valid phone number (digits, spaces, +, – allowed).";
      }
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});

    setIsSubmitting(true);
    try {
      await createInquiry(professional.id, {
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      setStep("details");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === "gate" ? `Contact ${professionalName}` : "Contact Details"}
      description={
        step === "gate"
          ? "Enter your details to unlock the professional's contact information."
          : "Reach out directly using the details below."
      }
      size="md"
    >
      {step === "gate" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: undefined })); }}
              error={fieldErrors.name}
              disabled={isSubmitting}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
              error={fieldErrors.email}
              disabled={isSubmitting}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone / WhatsApp
            </label>
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setFieldErrors((p) => ({ ...p, phone: undefined })); }}
              error={fieldErrors.phone}
              disabled={isSubmitting}
            />
          </div>

          <p className="text-xs text-gray-400">
            At least one of email or phone is required.
          </p>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Verifying…" : "Get Contact Details"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Success banner */}
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Inquiry recorded! You may receive a review link after your interaction.</span>
          </div>

          {/* Contact details */}
          <div className="space-y-3">
            {professional.email && (
              <a
                href={`mailto:${professional.email}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{professional.email}</p>
                </div>
              </a>
            )}
            {professional.phone && (
              <a
                href={`tel:${professional.phone}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Phone</p>
                  <p className="text-sm font-semibold text-gray-800">{professional.phone}</p>
                </div>
              </a>
            )}
            {professional.whatsapp && (
              <a
                href={`https://wa.me/${professional.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">WhatsApp</p>
                  <p className="text-sm font-semibold text-gray-800">{professional.whatsapp}</p>
                </div>
              </a>
            )}
            {!(professional.email || professional.phone || professional.whatsapp) && (
              <p className="text-sm text-gray-500 text-center py-4">
                No contact details available.
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleClose}>Done</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
