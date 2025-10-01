/**
 * OpenAI Service - Enhanced with Security Features
 * Module 5 - Step 2: Enhanced with rate limiting, deduplication, privacy safeguards, and retry logic
 * 
 * SECURITY NOTE: This uses frontend API key for temporary implementation.
 * Will be moved to serverless endpoint in future step.
 */

import { aiRateLimiter } from '@/lib/utils/rate-limiter';
import { requestDeduplicator } from '@/lib/utils/request-deduplicator';
import { retryOpenAICall } from '@/lib/utils/retry-logic';
import { 
  redactPII, 
  sanitizeForLogging, 
  generateRequestId, 
  generateSessionId,
  validateInputSafety 
} from '@/lib/utils/privacy-utils';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens: number;
  temperature: number;
  stream: boolean;
}

interface OpenAIStreamChunk {
  choices: Array<{
    delta: {
      content?: string;
    };
    finish_reason?: string;
  }>;
}

export interface AIAssistRequest {
  fieldName: string;
  currentValue: string;
  userContext: any;
  language: 'en' | 'ar';
}

export interface AIAssistResponse {
  suggestion: string;
  requestId: string;
  metadata: {
    timestamp: number;
    tokensUsed: number;
  };
}

class OpenAIService {
  private readonly baseURL = 'https://api.openai.com/v1/chat/completions';
  private readonly apiKey: string;
  private readonly sessionId: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.sessionId = generateSessionId();
    
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. AI features will be disabled.');
    }
  }

  get isAvailable(): boolean {
    return !!this.apiKey;
  }

  async generateSuggestion(
    request: AIAssistRequest,
    requestId: string = generateRequestId()
  ): Promise<AIAssistResponse> {
    if (!this.isAvailable) {
      throw new Error('OpenAI API key not configured');
    }

    // Rate limiting check
    if (!aiRateLimiter.isAllowed(this.sessionId)) {
      const retryAfter = aiRateLimiter.getRetryAfter(this.sessionId);
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(retryAfter / 1000)} seconds.`);
    }

    // Input safety validation
    const safetyCheck = validateInputSafety(request.currentValue);
    if (!safetyCheck.safe) {
      console.warn('[OpenAI] Input safety issues detected:', safetyCheck.issues);
      // Continue but log the issues for monitoring
    }

    // Use request deduplication
    return requestDeduplicator.deduplicate(
      request.fieldName,
      request.currentValue,
      { language: request.language },
      async (abortSignal) => {
        return retryOpenAICall(async () => {
          const startTime = Date.now();
          
          try {
            const prompt = this.buildPrompt(request);
            const openAIRequest: OpenAIRequest = {
              model: 'gpt-4-turbo-preview',
              messages: [
                {
                  role: 'system',
                  content: this.getSystemPrompt(request.language)
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              max_tokens: 500,
              temperature: 0.7,
              stream: true
            };

            // Log request (sanitized)
            console.log('[OpenAI] Request:', sanitizeForLogging({
              requestId,
              fieldName: request.fieldName,
              language: request.language,
              inputLength: request.currentValue.length,
              model: openAIRequest.model,
            }));

            const response = await fetch(this.baseURL, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'X-Request-ID': requestId,
              },
              body: JSON.stringify(openAIRequest),
              signal: abortSignal,
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${redactPII(errorText)}`);
            }

            const suggestion = await this.handleStreamResponse(response, abortSignal);
            const responseTime = Date.now() - startTime;
            
            // Log successful response (sanitized)
            console.log('[OpenAI] Success:', sanitizeForLogging({
              requestId,
              responseTime,
              suggestionLength: suggestion.length,
              tokensEstimate: Math.ceil(suggestion.length / 4),
            }));

            return {
              suggestion: suggestion.trim(),
              requestId,
              metadata: {
                timestamp: Date.now(),
                tokensUsed: Math.ceil(suggestion.length / 4),
              },
            };

          } catch (error) {
            // Log error (sanitized)
            console.error('[OpenAI] Error:', sanitizeForLogging({
              requestId,
              error: error instanceof Error ? error.message : 'Unknown error',
              responseTime: Date.now() - startTime,
            }));
            
            throw error;
          }
        });
      }
    );
  }

  cancelRequest(requestId: string): void {
    // Cancel through deduplicator
    requestDeduplicator.cancel('', '', { requestId });
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    requestDeduplicator.cancelAll();
  }

  /**
   * Get current rate limit status
   */
  getRateLimitStatus(): { tokensAvailable: number; retryAfter: number } {
    return {
      tokensAvailable: aiRateLimiter.getTokenCount(this.sessionId),
      retryAfter: aiRateLimiter.getRetryAfter(this.sessionId),
    };
  }

  /**
   * Get pending request count
   */
  getPendingRequestCount(): number {
    return requestDeduplicator.getPendingCount();
  }

  private async handleStreamResponse(response: Response, signal: AbortSignal): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response stream');
    }

    const decoder = new TextDecoder();
    let result = '';
    
    try {
      while (true) {
        if (signal.aborted) {
          throw new Error('Request aborted');
        }

        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              return result;
            }
            
            try {
              const parsed: OpenAIStreamChunk = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              
              if (content) {
                result += content;
              }
              
              if (parsed.choices[0]?.finish_reason === 'stop') {
                return result;
              }
            } catch (e) {
              // Skip invalid JSON chunks
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
    
    return result;
  }

  private buildPrompt(request: AIAssistRequest): string {
    const { fieldName, currentValue, userContext } = request;
    
    const fieldInstructions: Record<string, string> = {
      financialSituation: 'Help write a clear, professional description of current financial challenges and circumstances. Focus on specific situations without being overly personal.',
      employmentCircumstances: 'Help describe current employment status, job search efforts, or workplace challenges that affect financial stability.',
      reasonForApplying: 'Help explain why financial assistance is needed and how it would help improve the situation.',
    };

    const instruction = fieldInstructions[fieldName] || 
      `Help improve the content for the ${fieldName} field in a social support application.`;

    let contextInfo = '';
    if (userContext.step1) {
      const employment = userContext.step2?.employmentStatus;
      if (employment) {
        contextInfo += `Employment status: ${employment}. `;
      }
    }

    return `${instruction}

${contextInfo ? `Context: ${contextInfo}` : ''}

Current input: "${currentValue || '[empty]'}"

Please provide a well-written, professional response that:
- Is appropriate for a government social support application
- Is clear and specific without being overly personal
- Is 2-4 sentences long
- Maintains a respectful, professional tone

Only return the improved text, no explanations or quotes.`;
  }

  private getSystemPrompt(language: 'en' | 'ar'): string {
    const prompts = {
      en: 'You are a helpful assistant that helps people write clear, professional descriptions for social support applications. Provide helpful, respectful suggestions that maintain dignity while clearly communicating needs.',
      ar: 'أنت مساعد مفيد يساعد الناس في كتابة أوصاف واضحة ومهنية لطلبات الدعم الاجتماعي. قدم اقتراحات مفيدة ومحترمة تحافظ على الكرامة مع التواصل الواضح للاحتياجات.'
    };
    
    return prompts[language] || prompts.en;
  }
}

export const openAIService = new OpenAIService();