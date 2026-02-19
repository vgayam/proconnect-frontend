// =============================================================================
// MOCK DATA FOR DEVELOPMENT
// =============================================================================
// This file contains mock data to develop and test the UI without a backend.
// Replace these with actual API calls when connecting to your backend.
// =============================================================================

import { Professional, Skill } from "@/types";

/**
 * Available skill categories for filtering
 */
export const SKILL_CATEGORIES = [
  // Local & Physical Services
  "Plumbing",
  "Electrical Work",
  "Carpentry",
  "HVAC",
  "Painting",
  "Landscaping",
  "Cleaning Services",
  "Pest Control",
  // Creative Services
  "Photography",
  "Videography",
  "Graphic Design",
  "Interior Design",
  // Personal Services
  "Personal Training",
  "Tutoring",
  "Music Lessons",
  "Pet Care",
  // Professional Services
  "Legal Services",
  "Accounting",
  "Real Estate",
  "Event Planning",
  "Catering",
] as const;

/**
 * Popular skills for quick filtering
 */
export const POPULAR_SKILLS: Skill[] = [
  // Local & Physical Services
  { id: "1", name: "Pipe Repair", category: "Plumbing" },
  { id: "2", name: "Drain Cleaning", category: "Plumbing" },
  { id: "3", name: "Electrical Installation", category: "Electrical Work" },
  { id: "4", name: "Wiring & Rewiring", category: "Electrical Work" },
  { id: "5", name: "Woodworking", category: "Carpentry" },
  { id: "6", name: "Furniture Assembly", category: "Carpentry" },
  { id: "7", name: "AC Repair", category: "HVAC" },
  { id: "8", name: "Interior Painting", category: "Painting" },
  { id: "9", name: "Lawn Maintenance", category: "Landscaping" },
  { id: "10", name: "House Cleaning", category: "Cleaning Services" },
  // Creative Services
  { id: "11", name: "Portrait Photography", category: "Photography" },
  { id: "12", name: "Wedding Photography", category: "Photography" },
  { id: "13", name: "Logo Design", category: "Graphic Design" },
  { id: "14", name: "Branding", category: "Graphic Design" },
  { id: "15", name: "Video Editing", category: "Videography" },
  // Personal Services
  { id: "16", name: "Personal Training", category: "Personal Training" },
  { id: "17", name: "Math Tutoring", category: "Tutoring" },
  { id: "18", name: "Piano Lessons", category: "Music Lessons" },
  { id: "19", name: "Dog Walking", category: "Pet Care" },
  // Professional Services
  { id: "20", name: "Legal Consultation", category: "Legal Services" },
  { id: "21", name: "Tax Preparation", category: "Accounting" },
  { id: "22", name: "Event Coordination", category: "Event Planning" },
];

/**
 * Mock professionals data
 * In production, this would come from your API
 */
