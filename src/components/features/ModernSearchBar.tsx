// =============================================================================
// MODERN SEARCH BAR COMPONENT
// =============================================================================
// Clean search with integrated category dropdown
// =============================================================================

"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, ChevronDown, X } from "lucide-react";
import { useServiceCategories } from "@/hooks/useCategories";

function ModernSearchBarInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, isLoading: isCategoriesLoading } = useServiceCategories();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect location only if not already set from URL
  useEffect(() => {
    if (location) return; // already have location from URL, skip detection
    setIsLoadingLocation(true);
    if (!("geolocation" in navigator)) {
      setIsLoadingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "";
          const state = data.address?.state || "";
          if (city) setLocation(state ? `${city}, ${state}` : city);
        } catch {
          // silent fail
        } finally {
          setIsLoadingLocation(false);
        }
      },
      () => setIsLoadingLocation(false),
      { timeout: 5000 }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus location input when editing
  useEffect(() => {
    if (isEditingLocation) locationInputRef.current?.focus();
  }, [isEditingLocation]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navigate = (category: string, q: string) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q.trim()) params.set("q", q.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/professionals?${params.toString()}`);
  };

  const handleSearch = () => navigate(selectedCategory, query);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setShowCategoryDropdown(false);
    navigate(cat, query);
  };

  return (
    <div className="w-full">
      {/* Location line — clickable to edit */}
      <div className="flex items-center gap-1.5 mb-2 text-sm">
        <MapPin className={`h-4 w-4 flex-shrink-0 ${isLoadingLocation ? "text-primary-500 animate-pulse" : "text-gray-400"}`} />
        {isEditingLocation ? (
          <div className="flex items-center gap-1">
            <input
              ref={locationInputRef}
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") setIsEditingLocation(false);
              }}
              onBlur={() => setIsEditingLocation(false)}
              placeholder="Enter your city..."
              className="text-sm border-b border-primary-400 focus:outline-none text-gray-800 w-48 bg-transparent"
            />
            <button onClick={() => { setLocation(""); setIsEditingLocation(false); }}>
              <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditingLocation(true)}
            className="text-gray-500 hover:text-primary-600 transition-colors"
            title="Click to change location"
          >
            Serving to{" "}
            <span className="font-semibold text-gray-800 underline decoration-dashed underline-offset-2">
              {isLoadingLocation ? "Detecting..." : location || "your location"}
            </span>
            <span className="text-xs text-gray-400 ml-1">(change)</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex h-14 w-full rounded-xl overflow-visible border border-gray-300 shadow-md bg-white">

        {/* Category Dropdown */}
        <div ref={dropdownRef} className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowCategoryDropdown((v) => !v)}
            className="flex items-center gap-2 h-full px-4 bg-gray-50 border-r border-gray-300 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 rounded-l-xl min-w-[160px]"
          >
            <span className="truncate flex-1 text-left">
              {isCategoriesLoading ? "Loading..." : selectedCategory || "All Categories"}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${showCategoryDropdown ? "rotate-180" : ""}`} />
          </button>

          {showCategoryDropdown && (
            <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-56 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
              <button
                onClick={() => handleCategorySelect("")}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedCategory === "" ? "bg-primary-50 text-primary-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
              >
                All Categories
              </button>
              <div className="border-t border-gray-100" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedCategory === cat ? "bg-primary-50 text-primary-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search a service or select a category from the dropdown..."
          className="flex-1 min-w-0 px-5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-white"
        />

        {/* Search Button */}
        <button
          type="button"
          onClick={handleSearch}
          className="flex items-center gap-2 px-6 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-sm font-semibold transition-colors flex-shrink-0 rounded-r-xl"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>

      {/* Active filter hint */}
      {(selectedCategory || query.trim()) && (
        <p className="mt-2 text-xs text-gray-500">
          Searching
          {selectedCategory && <> in <span className="font-medium text-primary-600">{selectedCategory}</span></>}
          {query.trim() && <> for <span className="font-medium text-gray-700">&quot;{query.trim()}&quot;</span></>}
          {location.trim() && <> near <span className="font-medium text-gray-700">{location.trim()}</span></>}
        </p>
      )}
    </div>
  );
}

export function ModernSearchBar() {
  return (
    <Suspense fallback={
      <div className="space-y-3">
        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-14 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    }>
      <ModernSearchBarInner />
    </Suspense>
  );
}
