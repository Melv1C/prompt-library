/**
 * File: src/types/user.ts
 *
 * Description: Zod schemas and inferred types for User-related data structures
 *
 */

import { z } from 'zod';

// Base User Schema with all required fields and validation rules
export const UserSchema = z.object({
    id: z.string().min(1, 'User ID cannot be empty'),
    displayName: z
        .string()
        .min(2, 'Display name must be at least 2 characters')
        .max(50, 'Display name cannot exceed 50 characters'),
    email: z
        .string()
        .email('Valid email address is required'),
    photoURL: z
        .string()
        .url('Valid URL is required')
        .or(z.literal('')) // Allow an empty string as an alternative
        .default(''), // Default to empty string if not provided
    createdAt: z.coerce.date(), // Will convert timestamps, strings, etc. to Date objects
    favoritePrompts: z
        .array(z.string().min(1, 'Prompt ID cannot be empty'))
        .max(500, 'Too many favorite prompts')
        .default([]),
});

// Inferred type from the schema
export type UserType = z.infer<typeof UserSchema>;

// Schema for creating a new user (omits auto-generated fields)
export const CreateUserSchema = UserSchema.omit({
    id: true,
    createdAt: true,
    favoritePrompts: true,
});

export type CreateUserType = z.infer<typeof CreateUserSchema>;

// Schema for updating user profile (all fields optional except id)
export const UpdateUserSchema = UserSchema.omit({
    id: true,
    email: true,
    createdAt: true,
}).partial();

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;

// Schema for user authentication
export const AuthUserSchema = z.object({
    email: z
        .string()
        .email('Valid email address is required'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(72, 'Password cannot exceed 72 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
            /[^A-Za-z0-9]/,
            'Password must contain at least one special character'
        ),
});

export type AuthUserType = z.infer<typeof AuthUserSchema>;
