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

export interface BroadcastJob {
  id: number;
  customerName: string;
  category: string;
  description: string;
  address?: string;
  lat?: number;
  lng?: number;
  status: string;
  expiresAt: string;
  createdAt: string;
}

/**
 * Opens an SSE connection to /api/professionals/me/bookings/stream
 * and calls onNewBooking / onNewJob whenever events arrive.
 * Automatically reconnects on disconnect (EventSource handles this natively).
 */
export function useBookingStream(
  enabled: boolean,
  onNewBooking: (booking: Booking) => void,
  onNewJob?: (job: BroadcastJob) => void
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

    // New: broadcast job events — only handled if caller passes onNewJob
    es.addEventListener('new-job', (e) => {
      if (!onNewJob) return;
      try {
        const job: BroadcastJob = JSON.parse(e.data);
        onNewJob(job);
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
  }, [enabled, onNewBooking, onNewJob]);
}
