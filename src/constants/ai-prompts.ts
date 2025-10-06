/**
 * AI Prompt Constants
 * Contains all AI-related constants for prompt templates and configurations
 */

// =============================================================================
// WORD COUNT LIMITS FOR AI PROMPTS
// =============================================================================

export const AI_WORD_LIMITS = {
  FINANCIAL_SITUATION: {
    MIN: 50,
    MAX: 200,
    SENTENCES: '2-4 sentences',
  },
  EMPLOYMENT_CIRCUMSTANCES: {
    MIN: 40,
    MAX: 150,
    SENTENCES: '2-3 sentences',
  },
  REASON_FOR_APPLYING: {
    MIN: 60,
    MAX: 200,
    SENTENCES: '2-4 sentences',
  },
  ADDITIONAL_COMMENTS: {
    MIN: 30,
    MAX: 150,
    SENTENCES: '1-3 sentences',
  },
} as const;

// =============================================================================
// AI FIELD CATEGORIES
// =============================================================================

export const AI_FIELD_CATEGORIES = {
  FINANCIAL: 'financial',
  EMPLOYMENT: 'employment',
  DESCRIPTIVE: 'descriptive',
  PERSONAL: 'personal',
} as const;

// =============================================================================
// SITUATION TYPES
// =============================================================================

export const SITUATION_TYPES = {
  UNEMPLOYMENT: 'unemployment',
  MEDICAL_EMERGENCY: 'medical_emergency',
  HOUSING_CRISIS: 'housing_crisis',
  FINANCIAL_INSTABILITY: 'financial_instability',
  GENERAL_SUPPORT: 'general_support',
} as const;

// =============================================================================
// URGENCY LEVELS
// =============================================================================

export const URGENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// =============================================================================
// PROMPT STRATEGIES
// =============================================================================

export const PROMPT_STRATEGIES = {
  ENHANCE: 'enhance',
  GENERATE: 'generate',
  REDIRECT: 'redirect',
} as const;

// =============================================================================
// CONTENT ANALYSIS THRESHOLDS
// =============================================================================

export const CONTENT_THRESHOLDS = {
  MIN_CHARS: 10,
  MIN_WORDS: 3,
  RELEVANCY_THRESHOLD: 50,
  COMPLETENESS_THRESHOLD: 70,
} as const;

// =============================================================================
// AI MODAL CONFIGURATION
// =============================================================================

export const AI_MODAL_CONFIG = {
  MAX_WIDTH: 'max-w-2xl',
  ANIMATION_DURATION: 200,
  LOADING_SKELETON_LINES: 3,
} as const;

// =============================================================================
// EXAMPLE GENERATION LIMITS
// =============================================================================

export const EXAMPLE_LIMITS = {
  MAX_EXAMPLES: 3,
  MIN_USER_INPUT: 10,
  SENTENCE_RANGE: '2-4 sentences',
} as const;

// =============================================================================
// AI GUIDANCE MESSAGES
// =============================================================================

export const AI_GUIDANCE = {
  TONE: {
    PROFESSIONAL: 'professional',
    RESPECTFUL: 'respectful', 
    FACTUAL: 'factual',
    FORWARD_LOOKING: 'forward-looking',
  },
  FOCUS_AREAS: {
    CIRCUMSTANCES: 'circumstances',
    SPECIFIC_IMPACT: 'specific impact',
    TIMEFRAME: 'timeframe',
    ASSISTANCE_TYPE: 'assistance type',
  },
} as const;

// =============================================================================
// FIELD INTELLIGENCE SCORING
// =============================================================================

export const INTELLIGENCE_SCORING = {
  COMPLETENESS: {
    EXCELLENT: 90,
    GOOD: 70,
    FAIR: 50,
    POOR: 30,
  },
  RELEVANCY: {
    HIGHLY_RELEVANT: 90,
    RELEVANT: 70,
    SOMEWHAT_RELEVANT: 50,
    IRRELEVANT: 30,
  },
} as const;

// =============================================================================
// INCOME THRESHOLDS FOR CONTEXT
// =============================================================================

export const INCOME_THRESHOLDS = {
  NO_INCOME: 0,
  LOW_INCOME: 2000,
  MODERATE_INCOME: 5000,
  HIGHER_INCOME: 10000,
} as const;

// =============================================================================
// TIME REFERENCES
// =============================================================================

export const TIME_REFERENCES = {
  IMMEDIATE: 'immediate',
  SHORT_TERM: 'short-term',
  MEDIUM_TERM: 'medium-term',
  LONG_TERM: 'long-term',
  MONTHS: {
    THREE: 3,
    SIX: 6,
    EIGHT: 8,
    TWELVE: 12,
  },
} as const;

// =============================================================================
// LANGUAGE SETTINGS
// =============================================================================

export const AI_LANGUAGES = {
  ENGLISH: 'en',
  ARABIC: 'ar',
} as const;

// =============================================================================
// FIELD LABELS FOR AI
// =============================================================================

export const AI_FIELD_LABELS = {
  FINANCIAL_SITUATION: 'financial situation',
  EMPLOYMENT_CIRCUMSTANCES: 'employment circumstances',
  REASON_FOR_APPLYING: 'reason for applying',
  CURRENT_FINANCIAL_NEED: 'current financial need',
  MONTHLY_EXPENSES: 'monthly expenses',
  EMERGENCY_DESCRIPTION: 'emergency description',
  ADDITIONAL_COMMENTS: 'additional comments',
} as const;

// =============================================================================
// MODAL TITLES AND DESCRIPTIONS
// =============================================================================

export const AI_MODAL_CONTENT = {
  TITLES: {
    FINANCIAL_SITUATION: '💰 Describe Your Financial Situation',
    EMPLOYMENT_CIRCUMSTANCES: '💼 Describe Your Employment Circumstances',
    REASON_FOR_APPLYING: '📋 Explain Your Reason for Applying',
    CURRENT_FINANCIAL_NEED: '💸 Describe Your Current Financial Need',
    MONTHLY_EXPENSES: '📊 Detail Your Monthly Expenses',
    EMERGENCY_DESCRIPTION: '🚨 Describe Your Emergency Situation',
    DEFAULT: '✨ AI Writing Assistant',
  },
  PLACEHOLDERS: {
    FINANCIAL_SITUATION: 'Describe your income, expenses, debts, and any financial difficulties you\'re experiencing...',
    EMPLOYMENT_CIRCUMSTANCES: 'Describe your current employment status, work history, and any barriers to employment...',
    REASON_FOR_APPLYING: 'Explain why you\'re applying for assistance and how it will help your specific situation...',
    CURRENT_FINANCIAL_NEED: 'Detail your urgent financial needs and specific amounts if known...',
    MONTHLY_EXPENSES: 'List your monthly expenses including rent, utilities, food, transportation...',
    EMERGENCY_DESCRIPTION: 'Describe the emergency situation and why immediate help is needed...',
  },
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type SituationType = typeof SITUATION_TYPES[keyof typeof SITUATION_TYPES];
export type UrgencyLevel = typeof URGENCY_LEVELS[keyof typeof URGENCY_LEVELS];
export type PromptStrategy = typeof PROMPT_STRATEGIES[keyof typeof PROMPT_STRATEGIES];
export type AIFieldCategory = typeof AI_FIELD_CATEGORIES[keyof typeof AI_FIELD_CATEGORIES];
export type AILanguage = typeof AI_LANGUAGES[keyof typeof AI_LANGUAGES];
export type AIGuidanceTone = typeof AI_GUIDANCE.TONE[keyof typeof AI_GUIDANCE.TONE];