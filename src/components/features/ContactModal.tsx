// =============================================================================
// CONTACT MODAL COMPONENT
// =============================================================================
// Modal form for contacting a professional.
// =============================================================================

"use client";

import { useState } from "react";
import { Modal, Button, Input } from "@/components/ui";
import { Professional, ContactRequest } from "@/types";
import { Send, CheckCircle } from "lucide-react";

export interface ContactModalProps {
  professional: Professional;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Contact modal for sending messages to professionals
 *
 * @example
 * <ContactModal professional={data} isOpen={isOpen} onClose={close} />
 */
export function ContactModal({ professional, isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState<Partial<ContactRequest>>({
    senderName: "",
    senderEmail: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.senderName?.trim()) {
      newErrors.senderName = "Name is required";
    }
    if (!formData.senderEmail?.trim()) {
      newErrors.senderEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.senderEmail)) {
      newErrors.senderEmail = "Please enter a valid email";
    }
    if (!formData.subject?.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.message?.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call - replace with actual API endpoint
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In production, you would call your API here:
      // await api.sendContactRequest({
      //   ...formData,
      //   professionalId: professional.id,
      // });

      setIsSuccess(true);
    } catch (error) {
      setErrors({ form: "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form state on close
    setFormData({ senderName: "", senderEmail: "", subject: "", message: "" });
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  const updateField = (field: keyof ContactRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on input
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSuccess ? "Message Sent!" : `Contact ${professional.displayName}`}
      description={
        isSuccess
          ? undefined
          : "Fill out the form below to get in touch. They typically respond within 24 hours."
      }
      size="lg"
    >
      {isSuccess ? (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your message has been sent!
          </h3>
          <p className="text-gray-600 mb-6">
            {professional.displayName} will receive your message and get back to you soon.
          </p>
          <Button onClick={handleClose}>Close</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.form}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Name"
              placeholder="John Doe"
              value={formData.senderName}
              onChange={(e) => updateField("senderName", e.target.value)}
              error={errors.senderName}
              fullWidth
            />
            <Input
              label="Your Email"
              type="email"
              placeholder="john@example.com"
              value={formData.senderEmail}
              onChange={(e) => updateField("senderEmail", e.target.value)}
              error={errors.senderEmail}
              fullWidth
            />
          </div>

          <Input
            label="Subject"
            placeholder="What's this about?"
            value={formData.subject}
            onChange={(e) => updateField("subject", e.target.value)}
            error={errors.subject}
            fullWidth
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Message</label>
            <textarea
              placeholder="Tell them about your project or inquiry..."
              value={formData.message}
              onChange={(e) => updateField("message", e.target.value)}
              rows={5}
              className={`
                w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400
                transition-colors focus:outline-none focus:ring-2
                ${
                  errors.message
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-500/20"
                }
              `}
            />
            {errors.message && (
              <p className="text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
