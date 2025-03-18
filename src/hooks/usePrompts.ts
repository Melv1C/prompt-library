/**
 * File: src/hooks/usePrompts.ts
 *
 * Description: React hooks for fetching and managing multiple prompts with
 * filtering, sorting, and pagination options
 *
 */

import {
    PromptQueryOptions,
    getPrompts,
    getPublicPrompts,
    getUserPrompts,
} from '@/services/promptService';
import { PromptType } from '@/types/prompt';
import { useCallback, useEffect, useState } from 'react';

interface UsePromptsResult {
    prompts: PromptType[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Hook for fetching multiple prompts with optional filtering
 * @param options Query options for filtering and sorting prompts
 * @returns Object containing prompts array, loading state, error state, and refetch function
 */
export function usePrompts(options?: PromptQueryOptions): UsePromptsResult {
    const [prompts, setPrompts] = useState<PromptType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Convert options to a stable string for dependency tracking
    const optionsKey = JSON.stringify(options);

    const fetchPrompts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedPrompts = await getPrompts(options);
            setPrompts(fetchedPrompts);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionsKey]);

    // Fetch prompts on mount or when options change
    useEffect(() => {
        fetchPrompts();
    }, [fetchPrompts]);

    return {
        prompts,
        loading,
        error,
        refetch: fetchPrompts,
    };
}

/**
 * Hook for fetching public prompts with optional filtering
 * @param options Additional query options (excluding isPublic which is set to true)
 * @returns Object containing public prompts array, loading state, error state, and refetch function
 */
export function usePublicPrompts(
    options?: Omit<PromptQueryOptions, 'isPublic'>
): UsePromptsResult {
    const [prompts, setPrompts] = useState<PromptType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Convert options to a stable string for dependency tracking
    const optionsKey = JSON.stringify(options);

    const fetchPublicPrompts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedPrompts = await getPublicPrompts(options);
            setPrompts(fetchedPrompts);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionsKey]);

    // Fetch prompts on mount or when options change
    useEffect(() => {
        fetchPublicPrompts();
    }, [fetchPublicPrompts]);

    return {
        prompts,
        loading,
        error,
        refetch: fetchPublicPrompts,
    };
}

/**
 * Hook for fetching prompts created by a specific user
 * @param userId The ID of the user whose prompts to fetch
 * @param options Additional query options (excluding authorId which is set to userId)
 * @returns Object containing user's prompts array, loading state, error state, and refetch function
 */
export function useUserPrompts(
    userId: string | undefined,
    options?: Omit<PromptQueryOptions, 'authorId'>
): UsePromptsResult {
    const [prompts, setPrompts] = useState<PromptType[]>([]);
    const [loading, setLoading] = useState<boolean>(!!userId);
    const [error, setError] = useState<Error | null>(null);

    // Convert options and userId to a stable string for dependency tracking
    const optionsKey = JSON.stringify({ ...options, userId });

    const fetchUserPrompts = useCallback(async () => {
        if (!userId) {
            setPrompts([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const fetchedPrompts = await getUserPrompts(userId, options);
            setPrompts(fetchedPrompts);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionsKey, userId]);

    // Fetch prompts on mount or when userId/options change
    useEffect(() => {
        fetchUserPrompts();
    }, [fetchUserPrompts]);

    return {
        prompts,
        loading,
        error,
        refetch: fetchUserPrompts,
    };
}
