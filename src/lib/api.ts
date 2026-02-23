// =============================================================================
// API CLIENT
// =============================================================================
// Client for connecting to the ProConnect backend API
// =============================================================================

import type { Professional, Skill, SearchParams } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Get all professionals with optional filters
 */
export async function getProfessionals(params?: SearchParams): Promise<Professional[]> {
  try {
    const query = new URLSearchParams();
    
    if (params?.query) query.set('q', params.query);
    if (params?.category) query.set('category', params.category); // backend expects 'category'
    if (params?.location) query.set('city', params.location); // backend expects 'city'
    if (params?.page !== undefined) query.set('page', String(params.page));
    if (params?.pageSize !== undefined) query.set('pageSize', String(params.pageSize));
    if (params?.available) query.set('available', 'true');
    if (params?.skills && params.skills.length > 0) {
      query.set('skills', params.skills.join(','));
    }
    
    const url = `${API_URL}/api/professionals${query.toString() ? `?${query}` : ''}`;
    const response = await fetch(url, {
      cache: 'no-store', // Always fetch fresh data
      next: { revalidate: 0 },
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('API Error:', response.status, errorText);
      throw new Error(`Failed to fetch professionals: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    // Backend returns a paginated wrapper: { results: [...], page, pageSize, total, totalPages }
    const list = Array.isArray(data) ? data : (data.results ?? []);
    return list.map(mapProfessionalResponse);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    // Return empty array instead of throwing to prevent page crash
    return [];
  }
}

/**
 * Get a single professional by ID
 */
export async function getProfessionalById(id: string | number): Promise<Professional> {
  try {
    const response = await fetch(`${API_URL}/api/professionals/${id}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('API Error:', response.status, errorText);
      throw new Error(`Failed to fetch professional: ${response.status} ${response.statusText}`);
    }
    
    return mapProfessionalResponse(await response.json());
  } catch (error) {
    console.error('Error fetching professional:', error);
    throw error;
  }
}

/**
 * Get all skills
 */
export async function getSkills(): Promise<Skill[]> {
  try {
    const response = await fetch(`${API_URL}/api/skills`, {
      cache: 'force-cache', // Skills don't change often
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch skills: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
}

/**
 * Get all skill categories
 */
export async function getSkillCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/api/skills/categories`, {
      cache: 'force-cache',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Contact a professional
 */
export async function contactProfessional(
  professionalId: number,
  data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    serviceId?: number;
  }
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/professionals/${professionalId}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error sending contact message:', error);
    throw error;
  }
}

/**
 * Maps a raw backend professional response to the frontend Professional type.
 * Handles field renaming and nested structure differences.
 */
function mapProfessionalResponse(raw: any): Professional {
  return {
    ...raw,
    id: String(raw.id),
    // Map flat location fields to nested object (backend may return either)
    location: raw.location ?? {
      city: raw.city,
      state: raw.state,
      country: raw.country,
      remote: raw.remote ?? false,
    },
    // Contact info — backend sends as flat fields
    email: raw.email ?? undefined,
    phone: raw.phone ?? undefined,
    whatsapp: raw.whatsapp ?? undefined,
    // Hourly rate — map to nested PriceRange shape
    hourlyRate: (raw.hourlyRateMin != null)
      ? {
          min: raw.hourlyRateMin,
          max: raw.hourlyRateMax ?? undefined,
          currency: raw.currency ?? 'USD',
          unit: 'per hour',
        }
      : undefined,
    // Ensure skills/services/socialLinks are always arrays
    skills: raw.skills ?? [],
    services: (raw.services ?? []).map((s: any) => ({
      ...s,
      id: String(s.id),
      priceRange: (s.priceMin != null)
        ? { min: s.priceMin, max: s.priceMax ?? undefined, currency: s.currency ?? 'USD', unit: s.priceUnit }
        : undefined,
    })),
    socialLinks: (raw.socialLinks ?? []).map((l: any) => ({ ...l, id: String(l.id) })),
    serviceAreas: raw.serviceAreas ?? [],
  };
}

/**
 * Create a new professional profile
 */
export async function createProfessional(data: any): Promise<Professional> {
  try {
    const response = await fetch(`${API_URL}/api/professionals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('API Error:', response.status, errorText);
      throw new Error(`Failed to create professional: ${response.status} ${response.statusText}`);
    }
    
    const raw = await response.json();
    return mapProfessionalResponse(raw);
  } catch (error) {
    console.error('Error creating professional:', error);
    throw error;
  }
}

/**
 * Get distinct cities that have professionals
 */
export async function getCities(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/api/professionals/cities`, {
      cache: 'no-store',
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}
