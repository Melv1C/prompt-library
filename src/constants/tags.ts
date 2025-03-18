/**
 * File: src/constants/tags.ts
 *
 * Description: Defines the available tags for prompts in the application
 *
 */

/**
 * Enum of available prompt tags
 * Used for tagging prompts and filtering
 */
export enum PromptTag {
    // Prompt types
    SYSTEM = 'System Prompt',
    USER = 'User Prompt',
    INSTRUCTION = 'Instruction',
    TEMPLATE = 'Template',

    // IDE AI Assistants
    COPILOT = 'GitHub Copilot',
    CURSOR = 'Cursor',

    // Rule types
    RULES = 'Rules',
    GUIDELINES = 'Guidelines',
    CONSTRAINTS = 'Constraints',
    POLICIES = 'Policies',

    // Programming languages
    PYTHON = 'Python',
    TYPESCRIPT = 'TypeScript',
    JAVASCRIPT = 'JavaScript',
    JAVA = 'Java',
    CSHARP = 'C#',
    CPP = 'C++',
    RUST = 'Rust',
    GO = 'Go',
    PHP = 'PHP',
    RUBY = 'Ruby',
    SQL = 'SQL',
    HTML_CSS = 'HTML/CSS',

    // Frameworks & Technologies
    REACT = 'React',
    EXPRESS = 'Express',
    VUE = 'Vue',
    NEXT = 'Next.js',
    FIREBASE = 'Firebase',
    DOCKER = 'Docker',
    KUBERNETES = 'Kubernetes',
    GRAPHQL = 'GraphQL',
    REST = 'REST API',
    AWS = 'AWS',
    AZURE = 'Azure',
    GCP = 'Google Cloud',

    // Languages
    EN = 'English',
    FR = 'French',

    // Use cases
    CODING = 'Coding',
    WRITING = 'Writing',
    BRAINSTORMING = 'Brainstorming',
    TRANSLATION = 'Translation',
    SUMMARIZATION = 'Summarization',
    DATA_ANALYSIS = 'Data Analysis',
    DEBUGGING = 'Debugging',

    // Content formats
    ACADEMIC = 'Academic',
    CREATIVE = 'Creative',
    TECHNICAL = 'Technical',
    BUSINESS = 'Business',
    DOCUMENTATION = 'Documentation',
}

/**
 * Array of all available prompt tags
 * Useful for tag selection components and filtering
 */
export const PROMPT_TAGS = Object.values(PromptTag);

/**
 * Tag groups for better organization in UI components
 * Makes it easier to display tags in categorized sections
 */
export const TAG_GROUPS = {
    PROMPT_TYPES: [
        PromptTag.SYSTEM,
        PromptTag.USER,
        PromptTag.INSTRUCTION,
        PromptTag.TEMPLATE,
    ],
    IDE_AI_ASSISTANTS: [PromptTag.COPILOT, PromptTag.CURSOR],
    RULES: [
        PromptTag.RULES,
        PromptTag.GUIDELINES,
        PromptTag.CONSTRAINTS,
        PromptTag.POLICIES,
    ],
    PROGRAMMING_LANGUAGES: [
        PromptTag.PYTHON,
        PromptTag.TYPESCRIPT,
        PromptTag.JAVASCRIPT,
        PromptTag.JAVA,
        PromptTag.CSHARP,
        PromptTag.CPP,
        PromptTag.RUST,
        PromptTag.GO,
        PromptTag.PHP,
        PromptTag.RUBY,
        PromptTag.SQL,
        PromptTag.HTML_CSS,
    ],
    FRAMEWORKS_TECHNOLOGIES: [
        PromptTag.REACT,
        PromptTag.EXPRESS,
        PromptTag.VUE,
        PromptTag.NEXT,
        PromptTag.FIREBASE,
        PromptTag.DOCKER,
        PromptTag.KUBERNETES,
        PromptTag.GRAPHQL,
        PromptTag.REST,
        PromptTag.AWS,
        PromptTag.AZURE,
        PromptTag.GCP,
    ],
    LANGUAGES: [PromptTag.EN, PromptTag.FR],
    USE_CASES: [
        PromptTag.CODING,
        PromptTag.WRITING,
        PromptTag.BRAINSTORMING,
        PromptTag.TRANSLATION,
        PromptTag.SUMMARIZATION,
        PromptTag.DATA_ANALYSIS,
        PromptTag.DEBUGGING,
    ],
    CONTENT_FORMATS: [
        PromptTag.ACADEMIC,
        PromptTag.CREATIVE,
        PromptTag.TECHNICAL,
        PromptTag.BUSINESS,
        PromptTag.DOCUMENTATION,
    ],
};
