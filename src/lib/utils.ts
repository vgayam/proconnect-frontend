import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes safely
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 *
 * Usage:
 * cn("base-class", condition && "conditional-class", "another-class")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price range for display
 */
export function formatPriceRange(
  min: number,
  max?: number,
  currency: string = "USD",
  unit?: string
): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const minFormatted = formatter.format(min);
  const maxFormatted = max ? formatter.format(max) : null;

  let result = maxFormatted ? `${minFormatted} - ${maxFormatted}` : minFormatted;

  if (unit) {
    result += ` ${unit}`;
  }

  return result;
}

/**
 * Format a location object for display
 */
export function formatLocation(location: {
  city?: string;
  state?: string;
  country: string;
}): string {
  const parts = [location.city, location.state, location.country].filter(Boolean);
  return parts.join(", ");
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Generate initials from a name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
