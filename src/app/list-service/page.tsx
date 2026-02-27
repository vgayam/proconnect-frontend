// =============================================================================
// LIST YOUR SERVICE PAGE
// =============================================================================
// Onboarding wizard for professionals to create/edit their profile.
// ?edit=true → pre-fills from API and submits via PUT instead of POST.
// =============================================================================

import { Suspense } from "react";
import { ListServiceFormWrapper } from "./ListServiceFormWrapper";

export const metadata = {
  title: "Join as a Professional — ProConnect",
  description: "Create your professional profile and start connecting with clients today.",
};

export default function ListServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white">
      {/* Top banner */}
      <div className="bg-primary-600 text-white text-center py-3 text-sm font-medium tracking-wide">
        🎉 Join thousands of professionals already on ProConnect — it&apos;s free to list
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold uppercase tracking-widest mb-4">
              Professional Onboarding
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Grow your business with ProConnect
            </h1>
            <p className="text-gray-500 text-base">
              Set up your profile in a few minutes and start getting discovered by clients near you.
            </p>
          </div>

          <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="h-8 w-8 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" /></div>}>
            <ListServiceFormWrapper />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
