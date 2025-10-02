/**
 * AI Service Foundation
 * Module 5 - Step 1: Setup AI Configuration & Service Foundation
 */

import axiosClient from './axios-client';
import { aiConfig, AI_FEATURES, AI_MODELS } from '@/lib/config/ai-config';
import type {
  AIAssistRequest,
  AIAssistResponse,
  AIServiceError,
  AIUsageStats,
  AIRequestTracker,
  SuggestionOptions,
} from '@/types/ai.types';

/**
 * Rate limiting and request tracking
 */
class RequestTracker {
  private requests: Map<string, AIRequestTracker[]> = new Map();
  private readonly windowMs = 60 * 1000; // 1 minute

  /**
   * Check if user has exceeded rate limits
   */
  canMakeRequest(sessionId: string): boolean {
    if (!AI_FEATURES.REAL_TIME_ASSISTANCE) return false;

    const userRequests = this.requests.get(sessionId) || [];
    const now = Date.now();
    
    // Clean old requests
    const recentRequests = userRequests.filter(
      req => now - req.timestamp < this.windowMs
    );
    
    this.requests.set(sessionId, recentRequests);
    
    return recentRequests.length < aiConfig.security.rateLimitPerMinute;
  }

  /**
   * Track a new request
   */
  trackRequest(request: AIRequestTracker): void {
    const sessionRequests = this.requests.get(request.sessionId) || [];
    sessionRequests.push(request);
    this.requests.set(request.sessionId, sessionRequests);
  }

  /**
   * Get usage statistics for a session
   */
  getUsageStats(sessionId: string): AIUsageStats {
    const userRequests = this.requests.get(sessionId) || [];
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const monthMs = 30 * dayMs;

    const todayRequests = userRequests.filter(req => now - req.timestamp < dayMs);
    const monthRequests = userRequests.filter(req => now - req.timestamp < monthMs);

    const successfulRequests = userRequests.filter(req => req.success);
    const totalResponseTime = successfulRequests.reduce((sum, req) => sum + req.responseTime, 0);

    return {
      requestsToday: todayRequests.length,
      requestsThisMonth: monthRequests.length,
      tokensUsedToday: todayRequests.reduce((sum, req) => sum + req.tokensUsed, 0),
      tokensUsedThisMonth: monthRequests.reduce((sum, req) => sum + req.tokensUsed, 0),
      averageResponseTime: successfulRequests.length > 0 ? totalResponseTime / successfulRequests.length : 0,
      successRate: userRequests.length > 0 ? successfulRequests.length / userRequests.length : 0,
    };
  }
}

/**
 * Main AI Service class
 */
class AIService {
  private requestTracker = new RequestTracker();
  private pendingRequests = new Map<string, AbortController>();

  /**
   * Check if AI services are available
   */
  get isAvailable(): boolean {
    return aiConfig.enabled && AI_FEATURES.SUGGESTION_GENERATION;
  }

  /**
   * Generate AI suggestion for form field
   */
  async generateSuggestion(
    request: AIAssistRequest,
    options: SuggestionOptions = {},
    requestId?: string
  ): Promise<AIAssistResponse> {
    if (!this.isAvailable) {
      throw this.createError('SERVICE_UNAVAILABLE', 'AI assistance is not available');
    }

    const sessionId = this.getSessionId();
    
    if (!this.requestTracker.canMakeRequest(sessionId)) {
      throw this.createError('RATE_LIMIT', 'Rate limit exceeded. Please wait before making another request.');
    }

    const trackingId = requestId || this.generateRequestId();
    const startTime = Date.now();

    try {
      // Cancel any existing request with the same ID
      this.cancelRequest(trackingId);

      // Create abort controller for this request
      const controller = new AbortController();
      this.pendingRequests.set(trackingId, controller);

      const payload = this.buildRequestPayload(request, options);
      
      const response = await axiosClient.post<AIAssistResponse>(
        aiConfig.endpoints.suggestion,
        payload,
        {
          signal: controller.signal,
          timeout: aiConfig.openai.timeout,
          headers: {
            'Authorization': `Bearer ${aiConfig.openai.apiKey}`,
            'Content-Type': 'application/json',
            'X-Request-ID': trackingId,
          },
        }
      );

      // Track successful request
      this.trackRequest({
        sessionId,
        requestId: trackingId,
        timestamp: Date.now(),
        fieldName: request.fieldName,
        requestType: request.assistanceType || 'suggestion',
        tokensUsed: response.data.metadata.tokensUsed,
        responseTime: Date.now() - startTime,
        success: true,
      });

      this.pendingRequests.delete(trackingId);
      return response.data;

    } catch (error) {
      this.pendingRequests.delete(trackingId);
      
      const aiError = this.handleError(error);
      
      // Track failed request
      this.trackRequest({
        sessionId,
        requestId: trackingId,
        timestamp: Date.now(),
        fieldName: request.fieldName,
        requestType: request.assistanceType || 'suggestion',
        tokensUsed: 0,
        responseTime: Date.now() - startTime,
        success: false,
        error: aiError,
      });

      throw aiError;
    }
  }

