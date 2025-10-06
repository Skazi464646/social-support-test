/**
 * AI Enhanced Textarea Component
 * Module 5 - Step 4: Build Inline AI Assistance Component
 */

import { forwardRef, Suspense, lazy } from 'react';
import { useAIAssist } from '@/hooks/useAIAssist';
import { cn } from '@/lib/utils';

// Lazy load AI components for better performance
const AIAssistModal = lazy(() => 
  import('@/components/organisms/AIAssistModal').then(module => ({ 
    default: module.AIAssistModal 
  }))
);

interface AIEnhancedTextareaProps {
  fieldName: string;
  fieldLabel: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  userContext?: any;
  error?: string;
}

export const AIEnhancedTextarea = forwardRef<HTMLTextAreaElement, AIEnhancedTextareaProps>(
  ({
    fieldName,
    fieldLabel,
    value,
    onChange,
    placeholder,
    rows = 4,
    maxLength = 1000,
    minLength = 50,
    required = false,
    disabled = false,
    className = '',
    userContext = {},
    error,
  }, ref) => {
    const {
      modalProps,
      openModal,
    } = useAIAssist({
      fieldName,
      fieldLabel,
      initialValue: value,
      userContext,
      fieldConstraints: {
        minLength,
        maxLength,
        required,
      },
      onValueChange: onChange,
    });

    const characterCount = value.length;
    const isValidLength = characterCount >= minLength && characterCount <= maxLength;
    const showCharacterCount = maxLength > 0;

    return (
      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          className={`
            w-full px-3 py-2 border rounded-md resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${className}
          `}
        />

        {/* Error and Character Count Row */}
        <div className="mt-2 flex items-start justify-between gap-2 text-xs">
          {/* Left side - Error message */}
          <div className="flex-1 min-w-0">
            {error && (
              <span className="font-medium text-red-500" role="alert">
                {error}
              </span>
            )}
          </div>

          {/* Right side - Character Count */}
          {showCharacterCount && (
            <div
              className={cn(
                'text-right font-medium whitespace-nowrap',
                isValidLength ? 'text-gray-500' : 'text-red-500'
              )}
            >
              {characterCount}/{maxLength}
              {minLength > 0 && characterCount < minLength && (
                <span className="ml-1 text-red-500">
                  (min: {minLength})
                </span>
              )}
            </div>
          )}
        </div>

        {/* AI Assist Button */}
        <div className="mt-3">
          <button
            type="button"
            onClick={openModal}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-sm hover:shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Get AI writing assistance"
          >
            <span>✨</span>
            <span>AI Assist</span>
          </button>
        </div>

        {/* AI Assist Modal - Lazy Loaded */}
        <Suspense fallback={null}>
          <AIAssistModal {...modalProps} />
        </Suspense>
      </div>
    );
  }
);

AIEnhancedTextarea.displayName = 'AIEnhancedTextarea';
