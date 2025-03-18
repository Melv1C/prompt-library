/**
 * File: src/types/filterTypes.ts
 *
 * Description: Type definitions for filtering, searching, and sorting prompts
 */

import { z } from 'zod';
import { PromptSchema } from './prompt'; // Assuming this exists based on project structure

/**
 * Sort direction enum for type safety
 */
export const SortDirectionEnum = z.enum(['asc', 'desc']);
export type SortDirection = z.infer<typeof SortDirectionEnum>;

/**
 * Sort fields schema - only allows sorting by specific fields of a prompt
 * Using satisfies to ensure type safety while allowing string type
 */
export const sortablePromptFields = [
    'title',
    'createdAt',
    'updatedAt',
    'category',
] as const satisfies ReadonlyArray<keyof z.infer<typeof PromptSchema>>;

export const SortFieldEnum = z.enum(sortablePromptFields);
export type SortField = z.infer<typeof SortFieldEnum>;

/**
 * Schema for the filter state
 */
export const FilterStateSchema = z.object({
    // Search query for text-based searching
    searchQuery: z.string().default(''),

    // Selected categories for filtering (can be multiple)
    selectedCategories: z.array(z.string()).default([]),

    // Selected tags for filtering (can be multiple)
    selectedTags: z.array(z.string()).default([]),

    // Field to sort by (title, createdAt, etc.)
    sortField: SortFieldEnum.default('createdAt'),

    // Sort direction (ascending or descending)
    sortDirection: SortDirectionEnum.default('desc'),

    // Flag to show only public or private prompts
    isPublic: z.boolean().nullable().default(null), // null means "show all"
});

/**
 * Derived type from the schema
 */
export type FilterState = z.infer<typeof FilterStateSchema>;

/**
 * Default state for filters
 */
export const DEFAULT_FILTER_STATE: FilterState = {
    searchQuery: '',
    selectedCategories: [],
    selectedTags: [],
    sortField: 'createdAt',
    sortDirection: 'desc',
    isPublic: null,
};
