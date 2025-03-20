/**
 * File: src/hooks/index.ts
 *
 * Description: Exports all custom hooks for convenient imports.
 *
 */

// Export all hook functions
export { useAuth } from './useAuth';
export { usePrompt } from './usePrompt';
export {
    useCreatePrompt,
    useDeletePrompt,
    useUpdatePrompt,
} from './usePromptActions';
export { usePrompts, usePublicPrompts, useUserPrompts } from './usePrompts';
