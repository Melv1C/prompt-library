/**
 * File: src/hooks/useMultipleFavoriteStatuses.ts
 *
 * Description: Custom hook to fetch favorite status for multiple prompts at once
 * to avoid calling hooks in loops
 *
 */

import { checkMultipleFavorites } from '@/services/favoriteService';
import { userAtom } from '@/store/authAtom';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook to get favorite status for multiple prompts at once
 * @param promptIds - Array of prompt IDs to check favorite status for
 * @returns Object with promptId keys and favorite status values, plus loading state
 */
export function useMultipleFavoriteStatuses(promptIds: string[]) {
    const user = useAtomValue(userAtom);
    const [favoriteStatuses, setFavoriteStatuses] = useState<
        Record<string, boolean>
    >({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Get all favorite statuses at once using the service
    const fetchFavoriteStatuses = useCallback(async () => {
        // Reset when prompt IDs change
        setFavoriteStatuses({});

        // Don't fetch if not authenticated or no prompt IDs
        if (!user || promptIds.length === 0) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const statuses = await checkMultipleFavorites(user.id, promptIds);
            setFavoriteStatuses(statuses);
        } catch (err) {
            console.error('Error fetching favorite statuses:', err);
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [user, promptIds]);

    useEffect(() => {
        fetchFavoriteStatuses();
    }, [fetchFavoriteStatuses]);

    return { favoriteStatuses, loading, error };
}
