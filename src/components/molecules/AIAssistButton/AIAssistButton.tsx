/**
 * AI Assist Button Component
 * Module 5 - Step 1: Real OpenAI Integration
 */

import { useState } from 'react';
import { openAIService, getFieldExamples } from '@/lib/ai';
import type { AIAssistRequest } from '@/lib/api/openai-service';

interface AIAssistButtonProps {
  fieldName: string;
  currentValue: string;
  onSuggestionAccept: (suggestion: string) => void;
  userContext?: any;
  className?: string;
}

export function AIAssistButton({
  fieldName,
  currentValue,
  onSuggestionAccept,
  userContext = {},
  className = "absolute top-2 right-2 px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
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
    if (rateLimitStatus.tokensAvailable < 1) {
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
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Show user-friendly error messages
      if (errorMessage.includes('Rate limit exceeded')) {
        alert('You\'re making requests too quickly. Please wait a moment and try again.');
      } else if (errorMessage.includes('Request was cancelled')) {
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
        title={isLoading ? 'Generating suggestion...' : 'Get AI writing assistance'}
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
          className="absolute -bottom-6 right-0 text-xs text-blue-500 hover:text-blue-700 underline"
          onClick={() => {
            const exampleText = examples[Math.floor(Math.random() * examples.length)];
            if (exampleText) {
              onSuggestionAccept(exampleText);
            }
          }}
          title="Use a sample response"
        >
          Use example
        </button>
      )}
    </div>
  );
}