export const MOCK_PROFESSIONALS: Professional[] = [
  // Add generic professionals
  {
    id: "101",
    firstName: "Alex",
    lastName: "Smith",
    displayName: "Alex Smith",
    headline: "Professional Photographer | Portraits & Events",
    bio: "Experienced photographer specializing in portraits, weddings, and events. Capturing moments that matter.",
    avatarUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop&crop=face",
    coverImageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f1a09?w=1200&h=400&fit=crop",
    location: {
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      remote: false,
    },
    skills: [
      { id: "13", name: "Portrait Photography", category: "Photography", yearsOfExperience: 10 },
      { id: "14", name: "Wedding Photography", category: "Photography", yearsOfExperience: 8 },
    ],
    services: [
      {
        id: "s101",
        title: "Portrait Session",
        description: "Professional portrait photography for individuals and families.",
        priceRange: { min: 200, max: 500, currency: "USD", unit: "per session" },
        duration: "1-2 hours",
      },
      {
        id: "s102",
        title: "Event Photography",
        description: "Coverage for weddings, parties, and corporate events.",
        priceRange: { min: 1000, max: 3000, currency: "USD", unit: "per event" },
        duration: "4-8 hours",
      },
    ],
    socialLinks: [
      { id: "l101", platform: "instagram", url: "https://instagram.com/alexsmithphoto" },
      { id: "l102", platform: "website", url: "https://alexsmithphoto.com" },
    ],
    isVerified: true,
    isAvailable: true,
    rating: 4.7,
    reviewCount: 34,
    hourlyRate: { min: 100, max: 200, currency: "USD" },
    createdAt: "2022-05-10T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "102",
    firstName: "Priya",
    lastName: "Kumar",
    displayName: "Priya Kumar",
    headline: "Graphic Designer | Branding & Logo Specialist",
    bio: "Creative graphic designer with expertise in branding, logo design, and visual storytelling.",
    avatarUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&crop=face",
    coverImageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&h=400&fit=crop",
    location: {
      city: "Chicago",
      state: "IL",
      country: "USA",
      remote: true,
    },
    skills: [
      { id: "15", name: "Logo Design", category: "Graphic Design", yearsOfExperience: 6 },
      { id: "16", name: "Branding", category: "Graphic Design", yearsOfExperience: 7 },
    ],
    services: [
      {
        id: "s201",
        title: "Logo Design Package",
        description: "Custom logo design for businesses and startups.",
        priceRange: { min: 500, max: 1500, currency: "USD", unit: "per project" },
        duration: "2-4 weeks",
      },
      {
        id: "s202",
        title: "Brand Identity Creation",
        description: "Complete branding solutions including logo, color palette, and typography.",
        priceRange: { min: 2000, max: 5000, currency: "USD", unit: "per project" },
        duration: "4-8 weeks",
      },
    ],
    socialLinks: [
      { id: "l201", platform: "behance", url: "https://behance.net/priyakumar" },
      { id: "l202", platform: "website", url: "https://priyakumar.design" },
    ],
    isVerified: true,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 41,
    hourlyRate: { min: 80, max: 120, currency: "USD" },
    createdAt: "2021-11-22T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "103",
    firstName: "Miguel",
    lastName: "Lopez",
    displayName: "Miguel Lopez",
    headline: "Carpenter | Custom Woodworking & Repairs",
    bio: "Skilled carpenter offering custom furniture, cabinetry, and home repairs.",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
    coverImageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=400&fit=crop",
    location: {
      city: "Austin",
      state: "TX",
      country: "USA",
      remote: false,
    },
    skills: [
      { id: "17", name: "Woodworking", category: "Carpentry", yearsOfExperience: 12 },
    ],
    services: [
      {
        id: "s301",
        title: "Custom Furniture",
        description: "Design and build custom furniture pieces for your home or office.",
        priceRange: { min: 1500, max: 5000, currency: "USD", unit: "per project" },
        duration: "2-6 weeks",
      },
      {
        id: "s302",
        title: "Home Repairs",
        description: "General carpentry repairs and maintenance.",
        priceRange: { min: 100, max: 500, currency: "USD", unit: "per hour" },
        duration: "1-8 hours",
      },
    ],
    socialLinks: [
      { id: "l301", platform: "website", url: "https://miguelcarpentry.com" },
    ],
    isVerified: true,
    isAvailable: true,
    rating: 4.6,
    reviewCount: 19,
    hourlyRate: { min: 50, max: 100, currency: "USD" },
    createdAt: "2020-03-18T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
  {
    id: "104",
    firstName: "Jennifer",
    lastName: "Park",
    displayName: "Jennifer Park",
    headline: "Licensed Electrician | Residential & Commercial",
    bio: "Certified electrician with 12 years of experience in residential and commercial electrical work. Safety and quality are my top priorities.",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    coverImageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=400&fit=crop",
    location: {
      city: "Seattle",
      state: "WA",
      country: "USA",
      remote: false,
    },
    skills: [
      { id: "3", name: "Electrical Installation", category: "Electrical Work", yearsOfExperience: 12 },
      { id: "4", name: "Wiring & Rewiring", category: "Electrical Work", yearsOfExperience: 12 },
    ],
    services: [
      {
        id: "s401",
        title: "Electrical Installation",
        description: "Install new electrical systems, outlets, and lighting fixtures.",
        priceRange: { min: 90, max: 150, currency: "USD", unit: "per hour" },
        duration: "Varies",
      },
      {
        id: "s402",
        title: "Electrical Inspection",
        description: "Complete home electrical safety inspection.",
        priceRange: { min: 200, max: 400, currency: "USD", unit: "per project" },
        duration: "2-4 hours",
      },
    ],
    socialLinks: [
      { id: "l401", platform: "website", url: "https://jparkelectric.com" },
    ],
    isVerified: true,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 87,
    hourlyRate: { min: 90, max: 150, currency: "USD" },
    createdAt: "2019-08-10T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "105",
    firstName: "Robert",
    lastName: "Thompson",
    displayName: "Robert Thompson",
    headline: "Master Plumber | 25+ Years Experience",
    bio: "Experienced plumber offering comprehensive plumbing services from repairs to complete installations.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    coverImageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&h=400&fit=crop",
    location: {
      city: "Phoenix",
      state: "AZ",
      country: "USA",
      remote: false,
    },
    skills: [
      { id: "1", name: "Pipe Repair", category: "Plumbing", yearsOfExperience: 25 },
      { id: "2", name: "Drain Cleaning", category: "Plumbing", yearsOfExperience: 25 },
    ],
    services: [
      {
        id: "s501",
        title: "Emergency Plumbing",
        description: "24/7 emergency plumbing repairs and services.",
        priceRange: { min: 120, max: 180, currency: "USD", unit: "per hour" },
        duration: "Immediate",
      },
      {
        id: "s502",
        title: "Drain Cleaning",
        description: "Professional drain cleaning and unclogging services.",
        priceRange: { min: 150, max: 300, currency: "USD", unit: "per project" },
        duration: "1-3 hours",
      },
    ],
    socialLinks: [
      { id: "l501", platform: "website", url: "https://thompsonplumbing.com" },
    ],
    isVerified: true,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 234,
    hourlyRate: { min: 85, max: 130, currency: "USD" },
    createdAt: "2017-02-14T00:00:00Z",
    updatedAt: "2024-01-28T00:00:00Z",
  },
  {
    id: "106",
    firstName: "David",
    lastName: "Martinez",
    displayName: "David Martinez",
    headline: "HVAC Specialist | AC & Heating Expert",
    bio: "Expert in heating, ventilation, and air conditioning. Keeping your home comfortable year-round.",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    coverImageUrl: "https://images.unsplash.com/photo-1632236556854-c6ddcf40acaa?w=1200&h=400&fit=crop",
    location: {
      city: "Dallas",
      state: "TX",
      country: "USA",
      remote: false,
    },
    skills: [
      { id: "7", name: "AC Repair", category: "HVAC", yearsOfExperience: 15 },
    ],
    services: [
      {
        id: "s601",
        title: "AC Repair & Maintenance",
        description: "Complete AC system repair and seasonal maintenance.",
        priceRange: { min: 95, max: 150, currency: "USD", unit: "per hour" },
        duration: "Varies",
      },
      {
        id: "s602",
        title: "HVAC Installation",
        description: "New HVAC system installation for residential homes.",
        priceRange: { min: 5000, max: 15000, currency: "USD", unit: "per project" },
        duration: "1-3 days",
      },
    ],
    socialLinks: [
      { id: "l601", platform: "website", url: "https://martinezhvac.com" },
    ],
    isVerified: true,
    isAvailable: true,
    rating: 4.7,
    reviewCount: 145,
    hourlyRate: { min: 95, max: 150, currency: "USD" },
    createdAt: "2018-11-08T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "107",
    firstName: "Lisa",
    lastName: "Chen",
    displayName: "Lisa Chen",
    headline: "Certified Personal Trainer | Fitness & Nutrition Coach",
    bio: "Helping clients achieve their fitness goals through personalized workout plans and nutrition guidance.",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    coverImageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=400&fit=crop",
    location: {
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      remote: false,
    },
    skills: [
      { id: "16", name: "Personal Training", category: "Personal Training", yearsOfExperience: 8 },
    ],
    services: [
      {
        id: "s701",
        title: "Personal Training Session",
        description: "One-on-one fitness coaching and workout guidance.",
        priceRange: { min: 70, max: 120, currency: "USD", unit: "per hour" },
        duration: "1 hour",
      },
      {
        id: "s702",
        title: "Nutrition Consultation",
        description: "Personalized meal planning and nutrition advice.",
        priceRange: { min: 100, max: 150, currency: "USD", unit: "per session" },
        duration: "1 hour",
      },
    ],
    socialLinks: [
      { id: "l701", platform: "instagram", url: "https://instagram.com/lisachenfit" },
    ],
    isVerified: true,
    isAvailable: true,
    rating: 5.0,
    reviewCount: 178,
    hourlyRate: { min: 70, max: 120, currency: "USD" },
    createdAt: "2020-06-01T00:00:00Z",
    updatedAt: "2024-02-03T00:00:00Z",
  },
  {
    id: "108",
    firstName: "Michael",
    lastName: "Brown",
    displayName: "Michael Brown",
    headline: "Interior Painter | Residential & Commercial",
    bio: "Professional painter with an eye for detail. Transforming spaces with quality painting services.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    coverImageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&h=400&fit=crop",
    location: {
      city: "Denver",
      state: "CO",
      country: "USA",
      remote: false,
    },
    skills: [
      { id: "8", name: "Interior Painting", category: "Painting", yearsOfExperience: 10 },
    ],
    services: [
      {
        id: "s801",
        title: "Interior Painting",
        description: "Professional interior painting for homes and offices.",
        priceRange: { min: 45, max: 75, currency: "USD", unit: "per hour" },
        duration: "Varies",
      },
      {
        id: "s802",
        title: "Complete Room Painting",
        description: "Complete painting service for any room in your home.",
        priceRange: { min: 500, max: 2000, currency: "USD", unit: "per project" },
        duration: "1-3 days",
      },
    ],
    socialLinks: [
      { id: "l801", platform: "website", url: "https://brownpainting.com" },
    ],
    isVerified: true,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 112,
    hourlyRate: { min: 45, max: 75, currency: "USD" },
    createdAt: "2019-04-20T00:00:00Z",
    updatedAt: "2024-01-22T00:00:00Z",
  },
  {
    id: "109",
    firstName: "Sarah",
    lastName: "Johnson",
    displayName: "Sarah Johnson",
    headline: "Math Tutor | K-12 & College Level",
    bio: "Experienced educator helping students excel in mathematics through personalized tutoring.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    coverImageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=400&fit=crop",
    location: {
      city: "Boston",
      state: "MA",
      country: "USA",
      remote: true,
    },
    skills: [
      { id: "17", name: "Math Tutoring", category: "Tutoring", yearsOfExperience: 12 },
    ],
    services: [
      {
        id: "s901",
        title: "Math Tutoring Session",
        description: "One-on-one math tutoring for all levels.",
        priceRange: { min: 50, max: 90, currency: "USD", unit: "per hour" },
        duration: "1 hour",
      },
      {
        id: "s902",
        title: "Test Prep Coaching",
        description: "Specialized SAT/ACT math preparation.",
        priceRange: { min: 75, max: 120, currency: "USD", unit: "per hour" },
        duration: "1 hour",
      },
    ],
    socialLinks: [
      { id: "l901", platform: "linkedin", url: "https://linkedin.com/in/sarahjohnson" },
    ],
    isVerified: true,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 95,
    hourlyRate: { min: 50, max: 90, currency: "USD" },
    createdAt: "2018-09-12T00:00:00Z",
    updatedAt: "2024-01-30T00:00:00Z",
  },
];

/**
 * Get a professional by ID
 * Mock version - use API version from api.ts for real backend
 */
export function getProfessionalById(id: string): Professional | undefined {
  return MOCK_PROFESSIONALS.find((p) => p.id === id);
}

/**
 * Search professionals by query and filters
 * Mock version - use API version from api.ts for real backend
 */
export function searchProfessionals(params: {
  query?: string;
  skills?: string[];
  available?: boolean;
}): Professional[] {
  let results = [...MOCK_PROFESSIONALS];

  // Filter by search query (name, headline, skills)
  if (params.query) {
    const q = params.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.displayName.toLowerCase().includes(q) ||
        p.headline.toLowerCase().includes(q) ||
        p.skills.some((s) => s.name.toLowerCase().includes(q))
    );
  }

  // Filter by specific skills
  if (params.skills && params.skills.length > 0) {
    results = results.filter((p) =>
      params.skills!.some((skill) =>
        p.skills.some((s) => s.name.toLowerCase() === skill.toLowerCase())
      )
    );
  }

  // Filter by availability
  if (params.available !== undefined) {
    results = results.filter((p) => p.isAvailable === params.available);
  }

  return results;
}

// =============================================================================
// API INTEGRATION
// =============================================================================
// To switch from mock data to real API:
// 1. Import functions from './api' instead of using the functions above
// 2. Update pages to use async/await with the API functions
// 3. Handle loading and error states
//
// Example:
// import { getProfessionals } from './api';
// const professionals = await getProfessionals({ query: 'plumber' });
// =============================================================================
