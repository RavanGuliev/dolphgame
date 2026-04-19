/**
 * Formats an ISO date string to a human-readable format
 * @param dateString - ISO date string (e.g., "2025-07-27T16:35:52.000000Z")
 * @param options - Optional formatting options
 * @returns Formatted date string
 */
export function formatDate(dateString: string, options?: {
  includeTime?: boolean;
  locale?: string;
}): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return original if invalid
  }
  
  const defaultOptions = {
    includeTime: true,
    locale: 'az-AZ', // Azerbaijani locale based on the app content
    ...options
  };
  
  if (defaultOptions.includeTime) {
    // Format: "27.07.2025, 16:35"
    return date.toLocaleString(defaultOptions.locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } else {
    // Format: "27.07.2025"
    return date.toLocaleDateString(defaultOptions.locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}


/**
 * Formats date for display in tables and cards
 * @param dateString - ISO date string
 * @returns Formatted date with time
 */
export function formatDateTime(dateString: string): string {
  return formatDate(dateString, { includeTime: true });
}

/**
 * Formats date for display in blog cards and simple date displays
 * @param dateString - ISO date string
 * @returns Formatted date without time
 */
export function formatDateOnly(dateString: string): string {
  return formatDate(dateString, { includeTime: false });
} 