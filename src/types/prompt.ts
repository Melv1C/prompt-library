/**
 * File: src/types/prompt.ts
 *
 * Description: Zod schemas and inferred types for Prompt-related data structures
 *
 */

import { PromptCategory, PromptTag } from '@/constants';
import { z } from 'zod';

// Base Prompt Schema with all required fields and validation rules
export const PromptSchema = z.object({
    id: z.string().min(1, 'Prompt ID cannot be empty'),
    title: z
        .string()
        .min(1, 'Title is required')
        .max(100, 'Title cannot exceed 100 characters')
        .trim(),
    description: z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .optional()
        .transform((val) => val || ''), // Convert undefined to empty string
    content: z
        .string()
        .min(1, 'Content is required')
        .max(10000, 'Content cannot exceed 10,000 characters'),
    tags: z
        .array(z.nativeEnum(PromptTag))
        .max(10, 'Cannot have more than 10 tags')
        .default([]), // Default to empty array, we'll enforce minimum in the form
    category: z
        .nativeEnum(PromptCategory, {
            errorMap: () => ({ message: 'Please select a valid category' }),
        })
        .default(PromptCategory.OTHER),
    authorId: z.string().min(1, 'Author ID cannot be empty'),
    isPublic: z.boolean().default(false),
    createdAt: z.coerce.date(), // Will convert timestamps, strings, etc. to Date objects
    updatedAt: z.coerce.date(), // Will convert timestamps, strings, etc. to Date objects
    favoriteCount: z
        .number()
        .int('Favorite count must be an integer')
        .nonnegative('Favorite count cannot be negative')
        .default(0),
});

// Inferred type from the schema
export type PromptType = z.infer<typeof PromptSchema>;

// Schema for creating a new prompt (omits auto-generated fields)
export const CreatePromptSchema = PromptSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    favoriteCount: true,
}).extend({
    // Ensure content is properly validated for new prompts
    content: z
        .string()
        .min(1, 'Content is required')
        .max(10000, 'Content cannot exceed 10,000 characters')
        .trim(),
});

export type CreatePromptType = z.infer<typeof CreatePromptSchema>;

// Schema for updating an existing prompt (all fields optional except id)
export const UpdatePromptSchema = CreatePromptSchema.extend({
    id: z.string().min(1, 'Prompt ID cannot be empty'), // ID is required for updates
    updatedAt: z.coerce.date(), // Updated at is optional for updates
})

export type UpdatePromptType = z.infer<typeof UpdatePromptSchema>;
