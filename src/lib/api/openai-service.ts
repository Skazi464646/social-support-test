/**
 * OpenAI Service - Frontend Integration
 * Module 5 - Step 1: Real OpenAI Integration with Streaming + Abort
 * 
 * SECURITY NOTE: This uses frontend API key for temporary implementation.
 * Will be moved to serverless endpoint in future step.
 */

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
  private pendingRequests = new Map<string, AbortController>();

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. AI features will be disabled.');
    }
  }

  get isAvailable(): boolean {
    return !!this.apiKey;
  }

  async generateSuggestion(
    request: AIAssistRequest,
    requestId: string = `req_${Date.now()}`
  ): Promise<AIAssistResponse> {
    if (!this.isAvailable) {
      throw new Error('OpenAI API key not configured');
    }

    // Cancel any existing request with same ID
    this.cancelRequest(requestId);

    const controller = new AbortController();
    this.pendingRequests.set(requestId, controller);

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

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(openAIRequest),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const suggestion = await this.handleStreamResponse(response, controller.signal);
      
      this.pendingRequests.delete(requestId);

      return {
        suggestion: suggestion.trim(),
        requestId,
        metadata: {
          timestamp: Date.now(),
          tokensUsed: Math.ceil(suggestion.length / 4), // Rough estimate
        },
      };

    } catch (error) {
      this.pendingRequests.delete(requestId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request was cancelled');
        }
        throw error;
      }
      
      throw new Error('Unknown error occurred');
    }
  }

  cancelRequest(requestId: string): void {
    const controller = this.pendingRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.pendingRequests.delete(requestId);
    }
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