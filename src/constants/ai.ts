// Centralized AI-related constants

export const AI_ENDPOINTS = {
  openaiChatCompletions: 'https://api.openai.com/v1/chat/completions',
} as const;

export const AI_MODELS = {
  defaultModel: 'gpt-4-turbo-preview',
} as const;

export const AI_SUGGESTION = {
  maxTokens: 500,
  temperature: 0.7,
  stream: true as const,
  optimizedPromptMaxTokens: 400,
} as const;

export const AI_EXAMPLES = {
  maxTokens: 1000,
  temperature: 0.7,
  stream: false as const,
} as const;

export const AI_RELEVANCY = {
  maxTokens: 200,
  temperature: 0.3,
  stream: false as const,
  threshold: 70,
} as const;

export const AI_FIELD_DEFAULTS = {
  minLength: 50,
  maxLength: 1000,
  hasUserInputMinChars: 10,
} as const;

export const AI_RATE_LIMIT = {
  minTokensAvailable: 1,
} as const;


