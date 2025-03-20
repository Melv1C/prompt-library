/**
 * File: src/services/favoriteService.ts
 *
 * Description: Service functions for managing user favorites
 * with Firebase Firestore integration
 *
 */

import { db } from '@/config/firebase';
import { PromptType } from '@/types/prompt';
import { UserType } from '@/types/user';
import {
    arrayRemove,
    arrayUnion,
    doc,
    getDoc,
    increment,
    updateDoc,
} from 'firebase/firestore';
import { getPromptById } from './promptService';

/**
 * Check if a prompt is in a user's favorites
 * @param userId User ID to check
 * @param promptId Prompt ID to check
 * @returns Boolean indicating if the prompt is favorited
 */
export async function checkIsFavorite(
    userId: string,
    promptId: string
): Promise<boolean> {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            throw new Error('User not found');
        }

        const userData = userSnap.data() as UserType;
        return userData.favoritePrompts.includes(promptId);
    } catch (error) {
        console.error('Error checking favorite status:', error);
        throw error;
    }
}

/**
 * Add a prompt to user's favorites and increment the prompt's favorite count
 * @param userId User ID adding the favorite
 * @param promptId Prompt ID to add to favorites
 */
export async function addToFavorites(
    userId: string,
    promptId: string
): Promise<void> {
    try {
        // Add to user's favorites array
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            favoritePrompts: arrayUnion(promptId),
        });

        // Increment the prompt's favorite count
        const promptRef = doc(db, 'prompts', promptId);
        await updateDoc(promptRef, {
            favoriteCount: increment(1),
        });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        throw error;
    }
}

/**
 * Remove a prompt from user's favorites and decrement the prompt's favorite count
 * @param userId User ID removing the favorite
 * @param promptId Prompt ID to remove from favorites
 */
export async function removeFromFavorites(
    userId: string,
    promptId: string
): Promise<void> {
    try {
        // Remove from user's favorites array
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            favoritePrompts: arrayRemove(promptId),
        });

        // Decrement the prompt's favorite count (ensuring it doesn't go below 0)
        const promptRef = doc(db, 'prompts', promptId);
        const promptSnap = await getDoc(promptRef);

        if (promptSnap.exists()) {
            const promptData = promptSnap.data() as PromptType;
            const newCount = Math.max(0, (promptData.favoriteCount || 0) - 1);

            await updateDoc(promptRef, {
                favoriteCount: newCount,
            });
        }
    } catch (error) {
        console.error('Error removing from favorites:', error);
        throw error;
    }
}

/**
 * Get the current favorite count for a prompt
 * @param promptId Prompt ID to get favorite count for
 * @returns The number of users who have favorited this prompt
 */
export async function getFavoriteCount(promptId: string): Promise<number> {
    try {
        const promptRef = doc(db, 'prompts', promptId);
        const promptSnap = await getDoc(promptRef);

        if (!promptSnap.exists()) {
            throw new Error('Prompt not found');
        }

        const promptData = promptSnap.data() as PromptType;
        return promptData.favoriteCount || 0;
    } catch (error) {
        console.error('Error getting favorite count:', error);
        throw error;
    }
}

/**
 * Get all prompts that a user has favorited
 * @param userId User ID to get favorites for
 * @returns Array of prompt objects that are in the user's favorites
 */
export async function getUserFavorites(userId: string): Promise<PromptType[]> {
    try {
        // Get user's favorite prompt IDs
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            throw new Error('User not found');
        }

        const userData = userSnap.data() as UserType;
        const favoriteIds = userData.favoritePrompts || [];

        if (favoriteIds.length === 0) {
            return [];
        }

        // Fetch each prompt by ID
        const prompts = await Promise.all(
            favoriteIds.map((id) => getPromptById(id))
        );

        // Filter out any null results (in case a prompt was deleted but still in favorites)
        return prompts.filter(Boolean) as PromptType[];
    } catch (error) {
        console.error('Error getting user favorites:', error);
        throw error;
    }
}

/**
 * Check if multiple prompts are in a user's favorites
 * @param userId User ID to check
 * @param promptIds Array of Prompt IDs to check
 * @returns Record mapping promptId to favorite status boolean
 */
export async function checkMultipleFavorites(
    userId: string,
    promptIds: string[]
): Promise<Record<string, boolean>> {
    try {
        if (promptIds.length === 0) {
            return {};
        }

        // Initialize all prompt IDs with false
        const statuses = promptIds.reduce<Record<string, boolean>>(
            (acc, id) => {
                acc[id] = false;
                return acc;
            },
            {}
        );

        // Get user's favorite prompt IDs
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            throw new Error('User not found');
        }

        const userData = userSnap.data() as UserType;
        const favoriteIds = userData.favoritePrompts || [];

        // Update statuses for favorites found in the user data
        promptIds.forEach((id) => {
            if (favoriteIds.includes(id)) {
                statuses[id] = true;
            }
        });

        return statuses;
    } catch (error) {
        console.error('Error checking multiple favorite statuses:', error);
        throw error;
    }
}
