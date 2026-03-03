"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface ShareButtonProps {
  name: string;
  headline?: string;
}

export function ShareButton({ name, headline }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    const shareData = {
      title: `${name} on ProConnect`,
      text: headline
        ? `${name} — ${headline}`
        : `Check out ${name}'s professional profile on ProConnect`,
      url,
    };

    // Native Web Share API — opens WhatsApp, SMS, email, etc. on mobile
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled — do nothing
      }
      return;
    }

    // Desktop fallback: copy URL to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      title="Share profile"
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-sm font-medium transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          {'share' in navigator ? (
            <Share2 className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          Share
        </>
      )}
    </button>
  );
}
