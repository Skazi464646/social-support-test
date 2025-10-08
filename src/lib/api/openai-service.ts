/**
 * OpenAI Service - Enhanced with Security Features
 * Module 5 - Step 2: Enhanced with rate limiting, deduplication, privacy safeguards, and retry logic
 * 
 * SECURITY NOTE: This uses frontend API key for temporary implementation.
 * Will be moved to serverless endpoint in future step.
 */


import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_DEFAULTS } from '@/constants';



const REQUEST_TIMEOUT = API_DEFAULTS.requestTimeoutMs; // 30 seconds

// Create axios instance with base configuration
export const openaiApiClient = axios.create({
  baseURL: AI_ENDPOINTS.openaiChatCompletions,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

openaiApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add request ID for tracking
    const requestId = crypto.randomUUID();
    config.headers.set('X-Request-ID', requestId);
    config.headers.set('X-Timestamp', new Date().toISOString());

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        requestId,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// RESPONSE INTERCEPTOR  
// =============================================================================

openaiApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      const requestId = response.config.headers?.['X-Request-ID'];
      const retryCount = response.config.metadata?.retryCount || 0;
      console.log(`[openaiApiClient API Response] ${response.status} ${response.config.url}`, {
        requestId,
        data: response.data,
        retryCount: retryCount > 0 ? retryCount : undefined,
         duration: response.config.metadata?.endTime &&
        response.config.metadata?.startTime 
                  ? response.config.metadata.endTime - 
      response.config.metadata.startTime 
                  : undefined,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const requestId = error.config?.headers?.['X-Request-ID'];
    const originalRequest = error.config;
    
    // Initialize retry count if not present
    if (originalRequest && !originalRequest.metadata) {
      originalRequest.metadata = { startTime: Date.now(), retryCount: 0 };
    }
    
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${error.response?.status || 'Network'} ${error.config?.url}`, {
        requestId,
        error: error.message,
        response: error.response?.data,
        retryCount: originalRequest?.metadata?.retryCount || 0,
      });
    }

    // =============================================================================
    // AUTOMATIC RETRY LOGIC
    // =============================================================================
  }
);


import { 
  aiRateLimiter,
  requestDeduplicator,
  retryOpenAICall,
  redactPII, 
  sanitizeForLogging, 
  generateRequestId, 
  generateSessionId,
  validateInputSafety 
} from '@/lib/utils/simple-utils';
import { AI_ENDPOINTS, AI_MODELS as CONST_MODELS, AI_SUGGESTION, AI_EXAMPLES, AI_RELEVANCY, AI_FIELD_DEFAULTS } from '@/constants';
import { 
  getSystemPrompt, 
  buildUserPrompt,
  buildSmartUserPrompt, 
  buildExampleGenerationSystemPrompt,
  buildExampleGenerationUserPrompt,
  buildRelevancySystemPrompt,
  buildRelevancyUserPrompt,
  parseExamplesFromResponse,
  parseRelevancyResponse,
  type PromptContext,
  type EnhancedPromptContext 
} from '@/lib/ai/prompt-templates';
import { 
  optimizePromptLength, 
  validatePromptContext, 
  calculatePromptEfficiency 
} from '@/lib/ai/prompt-optimizer';
import { AIAssistRequest, AIAssistResponse, AIExampleRequest, AIExampleResponse, AIRelevancyRequest, AIRelevancyResponse, OpenAIRequest, OpenAIStreamChunk } from './interface';



class OpenAIService {
  private readonly baseURL = AI_ENDPOINTS.openaiChatCompletions;
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

  /**
   * Make a streaming request using fetch with openaiApiClient configuration
   * Axios doesn't support ReadableStream in browsers, so we use fetch for streaming
   */
  private async streamingRequest(
    body: OpenAIRequest,
    requestId: string,
    signal?: AbortSignal
  ): Promise<Response> {
    // Build headers compatible with fetch, using openaiApiClient configuration
    const headers = new Headers({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Request-ID': requestId,
    });

    return fetch(this.baseURL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal,
    });
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
      async (abortSignal: AbortSignal) => {
        return retryOpenAICall(async () => {
          const startTime = Date.now();
          
          try {
            const promptContext: PromptContext = {
              userContext: request.userContext,
              currentValue: request.currentValue,
              language: request.language,
              fieldConstraints: {
                minLength: AI_FIELD_DEFAULTS.minLength,
                maxLength: AI_FIELD_DEFAULTS.maxLength,
                required: true,
              },
            };

            // Validate prompt context
            const validation = validatePromptContext(promptContext);
            if (validation.warnings.length > 0) {
              console.warn('[OpenAI] Prompt validation warnings:', validation.warnings);
            }

            // Build optimized prompts with intelligent context when available
            const systemPrompt = getSystemPrompt(request.fieldName, request.language);
            
            let userPrompt: string;
            if (request.intelligentContext) {
              // Use smart prompt builder with intelligent context
              const enhancedPromptContext: EnhancedPromptContext = {
                ...promptContext,
                intelligentContext: request.intelligentContext,
              };
              userPrompt = buildSmartUserPrompt(request.fieldName, enhancedPromptContext, request.intelligentContext);
            } else {
              // Fallback to basic prompt builder
              userPrompt = buildUserPrompt(request.fieldName, promptContext);
            }
            
            const optimizedPrompt = optimizePromptLength(userPrompt, AI_SUGGESTION.optimizedPromptMaxTokens);

            // Calculate efficiency metrics
            const efficiency = calculatePromptEfficiency(optimizedPrompt);
            console.log('[OpenAI] Prompt efficiency:', efficiency);

            const openAIRequest: OpenAIRequest = {
              model: CONST_MODELS.defaultModel,
              messages: [
                {
                  role: 'system',
                  content: systemPrompt
                },
                {
                  role: 'user',
                  content: optimizedPrompt
                }
              ],
              max_tokens: AI_SUGGESTION.maxTokens,
              temperature: AI_SUGGESTION.temperature,
              stream: AI_SUGGESTION.stream
            };

            // Log request (sanitized)
            console.log('[OpenAI] Request:', sanitizeForLogging({
              requestId,
              fieldName: request.fieldName,
              language: request.language,
              inputLength: request.currentValue.length,
              model: openAIRequest.model,
            }));

            // Use streamingRequest which applies openaiApiClient configuration
            const response = await this.streamingRequest(openAIRequest, requestId, abortSignal);

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

  /**
   * Generate dynamic examples based on user input
   */
  async generateDynamicExamples(
    request: AIExampleRequest,
    requestId: string = generateRequestId()
  ): Promise<AIExampleResponse> {
    if (!this.isAvailable) {
      throw new Error('OpenAI API key not configured');
    }

    // Rate limiting check
    if (!aiRateLimiter.isAllowed(this.sessionId)) {
      const retryAfter = aiRateLimiter.getRetryAfter(this.sessionId);
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(retryAfter / 1000)} seconds.`);
    }

    // Input safety validation
    const safetyCheck = validateInputSafety(request.userInput);
    if (!safetyCheck.safe) {
      console.warn('[OpenAI] Input safety issues detected:', safetyCheck.issues);
    }

    return retryOpenAICall(async () => {
      const startTime = Date.now();
      
      try {
        // Build example generation prompt
        const systemPrompt = buildExampleGenerationSystemPrompt(request.fieldName, request.language);
        const userPrompt = buildExampleGenerationUserPrompt(request);

        const openAIRequest: OpenAIRequest = {
          model: CONST_MODELS.defaultModel,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user', 
              content: userPrompt
            }
          ],
          max_tokens: AI_EXAMPLES.maxTokens,
          temperature: AI_EXAMPLES.temperature,
          stream: AI_EXAMPLES.stream
        };

        // Log request (sanitized)
        console.log('[OpenAI Examples] Request:', sanitizeForLogging({
          requestId,
          fieldName: request.fieldName,
          language: request.language,
          inputLength: request.userInput.length,
          model: openAIRequest.model,
        }));

        // Use openaiApiClient for non-streaming requests
        const response = await openaiApiClient.post('', openAIRequest);

        const data = response.data;
        const content = data.choices[0]?.message?.content || '';
        
        // Parse examples from response (assuming they're separated by numbered lines or special markers)
        const examples = parseExamplesFromResponse(content);
        const responseTime = Date.now() - startTime;
        
        // Log successful response (sanitized)
        console.log('[OpenAI Examples] Success:', sanitizeForLogging({
          requestId,
          responseTime,
          exampleCount: examples.length,
          tokensEstimate: Math.ceil(content.length / 4),
        }));

        return {
          examples,
          requestId,
          metadata: {
            timestamp: Date.now(),
            tokensUsed: Math.ceil(content.length / 4),
            basedinput: request.userInput.substring(0, 50) + '...', // Truncated for privacy
          },
        };

      } catch (error) {
        // Log error (sanitized)
        console.error('[OpenAI Examples] Error:', sanitizeForLogging({
          requestId,
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime: Date.now() - startTime,
        }));
        
        throw error;
      }
    });
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
        if (signal?.aborted) {
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

  /**
   * Validate if user input is relevant to the form field context
   */
  async validateInputRelevancy(
    request: AIRelevancyRequest,
    requestId: string = generateRequestId()
  ): Promise<AIRelevancyResponse> {
    if (!this.isAvailable) {
      throw new Error('OpenAI API key not configured');
    }

    // Rate limiting check
    if (!aiRateLimiter.isAllowed(this.sessionId)) {
      const retryAfter = aiRateLimiter.getRetryAfter(this.sessionId);
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(retryAfter / 1000)} seconds.`);
    }

    return retryOpenAICall(async () => {
      const startTime = Date.now();
      
      try {
        // Build relevancy validation prompt
        const systemPrompt = buildRelevancySystemPrompt(request.fieldName, request.language,request.userInput);
        const userPrompt = buildRelevancyUserPrompt(request);

        const openAIRequest: OpenAIRequest = {
          model: CONST_MODELS.defaultModel,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          max_tokens: AI_RELEVANCY.maxTokens,
          temperature: AI_RELEVANCY.temperature,
          stream: AI_RELEVANCY.stream
        };

        // Log request (sanitized)
        console.log('[OpenAI Relevancy] Request:', sanitizeForLogging({
          requestId,
          fieldName: request.fieldName,
          language: request.language,
          inputLength: request.userInput.length,
          model: openAIRequest.model,
        }));

        // Use openaiApiClient for non-streaming requests
        const response = await openaiApiClient.post('', openAIRequest);

        const data = response.data;
        const content = data.choices[0]?.message?.content || '';
        
        // Parse relevancy response
        const relevancyResult = parseRelevancyResponse(content);
        const responseTime = Date.now() - startTime;
        
        // Log successful response (sanitized)
        console.log('[OpenAI Relevancy] Success:', sanitizeForLogging({
          requestId,
          responseTime,
          isRelevant: relevancyResult.isRelevant,
          relevancyScore: relevancyResult.relevancyScore,
          tokensEstimate: Math.ceil(content.length / 4),
        }));

        return {
          isRelevant: relevancyResult.isRelevant,
          relevancyScore: relevancyResult.relevancyScore,
          reason: relevancyResult.reason,
          requestId,
          metadata: {
            timestamp: Date.now(),
            tokensUsed: Math.ceil(content.length / 4),
          },
        };

      } catch (error) {
        // Log error (sanitized)
        console.error('[OpenAI Relevancy] Error:', sanitizeForLogging({
          requestId,
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime: Date.now() - startTime,
        }));
        
        throw error;
      }
    });
  }

}

export const openAIService = new OpenAIService();