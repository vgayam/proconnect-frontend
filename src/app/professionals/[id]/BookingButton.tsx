"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { BookingModal } from "./BookingModal";

interface BookingButtonProps {
  professionalId: string | number;
  professionalName: string;
}

export function BookingButton({ professionalId, professionalName }: BookingButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white border border-primary-300 hover:bg-primary-50 text-primary-700 text-sm font-semibold rounded-xl transition whitespace-nowrap"
      >
        <CalendarDays className="h-4 w-4 shrink-0" />
        Book
      </button>

      <BookingModal
        professionalId={professionalId}
        professionalName={professionalName}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
