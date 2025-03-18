/**
 * File: src/hooks/usePrompts.ts
 *
 * Description: React hooks for fetching and managing multiple prompts with
 * client-side filtering, sorting, and pagination options
 *
 */

import {
    PromptQueryOptions,
    getPrompts,
    getPublicPrompts,
    getUserPrompts,
} from '@/services/promptService';
import { PromptType } from '@/types/prompt';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UsePromptsResult {
    prompts: PromptType[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    totalCount: number; // Added to provide total count for pagination
}

/**
 * Applies client-side filtering to an array of prompts
 * @param prompts Array of prompts to filter
 * @param options Query options for filtering and sorting
 * @returns Filtered and sorted array of prompts
 */
function applyClientSideFilters(
    prompts: PromptType[],
    options?: PromptQueryOptions
): PromptType[] {
    if (!options) return [...prompts];

    let filteredPrompts = [...prompts];

    // Apply isPublic filter if specified
    if (options.isPublic !== undefined) {
        filteredPrompts = filteredPrompts.filter(
            (prompt) => prompt.isPublic === options.isPublic
        );
    }

    // Apply authorId filter if specified
    if (options.authorId) {
        filteredPrompts = filteredPrompts.filter(
            (prompt) => prompt.authorId === options.authorId
        );
    }

    // Apply category filter if specified
    if (options.category) {
        filteredPrompts = filteredPrompts.filter(
            (prompt) => prompt.category === options.category
        );
    }

    // Apply categories filter if specified
    if (options.categories && options.categories.length > 0) {
        filteredPrompts = filteredPrompts.filter((prompt) =>
            options.categories?.includes(prompt.category)
        );
    }

    // Apply tags filter if specified
    if (options.tags && options.tags.length > 0) {
        filteredPrompts = filteredPrompts.filter((prompt) =>
            options.tags?.some((tag) => prompt.tags.includes(tag))
        );
    }

    // Apply search query filter if specified
    if (options.searchQuery) {
        const searchLower = options.searchQuery.toLowerCase();
        filteredPrompts = filteredPrompts.filter(
            (prompt) =>
                prompt.title.toLowerCase().includes(searchLower) ||
                prompt.content.toLowerCase().includes(searchLower) ||
                prompt.description?.toLowerCase().includes(searchLower)
        );
    }

    // Apply sorting if specified
    if (options.orderByField) {
        filteredPrompts.sort((a, b) => {
            let valueA: string | number | boolean | Date | string[] | undefined;
            let valueB: string | number | boolean | Date | string[] | undefined;

            // Handle special case for category sorting
            if (options.orderByField === 'title') {
                valueA = a.category;
                valueB = b.category;
            } else {
                valueA = a[options.orderByField as keyof PromptType];
                valueB = b[options.orderByField as keyof PromptType];
            }

            // Handle date comparison
            if (valueA instanceof Date && valueB instanceof Date) {
                return options.orderDirection === 'asc'
                    ? valueA.getTime() - valueB.getTime()
                    : valueB.getTime() - valueA.getTime();
            }

            // Handle string comparison
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return options.orderDirection === 'asc'
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }

            // Handle number comparison
            return options.orderDirection === 'asc'
                ? Number(valueA) - Number(valueB)
                : Number(valueB) - Number(valueA);
        });
    }

    // Apply limit if specified
    if (options.limitTo && filteredPrompts.length > options.limitTo) {
        filteredPrompts = filteredPrompts.slice(0, options.limitTo);
    }

    return filteredPrompts;
}

/**
 * Hook for fetching multiple prompts with client-side filtering
 * @param options Query options for filtering and sorting prompts
 * @returns Object containing prompts array, loading state, error state, and refetch function
 */
