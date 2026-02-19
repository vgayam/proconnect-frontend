// =============================================================================
// PROFESSIONAL PROFILE PAGE
// =============================================================================
// Detailed view of a professional's profile with services and contact.
// =============================================================================

import { notFound } from "next/navigation";
import Image from "next/image";
import { getProfessionalById } from "@/lib/api";
import { formatLocation, formatPriceRange } from "@/lib/utils";
import { Avatar, Badge, Card, CardContent } from "@/components/ui";
import { SocialLinks } from "@/components/features";
import { ContactButton } from "./ContactButton";
import {
  MapPin,
  Star,
  Clock,
  CheckCircle,
  Calendar,
  Briefcase,
} from "lucide-react";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfessionalProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  
  let professional;
  try {
    professional = await getProfessionalById(id);
  } catch (error) {
    notFound();
  }

  if (!professional) {
    notFound();
  }

  const {
    firstName,
    lastName,
    displayName,
    headline,
    bio,
    avatarUrl,
    coverImageUrl,
    location,
    skills,
    services,
    socialLinks,
    isVerified,
    isAvailable,
    rating,
    reviewCount,
    hourlyRate,
  } = professional;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary-600 to-secondary-600">
        {coverImageUrl && (
          <Image
            src={coverImageUrl}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="relative -mt-16 md:-mt-20 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0 -mt-20 md:-mt-24">
                <div className="rounded-xl border-4 border-white shadow-lg overflow-hidden">
                  <Avatar
                    src={avatarUrl}
                    firstName={firstName}
                    lastName={lastName}
                    size="3xl"
                    showStatus
                    isOnline={isAvailable}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {displayName}
                      </h1>
                      {isVerified && (
                        <CheckCircle className="h-6 w-6 text-primary-500" />
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mb-3">{headline}</p>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {formatLocation(location)}
                        {location.remote && (
                          <Badge variant="primary" size="sm" className="ml-1">
                            Remote
                          </Badge>
                        )}
                      </div>
                      {rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-medium text-gray-900">
                            {rating.toFixed(1)}
                          </span>
                          {reviewCount && (
                            <span>({reviewCount} reviews)</span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {isAvailable ? (
                          <span className="text-green-600 font-medium">
                            Available for work
                          </span>
                        ) : (
                          <span className="text-gray-500">Currently unavailable</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col gap-3">
                    <ContactButton professional={professional} />
                    {hourlyRate && (
                      <div className="text-center text-sm text-gray-500">
                        From{" "}
                        <span className="font-semibold text-gray-900">
                          {formatPriceRange(
                            hourlyRate.min,
                            hourlyRate.max,
                            hourlyRate.currency
                          )}
                        </span>
                        /hr
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <SocialLinks links={socialLinks} size="md" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 pb-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-line">{bio}</p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary-500" />
                  Services Offered
                </div>
              </h2>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="p-4 rounded-lg border border-gray-200 hover:border-primary-200 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {service.title}
                        </h3>
                        {service.priceRange && (
                          <span className="text-primary-600 font-semibold whitespace-nowrap">
                            {formatPriceRange(
                              service.priceRange.min,
                              service.priceRange.max,
                              service.priceRange.currency,
                              service.priceRange.unit
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {service.description}
                      </p>
                      {service.duration && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          Typical duration: {service.duration}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Skills & Categories */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Skills & Expertise
              </h2>
              <CardContent>
                {/* Group skills by category */}
                {(() => {
                  const skillsByCategory = skills.reduce((acc, skill) => {
                    const category = skill.category || 'Other';
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(skill);
                    return acc;
                  }, {} as Record<string, typeof skills>);

                  return (
                    <div className="space-y-4">
                      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                        <div key={category}>
                          <Badge variant="primary" size="md" className="mb-2">
                            {category}
                          </Badge>
                          <div className="flex flex-wrap gap-2">
                            {categorySkills.map((skill) => (
                              <Badge key={skill.id} variant="default" size="md">
                                {skill.name}
                                {skill.yearsOfExperience && (
                                  <span className="text-gray-400 ml-1">
                                    · {skill.yearsOfExperience}y
                                  </span>
                                )}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Quick Contact Card */}
            <Card className="bg-primary-50 border-primary-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Interested? Contact to see details
              </h2>
              <ContactButton professional={professional} fullWidth />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
