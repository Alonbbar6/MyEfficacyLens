/**
 * Shared Date Utilities
 */

import { format, formatDistance, parseISO, isValid } from 'date-fns';

/**
 * Format a date string or Date object to a readable format
 */
export function formatDate(date: string | Date, formatStr: string = 'MMM d, yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format a date for display in event cards
 */
export function formatEventDate(date: string | Date): string {
  return formatDate(date, 'EEEE, MMMM d, yyyy');
}

/**
 * Format time (e.g., "2:30 PM")
 */
export function formatTime(time: string): string {
  try {
    // Assuming time is in HH:mm format
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    return time;
  }
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: string | Date): boolean {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj < new Date();
  } catch (error) {
    return false;
  }
}

/**
 * Check if a date is today
 */
export function isToday(date: string | Date): boolean {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const today = new Date();
    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    return false;
  }
}
