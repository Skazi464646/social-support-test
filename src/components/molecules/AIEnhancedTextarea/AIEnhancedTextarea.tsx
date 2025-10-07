/**
 * AI Enhanced Textarea Component
 * Module 5 - Step 4: Build Inline AI Assistance Component
 */

import { forwardRef, Suspense, lazy } from 'react';
import { useAIAssist } from '@/hooks/useAIAssist';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// Lazy load AI components for better performance
const AIAssistModal = lazy(() => 
  import('@/components/organisms/AIAssistModal').then(module => ({ 
    default: module.AIAssistModal 
  }))
);

import type { AIEnhancedTextareaProps } from './AIEnhancedTextarea.types';

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
    const { t } = useTranslation(['common']);
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
            w-full px-3 py-2 rounded-md border resize-none transition-all duration-200
            focus:outline-none focus:border-primary focus:shadow-gold-sm
            ${error ? 'border-destructive-border' : 'border-input'}
            ${disabled ? 'bg-muted cursor-not-allowed text-text-tertiary' : 'bg-card'}
            ${className}
          `}
        />

        {/* Error and Character Count Row */}
        <div className="mt-2 flex items-start justify-between gap-2 text-xs">
          {/* Left side - Error message */}
          <div className="flex-1 min-w-0">
            {error && (
              <span className="font-medium text-destructive" role="alert">
                {error}
              </span>
            )}
          </div>

          {/* Right side - Character Count */}
          {showCharacterCount && (
            <div
              className={cn(
                'text-right font-medium whitespace-nowrap',
                isValidLength ? 'text-text-secondary' : 'text-destructive'
              )}
            >
              {characterCount}/{maxLength}
              {minLength > 0 && characterCount < minLength && (
                <span className="ml-1 text-destructive">
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
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            bg-primary text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary"
            title="Get AI writing assistance"
          >
            <span>✨</span>
          <span>{t('ai_assist', 'AI Assist')}</span>
            
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
