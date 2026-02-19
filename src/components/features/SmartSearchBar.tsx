// =============================================================================
// SMART SEARCH BAR COMPONENT
// =============================================================================
// Modern search bar with category dropdown and autocomplete suggestions
// =============================================================================

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Search, MapPin, ChevronDown, X } from "lucide-react";
import { useServiceCategories } from "@/hooks/useCategories";

interface SmartSearchBarProps {
  placeholder?: string;
  showLocation?: boolean;
  className?: string;
}

export function SmartSearchBar({
  placeholder = "What service do you need?",
  showLocation = true,
  className = "",
}: SmartSearchBarProps) {
  const router = useRouter();
  const { categories, allSubcategories } = useServiceCategories();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const categoryRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Auto-detect user's location on mount
  useEffect(() => {
    if (!showLocation) return;
    
    setIsLoadingLocation(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocode to get city name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
            );
            const data = await response.json();
            const city = data.address?.city || data.address?.town || data.address?.village || "";
            const state = data.address?.state || "";
            
            if (city) {
              setLocation(state ? `${city}, ${state}` : city);
            }
          } catch (error) {
            console.error("Failed to get location name:", error);
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoadingLocation(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsLoadingLocation(false);
    }
  }, [showLocation]);

  // Get suggestions based on query and selected category
  const suggestions = query.length >= 2
    ? allSubcategories
        .filter((sub) => {
          const matchesQuery = sub.name.toLowerCase().includes(query.toLowerCase());
          const matchesCategory = !selectedCategory || sub.category === selectedCategory;
          return matchesQuery && matchesCategory;
        })
        .slice(0, 5)
    : [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (selectedCategory) {
      params.set("category", selectedCategory);
    }
    if (query) {
      params.set("q", query);
    }
    if (location) {
      params.set("location", location);
    }
    
    router.push(`/professionals?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: string, category: string) => {
    setQuery(suggestion);
    setSelectedCategory(category);
    setShowSuggestions(false);
    
    const params = new URLSearchParams();
    params.set("category", category);
    params.set("q", suggestion);
    if (location) params.set("location", location);
    
    router.push(`/professionals?${params.toString()}`);
  };

  const clearCategory = () => {
    setSelectedCategory("");
    setShowCategoryDropdown(false);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Category Selector - Always visible */}
          <div className="relative border-b md:border-b-0 md:border-r border-gray-200" ref={categoryRef}>
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full md:w-48 px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 truncate">
                  {selectedCategory || "All Categories"}
                </span>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Category Dropdown - Visible by default */}
            <div className="absolute z-50 top-full left-0 w-full md:w-64 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
              <div className="p-2">
                <button
                  onClick={clearCategory}
                  className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium">All Categories</span>
                </button>
                <div className="border-t border-gray-100 my-2" />
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="flex items-center px-4 py-1">
              <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                    setShowSuggestions(false);
                  }
                }}
                className="flex-1 px-3 py-3 text-sm focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setShowSuggestions(false);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl"
              >
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 px-3 py-1 mb-1">
                    Suggestions
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.name, suggestion.category || "")}
                      className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">{suggestion.name}</span>
                        <span className="text-xs text-gray-500 group-hover:text-gray-700">
                          {suggestion.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Input (Optional) */}
          {showLocation && (
            <div className="flex items-center px-4 py-1 border-t md:border-t-0 md:border-l border-gray-200">
              <MapPin className={`h-5 w-5 flex-shrink-0 ${isLoadingLocation ? 'text-primary-500 animate-pulse' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder={isLoadingLocation ? "Detecting location..." : "Location"}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isLoadingLocation}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="w-full md:w-40 px-3 py-3 text-sm focus:outline-none"
              />
            </div>
          )}

          {/* Search Button */}
          <div className="p-2">
            <Button
              onClick={handleSearch}
              className="w-full md:w-auto px-6 h-full rounded-lg"
              size="lg"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory || query) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">Searching for:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
              {selectedCategory}
              <button
                onClick={clearCategory}
                className="hover:bg-primary-100 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {query && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              "{query}"
              <button
                onClick={() => setQuery("")}
                className="hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
