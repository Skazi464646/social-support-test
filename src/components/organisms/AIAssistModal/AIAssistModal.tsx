/**
 * AI Assistance Modal Component
 * Module 5 - Step 4: Build Inline AI Assistance Component
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { openAIService, getFieldExamples, getFieldConstraints } from '@/lib/ai';
import { getFieldModalConfig } from '@/lib/ai/prompt-templates';
import { cn } from '@/lib/utils';
import type { AIAssistRequest, AIExampleRequest, AIRelevancyRequest } from '@/lib/api/openai-service';

interface AIAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string;
  fieldLabel: string;
  currentValue: string;
  onAccept: (value: string) => void;
  userContext?: any;
  intelligentContext?: any;
  fieldConstraints?: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  };
}

interface Suggestion {
  id: string;
  text: string;
  isEdited: boolean;
  confidence?: number;
}

export function AIAssistModal({
  isOpen,
  onClose,
  fieldName,
  fieldLabel,
  currentValue,
  onAccept,
  userContext = {},
  intelligentContext,
  fieldConstraints,
}: AIAssistModalProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState(currentValue || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [, setStreamingText] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [dynamicExamples, setDynamicExamples] = useState<string[]>([]);
  const [loadingExamples, setLoadingExamples] = useState(false);
  const [examplesError, setExamplesError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Get field-specific data
  const examples = getFieldExamples(fieldName);
  const fieldConfig = getFieldModalConfig(fieldName);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editedText]);

  // Pre-fill textarea with current value when modal opens
  useEffect(() => {
    if (isOpen) {
      setEditedText(currentValue || '');
      setIsEditing(true); // Enable editing mode by default
      setSuggestions([]); // Clear previous suggestions
      setActiveSuggestionId(null); // Clear active suggestion
      setError(null); // Clear any previous errors
      setDynamicExamples([]); // Clear previous dynamic examples
      setExamplesError(null); // Clear examples error
      
      // Auto-generate dynamic examples if we have either:
      // 1. User input (≥10 characters for meaningful content) 
      // 2. OR intelligent context (form data) to work with
      const hasUserInput = currentValue.trim().length >= 10;
      const hasIntelligentContext = intelligentContext && (intelligentContext.step1 || intelligentContext.step2);
      
      if (hasUserInput || hasIntelligentContext) {
        generateDynamicExamples();
      }
    }
  }, [isOpen, currentValue]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      if (isEditing && textareaRef.current) {
        // Focus textarea when in editing mode
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
      } else if (modalRef.current) {
        modalRef.current.focus();
      }
    }
  }, [isOpen, isEditing]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const generateSuggestion = async () => {
    if (!openAIService.isAvailable) {
      setError('AI assistance is not available. Please check your configuration.');
      return;
    }

    // Check rate limits
    const rateLimitStatus = openAIService.getRateLimitStatus();
    if (rateLimitStatus.tokensAvailable < 1) {
      const retrySeconds = Math.ceil(rateLimitStatus.retryAfter / 1000);
      setError(`Rate limit reached. Please wait ${retrySeconds} seconds before trying again.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setStreamingText('');

    try {
      // STEP 1: If user has input, validate relevancy first
      const hasUserInput = currentValue.trim().length >= 10;
      
      if (hasUserInput) {
        const relevancyRequest: AIRelevancyRequest = {
          fieldName,
          userInput: currentValue,
          intelligentContext,
          language: 'en',
        };

        console.log('[AI Suggestion Relevancy] Checking relevancy for:', currentValue.substring(0, 50));
        const relevancyResponse = await openAIService.validateInputRelevancy(relevancyRequest);
        
        console.log('[AI Suggestion Relevancy] Result:', {
          isRelevant: relevancyResponse.isRelevant,
          score: relevancyResponse.relevancyScore,
          reason: relevancyResponse.reason
        });

        // Set threshold at 60% - adjust as needed
        const RELEVANCY_THRESHOLD = 60;
        
        if (!relevancyResponse.isRelevant || relevancyResponse.relevancyScore < RELEVANCY_THRESHOLD) {
          // Input is not relevant - create a suggestion with feedback
          const irrelevantSuggestion: Suggestion = {
            id: `irrelevant_${Date.now()}`,
            text: `Your input is not relevant to this context. ${relevancyResponse.reason}. Please provide more relevant information about your ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
            isEdited: false,
            confidence: 0,
          };
          
          setSuggestions(prev => [irrelevantSuggestion, ...prev]);
          setActiveSuggestionId(irrelevantSuggestion.id);
          setEditedText(irrelevantSuggestion.text);
          return;
        }
      }

      // STEP 2: If relevant (or no user input), generate suggestion
      const request: AIAssistRequest = {
        fieldName,
        currentValue,
        userContext,
        intelligentContext,
        language: 'en',
      };

      const response = await openAIService.generateSuggestion(request);
      
      const newSuggestion: Suggestion = {
        id: `suggestion_${Date.now()}`,
        text: response.suggestion,
        isEdited: false,
        confidence: 0.85,
      };
      
      setSuggestions(prev => [newSuggestion, ...prev]);
      setActiveSuggestionId(newSuggestion.id);
      setEditedText(newSuggestion.text);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const useExample = (exampleText: string) => {
    const newSuggestion: Suggestion = {
      id: `example_${Date.now()}`,
      text: exampleText,
      isEdited: false,
    };

    setSuggestions(prev => [newSuggestion, ...prev]);
    setActiveSuggestionId(newSuggestion.id);
    setEditedText(exampleText);
    setShowExamples(false);
  };

  const editSuggestion = () => {
    setIsEditing(true);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const saveEdit = () => {
    if (activeSuggestionId) {
      setSuggestions(prev => prev.map(s => 
        s.id === activeSuggestionId 
          ? { ...s, text: editedText, isEdited: true }
          : s
      ));
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    const activeSuggestion = suggestions.find(s => s.id === activeSuggestionId);
    if (activeSuggestion) {
      setEditedText(activeSuggestion.text);
    }
    setIsEditing(false);
  };

  const acceptSuggestion = () => {
    if (editedText.trim()) {
      onAccept(editedText.trim());
      onClose();
    }
  };

  const selectSuggestion = (suggestion: Suggestion) => {
    setActiveSuggestionId(suggestion.id);
    setEditedText(suggestion.text);
    setIsEditing(false);
  };

  const regenerateSuggestion = () => {
    generateSuggestion();
  };

  const generateDynamicExamples = useCallback(async () => {
    if (!openAIService.isAvailable) {
      setExamplesError('AI assistance is not available. Please check your configuration.');
      return;
    }

    // Only generate dynamic examples if we have either:
    // 1. User input (≥10 characters for meaningful content)
    // 2. OR intelligent context (form data) to work with
    const hasUserInput = currentValue.trim().length >= 10;
    const hasIntelligentContext = intelligentContext && (intelligentContext.step1 || intelligentContext.step2);
    
    if (!hasUserInput && !hasIntelligentContext) {
      return; // Skip if no meaningful input or context
    }

    setLoadingExamples(true);
    setExamplesError(null);

    try {
      // STEP 1: If user has input, validate relevancy first
      if (hasUserInput) {
        const relevancyRequest: AIRelevancyRequest = {
          fieldName,
          userInput: currentValue,
          intelligentContext,
          language: 'en',
        };

        console.log('[AI Relevancy] Checking relevancy for:', currentValue.substring(0, 50));
        const relevancyResponse = await openAIService.validateInputRelevancy(relevancyRequest);
        
        console.log('[AI Relevancy] Result:', {
          isRelevant: relevancyResponse.isRelevant,
          score: relevancyResponse.relevancyScore,
          reason: relevancyResponse.reason
        });

        // Set threshold at 60% - adjust as needed
        const RELEVANCY_THRESHOLD = 60;
        
        if (!relevancyResponse.isRelevant || relevancyResponse.relevancyScore < RELEVANCY_THRESHOLD) {
          // Input is not relevant - show helpful feedback
          setExamplesError(
            `Not relevant to this context. ${relevancyResponse.reason}. Please try to provide more relevant information about your ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}.`
          );
          setDynamicExamples([]);
          return;
        }
      }

      // STEP 2: If relevant (or no user input), generate examples
      const request: AIExampleRequest = {
        fieldName,
        userInput: hasUserInput ? currentValue : '', // Pass empty string if no user input
        userContext,
        intelligentContext,
        language: 'en',
      };

      const response = await openAIService.generateDynamicExamples(request);
      setDynamicExamples(response.examples);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate examples';
      setExamplesError(errorMessage);
      console.error('Dynamic examples generation error:', err);
    } finally {
      setLoadingExamples(false);
    }
  }, [currentValue, fieldName, userContext, intelligentContext]);

  // Character count helper
  const characterCount = editedText.length;
  const minLength = fieldConstraints?.minLength || 0;
  const maxLength = fieldConstraints?.maxLength || 1000;
  const isValidLength = characterCount >= minLength && characterCount <= maxLength;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-card text-card-foreground border border-card-border rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden focus:outline-none"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="ai-modal-title"
        aria-describedby="ai-modal-description"
      >
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="ai-modal-title" className="text-xl font-semibold text-text-primary">
                {fieldConfig.title}
              </h2>
              <p id="ai-modal-description" className="text-sm text-text-secondary mt-1">
                {fieldConfig.description}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-text-tertiary hover:text-text-secondary transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:h-[60vh] max-h-[80vh]">
          {/* Left Panel - Suggestions */}
          <div className="w-full lg:w-1/3 flex flex-col border-border border-b lg:border-b-0 lg:border-r">
            <div className="p-4 border-b border-muted-border">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={generateSuggestion}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 text-sm font-medium rounded bg-primary text-primary-foreground hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border border-current border-t-transparent rounded-full mr-2"></span>
                      Generating...
                    </>
                  ) : (
                    '✨ Generate'
                  )}
                </button>
                {suggestions.length > 0 && (
                  <button
                    type="button"
                    onClick={regenerateSuggestion}
                    disabled={isLoading}
                    className="px-3 py-2 text-sm font-medium rounded border border-border hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50"
                    title="Generate another suggestion"
                  >
                    🔄
                  </button>
                )}
              </div>

              {/* Show Examples Button - with loading state for dynamic examples */}
              {(examples.length > 0 || currentValue.trim().length >= 10 || (intelligentContext && (intelligentContext.step1 || intelligentContext.step2))) && (
                <button
                  type="button"
                  onClick={() => setShowExamples(!showExamples)}
                  disabled={loadingExamples}
                  className="w-full mt-2 py-1 text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                >
                  {loadingExamples ? (
                    <>
                      <span className="animate-spin inline-block w-3 h-3 border border-current border-t-transparent rounded-full mr-1"></span>
                      Loading examples...
                    </>
                  ) : (
                    `${showExamples ? 'Hide' : 'Show'} examples (${
                      dynamicExamples.length > 0 
                        ? `${dynamicExamples.length} personalized` 
                        : examples.length > 0 
                          ? examples.length 
                          : 'generating...'
                    })`
                  )}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Error Display */}
              {error && (
                <div className="p-4 bg-destructive-light border-b border-destructive-border">
                  <div className="text-destructive text-sm">
                    <strong>Error:</strong> {error}
                  </div>
                </div>
              )}

              {/* Examples - Show dynamic examples if available, otherwise static examples */}
              {showExamples && (
                <div className="border-b border-muted-border">
                  <div className="p-3 bg-muted rounded-b-md lg:rounded-none">
                    {dynamicExamples.length > 0 ? (
                      <>
                        <h4 className="text-sm font-medium text-text-secondary mb-2">
                          ✨ Examples Similar to Yours
                        </h4>
                        <div className="space-y-2">
                          {dynamicExamples.map((example, index) => (
                            <button
                              type="button"
                              key={`dynamic-${index}`}
                              onClick={() => useExample(example)}
                              className="w-full text-left p-2 text-xs border rounded transition-colors
                              border-primary hover:border-primary-hover bg-primary-light text-primary-light-foreground"
                            >
                              <div className="font-medium text-primary-light-foreground mb-1">Example {index + 1}:</div>
                              <div className="text-primary-light-foreground/90">
                                {example.length > 120 ? `${example.substring(0, 120)}...` : example}
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : examples.length > 0 ? (
                      <>
                        <h4 className="text-sm font-medium text-text-secondary mb-2">Sample Responses</h4>
                        <div className="space-y-2">
                          {examples.map((example, index) => (
                            <button
                              type="button"
                              key={`static-${index}`}
                              onClick={() => useExample(example)}
                              className="w-full text-left p-2 text-xs border rounded transition-colors border-border hover:bg-muted"
                            >
                              {example.substring(0, 100)}...
                            </button>
                          ))}
                        </div>
                      </>
                    ) : examplesError ? (
                      <div className="text-sm text-destructive p-2">
                        <div className="font-medium">Failed to load personalized examples</div>
                        <div className="text-xs mt-1">{examplesError}</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Suggestions List */}
              <div className="p-4 space-y-3">
                {suggestions.length === 0 ? (
                  <div className="text-center text-text-secondary text-sm py-8">
                    <div className="mb-2">💡</div>
                    <p className="font-medium">Click "Generate" for AI suggestions</p>
                    <p className="text-xs mt-1 text-text-tertiary">AI will help you write about your {fieldLabel.toLowerCase()}</p>
                    {examples.length > 0 && (
                      <p className="text-xs mt-1">or use an example to get started</p>
                    )}
                  </div>
                ) : (
                  suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className={`p-3 border rounded cursor-pointer transition-colors ${
                        activeSuggestionId === suggestion.id
                          ? 'border-primary bg-primary-light'
                          : 'border-border hover:border-primary'
                      }`}
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      <div className="text-sm text-text-primary line-clamp-3">
                        {suggestion.text.substring(0, 100)}...
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
                        <span>
                          {suggestion.isEdited ? '✏️ Edited' : suggestion.confidence ? '🤖 AI' : '📝 Example'}
                        </span>
                        <span>{suggestion.text.length} chars</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Editor */}
          <div className="flex-1 w-full flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-text-primary">Edit Your Response</h3>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={editSuggestion}
                      disabled={!activeSuggestionId}
                      className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50"
                    >
                      ✏️ Edit
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="px-3 py-1 text-sm rounded bg-primary text-primary-foreground hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                      >
                        Save
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 p-4">
              <div className="h-full flex flex-col">
                <textarea
                  ref={textareaRef}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  readOnly={!isEditing}
                  placeholder={
                    editedText 
                      ? "Edit your text here or generate AI suggestions for improvements..." 
                      : activeSuggestionId 
                        ? "Select a suggestion to edit it here..." 
                        : fieldConfig.placeholder
                  }
                  className={`w-full flex-1 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary ${
                    isEditing ? 'bg-card' : 'bg-muted'
                  }`}
                />
                
                {/* Character Count - positioned right below input field */}
                <div className="mt-2 flex justify-end">
                  <div
                    className={cn(
                      'text-xs font-medium',
                      isValidLength ? 'text-text-secondary' : 'text-destructive'
                    )}
                  >
                    {characterCount}/{maxLength}
                    {minLength > 0 && characterCount < minLength && (
                      <span className="ml-2 text-destructive">
                        (min: {minLength})
                      </span>
                    )}
                  </div>
                </div>

                {/* Field-specific guidance - condensed */}
                {!editedText && (
                  <div className="mt-4 p-3 border rounded-md border-info-border bg-info-light">
                    <h4 className="text-sm font-medium text-info-foreground mb-1">💡 Tips:</h4>
                    <div className="text-xs text-info-light-foreground">
                      {fieldConfig.guidance.slice(0, 2).map((tip, index) => (
                        <div key={index} className="mb-1">• {tip}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 bg-surface/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-text-secondary leading-snug">
              Rate limit: {openAIService.getRateLimitStatus().tokensAvailable} requests remaining
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-border rounded-md text-text-primary hover:bg-muted transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={acceptSuggestion}
                disabled={!editedText.trim() || !isValidLength}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full sm:w-auto"
              >
                Use This Text
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
