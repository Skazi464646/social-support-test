/**
 * AI Assist Button Component
 * Module 5 - Step 1: Real OpenAI Integration
 */

import { useState } from 'react';
import { openAIService, getFieldExamples } from '@/lib/ai';
import { AI_RATE_LIMIT, AI_MESSAGES } from '@/constants';
import type { AIAssistRequest } from '@/lib/api/openai-service';
import type { AIAssistButtonProps } from './AIAssistButton.types';

export function AIAssistButton({
  fieldName,
  currentValue,
  onSuggestionAccept,
  userContext = {},
  className = "absolute top-2 right-2 px-3 py-1 text-xs rounded border transition-colors bg-primary-light text-primary-light-foreground border-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
}: AIAssistButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!openAIService.isAvailable) {
      alert('AI assistance is not available. Please check your configuration.');
      return;
    }

    // Check rate limits before starting
    const rateLimitStatus = openAIService.getRateLimitStatus();
    if (rateLimitStatus.tokensAvailable < AI_RATE_LIMIT.minTokensAvailable) {
      const retrySeconds = Math.ceil(rateLimitStatus.retryAfter / 1000);
      alert(`Rate limit reached. Please wait ${retrySeconds} seconds before trying again.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: AIAssistRequest = {
        fieldName,
        currentValue,
        userContext,
        language: 'en',
      };

      const response = await openAIService.generateSuggestion(request);
      onSuggestionAccept(response.suggestion);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : AI_MESSAGES.errors.unknownError;
      setError(errorMessage);
      
      // Show user-friendly error messages
      if (errorMessage.includes('Rate limit exceeded')) {
        alert(AI_MESSAGES.errors.rateLimitAlert);
      } else if (errorMessage.includes(AI_MESSAGES.errors.requestCancelled)) {
        // Don't show alert for cancelled requests
      } else {
        alert(`AI Error: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const examples = getFieldExamples(fieldName);
  const hasExamples = examples.length > 0;

  return (
    <div className="relative">
      <button 
        type="button"
        className={className}
        onClick={handleClick}
        disabled={isLoading}
          title={isLoading ? AI_MESSAGES.button.generating : AI_MESSAGES.button.defaultTitle}
      >
        {isLoading ? (
          <>
            <span className="animate-spin inline-block w-3 h-3 border border-current border-t-transparent rounded-full mr-1"></span>
            Thinking...
          </>
        ) : (
          '✨ Help me write'
        )}
      </button>
      
      {hasExamples && (
        <button
          type="button"
          className="absolute -bottom-6 right-0 text-xs underline text-primary hover:text-primary/80"
          onClick={() => {
            const exampleText = examples[Math.floor(Math.random() * examples.length)];
            if (exampleText) {
              onSuggestionAccept(exampleText);
            }
          }}
              title={AI_MESSAGES.button.useSampleTitle}
        >
          Use example
        </button>
      )}
    </div>
  );
}
