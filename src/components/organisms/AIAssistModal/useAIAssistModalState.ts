import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { openAIService, getFieldExamples } from '@/lib/ai';
import { getFieldModalConfig } from '@/lib/ai/prompt-templates';
import type {
  AIAssistRequest,
  AIExampleRequest,
  AIRelevancyRequest,
} from '@/lib/api/openai-service';

export interface Suggestion {
  id: string;
  text: string;
  isEdited: boolean;
  confidence?: number;
}

interface UseAIAssistModalOptions {
  isOpen: boolean;
  fieldName: string;
  currentValue: string;
  userContext?: any;
  intelligentContext?: any;
  fieldConstraints?: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  };
  onClose: () => void;
}

interface AIAssistModalState {
  suggestions: Suggestion[];
  activeSuggestionId: string | null;
  editedText: string;
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
  showExamples: boolean;
  dynamicExamples: string[];
  loadingExamples: boolean;
  examplesError: string | null;
  examples: string[];
  fieldConfig: ReturnType<typeof getFieldModalConfig>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  modalRef: React.RefObject<HTMLDivElement>;
  characterCount: number;
  minLength: number;
  maxLength: number;
  isValidLength: boolean;
  canRequestExamples: boolean;
}

interface AIAssistModalActions {
  setEditedText: (value: string) => void;
  setShowExamples: (value: boolean) => void;
  toggleExamples: () => void;
  generateSuggestion: () => Promise<void>;
  regenerateSuggestion: () => void;
  selectSuggestion: (suggestion: Suggestion) => void;
  useExample: (example: string) => void;
  editSuggestion: () => void;
  cancelEdit: () => void;
  saveEdit: () => void;
}

interface UseAIAssistModalStateReturn {
  state: AIAssistModalState;
  actions: AIAssistModalActions;
}

