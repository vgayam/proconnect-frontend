// =============================================================================
// MODERN SEARCH BAR COMPONENT
// =============================================================================

"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, ChevronDown, Loader2 } from "lucide-react";
import { getCities, getSkillCategories } from "@/lib/api";

const CATEGORY_EMOJIS: Record<string, string> = {
  "Plumbing":          "🔧",
  "Electrical":        "⚡",
  "Photography":       "📷",
  "Carpentry":         "🪚",
  "Interior Design":   "🛋️",
  "Painting":          "🎨",
  "Cleaning":          "🧹",
  "Fitness":           "💪",
  "Education":         "📚",
  "Technology":        "💻",
  "HVAC":              "❄️",
  "Landscaping":       "🌿",
  "Pest Control":      "🐛",
  "Graphic Design":    "✏️",
  "Beauty & Wellness": "💆",
  "Handyman":          "�",
  "Vehicle":           "�",
};

// Priority order — most-searched categories shown first
const CATEGORY_PRIORITY = [
  "Plumbing", "Electrical", "Carpentry", "Cleaning",
  "Photography", "Interior Design", "Painting", "Fitness",
  "Graphic Design", "Education",
];

function ModernSearchBarInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const CITY_CACHE_KEY = "proconnect_city";

  // Seed city: URL param → localStorage cache → empty (geolocation will fill later)
  const urlCity = searchParams.get("location") || "";
  const cachedCity = typeof window !== "undefined"
    ? (localStorage.getItem(CITY_CACHE_KEY) || "")
    : "";
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [city, setCity] = useState(urlCity || cachedCity);
  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  // Persist city selection to localStorage whenever it changes
  const saveCity = (value: string) => {
    setCity(value);
    if (value.trim()) {
      localStorage.setItem(CITY_CACHE_KEY, value.trim());
    }
  };

  // Load cities and categories from backend
  useEffect(() => {
    getCities().then(setCities);
    getSkillCategories().then(setCategories);
  }, []);

  // Auto-detect location on mount ONLY if no cached/URL city
  useEffect(() => {
    if (city || !navigator.geolocation) return;
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          );
          const data = await res.json();
          const detectedCity =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "";
          if (detectedCity) saveCity(detectedCity);
        } catch {
          // silently fail
        } finally {
          setDetectingLocation(false);
        }
      },
      () => setDetectingLocation(false),
      { timeout: 5000 }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (q = query, category = "", loc = city) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (loc.trim()) params.set("location", loc.trim());
    router.push(`/professionals?${params.toString()}`);
  };

  // Filter cities by what user typed
  const filteredCities = city.trim()
    ? cities.filter((c) => c.toLowerCase().includes(city.toLowerCase()))
    : cities;

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-xl border border-gray-100">

        {/* Location input */}
        <div ref={cityRef} className="relative flex-shrink-0 sm:w-56">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border transition-all duration-200 cursor-text h-full ${
              showCityDropdown ? "border-primary-400 bg-white" : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setShowCityDropdown(true)}
          >
            {detectingLocation
              ? <Loader2 className="h-5 w-5 text-primary-400 animate-spin flex-shrink-0" />
              : <MapPin className="h-5 w-5 text-primary-500 flex-shrink-0" />
            }
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none mb-0.5">
                {detectingLocation ? "Detecting…" : "Location"}
              </span>
              <input
                type="text"
                value={city}
                onChange={(e) => { saveCity(e.target.value); setShowCityDropdown(true); }}
                onFocus={() => setShowCityDropdown(true)}
                placeholder="Any city"
                className="text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent w-full"
                autoComplete="off"
              />
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${showCityDropdown ? "rotate-180 text-primary-500" : ""}`} />
          </div>

          {/* City dropdown */}
          {showCityDropdown && filteredCities.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 max-h-52 overflow-y-auto">
              {city.trim() && !cities.some(c => c.toLowerCase() === city.toLowerCase()) && (
                <button
                  className="w-full text-left px-4 py-2.5 text-sm text-primary-600 font-medium hover:bg-primary-50 flex items-center gap-2"
                  onClick={() => setShowCityDropdown(false)}
                >
                  <Search className="h-3.5 w-3.5 flex-shrink-0" />
                  Search in &ldquo;{city}&rdquo;
                </button>
              )}
              {filteredCities.map((c) => (
                <button
                  key={c}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${city === c ? "text-primary-600 font-semibold bg-primary-50" : "text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => { saveCity(c); setShowCityDropdown(false); }}
                >
                  <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Service input */}
        <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus-within:border-primary-400 focus-within:bg-white transition-all duration-200 min-w-0">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none mb-0.5">Service</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. Plumber, Photographer…"
              className="text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent w-full"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Search button */}
        <button
          type="button"
          onClick={() => handleSearch()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-semibold text-sm rounded-xl transition-colors flex-shrink-0 sm:self-stretch"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>

      {/* Quick category chips */}
      {categories.length > 0 && (() => {
        const sorted = [
          ...CATEGORY_PRIORITY.filter(c => categories.includes(c)),
          ...categories.filter(c => !CATEGORY_PRIORITY.includes(c)).sort(),
        ];
        const visible = showAllCategories ? sorted : sorted.slice(0, 10);
        const hidden = sorted.length - 10;
        return (
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {visible.map((label) => (
              <button
                key={label}
                onClick={() => handleSearch("", label)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 font-medium shadow-sm hover:border-primary-400 hover:text-primary-600 hover:shadow-md transition-all duration-150"
              >
                <span>{CATEGORY_EMOJIS[label] ?? "🔍"}</span>
                {label}
              </button>
            ))}
            {!showAllCategories && hidden > 0 && (
              <button
                onClick={() => setShowAllCategories(true)}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-500 font-medium hover:bg-gray-200 transition-all duration-150"
              >
                +{hidden} more
              </button>
            )}
          </div>
        );
      })()}
    </div>
  );
}

export function ModernSearchBar() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <div className="h-14 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="flex gap-2 justify-center flex-wrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-8 w-24 bg-gray-100 rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <ModernSearchBarInner />
    </Suspense>
  );
}
