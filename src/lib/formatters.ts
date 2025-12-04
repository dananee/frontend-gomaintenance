/**
 * Global Formatting Utilities for CMMS/GMAO Application
 * 
 * Standardizes currency, date, and time formatting across the application.
 * - Currency: Moroccan Dirham (MAD/DH)
 * - Date: DD-MM-YYYY format (with dashes)
 * - Time: 24-hour format (HH:mm)
 */

import { format, parseISO, isValid } from "date-fns";

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Format amount as Moroccan Dirham currency
 * @param amount - The numeric amount to format
 * @param style - Display style: "full" (1,200.00 MAD) or "short" (1,200 DH)
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1200.50) // "1,200.50 MAD"
 * formatCurrency(1200.50, "short") // "1,200 DH"
 * formatCurrency(0) // "0.00 MAD"
 */
export function formatCurrency(
    amount: number,
    style: "full" | "short" = "full"
): string {
    if (typeof amount !== "number" || isNaN(amount)) {
        return style === "full" ? "0.00 MAD" : "0 DH";
    }

    const formatted = new Intl.NumberFormat("fr-MA", {
        minimumFractionDigits: style === "full" ? 2 : 0,
        maximumFractionDigits: 2,
    }).format(amount);

    return style === "full" ? `${formatted} MAD` : `${formatted} DH`;
}

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Parse date string or Date object
 * @param date - Date string (ISO 8601) or Date object
 * @returns Date object or null if invalid
 */
function parseDate(date: Date | string | null | undefined): Date | null {
    if (!date) return null;

    if (date instanceof Date) {
        return isValid(date) ? date : null;
    }

    try {
        const parsed = typeof date === "string" ? parseISO(date) : new Date(date);
        return isValid(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

/**
 * Format date in short format (DD-MM-YYYY)
 * @param date - Date string or Date object
 * @returns Formatted date string or empty string if invalid
 * 
 * @example
 * formatDateShort("2025-12-05") // "05-12-2025"
 * formatDateShort(new Date(2025, 11, 5)) // "05-12-2025"
 * formatDateShort(null) // ""
 */
export function formatDateShort(date: Date | string | null | undefined): string {
    const parsed = parseDate(date);
    if (!parsed) return "";

    return format(parsed, "dd-MM-yyyy");
}

/**
 * Format date in long format (DD Month YYYY)
 * @param date - Date string or Date object
 * @returns Formatted date string or empty string if invalid
 * 
 * @example
 * formatDateLong("2025-12-05") // "05 December 2025"
 * formatDateLong(new Date(2025, 11, 5)) // "05 December 2025"
 */
export function formatDateLong(date: Date | string | null | undefined): string {
    const parsed = parseDate(date);
    if (!parsed) return "";

    return format(parsed, "dd MMMM yyyy");
}

/**
 * Format date in month-year format (Month YYYY)
 * @param date - Date string or Date object
 * @returns Formatted date string or empty string if invalid
 * 
 * @example
 * formatMonthYear("2025-12-05") // "December 2025"
 */
export function formatMonthYear(date: Date | string | null | undefined): string {
    const parsed = parseDate(date);
    if (!parsed) return "";

    return format(parsed, "MMMM yyyy");
}

// ============================================================================
// TIME FORMATTING
// ============================================================================

/**
 * Format time in 24-hour format (HH:mm)
 * @param date - Date string or Date object
 * @returns Formatted time string or empty string if invalid
 * 
 * @example
 * formatTime("2025-12-05T14:35:00") // "14:35"
 * formatTime(new Date(2025, 11, 5, 8, 30)) // "08:30"
 */
export function formatTime(date: Date | string | null | undefined): string {
    const parsed = parseDate(date);
    if (!parsed) return "";

    return format(parsed, "HH:mm");
}

/**
 * Format time with seconds in 24-hour format (HH:mm:ss)
 * @param date - Date string or Date object
 * @returns Formatted time string or empty string if invalid
 * 
 * @example
 * formatTimeWithSeconds("2025-12-05T14:35:42") // "14:35:42"
 */
export function formatTimeWithSeconds(date: Date | string | null | undefined): string {
    const parsed = parseDate(date);
    if (!parsed) return "";

    return format(parsed, "HH:mm:ss");
}

// ============================================================================
// COMBINED DATE & TIME FORMATTING
// ============================================================================

/**
 * Format date and time in short format (DD-MM-YYYY HH:mm)
 * @param date - Date string or Date object
 * @returns Formatted datetime string or empty string if invalid
 * 
 * @example
 * formatDateTime("2025-12-05T14:35:00") // "05-12-2025 14:35"
 */
export function formatDateTime(date: Date | string | null | undefined): string {
    const parsed = parseDate(date);
    if (!parsed) return "";

    return format(parsed, "dd-MM-yyyy HH:mm");
}

/**
 * Format date and time in long format (DD Month YYYY HH:mm)
 * @param date - Date string or Date object
 * @returns Formatted datetime string or empty string if invalid
 * 
 * @example
 * formatDateTimeLong("2025-12-05T14:35:00") // "05 December 2025 14:35"
 */
export function formatDateTimeLong(date: Date | string | null | undefined): string {
    const parsed = parseDate(date);
    if (!parsed) return "";

    return format(parsed, "dd MMMM yyyy HH:mm");
}

/**
 * Format date and time with seconds (DD-MM-YYYY HH:mm:ss)
 * @param date - Date string or Date object
 * @returns Formatted datetime string or empty string if invalid
 * 
 * @example
 * formatDateTimeWithSeconds("2025-12-05T14:35:42") // "05-12-2025 14:35:42"
 */
export function formatDateTimeWithSeconds(date: Date | string | null | undefined): string {
    const parsed = parseDate(date);
    if (!parsed) return "";

    return format(parsed, "dd-MM-yyyy HH:mm:ss");
}

// ============================================================================
// RELATIVE TIME FORMATTING
// ============================================================================

/**
 * Format date as relative time (e.g., "2 hours ago", "in 3 days")
 * @param date - Date string or Date object
 * @returns Relative time string or empty string if invalid
 * 
 * @example
 * formatRelativeTime("2025-12-05T12:00:00") // "2 hours ago" (if current time is 14:00)
 */
export function formatRelativeTime(date: Date | string | null | undefined): string {
    const parsed = parseDate(date);
    if (!parsed) return "";

    const now = new Date();
    const diffMs = now.getTime() - parsed.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;

    return formatDateShort(parsed);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a date is today
 * @param date - Date string or Date object
 * @returns True if date is today
 */
export function isToday(date: Date | string | null | undefined): boolean {
    const parsed = parseDate(date);
    if (!parsed) return false;

    const today = new Date();
    return (
        parsed.getDate() === today.getDate() &&
        parsed.getMonth() === today.getMonth() &&
        parsed.getFullYear() === today.getFullYear()
    );
}

/**
 * Check if a date is in the past
 * @param date - Date string or Date object
 * @returns True if date is in the past
 */
export function isPast(date: Date | string | null | undefined): boolean {
    const parsed = parseDate(date);
    if (!parsed) return false;

    return parsed.getTime() < new Date().getTime();
}

/**
 * Check if a date is in the future
 * @param date - Date string or Date object
 * @returns True if date is in the future
 */
export function isFuture(date: Date | string | null | undefined): boolean {
    const parsed = parseDate(date);
    if (!parsed) return false;

    return parsed.getTime() > new Date().getTime();
}