export function useAIAssistModalState({
  isOpen,
  fieldName,
  currentValue,
  userContext,
  intelligentContext,
  fieldConstraints,
  onClose,
}: UseAIAssistModalOptions): UseAIAssistModalStateReturn {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState(currentValue || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [dynamicExamples, setDynamicExamples] = useState<string[]>([]);
  const [loadingExamples, setLoadingExamples] = useState(false);
  const [examplesError, setExamplesError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const examples = useMemo(() => getFieldExamples(fieldName), [fieldName]);
  const fieldConfig = useMemo(() => getFieldModalConfig(fieldName), [fieldName]);

  const characterCount = editedText.length;
  const minLength = fieldConstraints?.minLength || 0;
  const maxLength = fieldConstraints?.maxLength || 1000;
  const isValidLength = characterCount >= minLength && characterCount <= maxLength;
  const hasIntelligentContext = useMemo(
    () => Boolean(intelligentContext && (intelligentContext.step1 || intelligentContext.step2)),
    [intelligentContext],
  );
  const canRequestExamples = useMemo(
    () => examples.length > 0 || currentValue.trim().length >= 10 || hasIntelligentContext,
    [examples.length, currentValue, hasIntelligentContext],
  );

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [editedText]);

  const generateSuggestion = useCallback(async () => {
    if (!openAIService.isAvailable) {
      setError('AI assistance is not available. Please check your configuration.');
      return;
    }

    const rateLimitStatus = openAIService.getRateLimitStatus();
    if (rateLimitStatus.tokensAvailable < 1) {
      const retrySeconds = Math.ceil(rateLimitStatus.retryAfter / 1000);
      setError(`Rate limit reached. Please wait ${retrySeconds} seconds before trying again.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
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
          reason: relevancyResponse.reason,
        });

        const RELEVANCY_THRESHOLD = 60;

        if (!relevancyResponse.isRelevant || relevancyResponse.relevancyScore < RELEVANCY_THRESHOLD) {
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
  }, [currentValue, fieldName, userContext, intelligentContext]);

  const regenerateSuggestion = useCallback(() => {
    void generateSuggestion();
  }, [generateSuggestion]);

  const useExample = useCallback((exampleText: string) => {
    const newSuggestion: Suggestion = {
      id: `example_${Date.now()}`,
      text: exampleText,
      isEdited: false,
    };

    setSuggestions(prev => [newSuggestion, ...prev]);
    setActiveSuggestionId(newSuggestion.id);
    setEditedText(exampleText);
    setIsEditing(false);
    setShowExamples(false);
  }, []);

  const editSuggestion = useCallback(() => {
    setIsEditing(true);
  }, []);

  const saveEdit = useCallback(() => {
    if (!activeSuggestionId) return;

    setSuggestions(prev =>
      prev.map(suggestion =>
        suggestion.id === activeSuggestionId
          ? { ...suggestion, text: editedText, isEdited: true }
          : suggestion,
      ),
    );
    setIsEditing(false);
  }, [activeSuggestionId, editedText]);

  const cancelEdit = useCallback(() => {
    const activeSuggestion = suggestions.find(suggestion => suggestion.id === activeSuggestionId);
    if (activeSuggestion) {
      setEditedText(activeSuggestion.text);
    }
    setIsEditing(false);
  }, [activeSuggestionId, suggestions]);

  const selectSuggestion = useCallback((suggestion: Suggestion) => {
    setActiveSuggestionId(suggestion.id);
    setEditedText(suggestion.text);
    setIsEditing(false);
  }, []);

  const generateDynamicExamples = useCallback(async () => {
    if (!openAIService.isAvailable) {
      setExamplesError('AI assistance is not available. Please check your configuration.');
      return;
    }

    const hasUserInput = currentValue.trim().length >= 10;
    if (!hasUserInput && !hasIntelligentContext) {
      return;
    }

    setLoadingExamples(true);
    setExamplesError(null);

    try {
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
          reason: relevancyResponse.reason,
        });

        const RELEVANCY_THRESHOLD = 60;

        if (!relevancyResponse.isRelevant || relevancyResponse.relevancyScore < RELEVANCY_THRESHOLD) {
          setExamplesError(
            `Not relevant to this context. ${relevancyResponse.reason}. Please try to provide more relevant information about your ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
          );
          setDynamicExamples([]);
          return;
        }
      }

      const request: AIExampleRequest = {
        fieldName,
        userInput: hasUserInput ? currentValue : '',
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
  }, [currentValue, fieldName, userContext, intelligentContext, hasIntelligentContext]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setEditedText(currentValue || '');
    setIsEditing(true);
    setSuggestions([]);
    setActiveSuggestionId(null);
    setError(null);
    setDynamicExamples([]);
    setExamplesError(null);

    const hasUserInput = currentValue.trim().length >= 10;
    if (hasUserInput || hasIntelligentContext) {
      void generateDynamicExamples();
    }
  }, [isOpen, currentValue, hasIntelligentContext, generateDynamicExamples]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (isEditing && textareaRef.current) {
      const timeout = window.setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);

      return () => window.clearTimeout(timeout);
    }

    if (modalRef.current) {
      modalRef.current.focus();
    }

    return undefined;
  }, [isOpen, isEditing]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return {
    state: {
      suggestions,
      activeSuggestionId,
      editedText,
      isLoading,
      error,
      isEditing,
      showExamples,
      dynamicExamples,
      loadingExamples,
      examplesError,
      examples,
      fieldConfig,
      textareaRef,
      modalRef,
      characterCount,
      minLength,
      maxLength,
      isValidLength,
      canRequestExamples,
    },
    actions: {
      setEditedText,
      setShowExamples,
      toggleExamples: () => setShowExamples(prev => !prev),
      generateSuggestion,
      regenerateSuggestion,
      selectSuggestion,
      useExample,
      editSuggestion,
      cancelEdit,
      saveEdit,
    },
  };
}
