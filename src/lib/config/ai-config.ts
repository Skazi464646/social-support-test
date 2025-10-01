/**
 * AI Service Configuration
 * Module 5 - Step 1: Setup AI Configuration & Service Foundation
 */

export interface AIConfig {
  enabled: boolean;
  openai: {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
    timeout: number;
  };
  endpoints: {
    suggestion: string;
    completion: string;
  };
  features: {
    realTimeAssistance: boolean;
    contextualSuggestions: boolean;
    multiLanguageSupport: boolean;
  };
  security: {
    rateLimitPerMinute: number;
    maxRequestsPerUser: number;
    enableContentFiltering: boolean;
  };
}

/**
 * Validates environment variables and creates AI configuration
 */
function createAIConfig(): AIConfig {
  const {
    VITE_AI_ENABLED,
    VITE_OPENAI_API_KEY,
    VITE_AI_ENDPOINT,
  } = import.meta.env;

  // Validate required environment variables
  if (VITE_AI_ENABLED === 'true' && !VITE_OPENAI_API_KEY) {
    throw new Error('VITE_OPENAI_API_KEY is required when AI is enabled');
  }

  if (VITE_AI_ENABLED === 'true' && !VITE_AI_ENDPOINT) {
    throw new Error('VITE_AI_ENDPOINT is required when AI is enabled');
  }

  const isEnabled = VITE_AI_ENABLED === 'true';

  return {
    enabled: isEnabled,
    openai: {
      apiKey: VITE_OPENAI_API_KEY || '',
      model: 'gpt-4-turbo-preview',
      maxTokens: 1000,
      temperature: 0.7,
      timeout: 30000,
    },
    endpoints: {
      suggestion: `${VITE_AI_ENDPOINT}/suggestion`,
      completion: `${VITE_AI_ENDPOINT}/completion`,
    },
    features: {
      realTimeAssistance: isEnabled,
      contextualSuggestions: isEnabled,
      multiLanguageSupport: true,
    },
    security: {
      rateLimitPerMinute: 10,
      maxRequestsPerUser: 50,
      enableContentFiltering: true,
    },
  };
}

export const aiConfig = createAIConfig();

/**
 * Feature flags for AI functionality
 */
export const AI_FEATURES = {
  SUGGESTION_GENERATION: aiConfig.enabled && aiConfig.features.contextualSuggestions,
  REAL_TIME_ASSISTANCE: aiConfig.enabled && aiConfig.features.realTimeAssistance,
  MULTI_LANGUAGE: aiConfig.features.multiLanguageSupport,
  CONTENT_FILTERING: aiConfig.security.enableContentFiltering,
} as const;

/**
 * AI model configurations for different use cases
 */
export const AI_MODELS = {
  SUGGESTION: {
    model: 'gpt-4-turbo-preview',
    maxTokens: 500,
    temperature: 0.7,
  },
  COMPLETION: {
    model: 'gpt-4-turbo-preview',
    maxTokens: 1000,
    temperature: 0.5,
  },
  TRANSLATION: {
    model: 'gpt-4-turbo-preview',
    maxTokens: 800,
    temperature: 0.3,
  },
} as const;