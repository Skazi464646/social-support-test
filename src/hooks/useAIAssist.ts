/**
 * AI Assistance Hook
 * Module 5 - Step 4: Build Inline AI Assistance Component
 * Enhanced for Context-Aware AI (Phase 4)
 */

import { useState, useCallback, useEffect } from 'react';
import { useAIFormContext } from './useAIFormContext';

interface UseAIAssistProps {
  fieldName: string;
  fieldLabel: string;
  initialValue?: string;
  userContext?: any;
  fieldConstraints?: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  };
  onValueChange?: (value: string) => void;
}

export function useAIAssist({
  fieldName,
  fieldLabel,
  initialValue = '',
  userContext = {},
  fieldConstraints,
  onValueChange,
}: UseAIAssistProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue);

  // Get intelligent context (with fallback to provided userContext)
  const { userContext: intelligentContext, isAvailable: hasIntelligentContext } = useAIFormContext();

  // Use intelligent context if available, otherwise fall back to provided userContext
  const enhancedUserContext = hasIntelligentContext ? intelligentContext : userContext;

  // Sync currentValue with initialValue changes
  useEffect(() => {
    setCurrentValue(initialValue);
  }, [initialValue]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleAccept = useCallback((value: string) => {
    setCurrentValue(value);
    onValueChange?.(value);
    setIsModalOpen(false);
  }, [onValueChange]);

  const updateValue = useCallback((value: string) => {
    setCurrentValue(value);
    onValueChange?.(value);
  }, [onValueChange]);

  return {
    // State
    isModalOpen,
    currentValue,
    
    // Actions
    openModal,
    closeModal,
    handleAccept,
    updateValue,
    
    // Modal props with enhanced context
    modalProps: {
      isOpen: isModalOpen,
      onClose: closeModal,
      fieldName,
      fieldLabel,
      currentValue,
      onAccept: handleAccept,
      userContext: enhancedUserContext, // Use enhanced context instead of original
      intelligentContext: hasIntelligentContext ? intelligentContext : undefined,
      fieldConstraints,
    },
  };
}