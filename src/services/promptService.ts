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
    categories?: PromptCategory[]; // Support for multiple categories
    tags?: PromptTag[];
    orderByField?: 'createdAt' | 'updatedAt' | 'favoriteCount' | 'title';
    orderDirection?: 'asc' | 'desc';
    limitTo?: number;
    searchQuery?: string; // Text search capability
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

        // Handle category filtering - prioritize categories array over single category
        if (options.categories && options.categories.length > 0) {
            // Firestore supports in query for up to 10 values
            if (options.categories.length <= 10) {
                constraints.push(where('category', 'in', options.categories));
            } else {
                // If more than 10 categories, we'll need to perform client-side filtering later
                console.warn(
                    'More than 10 categories provided, some filtering will be done client-side'
                );
                constraints.push(
                    where('category', 'in', options.categories.slice(0, 10))
                );
            }
        } else if (options.category) {
            constraints.push(where('category', '==', options.category));
        }

        // Apply tag filtering if provided
        if (options.tags && options.tags.length > 0) {
            // Firestore can only filter on array-contains for a single value
            // For multiple tags, we use array-contains-any (up to 10 values)
            if (options.tags.length === 1) {
                constraints.push(
                    where('tags', 'array-contains', options.tags[0])
                );
            } else {
                // For multiple tags (up to 10), we can use array-contains-any
                constraints.push(
                    where(
                        'tags',
                        'array-contains-any',
                        options.tags.length <= 10
                            ? options.tags
                            : options.tags.slice(0, 10)
                    )
                );

                if (options.tags.length > 10) {
                    console.warn(
                        'More than 10 tags provided, some filtering will be done client-side'
                    );
                }
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

        let results = querySnapshot.docs
            .map((doc) => convertDocToPrompt(doc))
            .filter((prompt): prompt is PromptType => prompt !== null);

        // Handle text search (client-side filtering since Firestore doesn't support full-text search)
        if (options.searchQuery && options.searchQuery.trim() !== '') {
            const searchTerms = options.searchQuery
                .toLowerCase()
                .trim()
                .split(/\s+/);

            results = results.filter((prompt) => {
                const titleText = prompt.title.toLowerCase();
                const descriptionText = prompt.description?.toLowerCase() || '';
                const contentText = prompt.content.toLowerCase();

                // Check if all search terms appear in at least one of the fields
                return searchTerms.every(
                    (term) =>
                        titleText.includes(term) ||
                        descriptionText.includes(term) ||
                        contentText.includes(term)
                );
            });
        }

        // Handle additional client-side filtering for excess categories (if needed)
        if (options.categories && options.categories.length > 10) {
            const remainingCategories = options.categories.slice(10);
            results = results.filter((prompt) =>
                remainingCategories.includes(prompt.category)
            );
        }

        // Handle additional client-side filtering for excess tags (if needed)
        if (options.tags && options.tags.length > 10) {
            const remainingTags = options.tags.slice(10);
            results = results.filter((prompt) =>
                prompt.tags.some((tag) =>
                    remainingTags.includes(tag as PromptTag)
                )
            );
        }

        return results;
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
