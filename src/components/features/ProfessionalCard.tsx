// =============================================================================
// PROFESSIONAL CARD COMPONENT
// =============================================================================
// Card displaying a professional's summary information.
// Used in search results and listings.
// =============================================================================

import { Professional } from "@/types";
import { cn, formatLocation, formatPriceRange } from "@/lib/utils";
import { Avatar, Badge, Card } from "@/components/ui";
import { MapPin, Star, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

export interface ProfessionalCardProps {
  professional: Professional;
  className?: string;
}

/**
 * Card component for displaying professional in listings
 *
 * @example
 * <ProfessionalCard professional={professionalData} />
 */
export function ProfessionalCard({ professional, className }: ProfessionalCardProps) {
  const {
    id,
    firstName,
    lastName,
    displayName,
    headline,
    avatarUrl,
    location,
    skills,
    isVerified,
    isAvailable,
    rating,
    reviewCount,
    hourlyRate,
  } = professional;

  return (
    <Link href={`/professionals/${id}`} className="block">
      <Card
        hoverable
        className={cn(
          "group transition-all duration-200",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <Avatar
              src={avatarUrl}
              firstName={firstName}
              lastName={lastName}
              size="xl"
              showStatus
              isOnline={isAvailable}
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {displayName}
                  </h3>
                  {isVerified && (
                    <CheckCircle className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">{headline}</p>
              </div>

              {/* Rating */}
              {rating && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{rating.toFixed(1)}</span>
                  {reviewCount && (
                    <span className="text-gray-400">({reviewCount})</span>
                  )}
                </div>
              )}
            </div>

            {/* Location & Availability */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{formatLocation(location)}</span>
              </div>
              {isAvailable ? (
                <div className="flex items-center gap-1 text-green-600">
                  <Clock className="h-4 w-4" />
                  <span>Available for work</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Unavailable</span>
                </div>
              )}
            </div>

            {/* Skills with Category */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {/* Show category badge first if available */}
              {skills.length > 0 && skills[0].category && (
                <Badge variant="primary" size="sm" className="font-semibold">
                  {skills[0].category}
                </Badge>
              )}
              {/* Then show individual skills */}
              {skills.slice(0, 4).map((skill) => (
                <Badge key={skill.id} variant="default" size="sm">
                  {skill.name}
                </Badge>
              ))}
              {skills.length > 4 && (
                <Badge variant="outline" size="sm">
                  +{skills.length - 4} more
                </Badge>
              )}
            </div>

            {/* Price */}
            {hourlyRate && (
              <div className="mt-3 text-sm">
                <span className="text-gray-500">From </span>
                <span className="font-semibold text-gray-900">
                  {formatPriceRange(hourlyRate.min, hourlyRate.max, hourlyRate.currency)}
                </span>
                <span className="text-gray-500">/hr</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
