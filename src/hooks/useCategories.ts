// =============================================================================
// USE SERVICE CATEGORIES HOOK
// =============================================================================
// Centralized hook for fetching categories and subcategories from the backend.
// Category = Main service type (e.g., "Plumbing", "Photography")
// Subcategory = Specialization within category (e.g., "Residential Plumbing", "Portrait Photography")
// Provides consistent data across all components with caching.
// =============================================================================

import { useEffect, useState } from 'react';
import { getSkills, getSkillCategories } from '@/lib/api';
import { Skill } from '@/types';
import { SKILL_CATEGORIES, POPULAR_SKILLS } from '@/lib/data';

interface ServiceCategoriesState {
  categories: string[];
  subcategoriesByCategory: { category: string; subcategories: string[] }[];
  allSubcategories: Skill[];
  isLoading: boolean;
  error: Error | null;
}

// In-memory cache to avoid multiple API calls
let cachedData: ServiceCategoriesState | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Hook to fetch and manage categories and subcategories data
 * Uses in-memory caching to avoid redundant API calls
 * Falls back to mock data if API fails
 */
export function useServiceCategories() {
  const [state, setState] = useState<ServiceCategoriesState>(() => {
    // Check if we have valid cached data
    if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return cachedData;
    }
    
    // Initial state with fallback data
    return {
      categories: SKILL_CATEGORIES as unknown as string[],
      subcategoriesByCategory: [],
      allSubcategories: POPULAR_SKILLS,
      isLoading: true,
      error: null,
    };
  });

  useEffect(() => {
    // If we have valid cached data, use it
    if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION) {
      setState(cachedData);
      return;
    }

    let isMounted = true;

    async function fetchData() {
      try {
        const [subcategories, categories] = await Promise.all([
          getSkills(),
          getSkillCategories()
        ]);

        // Group subcategories by parent category
        const grouped = subcategories.reduce((acc: { [key: string]: string[] }, subcategory) => {
          const category = subcategory.category || 'Other';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(subcategory.name);
          return acc;
        }, {});

        const subcategoriesByCategory = Object.entries(grouped).map(([category, names]) => ({
          category,
          subcategories: names.sort()
        }));

        const newState = {
          categories,
          subcategoriesByCategory,
          allSubcategories: subcategories,
          isLoading: false,
          error: null,
        };

        if (isMounted) {
          setState(newState);
          // Update cache
          cachedData = newState;
          cacheTimestamp = Date.now();
        }
      } catch (error) {
        console.error('Failed to fetch categories and subcategories:', error);
        
        if (isMounted) {
          setState({
            categories: SKILL_CATEGORIES as unknown as string[],
            subcategoriesByCategory: [],
            allSubcategories: POPULAR_SKILLS,
            isLoading: false,
            error: error as Error,
          });
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

/**
 * Get subcategories for a specific category
 * Used for displaying filter options in search results
 */
export function useSubcategoriesForCategory(category: string) {
  const { subcategoriesByCategory, isLoading, error } = useServiceCategories();
  
  const categoryData = subcategoriesByCategory.find(c => c.category === category);
  
  return {
    subcategories: categoryData?.subcategories || [],
    isLoading,
    error,
  };
}

/**
 * Get popular subcategories (first N subcategories from the backend)
 * Used for search bar suggestions
 */
export function usePopularSubcategories(limit = 20) {
  const { allSubcategories, isLoading, error } = useServiceCategories();
  
  return {
    popularSubcategories: allSubcategories.slice(0, limit),
    isLoading,
    error,
  };
}

/**
 * Get popular categories (first N categories from the backend)
 * Used for home page category browsing
 */
export function usePopularCategories(limit = 6) {
  const { categories, isLoading, error } = useServiceCategories();
  
  return {
    popularCategories: categories.slice(0, limit),
    isLoading,
    error,
  };
}

// Legacy exports for backward compatibility
export const useCategories = useServiceCategories;
export const usePopularSkills = usePopularSubcategories;
