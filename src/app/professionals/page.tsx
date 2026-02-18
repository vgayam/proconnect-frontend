// =============================================================================
// PROFESSIONALS LISTING PAGE
// =============================================================================
// Search and browse professionals with filters.
// =============================================================================

import { Suspense } from "react";
import { SearchBar, ProfessionalCard } from "@/components/features";
import { searchProfessionals } from "@/lib/data";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    skills?: string;
    available?: string;
  }>;
}

export default async function ProfessionalsPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  // Parse search params
  const query = resolvedParams.q || "";
  const skills = resolvedParams.skills?.split(",").filter(Boolean) || [];
  const available = resolvedParams.available === "true";

  // Search professionals (in production, this would be an API call)
  const professionals = searchProfessionals({
    query,
    skills,
    available: available || undefined,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Professionals
          </h1>
          <p className="text-gray-600 mb-6">
            Browse our network of verified professionals and find the perfect match for your project.
          </p>
          <Suspense fallback={<div className="h-12 bg-gray-100 rounded-lg animate-pulse" />}>
            <SearchBar showFilters />
          </Suspense>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {professionals.length === 0 ? (
              "No professionals found"
            ) : (
              <>
                Showing <span className="font-semibold">{professionals.length}</span>{" "}
                professional{professionals.length !== 1 ? "s" : ""}
                {query && (
                  <>
                    {" "}for &ldquo;<span className="font-semibold">{query}</span>&rdquo;
                  </>
                )}
              </>
            )}
          </p>

          {/* Sort dropdown - placeholder for future functionality */}
          <select
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            defaultValue="relevance"
          >
            <option value="relevance">Most Relevant</option>
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviews</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>

        {/* Results Grid */}
        {professionals.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {professionals.map((professional) => (
              <ProfessionalCard key={professional.id} professional={professional} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No professionals found
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Try adjusting your search terms or filters to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
