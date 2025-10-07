/**
 * AI Enhanced Input Component (for single-line fields)
 * Module 5 - Step 5: Integrate AI Assistance with Form Fields
 */

import { forwardRef, useState } from 'react';
import { AIAssistModal } from '@/components/organisms/AIAssistModal';
import { useAIAssist } from '@/hooks/useAIAssist';
import { useTranslation } from 'react-i18next';
import type { AIEnhancedInputProps } from './AIEnhancedInput.types';

export const AIEnhancedInput = forwardRef<HTMLInputElement, AIEnhancedInputProps>(
  ({
    fieldName,
    fieldLabel,
    value,
    onChange,
    placeholder,
    maxLength = 100,
    type = 'text',
    required = false,
    disabled = false,
    className = '',
    userContext = {},
    error,
    showAIAssist = true,
  }, ref) => {
    const [showModal, setShowModal] = useState(false);
    const { t } = useTranslation(['common']);

    const {
      modalProps,
    } = useAIAssist({
      fieldName,
      fieldLabel,
      initialValue: value,
      userContext,
      fieldConstraints: {
        minLength: 0,
        maxLength,
        required,
      },
      onValueChange: onChange,
    });

    const characterCount = value.length;
    const showCharacterCount = maxLength > 0 && maxLength <= 200;

    return (
      <div className="relative">
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className={`
            w-full px-3 py-2 rounded-md border
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary
            ${error ? 'border-destructive-border' : 'border-input'}
            ${disabled ? 'bg-muted cursor-not-allowed text-text-tertiary' : 'bg-card'}
            ${className}
          `}
        />

        {/* Bottom row with AI button and character count */}
        {(showAIAssist && ['text', 'email'].includes(type) && !disabled) || showCharacterCount ? (
          <div className="mt-1 flex flex-col gap-2 text-xs leading-snug sm:flex-row sm:items-center sm:justify-between">
            {/* Left side - AI Assist Button and Error */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
              {showAIAssist && ['text', 'email'].includes(type) && !disabled && (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm transition-all duration-200 w-fit
                  bg-primary text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  title="Get AI writing assistance"
                >
                  <span className="text-sm">✨</span>
                 <span>{t('ai_assist', 'AI Assist')}</span>
                </button>
              )}
              {error && (
                <span className="font-medium text-destructive" role="alert">
                  {error}
                </span>
              )}
            </div>

            {/* Right side - Character Count */}
            {showCharacterCount && (
              <div className="text-text-secondary sm:text-right font-medium">
                {characterCount}/{maxLength}
              </div>
            )}
          </div>
        ) : error ? (
          <div className="mt-1">
            <span className="font-medium text-destructive text-xs" role="alert">
              {error}
            </span>
          </div>
        ) : null}

        {/* AI Assist Modal */}
        {showModal && (
          <AIAssistModal 
            {...modalProps}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    );
  }
);

AIEnhancedInput.displayName = 'AIEnhancedInput';
