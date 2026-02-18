// =============================================================================
// FOR PROFESSIONALS PAGE
// =============================================================================
// Landing page for professionals who want to list their services.
// =============================================================================

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { 
  CheckCircle, 
  Users, 
  DollarSign, 
  Shield, 
  ArrowRight,
  Briefcase,
  Star,
  MessageSquare
} from "lucide-react";

export default function ForProfessionalsPage() {
  const benefits = [
    {
      icon: Users,
      title: "Reach More Clients",
      description: "Get discovered by thousands of potential clients actively looking for your skills.",
    },
    {
      icon: DollarSign,
      title: "Set Your Own Rates",
      description: "You control your pricing. List hourly rates or project-based pricing.",
    },
    {
      icon: Shield,
      title: "Build Your Reputation",
      description: "Collect reviews and build a verified profile that stands out.",
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Clients contact you directly. No middleman, no complicated bidding.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Create Your Profile",
      description: "Add your skills, experience, and portfolio to showcase your expertise.",
    },
    {
      number: "2",
      title: "List Your Services",
      description: "Define the services you offer with pricing and availability.",
    },
    {
      number: "3",
      title: "Get Discovered",
      description: "Clients find you through search and reach out directly.",
    },
    {
      number: "4",
      title: "Grow Your Business",
      description: "Build relationships, collect reviews, and expand your client base.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
              <Briefcase className="h-4 w-4" />
              For Professionals
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              List Your Services & Grow Your Business
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join our network of professionals and connect with clients looking for exactly what you offer.
              No bidding wars. No complicated fees. Just direct connections.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/list-service">
                <Button size="xl" className="bg-white text-primary-600 hover:bg-gray-100">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/professionals">
                <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why List on ProConnect?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We help professionals like you find clients and grow their business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 mb-4">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. Create your profile and start connecting with clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white font-bold text-lg mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-primary-200 -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Professionals Welcome
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're a developer, designer, photographer, carpenter, or any other professional — we have clients looking for you.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Software Developers",
              "UI/UX Designers",
              "Photographers",
              "Graphic Designers",
              "Carpenters",
              "Electricians",
              "Plumbers",
              "Marketing Experts",
              "Legal Consultants",
              "Personal Trainers",
              "Tutors",
              "Event Planners",
              "Content Writers",
              "Video Producers",
              "And Many More...",
            ].map((category, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm font-medium mb-6">
            <Star className="h-4 w-4 fill-white" />
            Join 5,000+ Professionals
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Create your free profile today and start connecting with clients.
          </p>

          <Link href="/list-service">
            <Button size="xl" className="bg-white text-primary-600 hover:bg-gray-100">
              <CheckCircle className="h-5 w-5" />
              Create Free Profile
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
