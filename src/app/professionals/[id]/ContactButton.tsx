// =============================================================================
// CONTACT BUTTON - CLIENT COMPONENT
// =============================================================================
// Client-side button that opens the contact modal.
// =============================================================================

"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { ContactModal } from "@/components/features";
import { Professional } from "@/types";
import { MessageCircle } from "lucide-react";

export interface ContactButtonProps {
  professional: Professional;
  fullWidth?: boolean;
}

export function ContactButton({ professional, fullWidth = false }: ContactButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        size="lg"
        onClick={() => setIsModalOpen(true)}
        className={fullWidth ? "w-full" : ""}
      >
        <MessageCircle className="h-5 w-5" />
        Contact {professional.firstName}
      </Button>

      <ContactModal
        professional={professional}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
