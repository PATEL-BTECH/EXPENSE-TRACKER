/**
 * Date and time formatting utilities
 */

/**
 * Formats a date to show only date (e.g., "Jan 15, 2024")
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Formats a date to show date and time (e.g., "Jan 15, 2024, 2:30 PM")
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
}

/**
 * Formats a date to show compact date and time (e.g., "Jan 15, 2:30 PM")
 */
export function formatCompactDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
}

/**
 * Formats time only (e.g., "2:30 PM")
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
}

/**
 * Gets current date in YYYY-MM-DD format for date input
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Gets current time in HH:MM format for time input
 */
export function getCurrentTime(): string {
  return new Date().toTimeString().slice(0, 5);
}

/**
 * Combines date and time strings into a Date object
 */
export function combineDateAndTime(dateString: string, timeString: string): Date {
  const dateTimeString = `${dateString}T${timeString}:00`;
  return new Date(dateTimeString);
}
