/**
 * AI Assistance Modal Component
 * Module 5 - Step 4: Build Inline AI Assistance Component
 */

import { useState, useEffect, useRef } from 'react';
import { openAIService, getFieldExamples, getFieldConstraints } from '@/lib/ai';
import type { AIAssistRequest } from '@/lib/api/openai-service';

interface AIAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  fieldName: string;
  fieldLabel: string;
  currentValue: string;
  onAccept: (value: string) => void;
  userContext?: any;
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
  fieldConstraints,
}: AIAssistModalProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [, setStreamingText] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Get field-specific data
  const examples = getFieldExamples(fieldName);
  const constraints = getFieldConstraints(fieldName);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editedText]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

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
      const request: AIAssistRequest = {
        fieldName,
        currentValue,
        userContext,
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

  // Character count helper
  const characterCount = editedText.length;
  const minLength = fieldConstraints?.minLength || 0;
  const maxLength = fieldConstraints?.maxLength || 1000;
  const isValidLength = characterCount >= minLength && characterCount <= maxLength;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden focus:outline-none"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="ai-modal-title"
        aria-describedby="ai-modal-description"
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="ai-modal-title" className="text-xl font-semibold text-gray-900">
                ✨ AI Writing Assistant
              </h2>
              <p id="ai-modal-description" className="text-sm text-gray-600 mt-1">
                Get help writing your {fieldLabel.toLowerCase()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[60vh]">
          {/* Left Panel - Suggestions */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={generateSuggestion}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    onClick={regenerateSuggestion}
                    disabled={isLoading}
                    className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                    title="Generate another suggestion"
                  >
                    🔄
                  </button>
                )}
              </div>

              {examples.length > 0 && (
                <button
                  onClick={() => setShowExamples(!showExamples)}
                  className="w-full mt-2 text-sm text-blue-600 hover:text-blue-700 py-1"
                >
                  {showExamples ? 'Hide' : 'Show'} examples ({examples.length})
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border-b border-red-100">
                  <div className="text-red-700 text-sm">
                    <strong>Error:</strong> {error}
                  </div>
                </div>
              )}

              {/* Examples */}
              {showExamples && examples.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="p-3 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Responses</h4>
                    <div className="space-y-2">
                      {examples.map((example, index) => (
                        <button
                          key={index}
                          onClick={() => useExample(example)}
                          className="w-full text-left p-2 text-xs border rounded hover:bg-white transition-colors"
                        >
                          {example.substring(0, 100)}...
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Suggestions List */}
              <div className="p-4 space-y-3">
                {suggestions.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm py-8">
                    <div className="mb-2">💡</div>
                    <p>Click "Generate" to get AI suggestions</p>
                    <p className="text-xs mt-1">or use an example to get started</p>
                  </div>
                ) : (
                  suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className={`p-3 border rounded cursor-pointer transition-colors ${
                        activeSuggestionId === suggestion.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      <div className="text-sm text-gray-800 line-clamp-3">
                        {suggestion.text.substring(0, 100)}...
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
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
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Edit Your Response</h3>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      onClick={editSuggestion}
                      disabled={!activeSuggestionId}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                      ✏️ Edit
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
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
                  placeholder={activeSuggestionId ? "Select a suggestion to edit it here..." : "Generate a suggestion or use an example to get started..."}
                  className={`w-full flex-1 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isEditing ? 'bg-white' : 'bg-gray-50'
                  }`}
                />
                
                {/* Character Count */}
                <div className="flex items-center justify-between mt-2 text-sm">
                  <div className="text-gray-500">
                    {constraints.length > 0 && (
                      <div className="text-xs">
                        <strong>Guidelines:</strong> {constraints.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className={`${isValidLength ? 'text-gray-500' : 'text-red-500'}`}>
                    {characterCount}/{maxLength} characters
                    {minLength > 0 && characterCount < minLength && (
                      <span className="text-red-500 ml-2">
                        (min: {minLength})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Rate limit: {openAIService.getRateLimitStatus().tokensAvailable} requests remaining
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={acceptSuggestion}
                disabled={!editedText.trim() || !isValidLength}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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