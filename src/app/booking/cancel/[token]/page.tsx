"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";

export default function CancelBookingPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "confirm" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    // Validate token on load
    async function checkToken() {
      try {
        const res = await fetch(`/api/booking/cancel/${params.token}`);
        if (res.ok) {
          setStatus("confirm");
        } else {
          setStatus("error");
          setMessage("Invalid or expired cancellation link");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Failed to load cancellation page");
      }
    }
    checkToken();
  }, [params.token]);

  async function handleCancel() {
    setCancelling(true);
    try {
      const res = await fetch(`/api/booking/cancel/${params.token}`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Your booking has been cancelled successfully");
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to cancel booking");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Something went wrong. Please try again");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {status === "loading" && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {status === "confirm" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Cancel Booking?</h1>
              <p className="text-gray-600">
                Are you sure you want to cancel this booking? The professional will be notified.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/"
                className="flex-1 py-3 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition text-center"
              >
                Keep Booking
              </Link>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Cancelled</h1>
              <p className="text-gray-600">{message}</p>
            </div>
            <Link
              href="/"
              className="inline-block py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition"
            >
              Back to Home
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
              <p className="text-gray-600">{message}</p>
            </div>
            <Link
              href="/"
              className="inline-block py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
