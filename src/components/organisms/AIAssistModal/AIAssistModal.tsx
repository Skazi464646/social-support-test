/**
 * AI Assistance Modal Component
 * Module 5 - Step 4: Build Inline AI Assistance Component
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {  AI_FIELD_DEFAULTS, AI_RATE_LIMIT, AI_MESSAGES } from '@/constants';
import { openAIService, getFieldExamples } from '@/lib/ai';
import { getFieldModalConfig } from '@/lib/ai/prompt-templates';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEY } from '@/constants/internationalization';

import { useNoScrollBody } from '@/hooks';
import type { AIAssistModalProps, Suggestion } from './AIAssistModal.types';
import { AIExampleRequest,AIAssistRequest } from '@/lib/api/openai-service.types';
import { ModalHeader } from '@/components/molecules/ModalHeader';
import AiAssistModalFooter from './AiAssistModalFooter';

export function AIAssistModal({
  isOpen,
  onClose,
  fieldName,
  currentValue,
  onAccept,
  userContext = {},
  intelligentContext,
  fieldConstraints,
}: AIAssistModalProps) {
  const { t } = useTranslation(['common', 'form']);
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
  const fieldConfig = getFieldModalConfig(fieldName, t);

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
      const hasUserInput = currentValue.trim().length >= AI_FIELD_DEFAULTS.hasUserInputMinChars;
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
      setError(AI_MESSAGES.errors.unavailable);
      return;
    }

    // Check rate limits
    const rateLimitStatus = openAIService.getRateLimitStatus();
    if (rateLimitStatus.tokensAvailable < AI_RATE_LIMIT.minTokensAvailable) {
      const retrySeconds = Math.ceil(rateLimitStatus.retryAfter / 1000);
      setError(AI_MESSAGES.errors.rateLimitReached(retrySeconds));
      return;
    }

    setIsLoading(true);
    setError(null);
    setStreamingText('');

    try {
      // STEP 1: If user has input, validate relevancy first
      // const hasUserInput = editedText.trim().length >= AI_FIELD_DEFAULTS.hasUserInputMinChars;

      // if (hasUserInput) {
      //   const relevancyRequest: AIRelevancyRequest = {
      //     fieldName,
      //     userInput: editedText,
      //     intelligentContext,
      //     language: 'en',
      //   };
      //   const relevancyResponse = await openAIService.validateInputRelevancy(relevancyRequest);

      //   if (!relevancyResponse.isRelevant || relevancyResponse.relevancyScore < AI_RELEVANCY.threshold) {
      //     // Input is not relevant - create a suggestion with feedback
      //     const irrelevantSuggestion: Suggestion = {
      //       id: `irrelevant_${Date.now()}`,
      //       text: AI_MESSAGES.relevancy.notRelevant(relevancyResponse.reason, fieldName),
      //       isEdited: false,
      //       confidence: 0,
      //     };

      //     setSuggestions(prev => [irrelevantSuggestion, ...prev]);
      //     setActiveSuggestionId(irrelevantSuggestion.id);
      //     setEditedText(irrelevantSuggestion.text);
      //     return;
      //   }
      // }

      // STEP 2: If relevant (or no user input), generate suggestion
      const request: AIAssistRequest = {
        fieldName,
        currentValue: editedText,
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
      const errorMessage = err instanceof Error ? err.message : AI_MESSAGES.errors.unknownError;
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
      setExamplesError(AI_MESSAGES.errors.unavailable);
      return;
    }

    // Only generate dynamic examples if we have either:
    // 1. User input (≥10 characters for meaningful content)
    // 2. OR intelligent context (form data) to work with
    const hasUserInput = editedText.trim().length >= AI_FIELD_DEFAULTS.hasUserInputMinChars;
    const hasIntelligentContext = intelligentContext && (intelligentContext.step1 || intelligentContext.step2);

    if (!hasUserInput && !hasIntelligentContext) {
      return; // Skip if no meaningful input or context
    }

    setLoadingExamples(true);
    setExamplesError(null);

    try {
      // STEP 1: If user has input, validate relevancy first
      // if (hasUserInput) {
      //   const relevancyRequest: AIRelevancyRequest = {
      //     fieldName,
      //     userInput: editedText,
      //     intelligentContext,
      //     language: 'en',
      //   };
      //   const relevancyResponse = await openAIService.validateInputRelevancy(relevancyRequest);

      //   if (!relevancyResponse.isRelevant || relevancyResponse.relevancyScore < AI_RELEVANCY.threshold) {
      //     // Input is not relevant - show helpful feedback
      //     setExamplesError(
      //       AI_MESSAGES.relevancy.notRelevantExamples(relevancyResponse.reason, fieldName)
      //     );
      //     setDynamicExamples([]);
      //     return;
      //   }
      // }

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
      const errorMessage = err instanceof Error ? err.message : AI_MESSAGES.errors.failedExamples;
      setExamplesError(errorMessage);
    } finally {
      setLoadingExamples(false);
    }
  }, [currentValue, fieldName, userContext, intelligentContext]);

  // Character count helper
  const characterCount = editedText.length;
  const minLength = fieldConstraints?.minLength || 0;
  const maxLength = fieldConstraints?.maxLength || AI_FIELD_DEFAULTS.maxLength;
  const isValidLength = characterCount >= minLength && characterCount <= maxLength;
  useNoScrollBody(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-bg-black/50 z-50 p-0 sm:p-4 sm:flex sm:items-center sm:justify-center">
      <div
        ref={modalRef}
        className="bg-white text-gray-900 border-0 sm:border sm:border-gray-200 rounded-none sm:rounded-lg shadow-2xl w-full h-full sm:max-w-4xl sm:w-full sm:max-h-[90vh] sm:h-auto overflow-y-auto focus:outline-none"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="ai-modal-title"
        aria-describedby="ai-modal-description"
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white z-10">
          <ModalHeader
            title={fieldConfig.title}
            description={fieldConfig.description}
            onClose={onClose}
            closeAriaLabel={t(TRANSLATION_KEY.modalHeader.close_aria_label, AI_MESSAGES.modal.closeAriaLabel)}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)] sm:min-h-0">
          {/* Left Panel - Suggestions */}
          <div className="w-full lg:w-1/3 flex flex-col border-border border-b lg:border-b-0 lg:border-r lg:min-h-[60vh]">
            <div className="p-4 border-b border-muted-border">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={generateSuggestion}
                  disabled={isLoading || !isValidLength}
                  className="flex-1 px-6 py-3 text-base font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-gold-md hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none shadow-sm border border-primary/20"
                  title={t(TRANSLATION_KEY.aiModal.generate, AI_MESSAGES.modal.generateButton)}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin inline-block w-5 h-5 border border-current border-t-transparent rounded-full mr-3"></span>
                      {t(TRANSLATION_KEY.aiModal.generating, AI_MESSAGES.modal.generating)}
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✨</span>
                      {t(TRANSLATION_KEY.aiModal.generate, AI_MESSAGES.modal.generateButton)}
                    </>
                  )}
                </button>
                {suggestions.length > 0 && (
                  <button
                    type="button"
                    onClick={regenerateSuggestion}
                    disabled={isLoading}
                    className="px-3 py-3 text-lg rounded-lg border border-primary/30 bg-background text-primary hover:bg-primary/10 hover:border-primary hover:shadow-gold-sm hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:transform-none disabled:shadow-none flex-shrink-0"
                  title={t(TRANSLATION_KEY.aiModal.regenerate_title, AI_MESSAGES.modal.regenerateTitle)}
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
                  className="w-full mt-3 py-1.5 px-3 text-xs font-normal text-primary hover:text-primary/80 hover:bg-primary/5 rounded-md border border-primary/20 hover:border-primary/40 transition-all duration-200 disabled:opacity-50"
                  title={t(TRANSLATION_KEY.aiModal.regenerate_title, AI_MESSAGES.modal.regenerateTitle)}
                >
                  {loadingExamples ? (
                    <>
                      <span className="animate-spin inline-block w-3 h-3 border border-current border-t-transparent rounded-full mr-1"></span>
                      {t(TRANSLATION_KEY.aiModal.loading_examples, TRANSLATION_KEY.aiModal.loading_examples)}
                    </>
                  ) : (
                    (() => {
                      const exampleCount = dynamicExamples.length > 0
                        ? dynamicExamples.length
                        : (examples.length > 0 ? examples.length : 0);
                      const key = showExamples
                        ? TRANSLATION_KEY.aiModal.hide_examples
                        : TRANSLATION_KEY.aiModal.show_examples;
                      const fallback = showExamples ? 'Hide examples ({{count}})' : 'Show examples ({{count}})';
                      return t(key, { count: exampleCount, defaultValue: fallback });
                    })()
                  )}
                </button>
              )}
            </div>

            <div className="flex-1 lg:max-h-[50vh] lg:overflow-y-auto">
              {/* Error Display */}
              {error && (
                <div className="p-4 bg-destructive-light border-b border-destructive-border">
                  <div className="text-destructive text-sm">
                    <strong>{t(TRANSLATION_KEY.aiModal.error_label, 'Error')}:</strong> {error}
                  </div>
                </div>
              )}

              {/* Examples - Show dynamic examples if available, otherwise static examples */}
              {showExamples && (
                <div className="border-b border-muted-border">
                  <div className="p-3 bg-muted rounded-b-md lg:rounded-none">
                    {dynamicExamples.length > 0 ? (
                      <>
                        <span className="text-sm font-small text-text-secondary mb-2">
                          {t(TRANSLATION_KEY.aiModal.examples_similar_title, TRANSLATION_KEY.translation_values.examples_similar_title)}
                        </span>
                        <div className="space-y-2">
                          {dynamicExamples.map((example, index) => (
                            <button
                              type="button"
                              key={`dynamic-${index}`}
                              onClick={() => useExample(example)}
                              className="w-full text-left p-2 text-xs border rounded transition-colors
                              border-primary hover:border-primary-hover bg-primary-light text-primary-light-foreground"
                            >
                              <div className="font-medium text-primary-light-foreground mb-1">{t(TRANSLATION_KEY.aiModal.example_label, TRANSLATION_KEY.translation_values.show_examples)} {index + 1}:</div>
                              <div className="text-primary-light-foreground/90">
                                {example.length > 120 ? `${example.substring(0, 120)}...` : example}
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : examples.length > 0 ? (
                      <>
                        <h4 className="text-sm font-small text-text-secondary mb-2">{t(TRANSLATION_KEY.aiModal.sample_responses_title, TRANSLATION_KEY.translation_values.sample_responses_title)}</h4>
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
                        <div className="font-medium">{t(TRANSLATION_KEY.aiModal.failed_examples, TRANSLATION_KEY.translation_values.failed_examples)}</div>
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
                      <p className="font-medium">{t(TRANSLATION_KEY.aiModal.generate_prompt, AI_MESSAGES.modal.generatePrompt)}</p>
                      <p className="text-xs mt-1 text-text-tertiary">{t(TRANSLATION_KEY.aiModal.assist_intro, TRANSLATION_KEY.translation_values.assist_intro)}</p>
                      {examples.length > 0 && (
                        <p className="text-xs mt-1">{t(TRANSLATION_KEY.aiModal.use_example_hint, TRANSLATION_KEY.translation_values.use_example_hint)}</p>
                    )}
                  </div>
                ) : (
                  suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className={`p-3 border rounded cursor-pointer transition-colors ${activeSuggestionId === suggestion.id
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
                          {suggestion.isEdited ? t(TRANSLATION_KEY.aiModal.badge.edited, TRANSLATION_KEY.translation_values.badge.edited) : suggestion.confidence ? t(TRANSLATION_KEY.aiModal.badge.ai, TRANSLATION_KEY.translation_values.badge.ai) : t(TRANSLATION_KEY.aiModal.badge.example, TRANSLATION_KEY.translation_values.badge.example)}
                        </span>
                        <span>{suggestion.text.length} {t(TRANSLATION_KEY.aiModal.badge.chars, 'chars')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Editor */}
          <div className="flex-1 w-full flex flex-col lg:min-h-[60vh]">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-text-primary">{t(TRANSLATION_KEY.aiModal.edit_your_response, TRANSLATION_KEY.translation_values.edit_your_response)}</h3>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={editSuggestion}
                      disabled={!activeSuggestionId}
                      className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    >
                      ✏️ Edit
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-3 py-1 text-sm border border-border rounded hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {t(TRANSLATION_KEY.aiModal.cancel, TRANSLATION_KEY.translation_values.cancel)}
                      </button>
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="px-3 py-1 text-sm rounded bg-primary text-primary-foreground hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {t(TRANSLATION_KEY.aiModal.save, 'Save')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 lg:max-h-[50vh] lg:overflow-y-auto">
              <div className="h-full flex flex-col">
                <textarea
                  ref={textareaRef}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  readOnly={!isEditing}
                  placeholder={
                    editedText
                      ? t(TRANSLATION_KEY.aiModal.edit_placeholder, AI_MESSAGES.modal.editPlaceholder)
                      : activeSuggestionId
                        ? t(TRANSLATION_KEY.aiModal.select_placeholder, AI_MESSAGES.modal.selectPlaceholder)
                        : fieldConfig.placeholder
                  }
                  className={`w-full min-h-[300px] lg:min-h-[200px] flex-1 p-3 border rounded-md resize-none transition-all duration-200 focus:outline-none focus:border-primary focus:shadow-gold-sm ${isEditing ? 'bg-card' : 'bg-muted'
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
                        {t(TRANSLATION_KEY.aiModal.min_prefix, 'min:')} {minLength}
                      </span>
                    )}
                  </div>
                </div>

                {/* Field-specific guidance - condensed */}
                {!editedText && (
                  <div className="mt-4 p-3 border rounded-md border-info-border bg-info-light">
                    <h4 className="text-sm font-medium text-info-foreground mb-1">💡 {t(TRANSLATION_KEY.aiModal.tips_title, TRANSLATION_KEY.translation_values.tips_title)}:</h4>
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

        {/* Footer - Sticky */}
       <AiAssistModalFooter 
       acceptSuggestion={acceptSuggestion} 
       editedText={editedText} 
       isValidLength={isValidLength}
        onClose={onClose}/>
      </div>
    </div>
  );
}
