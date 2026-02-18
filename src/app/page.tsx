// =============================================================================
// HOME PAGE
// =============================================================================
// Landing page with hero section, search, and featured professionals.
// =============================================================================

import { Suspense } from "react";
import Link from "next/link";
import { Button, Badge } from "@/components/ui";
import { SearchBar, ProfessionalCard } from "@/components/features";
import { MOCK_PROFESSIONALS, POPULAR_SKILLS } from "@/lib/data";
import { ArrowRight, Users, Shield, Zap, Star } from "lucide-react";

export default function HomePage() {
  // Get top-rated professionals for the featured section
  const featuredProfessionals = MOCK_PROFESSIONALS.filter((p) => p.isAvailable)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find the Perfect{" "}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Professional
              </span>{" "}
              for Any Job
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with plumbers, electricians, photographers, designers, carpenters, and more.
              Browse profiles, check reviews, and reach out directly.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <Suspense fallback={
                <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              }>
                <SearchBar placeholder="Search by skill, name, or service..." />
              </Suspense>
            </div>

            {/* Popular Skills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="text-sm text-gray-500">Popular:</span>
              {[
                { id: "p1", name: "Plumbing" },
                { id: "p2", name: "Electrical Work" },
                { id: "p3", name: "Photography" },
                { id: "p4", name: "Carpentry" },
                { id: "p5", name: "Graphic Design" },
                { id: "p6", name: "Home Repair" },
              ].map((skill) => (
                <Link key={skill.id} href={`/professionals?skills=${skill.name}`}>
                  <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
                    {skill.name}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/professionals">
                <Button size="xl">
                  Browse Professionals
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/list-service">
                <Button variant="outline" size="xl">
                  List Your Services
                </Button>
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
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary-100 text-secondary-600 mb-4">
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

      {/* Featured Professionals Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Professionals
              </h2>
              <p className="text-lg text-gray-600">
                Top-rated professionals ready to help with your needs.
              </p>
            </div>
            <Link href="/professionals">
              <Button variant="outline">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProfessionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/professionals">
              <Button size="xl" variant="secondary">
                Find Professionals
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/list-service">
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10">
                List Your Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                5,000+
              </div>
              <div className="text-gray-600">Professionals</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                10,000+
              </div>
              <div className="text-gray-600">Connections Made</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                4.8
              </div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                50+
              </div>
              <div className="text-gray-600">Skill Categories</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
