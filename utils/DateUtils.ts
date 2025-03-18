// utils/DateUtils.ts
/**
 * Formats a Date object into ISO 8601 string which PostgreSQL can accept.
 * Example: '2025-03-17T09:47:45.818Z'
 */
export function formatPostgresTimestamp(date: Date): string {
    return date.toISOString();
  }
  