export function usePrompts(options?: PromptQueryOptions): UsePromptsResult {
    const [allPrompts, setAllPrompts] = useState<PromptType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Use useMemo to create a stable dependency key that only changes when
    // relevant option properties change
    const optionsKey = useMemo(() => {
        // Extract only the properties we care about for dependency tracking
        const {
            authorId,
            isPublic,
            category,
            categories,
            tags,
            orderByField,
            orderDirection,
            limitTo,
            searchQuery,
        } = options || {};

        return JSON.stringify({
            authorId,
            isPublic,
            category,
            categories,
            tags,
            orderByField,
            orderDirection,
            limitTo,
            searchQuery,
        });
    }, [options]);

    const fetchPrompts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch all prompts without any filters for client-side filtering
            const fetchedPrompts = await getPrompts();
            setAllPrompts(fetchedPrompts);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error('Failed to fetch prompts')
            );
            console.error('Error in usePrompts:', err);
        } finally {
            setLoading(false);
        }
    }, []); // No dependencies since we always fetch all prompts

    // Fetch prompts on mount only
    useEffect(() => {
        fetchPrompts();
    }, [fetchPrompts]);

    // Apply client-side filtering based on options
    const filteredPrompts = useMemo(() => {
        return applyClientSideFilters(allPrompts, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allPrompts, optionsKey]);

    return {
        prompts: filteredPrompts,
        loading,
        error,
        refetch: fetchPrompts,
        totalCount: filteredPrompts.length,
    };
}

/**
 * Hook for fetching public prompts with client-side filtering
 * @param options Additional query options
 * @returns Object containing public prompts array, loading state, error state, and refetch function
 */
export function usePublicPrompts(
    options?: Omit<PromptQueryOptions, 'isPublic'>
): UsePromptsResult {
    const [allPrompts, setAllPrompts] = useState<PromptType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Use useMemo for stable dependency tracking
    const optionsKey = useMemo(() => {
        const {
            authorId,
            category,
            categories,
            tags,
            orderByField,
            orderDirection,
            limitTo,
            searchQuery,
        } = options || {};

        return JSON.stringify({
            authorId,
            category,
            categories,
            tags,
            orderByField,
            orderDirection,
            limitTo,
            searchQuery,
        });
    }, [options]);

    const fetchPublicPrompts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch all public prompts without filters
            const fetchedPrompts = await getPublicPrompts();
            setAllPrompts(fetchedPrompts);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error('Failed to fetch public prompts')
            );
            console.error('Error in usePublicPrompts:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch prompts on mount only
    useEffect(() => {
        fetchPublicPrompts();
    }, [fetchPublicPrompts]);

    // Apply client-side filtering based on options
    const filteredPrompts = useMemo(() => {
        return applyClientSideFilters(allPrompts, {
            ...options,
            isPublic: true,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allPrompts, optionsKey]);

    return {
        prompts: filteredPrompts,
        loading,
        error,
        refetch: fetchPublicPrompts,
        totalCount: filteredPrompts.length,
    };
}

/**
 * Hook for fetching prompts created by a specific user with client-side filtering
 * @param userId The ID of the user whose prompts to fetch
 * @param options Additional query options
 * @returns Object containing user's prompts array, loading state, error state, and refetch function
 */
export function useUserPrompts(
    userId: string | undefined,
    options?: Omit<PromptQueryOptions, 'authorId'>
): UsePromptsResult {
    const [allPrompts, setAllPrompts] = useState<PromptType[]>([]);
    const [loading, setLoading] = useState<boolean>(!!userId);
    const [error, setError] = useState<Error | null>(null);

    // Use useMemo for stable dependency tracking, including userId
    const optionsKey = useMemo(() => {
        const {
            isPublic,
            category,
            categories,
            tags,
            orderByField,
            orderDirection,
            limitTo,
            searchQuery,
        } = options || {};

        return JSON.stringify({
            userId,
            isPublic,
            category,
            categories,
            tags,
            orderByField,
            orderDirection,
            limitTo,
            searchQuery,
        });
    }, [options, userId]);

    const fetchUserPrompts = useCallback(async () => {
        if (!userId) {
            setAllPrompts([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            // Fetch all prompts for this user without filters
            const fetchedPrompts = await getUserPrompts(userId);
            setAllPrompts(fetchedPrompts);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error('Failed to fetch user prompts')
            );
            console.error('Error in useUserPrompts:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Fetch prompts on mount or when userId changes
    useEffect(() => {
        fetchUserPrompts();
    }, [fetchUserPrompts]);

    // Apply client-side filtering based on options
    const filteredPrompts = useMemo(() => {
        return applyClientSideFilters(allPrompts, {
            ...options,
            authorId: userId,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allPrompts, optionsKey, userId]);

    return {
        prompts: filteredPrompts,
        loading,
        error,
        refetch: fetchUserPrompts,
        totalCount: filteredPrompts.length,
    };
}
