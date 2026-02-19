// =============================================================================
// POPULAR CATEGORIES COMPONENT
// =============================================================================
// Client component that displays popular categories from the backend
// =============================================================================

"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import { usePopularCategories } from "@/hooks/useCategories";

// Map of category names to their URL paths
const CATEGORY_PATH_MAP: Record<string, string> = {
  "Plumbing": "plumbers",
  "Electrical Work": "electricians",
  "Photography": "photographers",
  "Carpentry": "carpenters",
  "Graphic Design": "designers",
  "HVAC": "professionals?category=HVAC",
  "Videography": "professionals?category=Videography",
  "Interior Design": "professionals?category=Interior+Design",
  "Painting": "professionals?category=Painting",
  "Landscaping": "professionals?category=Landscaping",
};

/**
 * Get the URL path for a category
 */
function getCategoryPath(category: string): string {
  // Check if we have a specific mapping
  if (CATEGORY_PATH_MAP[category]) {
    return `/${CATEGORY_PATH_MAP[category]}`;
  }
  // Default: use the category as a query parameter
  return `/professionals?category=${encodeURIComponent(category)}`;
}

export function PopularCategories() {
  const { popularCategories, isLoading } = usePopularCategories(6);

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-2">
        <span className="text-sm text-gray-500 font-medium">Popular Categories:</span>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-7 w-24 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <span className="text-sm text-gray-500 font-medium">Popular Categories:</span>
      {popularCategories.map((category) => (
        <Link key={category} href={getCategoryPath(category)}>
          <Badge 
            variant="outline" 
            className="hover:bg-primary-50 hover:border-primary-300 cursor-pointer transition-colors"
          >
            {category}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
