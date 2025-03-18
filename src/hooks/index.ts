/**
 * File: src/hooks/index.ts
 *
 * Description: Export file for all prompt-related hooks to simplify imports
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
