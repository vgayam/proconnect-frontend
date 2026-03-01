// =============================================================================
// PROFESSIONALS LISTING PAGE
// =============================================================================
// Search and browse professionals with filters.
// =============================================================================

import { Suspense } from "react";
import { ModernSearchBar, ProfessionalCard } from "@/components/features";
import { getProfessionals } from "@/lib/api";
import SortSelect from "./SortSelect";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
    subcategories?: string;
    skills?: string;
    sort?: string;
  }>;
}

export default async function ProfessionalsPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const category = resolvedParams.category || "";
  const location = resolvedParams.location || "";
  const subcategories = resolvedParams.subcategories?.split(",").filter(Boolean) || [];
  const skills = resolvedParams.skills?.split(",").filter(Boolean) || [];
  const sort = resolvedParams.sort || "relevance";

  // Fetch professionals — backend defaults available=true, so unavailable are always excluded
  let professionals = await getProfessionals({
    query: query || undefined,
    category: category || undefined,
    location: location || undefined,
    skills: [...skills, ...subcategories].length > 0 ? [...skills, ...subcategories] : undefined,
  });

  // Apply sort
  professionals = [...professionals].sort((a, b) => {
    switch (sort) {
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0);
      case "reviews":
        return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      case "price_low":
        return (a.hourlyRate?.min ?? 0) - (b.hourlyRate?.min ?? 0);
      case "price_high":
        return (b.hourlyRate?.min ?? 0) - (a.hourlyRate?.min ?? 0);
      default:
        return 0; // keep server order for "relevance"
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Professionals</h1>
          <p className="text-gray-600 mb-6">
            Browse our network of verified professionals.
          </p>
          <Suspense fallback={<div className="h-14 bg-gray-100 rounded-xl animate-pulse" />}>
            <ModernSearchBar />
          </Suspense>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-gray-600">
              {professionals.length === 0 ? (
                "No professionals found"
              ) : (
                <>
                  Showing <span className="font-semibold">{professionals.length}</span>{" "}
                  professional{professionals.length !== 1 ? "s" : ""}
                  {category && <> in <span className="font-semibold text-primary-600">{category}</span></>}
                  {location && <> near <span className="font-semibold text-primary-600">{location}</span></>}
                  {query && <> for &ldquo;<span className="font-semibold">{query}</span>&rdquo;</>}
                </>
              )}
            </p>
          </div>
          <Suspense fallback={<div className="w-40 h-9 bg-gray-100 rounded-lg animate-pulse" />}>
            <SortSelect />
          </Suspense>
        </div>

        {/* Results Grid */}
        {professionals.length > 0 ? (
          <div className="space-y-6">
            {professionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No professionals found</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Try adjusting your search terms or selecting a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

