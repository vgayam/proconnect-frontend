// =============================================================================
// CATEGORY BADGES COMPONENT
// =============================================================================
// Displays all service categories as clickable badges
// Used on home page to show available categories
// =============================================================================

"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import { useServiceCategories } from "@/hooks/useCategories";

export function CategoryBadges() {
  const { categories, isLoading } = useServiceCategories();

  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Categories</h4>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="h-8 w-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Categories</h4>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link key={category} href={`/professionals?category=${encodeURIComponent(category)}`}>
            <Badge 
              variant="outline" 
              className="hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 cursor-pointer transition-all text-sm py-1.5 px-3"
            >
              {category}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
