/**
 * AI Enhanced Input Component (for single-line fields)
 * Module 5 - Step 5: Integrate AI Assistance with Form Fields
 */

import { forwardRef, useState } from 'react';
import { AIAssistModal } from '@/components/organisms/AIAssistModal';
import { useAIAssist } from '@/hooks/useAIAssist';

interface AIEnhancedInputProps {
  fieldName: string;
  fieldLabel: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  type?: 'text' | 'email' | 'tel';
  required?: boolean;
  disabled?: boolean;
  className?: string;
  userContext?: any;
  error?: string;
  showAIAssist?: boolean; // Option to show/hide AI assist for specific fields
}

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
              w-full px-3 py-2 border rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${error ? 'border-red-300' : 'border-gray-300'}
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              ${showAIAssist && ['text', 'email'].includes(type) ? 'pr-20' : ''}
              ${className}
            `}
          />
          
          {/* AI Assist Button - Only show for text and email fields */}
          {showAIAssist && ['text', 'email'].includes(type) && !disabled && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
              title="Get AI writing assistance"
            >
              ✨ AI
            </button>
          )}
        </div>

        {/* Character Count */}
        {showCharacterCount && (
          <div className="flex justify-between items-center mt-1 text-xs">
            <div>
              {error && (
                <span className="text-red-500">{error}</span>
              )}
            </div>
            <div className="text-gray-500">
              {characterCount}/{maxLength}
            </div>
          </div>
        )}

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