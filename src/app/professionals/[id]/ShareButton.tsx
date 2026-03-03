"use client";

import { useState, useEffect } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface ShareButtonProps {
  name: string;
  headline?: string;
  url: string; // canonical URL passed from server — never rely on window.location
}

export function ShareButton({ name, headline, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  // Detect Web Share API support after mount (navigator is undefined on server)
  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  async function handleShare() {
    const shareData = {
      title: `${name} on ProConnect`,
      text: headline
        ? `${name} — ${headline}`
        : `Check out ${name}'s professional profile on ProConnect`,
      url,
    };

    // Native Web Share API — opens WhatsApp, SMS, email, etc. on mobile
    if (canShare) {
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
      title={canShare ? "Share profile" : "Copy profile link"}
      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          {canShare ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {canShare ? "Share" : "Copy link"}
        </>
      )}
    </button>
  );
}
