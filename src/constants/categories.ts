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
    ASSISTANT = 'Assistant',
    INSTRUCTION = 'Instruction',
    RULES = 'Rules',
    PROJECT_CONTEXT = 'Project Context',
    DOCUMENTATION = 'Documentation',
    OTHER = 'Other',
}

/**
 * Array of all available prompt categories
 * Useful for dropdowns and filtering components
 */
export const PROMPT_CATEGORIES = Object.values(PromptCategory);
