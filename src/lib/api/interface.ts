import type { AIFormContext } from '@/hooks/useAIFormContext';


export interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface OpenAIRequest {
    model: string;
    messages: OpenAIMessage[];
    max_tokens: number;
    temperature: number;
    stream: boolean;
}

export interface OpenAIStreamChunk {
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
    intelligentContext?: AIFormContext;
    language: 'en' | 'ar';
}

export interface AIExampleRequest {
    fieldName: string;
    userInput: string;
    userContext: any;
    intelligentContext?: AIFormContext;
    language: 'en' | 'ar';
}

export interface AIRelevancyRequest {
    fieldName: string;
    userInput: string;
    intelligentContext?: AIFormContext;
    language: 'en' | 'ar';
}

export interface AIRelevancyResponse {
    isRelevant: boolean;
    relevancyScore: number; // 0-100
    reason: string;
    requestId: string;
    metadata: {
        timestamp: number;
        tokensUsed: number;
    };
}

export interface AIExampleResponse {
    examples: string[];
    requestId: string;
    metadata: {
        timestamp: number;
        tokensUsed: number;
        basedinput: string;
    };
}

export interface AIAssistResponse {
    suggestion: string;
    requestId: string;
    metadata: {
        timestamp: number;
        tokensUsed: number;
    };
}