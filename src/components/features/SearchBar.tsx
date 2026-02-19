// =============================================================================
// SEARCH BAR COMPONENT
// =============================================================================
// Main search component with filters for finding professionals.
// =============================================================================

"use client";

import { useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Button, Badge } from "@/components/ui";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePopularSkills } from "@/hooks/useCategories";
import { debounce } from "@/lib/utils";

export interface SearchBarProps {
  /** Show expanded filters */
  showFilters?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Additional class name */
  className?: string;
}

/**
 * Search bar component with filters
 *
 * @example
 * <SearchBar showFilters placeholder="Search by name or skill..." />
 */
export function SearchBar({
  showFilters = false,
  placeholder = "Search professionals by name, skill, or service...",
  className,
}: SearchBarProps) {
  return (
    <Suspense fallback={<div className="h-12 bg-gray-100 rounded-lg animate-pulse" />}>
      <SearchBarInner showFilters={showFilters} placeholder={placeholder} className={className} />
    </Suspense>
  );
}

function SearchBarInner({
  showFilters = false,
  placeholder = "Search professionals by name, skill, or service...",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    searchParams.get("skills")?.split(",").filter(Boolean) || []
  );
  const [showFilterPanel, setShowFilterPanel] = useState(showFilters);
  const [availableOnly, setAvailableOnly] = useState(searchParams.get("available") === "true");
  
  // Fetch popular subcategories from backend
  const { popularSubcategories } = usePopularSkills(20);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((searchQuery: string, skills: string[], available: boolean) => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (skills.length > 0) params.set("skills", skills.join(","));
      if (available) params.set("available", "true");

      router.push(`/professionals?${params.toString()}`);
    }, 300),
    [router]
  );

  const handleSearch = (value: string) => {
    setQuery(value);
    debouncedSearch(value, selectedSkills, availableOnly);
  };

  const toggleSkill = (skillName: string) => {
    const newSkills = selectedSkills.includes(skillName)
      ? selectedSkills.filter((s) => s !== skillName)
      : [...selectedSkills, skillName];
    setSelectedSkills(newSkills);
    debouncedSearch(query, newSkills, availableOnly);
  };

  const removeSkill = (skillName: string) => {
    const newSkills = selectedSkills.filter((s) => s !== skillName);
    setSelectedSkills(newSkills);
    debouncedSearch(query, newSkills, availableOnly);
  };

  const clearAll = () => {
    setQuery("");
    setSelectedSkills([]);
    setAvailableOnly(false);
    router.push("/professionals");
  };

  const hasFilters = query || selectedSkills.length > 0 || availableOnly;

  return (
    <div className={className}>
      {/* Main Search Input */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            leftIcon={<Search className="h-5 w-5" />}
            fullWidth
            className="h-12"
          />
        </div>
        <Button
          variant={showFilterPanel ? "primary" : "outline"}
          size="lg"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className="px-4"
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>

      {/* Selected Filters Display */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-sm text-gray-500">Active filters:</span>
          {selectedSkills.map((skill) => (
            <Badge
              key={skill}
              variant="primary"
              removable
              onRemove={() => removeSkill(skill)}
            >
              {skill}
            </Badge>
          ))}
          {availableOnly && (
            <Badge variant="success" removable onRemove={() => {
              setAvailableOnly(false);
              debouncedSearch(query, selectedSkills, false);
            }}>
              Available Now
            </Badge>
          )}
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-slide-down">
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => {
                  setAvailableOnly(e.target.checked);
                  debouncedSearch(query, selectedSkills, e.target.checked);
                }}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Currently Available</span>
            </label>
          </div>

          {/* Popular Skills */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Specializations</h4>
            <div className="flex flex-wrap gap-2">
              {popularSubcategories.map((subcategory) => (
                <Badge
                  key={subcategory.id}
                  variant={selectedSkills.includes(subcategory.name) ? "primary" : "outline"}
                  onClick={() => toggleSkill(subcategory.name)}
                  className="cursor-pointer"
                >
                  {subcategory.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
