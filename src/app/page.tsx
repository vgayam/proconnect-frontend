// =============================================================================
// HOME PAGE
// =============================================================================
// Landing page with hero section, search, and featured professionals.
// =============================================================================

import Link from "next/link";
import { ModernSearchBar } from "@/components/features";
import { PostJobButton } from "@/components/features/PostJobButton";
import { ClipboardList, MapPin, Zap, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section id="search" className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Headline */}
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Find the Perfect{" "}
                <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                  Professional
                </span>{" "}
                for Any Job
              </h1>
              <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
                Browse verified professionals, check reviews, and hire with confidence — all in one place.
              </p>
            </div>

            {/* Modern Search Bar */}
            <div className="max-w-4xl mx-auto">
              <ModernSearchBar />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <PostJobButton />
              <Link href="/list-service" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                Are you a professional? <span className="font-medium text-primary-600 underline underline-offset-2">List your services →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-200 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />
      </section>

      {/* How Post a Job Works Section */}
      <section className="py-16 lg:py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-100 rounded-full px-3 py-1 mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                New Feature
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Need it done fast? Post a Job
              </h2>
              <p className="text-lg text-gray-500 max-w-xl mx-auto">
                Don&apos;t have time to browse? Describe what you need and let nearby professionals come to you.
              </p>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center shadow">1</div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 mb-4 mt-2">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Describe the job</h3>
                <p className="text-sm text-gray-500">Tell us what you need — e.g. "Fix leaking kitchen pipe urgently"</p>
              </div>

              <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center shadow">2</div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 mb-4 mt-2">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Share your location</h3>
                <p className="text-sm text-gray-500">We use your location to find verified professionals within 5 km</p>
              </div>

              <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center shadow">3</div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-50 text-green-600 mb-4 mt-2">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">A pro accepts &amp; contacts you</h3>
                <p className="text-sm text-gray-500">The first available professional accepts the job. You get an email instantly.</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <PostJobButton />
              <p className="text-xs text-gray-400 mt-3">Free to post · No sign-up required · Typically responds in &lt; 10 min</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
