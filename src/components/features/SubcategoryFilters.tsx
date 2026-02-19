// =============================================================================
// SUBCATEGORY FILTERS COMPONENT
// =============================================================================
// Filter sidebar for search results - shows subcategories with counts
// =============================================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui";
import { useServiceCategories } from "@/hooks/useCategories";
import { Filter, X } from "lucide-react";

interface SubcategoryFiltersProps {
  /** Currently selected category to show subcategories for */
  selectedCategory?: string;
  /** Total count of professionals (for calculating percentages) */
  totalCount?: number;
}

export function SubcategoryFilters({ selectedCategory, totalCount = 0 }: SubcategoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { subcategoriesByCategory, categories } = useServiceCategories();
  
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    searchParams.get("subcategories")?.split(",").filter(Boolean) || []
  );
  const [categoryFilter, setCategoryFilter] = useState(
    selectedCategory || searchParams.get("category") || ""
  );

  // Get subcategories for the selected category
  const categoryData = subcategoriesByCategory.find(c => c.category === categoryFilter);
  const availableSubcategories = categoryData?.subcategories || [];

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    setSelectedSubcategories([]); // Reset subcategories when category changes
    updateURL(category, []);
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    const newSelection = selectedSubcategories.includes(subcategory)
      ? selectedSubcategories.filter(s => s !== subcategory)
      : [...selectedSubcategories, subcategory];
    
    setSelectedSubcategories(newSelection);
    updateURL(categoryFilter, newSelection);
  };

  const updateURL = (category: string, subcategories: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    
    if (subcategories.length > 0) {
      params.set("subcategories", subcategories.join(","));
    } else {
      params.delete("subcategories");
    }
    
    router.push(`/professionals?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setCategoryFilter("");
    setSelectedSubcategories([]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("subcategories");
    router.push(`/professionals?${params.toString()}`);
  };

  const hasFilters = categoryFilter || selectedSubcategories.length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Category
        </label>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <input
              type="radio"
              name="category"
              checked={!categoryFilter}
              onChange={() => handleCategoryChange("")}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="ml-3 text-sm text-gray-700">All Categories</span>
          </label>
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <input
                type="radio"
                name="category"
                checked={categoryFilter === category}
                onChange={() => handleCategoryChange(category)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Subcategory Filters - Only show if category is selected */}
      {categoryFilter && availableSubcategories.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Specializations
          </label>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {availableSubcategories.map((subcategory) => (
              <label
                key={subcategory}
                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedSubcategories.includes(subcategory)}
                  onChange={() => handleSubcategoryToggle(subcategory)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700 flex-1">{subcategory}</span>
                {/* TODO: Add count when available from backend */}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Selected Filters Display */}
      {hasFilters && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          <p className="text-xs font-medium text-gray-500 mb-3">ACTIVE FILTERS</p>
          <div className="flex flex-wrap gap-2">
            {categoryFilter && (
              <Badge variant="primary" className="flex items-center gap-1">
                {categoryFilter}
                <button
                  onClick={() => handleCategoryChange("")}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedSubcategories.map((sub) => (
              <Badge key={sub} variant="secondary" className="flex items-center gap-1">
                {sub}
                <button
                  onClick={() => handleSubcategoryToggle(sub)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      {!categoryFilter && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Select a category first to see specialization options
          </p>
        </div>
      )}
    </div>
  );
}
