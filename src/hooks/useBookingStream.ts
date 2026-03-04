'use client';

import { useEffect } from 'react';

interface Booking {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  preferredDate?: string;
  preferredTime?: string;
  note?: string;
  status: string;
  createdAt: string;
}

/**
 * Opens an SSE connection to /api/professionals/me/bookings/stream
 * and calls onNewBooking whenever a new booking arrives.
 * Automatically reconnects on disconnect (EventSource handles this natively).
 */
export function useBookingStream(
  enabled: boolean,
  onNewBooking: (booking: Booking) => void
) {
  useEffect(() => {
    if (!enabled) return;

    const es = new EventSource('/api/professionals/me/bookings/stream');

    es.addEventListener('new-booking', (e) => {
      try {
        const booking: Booking = JSON.parse(e.data);
        onNewBooking(booking);
      } catch {
        // malformed event — ignore
      }
    });

    es.onerror = () => {
      // EventSource auto-reconnects after error — no action needed
    };

    return () => {
      es.close();
    };
  }, [enabled, onNewBooking]);
}
