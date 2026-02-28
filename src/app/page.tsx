// =============================================================================
// HOME PAGE
// =============================================================================
// Landing page with hero section, search, and featured professionals.
// =============================================================================

import Link from "next/link";
import { Button } from "@/components/ui";
import { ModernSearchBar } from "@/components/features";
import { Users, Shield, Zap, Search } from "lucide-react";

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
            <div className="flex items-center justify-center mt-6">
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

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ProConnect?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make it easy to find and connect with the right professionals for your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 mb-4">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Verified Professionals
              </h3>
              <p className="text-gray-600">
                Every professional is vetted for quality. View their work, reviews, and verified credentials.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 mb-4">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quick Connections
              </h3>
              <p className="text-gray-600">
                Contact professionals directly. No bidding, no middleman—just simple, direct communication.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 text-green-600 mb-4">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure & Trusted
              </h3>
              <p className="text-gray-600">
                Your information is safe. We facilitate connections without hidden fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Help?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have found the perfect professional for their needs.
          </p>
          <Link href="/professionals">
            <Button size="xl" className="bg-white text-primary-600 hover:bg-primary-50 shadow-sm">
              <Search className="h-5 w-5" />
              Find a Professional
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
