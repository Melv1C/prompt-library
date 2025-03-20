/**
 * File: src/hooks/useFavorites.ts
 *
 * Description: React hooks for managing user favorites functionality
 * (adding, removing, checking favorites status)
 *
 */

import {
    addToFavorites,
    checkIsFavorite,
    getFavoriteCount,
    getUserFavorites,
    removeFromFavorites,
} from '@/services/favoriteService';
import { userAtom } from '@/store/authAtom';
import { PromptType } from '@/types/prompt';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

interface UseFavoriteStatusResult {
    isFavorite: boolean;
    favoriteCount: number;
    loading: boolean;
    error: Error | null;
    toggleFavorite: () => Promise<void>;
}

/**
 * Hook for checking and toggling favorite status of a single prompt
 * @param promptId ID of the prompt to check favorite status
 * @returns Object containing favorite status, loading state, error, and toggle function
 */
export function useFavoriteStatus(
    promptId: string | undefined
): UseFavoriteStatusResult {
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [favoriteCount, setFavoriteCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const currentUser = useAtomValue(userAtom);

    // Check if the prompt is in user's favorites
    const checkFavoriteStatus = useCallback(async () => {
        if (!promptId) {
            setIsFavorite(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            // Check if prompt is in favorites
            
            const favoriteStatus = currentUser
                ? await checkIsFavorite(currentUser.id, promptId)
                : false;
            setIsFavorite(favoriteStatus);

            // Get the prompt's favorite count
            const count = await getFavoriteCount(promptId);
            setFavoriteCount(count);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error('Failed to check favorite status')
            );
            console.error('Error checking favorite status:', err);
        } finally {
            setLoading(false);
        }
    }, [promptId, currentUser]);

    // Toggle favorite status
    const toggleFavorite = async () => {
        if (!promptId || !currentUser) {
            setError(new Error('You must be logged in to favorite prompts'));
            return;
        }

        try {
            setLoading(true);
            setError(null);

            if (isFavorite) {
                // Remove from favorites
                await removeFromFavorites(currentUser.id, promptId);
                setIsFavorite(false);
                setFavoriteCount((prev) => Math.max(0, prev - 1));
            } else {
                // Add to favorites
                await addToFavorites(currentUser.id, promptId);
                setIsFavorite(true);
                setFavoriteCount((prev) => prev + 1);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error('Failed to update favorite status')
            );
            console.error('Error toggling favorite:', err);
        } finally {
            setLoading(false);
        }
    };

    // Check favorite status on mount or when promptId/user changes
    useEffect(() => {
        checkFavoriteStatus();
    }, [checkFavoriteStatus]);

    return {
        isFavorite,
        favoriteCount,
        loading,
        error,
        toggleFavorite,
    };
}

interface UseFavoritePromptsResult {
    favoritePrompts: PromptType[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Hook for fetching all favorite prompts of the current user
 * @returns Object containing favorite prompts array, loading state, error state, and refetch function
 */
export function useFavoritePrompts(): UseFavoritePromptsResult {
    const [favoritePrompts, setFavoritePrompts] = useState<PromptType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const currentUser = useAtomValue(userAtom);

    const fetchFavorites = useCallback(async () => {
        if (!currentUser) {
            setFavoritePrompts([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const prompts = await getUserFavorites(currentUser.id);
            setFavoritePrompts(prompts);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error('Failed to fetch favorite prompts')
            );
            console.error('Error fetching favorites:', err);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    // Fetch favorites on mount or when user changes
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    return {
        favoritePrompts,
        loading,
        error,
        refetch: fetchFavorites,
    };
}
