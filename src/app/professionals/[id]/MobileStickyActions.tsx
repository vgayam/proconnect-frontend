"use client";

// =============================================================================
// MOBILE STICKY ACTION BAR
// =============================================================================
// Fixed bottom bar on mobile showing Contact + Book buttons.
// Hidden on md+ screens where the desktop CTA is already visible.
// =============================================================================

import { Professional, Service } from "@/types";
import { ContactButton } from "./ContactButton";
import { BookingButton } from "./BookingButton";

interface MobileStickyActionsProps {
  professional: Professional;
  services: Service[];
}

export function MobileStickyActions({ professional, services }: MobileStickyActionsProps) {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 shadow-lg px-4 py-3 flex gap-3">
      <div className="flex-1">
        <ContactButton professional={professional} fullWidth />
      </div>
      <div className="flex-1">
        <BookingButton
          professionalId={professional.id}
          professionalName={professional.displayName ?? `${professional.firstName} ${professional.lastName}`}
          services={services ?? []}
          fullWidth
        />
      </div>
    </div>
  );
}