  /**
   * Cancel a pending request
   */
  cancelRequest(requestId: string): void {
    const controller = this.pendingRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.pendingRequests.delete(requestId);
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    for (const [, controller] of this.pendingRequests) {
      controller.abort();
    }
    this.pendingRequests.clear();
  }

  /**
   * Get usage statistics for current session
   */
  getUsageStats(): AIUsageStats {
    return this.requestTracker.getUsageStats(this.getSessionId());
  }

  /**
   * Mock AI response for development/testing
   */
  async generateMockSuggestion(request: AIAssistRequest): Promise<AIAssistResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const mockSuggestions: Record<string, string> = {
      'financialSituation': 'I am currently facing financial hardships due to unexpected medical expenses that have depleted my savings. My monthly income is insufficient to cover all essential needs while managing these additional costs. I am seeking temporary assistance to help stabilize my situation.',
      'employmentCircumstances': 'I am currently employed part-time but seeking full-time employment to improve my financial stability. The limited hours available at my current position make it challenging to meet all monthly expenses consistently.',
      'reasonForApplying': 'I am applying for financial assistance to help cover essential living expenses during this temporary difficult period. This support would allow me to maintain stable housing and basic needs while I work toward improving my employment situation.',
    };

    const suggestion = mockSuggestions[request.fieldName] || 
      `This is a mock AI suggestion for the ${request.fieldName} field. In a real implementation, this would be generated based on your context and provide helpful, relevant content.`;

    return {
      suggestion,
      confidence: 0.85,
      reasoning: 'Generated based on common patterns for social support applications.',
      alternatives: [
        'Alternative suggestion 1...',
        'Alternative suggestion 2...',
      ],
      metadata: {
        requestId: this.generateRequestId(),
        timestamp: Date.now(),
        modelUsed: 'mock-model',
        tokensUsed: Math.floor(Math.random() * 100) + 50,
      },
    };
  }

  /**
   * Private helper methods
   */
  private buildRequestPayload(request: AIAssistRequest, options: SuggestionOptions) {
    return {
      ...request,
      options: {
        model: AI_MODELS.SUGGESTION.model,
        maxTokens: AI_MODELS.SUGGESTION.maxTokens,
        temperature: AI_MODELS.SUGGESTION.temperature,
        ...options,
      },
      metadata: {
        timestamp: Date.now(),
        sessionId: this.getSessionId(),
        userAgent: navigator.userAgent,
      },
    };
  }

  private handleError(error: any): AIServiceError {
    if (error.name === 'AbortError') {
      return this.createError('TIMEOUT', 'Request was cancelled');
    }

    if (error.response) {
      const status = error.response.status;
      
      if (status === 429) {
        return this.createError('RATE_LIMIT', 'Rate limit exceeded', {
          retryAfter: error.response.headers['retry-after'] || 60,
        });
      }
      
      if (status === 400) {
        return this.createError('INVALID_REQUEST', 'Invalid request format');
      }
      
      if (status >= 500) {
        return this.createError('SERVICE_UNAVAILABLE', 'AI service is temporarily unavailable');
      }
    }

    return this.createError('SERVICE_UNAVAILABLE', 'Failed to connect to AI service');
  }

  private createError(code: AIServiceError['code'], message: string, details?: any): AIServiceError {
    return { code, message, details };
  }

  private trackRequest(request: AIRequestTracker): void {
    this.requestTracker.trackRequest(request);
  }

  private generateRequestId(): string {
    return `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSessionId(): string {
    // In a real app, this would be a proper session ID
    return 'session_' + (sessionStorage.getItem('ai-session-id') || 
      (() => {
        const id = Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('ai-session-id', id);
        return id;
      })()
    );
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export mock service for development
export const mockAIService = {
  ...aiService,
  generateSuggestion: aiService.generateMockSuggestion.bind(aiService),
};

// Export the appropriate service based on environment
export default aiConfig.enabled ? aiService : mockAIService;