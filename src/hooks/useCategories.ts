// Hook for fetching categories and subcategories from the backend.
// Used by ListServiceForm.

import { useEffect, useState } from 'react';
import { getSkills, getSkillCategories } from '@/lib/api';
import { Skill } from '@/types';

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
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour — backend serves from in-process cache anyway

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
    
    // Initial state
    return {
      categories: [],
      subcategoriesByCategory: [],
      allSubcategories: [],
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
            categories: [],
            subcategoriesByCategory: [],
            allSubcategories: [],
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

// Alias for backward compatibility
export const useCategories = useServiceCategories;
