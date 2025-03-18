/**
 * File: src/services/promptService.ts
 *
 * Description: Service for managing prompts in Firestore, providing CRUD operations
 * and specialized query methods.
 *
 */

import { db } from '@/config/firebase';
import { PromptCategory, PromptTag } from '@/constants';
import { CreatePromptType, PromptType, UpdatePromptType } from '@/types/prompt';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentSnapshot,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    QueryConstraint,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore';

// Collection reference for prompts
const PROMPTS_COLLECTION = 'prompts';
const promptsRef = collection(db, PROMPTS_COLLECTION);

/**
 * Converts a Firestore document into a typed Prompt object
 * @param doc The Firestore document to convert
 * @returns A properly typed PromptType object
 */
const convertDocToPrompt = (doc: DocumentSnapshot): PromptType | null => {
    if (!doc.exists()) {
        return null;
    }

    const data = doc.data();
    return {
        id: doc.id,
        title: data.title,
        description: data.description || '',
        content: data.content,
        tags: data.tags,
        category: data.category as PromptCategory,
        authorId: data.authorId,
        isPublic: data.isPublic,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        favoriteCount: data.favoriteCount || 0,
    };
};

/**
 * Creates a new prompt in the database
 * @param promptData Data for the new prompt
 * @returns The created prompt with its ID
 */
export const createPrompt = async (
    promptData: CreatePromptType
): Promise<PromptType> => {
    try {
        // Add timestamps
        const promptWithTimestamps = {
            ...promptData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            favoriteCount: 0,
        };

        const docRef = await addDoc(promptsRef, promptWithTimestamps);
        const newPromptSnapshot = await getDoc(docRef);

        const newPrompt = convertDocToPrompt(newPromptSnapshot);
        if (!newPrompt) {
            throw new Error(
                'Failed to create prompt - document not found after creation'
            );
        }

        return newPrompt;
    } catch (error) {
        console.error('Error creating prompt:', error);
        throw new Error(
            `Failed to create prompt: ${
                error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
};

/**
 * Retrieves a prompt by its ID
 * @param promptId The ID of the prompt to retrieve
 * @returns The prompt data or null if not found
 */
export const getPromptById = async (
    promptId: string
): Promise<PromptType | null> => {
    try {
        const promptDoc = await getDoc(doc(db, PROMPTS_COLLECTION, promptId));
        return convertDocToPrompt(promptDoc);
    } catch (error) {
        console.error(`Error fetching prompt ${promptId}:`, error);
        throw new Error(
            `Failed to fetch prompt: ${
                error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
};

/**
 * Updates an existing prompt
 * @param promptId The ID of the prompt to update
 * @param updateData The fields to update
 * @returns The updated prompt data
 */
export const updatePrompt = async (
    promptId: string,
    updateData: UpdatePromptType
): Promise<PromptType> => {
    try {
        const promptRef = doc(db, PROMPTS_COLLECTION, promptId);

        // Ensure updatedAt is set
        const updates = {
            ...updateData,
            updatedAt: serverTimestamp(),
        };

        await updateDoc(promptRef, updates);

        const updatedPromptSnapshot = await getDoc(promptRef);
        const updatedPrompt = convertDocToPrompt(updatedPromptSnapshot);

        if (!updatedPrompt) {
            throw new Error(
                'Failed to update prompt - document not found after update'
            );
        }

        return updatedPrompt;
    } catch (error) {
        console.error(`Error updating prompt ${promptId}:`, error);
        throw new Error(
            `Failed to update prompt: ${
                error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
};

/**
 * Deletes a prompt from the database
 * @param promptId The ID of the prompt to delete
 * @returns True if the operation was successful
 */
export const deletePrompt = async (promptId: string): Promise<boolean> => {
    try {
        const promptRef = doc(db, PROMPTS_COLLECTION, promptId);
        await deleteDoc(promptRef);
        return true;
    } catch (error) {
        console.error(`Error deleting prompt ${promptId}:`, error);
        throw new Error(
            `Failed to delete prompt: ${
                error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
};

/**
 * Interface for prompt query options
 */
export interface PromptQueryOptions {
    authorId?: string;
    isPublic?: boolean;
    category?: PromptCategory;
    tags?: PromptTag[];
    orderByField?: 'createdAt' | 'updatedAt' | 'favoriteCount';
    orderDirection?: 'asc' | 'desc';
    limitTo?: number;
}

/**
 * Get prompts with filtering, sorting, and pagination
 * @param options Query options for filtering and sorting prompts
 * @returns Array of prompts matching the criteria
 */
export const getPrompts = async (
    options: PromptQueryOptions = {}
): Promise<PromptType[]> => {
    try {
        const constraints: QueryConstraint[] = [];

        // Apply filters
        if (options.authorId) {
            constraints.push(where('authorId', '==', options.authorId));
        }

        if (options.isPublic !== undefined) {
            constraints.push(where('isPublic', '==', options.isPublic));
        }

        if (options.category) {
            constraints.push(where('category', '==', options.category));
        }

        // Apply tag filtering if provided
        if (options.tags && options.tags.length > 0) {
            // Firestore can only filter on array-contains for a single value
            // For multiple tags, we would need a more complex solution or multiple queries
            if (options.tags.length === 1) {
                constraints.push(
                    where('tags', 'array-contains', options.tags[0])
                );
            } else {
                // For multiple tags, we need an "array-contains-any" query
                constraints.push(
                    where('tags', 'array-contains-any', options.tags)
                );
            }
        }

        // Apply ordering
        if (options.orderByField) {
            constraints.push(
                orderBy(options.orderByField, options.orderDirection || 'desc')
            );
        } else {
            // Default sorting by creation date, newest first
            constraints.push(orderBy('createdAt', 'desc'));
        }

        // Apply limit if specified
        if (options.limitTo && options.limitTo > 0) {
            constraints.push(limit(options.limitTo));
        }

        const q = query(promptsRef, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs
            .map((doc) => convertDocToPrompt(doc))
            .filter((prompt): prompt is PromptType => prompt !== null);
    } catch (error) {
        console.error('Error fetching prompts:', error);
        throw new Error(
            `Failed to fetch prompts: ${
                error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
};

/**
 * Get public prompts with optional filtering
 * @param options Additional query options
 * @returns Array of public prompts
 */
export const getPublicPrompts = async (
    options: Omit<PromptQueryOptions, 'isPublic'> = {}
): Promise<PromptType[]> => {
    return getPrompts({
        ...options,
        isPublic: true,
    });
};

/**
 * Get prompts created by a specific user
 * @param userId The ID of the user
 * @param options Additional query options
 * @returns Array of prompts created by the user
 */
export const getUserPrompts = async (
    userId: string,
    options: Omit<PromptQueryOptions, 'authorId'> = {}
): Promise<PromptType[]> => {
    return getPrompts({
        ...options,
        authorId: userId,
    });
};
