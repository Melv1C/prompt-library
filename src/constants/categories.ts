/**
 * File: src/constants/categories.ts
 *
 * Description: Defines the available categories for prompts in the application
 *
 */

/**
 * Enum of available prompt categories
 * Used for categorizing prompts and filtering
 */
export enum PromptCategory {
    // AI Assistant prompt categories
    ASSISTANT = 'Assistant',
    INSTRUCTION = 'Instruction',
    PERSONA = 'Persona',

    // Knowledge and context categories
    PROJECT_CONTEXT = 'Project Context',
    DOMAIN_KNOWLEDGE = 'Domain Knowledge',

    // Meta categories
    UTILITY = 'Utility',
    OTHER = 'Other',
}

/**
 * Array of all available prompt categories
 * Useful for dropdowns and filtering components
 */
export const PROMPT_CATEGORIES = Object.values(PromptCategory);
