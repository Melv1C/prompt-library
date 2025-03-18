/**
 * File: src/store/filterStore.ts
 *
 * Description: Jotai atoms and reducers for filter state management
 */

import { atom } from 'jotai';
import {
    DEFAULT_FILTER_STATE,
    FilterState,
    SortDirection,
    SortField,
} from '../types/filterTypes';

/**
 * Primary atom for storing the filter state
 */
export const filterStateAtom = atom<FilterState>(DEFAULT_FILTER_STATE);

/**
 * Derived atoms for each filter property for easier access
 */
export const searchQueryAtom = atom(
    (get) => get(filterStateAtom).searchQuery,
    (get, set, searchQuery: string) => {
        set(filterStateAtom, {
            ...get(filterStateAtom),
            searchQuery,
        });
    }
);

/**
 * Search debounce atom - updates search after a delay to prevent excessive queries
 */
export const debouncedSearchAtom = atom(
    (get) => get(searchQueryAtom),
    (_get, set, newValue: string) => {
        // Set the search query immediately in the UI
        set(searchQueryAtom, newValue);
    }
);

export const selectedCategoriesAtom = atom(
    (get) => get(filterStateAtom).selectedCategories,
    (get, set, selectedCategories: string[]) => {
        set(filterStateAtom, {
            ...get(filterStateAtom),
            selectedCategories,
        });
    }
);

export const selectedTagsAtom = atom(
    (get) => get(filterStateAtom).selectedTags,
    (get, set, selectedTags: string[]) => {
        set(filterStateAtom, {
            ...get(filterStateAtom),
            selectedTags,
        });
    }
);

export const sortFieldAtom = atom(
    (get) => get(filterStateAtom).sortField,
    (get, set, sortField: SortField) => {
        set(filterStateAtom, {
            ...get(filterStateAtom),
            sortField,
        });
    }
);

export const sortDirectionAtom = atom(
    (get) => get(filterStateAtom).sortDirection,
    (get, set, sortDirection: SortDirection) => {
        set(filterStateAtom, {
            ...get(filterStateAtom),
            sortDirection,
        });
    }
);

export const isPublicFilterAtom = atom(
    (get) => get(filterStateAtom).isPublic,
    (get, set, isPublic: boolean | null) => {
        set(filterStateAtom, {
            ...get(filterStateAtom),
            isPublic,
        });
    }
);

/**
 * Reset filter - utility atom to reset all filters to default values
 */
export const resetFilterAtom = atom(null, (_, set) => {
    set(filterStateAtom, DEFAULT_FILTER_STATE);
});

/**
 * Toggle category selection - adds if not present, removes if present
 */
export const toggleCategoryAtom = atom(null, (get, set, category: string) => {
    const currentCategories = get(filterStateAtom).selectedCategories;

    if (currentCategories.includes(category)) {
        set(
            selectedCategoriesAtom,
            currentCategories.filter((c) => c !== category)
        );
    } else {
        set(selectedCategoriesAtom, [...currentCategories, category]);
    }
});

/**
 * Toggle tag selection - adds if not present, removes if present
 */
export const toggleTagAtom = atom(null, (get, set, tag: string) => {
    const currentTags = get(filterStateAtom).selectedTags;

    if (currentTags.includes(tag)) {
        set(
            selectedTagsAtom,
            currentTags.filter((t) => t !== tag)
        );
    } else {
        set(selectedTagsAtom, [...currentTags, tag]);
    }
});

/**
 * Toggle sort direction between asc/desc
 */
export const toggleSortDirectionAtom = atom(null, (get, set) => {
    const currentDirection = get(filterStateAtom).sortDirection;
    set(sortDirectionAtom, currentDirection === 'asc' ? 'desc' : 'asc');
});
