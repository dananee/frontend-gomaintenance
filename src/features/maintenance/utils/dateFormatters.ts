import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from "date-fns";

/**
 * Format a date for display in the calendar
 */
export const formatCalendarDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM d, yyyy");
};

/**
 * Format a date with time
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM d, yyyy 'at' h:mm a");
};

/**
 * Format a date relative to now (e.g., "2 days ago", "in 3 hours")
 */
export const formatRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return "Today";
  }
  if (isTomorrow(dateObj)) {
    return "Tomorrow";
  }
  if (isYesterday(dateObj)) {
    return "Yesterday";
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

/**
 * Format a date for API requests (ISO format)
 */
export const formatForAPI = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString();
};

/**
 * Check if a date is overdue
 */
export const isOverdue = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj < new Date() && !isToday(dateObj);
};

/**
 * Get a human-readable date range string
 */
export const formatDateRange = (start: Date | null, end: Date | null): string => {
  if (!start && !end) return "All time";
  if (start && !end) return `From ${formatCalendarDate(start)}`;
  if (!start && end) return `Until ${formatCalendarDate(end)}`;
  return `${formatCalendarDate(start!)} - ${formatCalendarDate(end!)}`;
};
