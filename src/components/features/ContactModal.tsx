// =============================================================================
// CONTACT MODAL COMPONENT
// =============================================================================
// Modal form for contacting a professional.
// =============================================================================

"use client";

import { useState } from "react";
import { Modal, Button } from "@/components/ui";
import { Professional } from "@/types";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Contact Details"}
      description={"Reach out directly using the details below."}
      size="md"
    >
      <div className="space-y-2 mb-4">
        {professional.email && (
          <div>
            <span className="font-medium">Email:</span> <a href={`mailto:${professional.email}`} className="text-primary-600 underline">{professional.email}</a>
          </div>
        )}
        {professional.phone && (
          <div>
            <span className="font-medium">Phone:</span> <a href={`tel:${professional.phone}`} className="text-primary-600 underline">{professional.phone}</a>
          </div>
        )}
        {professional.whatsapp && (
          <div>
            <span className="font-medium">WhatsApp:</span> <a href={`https://wa.me/${professional.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">{professional.whatsapp}</a>
          </div>
        )}
        {!(professional.email || professional.phone || professional.whatsapp) && (
          <div className="text-gray-500">No contact details available.</div>
        )}
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}
