/**
 * AI Module Exports
 * Module 5 - Step 3: Field-Specific Prompt Templates
 */

// Prompt Templates
export {
  FIELD_PROMPT_TEMPLATES,
  getSystemPrompt,
  buildUserPrompt,
  getFieldExamples,
  getFieldConstraints,
  type PromptContext,
  type PromptTemplate,
} from './prompt-templates';

// Prompt Optimization
export {
  estimateTokens,
  optimizePromptLength,
  validatePromptContext,
  generatePromptVariations,
  calculatePromptEfficiency,
} from './prompt-optimizer';

// Re-export AI service
export { openAIService, type AIAssistRequest, type AIAssistResponse } from '../api/openai-service';