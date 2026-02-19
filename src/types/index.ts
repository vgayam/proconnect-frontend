// =============================================================================
// PROFESSIONAL TYPES
// =============================================================================
// These types define the core data structures for the platform.
// When connecting to your backend, ensure your API responses match these types.
// =============================================================================

/**
 * Represents a professional's social media or web presence link
 */
export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  label?: string; // Optional custom label like "Personal Blog"
}

/**
 * Supported social platforms with icons
 */
export type SocialPlatform =
  | "linkedin"
  | "twitter"
  | "github"
  | "website"
  | "instagram"
  | "youtube"
  | "dribbble"
  | "behance"
  | "medium"
  | "email";

/**
 * A service offered by a professional
 */
export interface Service {
  id: string;
  title: string;
  description: string;
  priceRange?: PriceRange; // Optional pricing info
  duration?: string; // e.g., "1-2 hours", "1 week"
}

/**
 * Price range for a service
 */
export interface PriceRange {
  min: number;
  max?: number;
  currency: string; // e.g., "USD", "EUR"
  unit?: string; // e.g., "per hour", "per project"
}

/**
 * A skill with optional proficiency level
 */
export interface Skill {
  id: string;
  name: string;
  category?: string; // e.g., "Frontend", "Design", "Marketing"
  yearsOfExperience?: number;
}

/**
 * The main professional profile
 */
export interface Professional {
  id: string;
  // Basic Info
  firstName: string;
  lastName: string;
  displayName: string; // Computed or custom display name
  headline: string; // Short professional tagline
  bio: string; // Longer description
  avatarUrl?: string;
  coverImageUrl?: string;

  // Location
  location: {
    city?: string;
    state?: string;
    country: string;
    remote: boolean; // Available for remote work
  };

  // Contact Info
  email?: string;
  phone?: string;
  whatsapp?: string;

  // Professional Details
  skills: Skill[];
  services: Service[];
  socialLinks: SocialLink[];

  // Metadata
  isVerified: boolean;
  isAvailable: boolean; // Currently accepting new clients
  rating?: number; // 1-5 star rating
  reviewCount?: number;
  hourlyRate?: PriceRange;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// SEARCH & FILTER TYPES
// =============================================================================

/**
 * Search parameters for finding professionals
 */
export interface SearchParams {
  query?: string;
  category?: string; // Filter by main category
  skills?: string[];
  location?: string;
  remote?: boolean;
  available?: boolean;
  minRating?: number;
  priceMin?: number;
  priceMax?: number;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}

export type SortOption =
  | "relevance"
  | "rating"
  | "reviews"
  | "price_low"
  | "price_high"
  | "newest";

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// =============================================================================
// CONTACT & MESSAGING TYPES
// =============================================================================

/**
 * Contact form submission
 */
export interface ContactRequest {
  professionalId: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  serviceId?: string; // If inquiring about a specific service
}

/**
 * Response from contact submission
 */
export interface ContactResponse {
  success: boolean;
  message: string;
  referenceId?: string;
}
