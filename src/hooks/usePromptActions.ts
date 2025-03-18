/**
 * File: src/hooks/usePromptActions.ts
 *
 * Description: React hooks for performing CRUD operations on prompts
 * (create, update, delete) with loading and error states
 *
 */

import {
    createPrompt,
    deletePrompt,
    updatePrompt,
} from '@/services/promptService';
import { CreatePromptType, PromptType, UpdatePromptType } from '@/types/prompt';
import { useState } from 'react';

interface PromptActionState<T = undefined> {
    loading: boolean;
    error: Error | null;
    success: boolean;
    data: T | null;
}

interface UseCreatePromptResult {
    createPromptAction: (
        promptData: CreatePromptType
    ) => Promise<PromptType | null>;
    state: PromptActionState<PromptType>;
    resetState: () => void;
}

/**
 * Hook for creating new prompts
 * @returns Object containing create function, state (loading, error, success, data), and reset function
 */
export function useCreatePrompt(): UseCreatePromptResult {
    const [state, setState] = useState<PromptActionState<PromptType>>({
        loading: false,
        error: null,
        success: false,
        data: null,
    });

    const resetState = () => {
        setState({
            loading: false,
            error: null,
            success: false,
            data: null,
        });
    };

    const createPromptAction = async (
        promptData: CreatePromptType
    ): Promise<PromptType | null> => {
        try {
            setState({
                loading: true,
                error: null,
                success: false,
                data: null,
            });
            const newPrompt = await createPrompt(promptData);
            setState({
                loading: false,
                error: null,
                success: true,
                data: newPrompt,
            });
            return newPrompt;
        } catch (err) {
            const error =
                err instanceof Error
                    ? err
                    : new Error('Failed to create prompt');
            setState({ loading: false, error, success: false, data: null });
            console.error('Error in useCreatePrompt:', err);
            return null;
        }
    };

    return {
        createPromptAction,
        state,
        resetState,
    };
}

interface UseUpdatePromptResult {
    updatePromptAction: (
        promptId: string,
        updateData: UpdatePromptType
    ) => Promise<PromptType | null>;
    state: PromptActionState<PromptType>;
    resetState: () => void;
}

/**
 * Hook for updating existing prompts
 * @returns Object containing update function, state (loading, error, success, data), and reset function
 */
export function useUpdatePrompt(): UseUpdatePromptResult {
    const [state, setState] = useState<PromptActionState<PromptType>>({
        loading: false,
        error: null,
        success: false,
        data: null,
    });

    const resetState = () => {
        setState({
            loading: false,
            error: null,
            success: false,
            data: null,
        });
    };

    const updatePromptAction = async (
        promptId: string,
        updateData: UpdatePromptType
    ): Promise<PromptType | null> => {
        try {
            setState({
                loading: true,
                error: null,
                success: false,
                data: null,
            });
            const updatedPrompt = await updatePrompt(promptId, updateData);
            setState({
                loading: false,
                error: null,
                success: true,
                data: updatedPrompt,
            });
            return updatedPrompt;
        } catch (err) {
            const error =
                err instanceof Error
                    ? err
                    : new Error('Failed to update prompt');
            setState({ loading: false, error, success: false, data: null });
            console.error('Error in useUpdatePrompt:', err);
            return null;
        }
    };

    return {
        updatePromptAction,
        state,
        resetState,
    };
}

interface UseDeletePromptResult {
    deletePromptAction: (promptId: string) => Promise<boolean>;
    state: PromptActionState<boolean>;
    resetState: () => void;
}

/**
 * Hook for deleting prompts
 * @returns Object containing delete function, state (loading, error, success, data), and reset function
 */
export function useDeletePrompt(): UseDeletePromptResult {
    const [state, setState] = useState<PromptActionState<boolean>>({
        loading: false,
        error: null,
        success: false,
        data: null,
    });

    const resetState = () => {
        setState({
            loading: false,
            error: null,
            success: false,
            data: null,
        });
    };

    const deletePromptAction = async (promptId: string): Promise<boolean> => {
        try {
            setState({
                loading: true,
                error: null,
                success: false,
                data: null,
            });
            const success = await deletePrompt(promptId);
            setState({ loading: false, error: null, success, data: success });
            return success;
        } catch (err) {
            const error =
                err instanceof Error
                    ? err
                    : new Error('Failed to delete prompt');
            setState({ loading: false, error, success: false, data: null });
            console.error('Error in useDeletePrompt:', err);
            return false;
        }
    };

    return {
        deletePromptAction,
        state,
        resetState,
    };
}
