/**
 * AI Enhanced Textarea Component
 * Module 5 - Step 4: Build Inline AI Assistance Component
 */

import { forwardRef } from 'react';
import { AIAssistModal } from '@/components/organisms/AIAssistModal';
import { useAIAssist } from '@/hooks/useAIAssist';

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
          
          {/* AI Assist Button */}
          <button
            type="button"
            onClick={openModal}
            disabled={disabled}
            className="absolute top-2 right-2 px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Get AI writing assistance"
          >
            ✨ AI Assist
          </button>
        </div>

        {/* Character Count */}
        {showCharacterCount && (
          <div className="flex justify-between items-center mt-1 text-xs">
            <div>
              {error && (
                <span className="text-red-500">{error}</span>
              )}
            </div>
            <div className={`${isValidLength ? 'text-gray-500' : 'text-red-500'}`}>
              {characterCount}/{maxLength}
              {minLength > 0 && characterCount < minLength && (
                <span className="text-red-500 ml-1">
                  (min: {minLength})
                </span>
              )}
            </div>
          </div>
        )}

        {/* AI Assist Modal */}
        <AIAssistModal {...modalProps} />
      </div>
    );
  }
);

AIEnhancedTextarea.displayName = 'AIEnhancedTextarea';