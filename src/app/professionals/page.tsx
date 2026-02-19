// =============================================================================
// PROFESSIONALS LISTING PAGE
// =============================================================================
// Search and browse professionals with filters.
// =============================================================================

import { Suspense } from "react";
import { ModernSearchBar, ProfessionalCard } from "@/components/features";
import { getProfessionals } from "@/lib/api";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    subcategories?: string;
    skills?: string;
    available?: string;
  }>;
}

export default async function ProfessionalsPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  // Parse search params
  const query = resolvedParams.q || "";
  const category = resolvedParams.category || "";
  const subcategories = resolvedParams.subcategories?.split(",").filter(Boolean) || [];
  const skills = resolvedParams.skills?.split(",").filter(Boolean) || [];
  const available = resolvedParams.available === "true";

  // Fetch professionals from API
  const professionals = await getProfessionals({
    query: query || undefined,
    category: category || undefined,
    skills: [...skills, ...subcategories].length > 0 ? [...skills, ...subcategories] : undefined,
    available: available || undefined,
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
          <p className="text-gray-600">
            {professionals.length === 0 ? (
              "No professionals found"
            ) : (
              <>
                Showing <span className="font-semibold">{professionals.length}</span>{" "}
                professional{professionals.length !== 1 ? "s" : ""}
                {category && <> in <span className="font-semibold text-primary-600">{category}</span></>}
                {query && <> for &ldquo;<span className="font-semibold">{query}</span>&rdquo;</>}
              </>
            )}
          </p>
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

