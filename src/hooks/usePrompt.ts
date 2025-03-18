/**
 * File: src/hooks/usePrompt.ts
 *
 * Description: React hook for fetching and managing a single prompt by ID
 *
 */

import { getPromptById } from '@/services/promptService';
import { PromptType } from '@/types/prompt';
import { useCallback, useEffect, useState } from 'react';

interface UsePromptResult {
    prompt: PromptType | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing a single prompt
 * @param promptId The ID of the prompt to fetch (undefined will return null prompt)
 * @returns Object containing prompt data, loading state, error state, and refetch function
 */
export function usePrompt(promptId: string | undefined): UsePromptResult {
    const [prompt, setPrompt] = useState<PromptType | null>(null);
    const [loading, setLoading] = useState<boolean>(!!promptId);
    const [error, setError] = useState<Error | null>(null);

    const fetchPrompt = useCallback(async () => {
        if (!promptId) {
            setPrompt(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const promptData = await getPromptById(promptId);
            setPrompt(promptData);
        } catch (err) {
            setError(
                err instanceof Error ? err : new Error('Failed to fetch prompt')
            );
            console.error('Error in usePrompt:', err);
        } finally {
            setLoading(false);
        }
    }, [promptId]);

    // Fetch prompt on mount or when promptId changes
    useEffect(() => {
        fetchPrompt();
    }, [fetchPrompt]);

    return {
        prompt,
        loading,
        error,
        refetch: fetchPrompt,
    };
}
