// =============================================================================
// PROFESSIONAL PROFILE PAGE
// =============================================================================
// Detailed view of a professional's profile with services and contact.
// =============================================================================

import { notFound } from "next/navigation";
import Image from "next/image";
import { getProfessionalById, getReviews, type ReviewResponse } from "@/lib/api";
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
  Navigation,
  Info,
  IndianRupee,
  MessageSquare,
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

  const reviews = await getReviews(id);

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
    serviceAreas,
    isVerified,
    isAvailable,
    rating,
    reviewCount,
    hourlyRate,
  } = professional;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-52 md:h-72 bg-gradient-to-r from-primary-600 to-secondary-600">
        {coverImageUrl && (
          <Image
            src={coverImageUrl}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <div className="relative -mt-16 md:-mt-20 mb-8">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0 -mt-20 md:-mt-24">
                <div className="rounded-2xl border-4 border-white shadow-xl overflow-hidden">
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
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {displayName}
                      </h1>
                      {isVerified && (
                        <span title="Verified Professional">
                          <CheckCircle className="h-6 w-6 text-primary-500 shrink-0" />
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-gray-500 mb-4">{headline}</p>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                        <span>{formatLocation(location)}</span>
                        {location.remote && (
                          <Badge variant="primary" size="sm" className="ml-1">
                            Remote
                          </Badge>
                        )}
                      </div>
                      {serviceAreas && serviceAreas.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Navigation className="h-4 w-4 text-gray-400 shrink-0" />
                          {serviceAreas.map((area) => (
                            <span
                              key={area}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      )}
                      {rating != null && (
                        <div className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 shrink-0" />
                          <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
                          {reviewCount != null && (
                            <span className="text-gray-400">({reviewCount} reviews)</span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                        {isAvailable ? (
                          <span className="text-green-600 font-medium">Available for work</span>
                        ) : (
                          <span className="text-gray-400">Currently unavailable</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col items-stretch md:items-end gap-2 shrink-0">
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
                {socialLinks?.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <SocialLinks links={socialLinks} size="md" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 pb-16">
          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            {bio && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-primary-500" />
                  <h2 className="text-xl font-semibold text-gray-900">About</h2>
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{bio}</p>
              </div>
            )}

            {/* Services Offered */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Briefcase className="h-5 w-5 text-primary-500" />
                <h2 className="text-xl font-semibold text-gray-900">Services Offered</h2>
              </div>

              {services && services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="group p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                          {service.title}
                        </h3>
                        {service.priceRange && (
                          <span className="flex items-center gap-0.5 text-primary-600 font-semibold whitespace-nowrap text-sm bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-full">
                            <IndianRupee className="h-3.5 w-3.5" />
                            {formatPriceRange(
                              service.priceRange.min,
                              service.priceRange.max,
                              service.priceRange.currency,
                              service.priceRange.unit
                            )}
                          </span>
                        )}
                      </div>
                      {service.description && (
                        <p className="text-gray-500 text-sm leading-relaxed mb-2">
                          {service.description}
                        </p>
                      )}
                      {service.duration && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Calendar className="h-3.5 w-3.5" />
                          Typical duration: {service.duration}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400 rounded-xl border-2 border-dashed border-gray-200">
                  <Briefcase className="h-10 w-10 mb-3 text-gray-300" />
                  <p className="text-sm font-medium">No services listed yet</p>
                  <p className="text-xs mt-1">Check back soon or reach out directly</p>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <MessageSquare className="h-5 w-5 text-primary-500" />
                <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
                {reviews.length > 0 && (
                  <span className="ml-auto text-sm text-gray-400">
                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </span>
                )}
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="font-semibold text-gray-900 text-sm">{review.customerName}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400 rounded-xl border-2 border-dashed border-gray-200">
                  <MessageSquare className="h-10 w-10 mb-3 text-gray-300" />
                  <p className="text-sm font-medium">No reviews yet</p>
                  <p className="text-xs mt-1">Be the first to leave a review after contacting</p>
                </div>
              )}
            </div>

          </div>

          {/* ── Right Column / Sidebar ── */}
          <div className="space-y-6">

            {/* Skills & Expertise */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
              {skills && skills.length > 0 ? (
                (() => {
                  const skillsByCategory = skills.reduce((acc, skill) => {
                    const cat = skill.category || 'Other';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(skill);
                    return acc;
                  }, {} as Record<string, typeof skills>);

                  return (
                    <div className="space-y-4">
                      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                        <div key={category}>
                          <Badge variant="primary" size="md" className="mb-2">
                            {category}
                          </Badge>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {categorySkills.map((skill) => (
                              <Badge key={skill.id} variant="default" size="md">
                                {skill.name}
                                {skill.yearsOfExperience != null && (
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
                })()
              ) : (
                <p className="text-sm text-gray-400">No skills listed.</p>
              )}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
