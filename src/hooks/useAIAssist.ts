/**
 * AI Assistance Hook
 * Module 5 - Step 4: Build Inline AI Assistance Component
 */

import { useState, useCallback, useEffect } from 'react';

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
    
    // Modal props
    modalProps: {
      isOpen: isModalOpen,
      onClose: closeModal,
      fieldName,
      fieldLabel,
      currentValue,
      onAccept: handleAccept,
      userContext,
      fieldConstraints,
    },
  };
}