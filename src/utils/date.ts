/**
 * File: src/utils/date.ts
 *
 * Description: Utility functions for date handling and conversion between Firebase timestamps and Date objects
 *
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Converts a Date object to a numeric timestamp for storage in Firebase
 * @param date JavaScript Date object
 * @returns Numeric timestamp (milliseconds since epoch)
 */
export const dateToTimestamp = (date: Date): number => {
    return date.getTime();
};

/**
 * Converts a Firebase Timestamp to a JavaScript Date object
 * @param timestamp Firebase Timestamp or numeric timestamp
 * @returns JavaScript Date object
 */
export const timestampToDate = (timestamp: Timestamp | number): Date => {
    if (typeof timestamp === 'number') {
        return new Date(timestamp);
    }

    // Firebase Timestamp object
    return timestamp.toDate();
};

/**
 * Normalizes various date representations to a consistent Date object
 * Handles Firebase Timestamp objects, numeric timestamps, ISO strings and Date objects
 */
export const normalizeDate = (
    date: Date | Timestamp | number | string
): Date => {
    // Already a Date object
    if (date instanceof Date) return date;

    // Firebase Timestamp object
    if (typeof date === 'object' && 'toDate' in date) {
        return date.toDate();
    }

    // Numeric timestamp
    if (typeof date === 'number') {
        return new Date(date);
    }

    // ISO string or other string format
    if (typeof date === 'string') {
        return new Date(date);
    }

    // Default fallback
    return new Date();
};
