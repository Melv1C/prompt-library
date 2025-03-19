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
    // Prompt Types
    TEMPLATE = 'Template',
    SYSTEM_PROMPT = 'System Prompt',
    USER_PROMPT = 'User Prompt',
    CHAIN = 'Chain Prompt',
    ONE_SHOT = 'One-Shot',
    FEW_SHOT = 'Few-Shot',
    ZERO_SHOT = 'Zero-Shot',

    // Languages
    MulTI_LANGUAGE = 'Multi-Language',
    EN = 'English',
    FR = 'French',
    ES = 'Spanish',
    DE = 'German',
    IT = 'Italian',
    PT = 'Portuguese',
    RU = 'Russian',
    ZH = 'Chinese',
    JA = 'Japanese',
    KO = 'Korean',

    // Programming Languages
    PYTHON = 'Python',
    JS_TS = 'JavaScript/TypeScript',
    HTML_CSS = 'HTML/CSS',
    JAVA = 'Java',
    C_SHARP = 'C#',
    CPP = 'C++',
    RUBY = 'Ruby',
    PHP = 'PHP',
    GO = 'Go',
    RUST = 'Rust',
    SWIFT = 'Swift',
    KOTLIN = 'Kotlin',
    SQL = 'SQL',

    // Frameworks & Technologies
    REACT = 'React',
    ANGULAR = 'Angular',
    VUE = 'Vue.js',
    NEXT = 'Next.js',
    EXPRESS = 'Express',
    DJANGO = 'Django',
    SPRING = 'Spring',
    FIREBASE = 'Firebase',
    DOCKER = 'Docker',
    KUBERNETES = 'Kubernetes',

    // Use Cases
    CODING = 'Coding',
    WRITING = 'Writing',
    TRANSLATION = 'Translation',
    SUMMARIZATION = 'Summarization',
    DATA_ANALYSIS = 'Data Analysis',
    CREATIVE = 'Creative',
    EDUCATIONAL = 'Educational',
    BUSINESS = 'Business',
    DEBUGGING = 'Debugging',
    REFACTORING = 'Refactoring',
    DOCUMENTATION = 'Documentation',
    TESTING = 'Testing',

    // Complexity
    SIMPLE = 'Simple',
    INTERMEDIATE = 'Intermediate',
    ADVANCED = 'Advanced',
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
        PromptTag.TEMPLATE,
        PromptTag.SYSTEM_PROMPT,
        PromptTag.USER_PROMPT,
        PromptTag.CHAIN,
        PromptTag.ONE_SHOT,
        PromptTag.FEW_SHOT,
        PromptTag.ZERO_SHOT,
    ],
    LANGUAGES: [
        PromptTag.EN,
        PromptTag.FR,
        PromptTag.ES,
        PromptTag.DE,
        PromptTag.IT,
        PromptTag.PT,
        PromptTag.RU,
        PromptTag.ZH,
        PromptTag.JA,
        PromptTag.KO,
    ],
    PROGRAMMING_LANGUAGES: [
        PromptTag.PYTHON,
        PromptTag.JS_TS,
        PromptTag.HTML_CSS,
        PromptTag.JAVA,
        PromptTag.C_SHARP,
        PromptTag.CPP,
        PromptTag.RUBY,
        PromptTag.PHP,
        PromptTag.GO,
        PromptTag.RUST,
        PromptTag.SWIFT,
        PromptTag.KOTLIN,
        PromptTag.SQL,
    ],
    FRAMEWORKS_TECHNOLOGIES: [
        PromptTag.REACT,
        PromptTag.ANGULAR,
        PromptTag.VUE,
        PromptTag.NEXT,
        PromptTag.EXPRESS,
        PromptTag.DJANGO,
        PromptTag.SPRING,
        PromptTag.FIREBASE,
        PromptTag.DOCKER,
        PromptTag.KUBERNETES,
    ],
    USE_CASES: [
        PromptTag.CODING,
        PromptTag.WRITING,
        PromptTag.TRANSLATION,
        PromptTag.SUMMARIZATION,
        PromptTag.DATA_ANALYSIS,
        PromptTag.CREATIVE,
        PromptTag.EDUCATIONAL,
        PromptTag.BUSINESS,
        PromptTag.DEBUGGING,
        PromptTag.REFACTORING,
        PromptTag.DOCUMENTATION,
        PromptTag.TESTING,
    ],
    COMPLEXITY: [
        PromptTag.SIMPLE,
        PromptTag.INTERMEDIATE,
        PromptTag.ADVANCED,
    ],
};
