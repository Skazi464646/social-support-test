import { useCallback, useEffect, useState } from 'react';
import { useAIFormContext } from '../useAIFormContext';
import type { AIAssistConstraints, UseAIAssistProps, UseAIAssistReturn } from './types';

export function useAIAssist({
  fieldName,
  fieldLabel,
  initialValue = '',
  userContext = {},
  fieldConstraints,
  onValueChange,
}: UseAIAssistProps): UseAIAssistReturn {
  const { isModalOpen, openModal, closeModal } = useModalControls();
  const { currentValue, updateValue } = useSyncedValue(initialValue, onValueChange);
  const enhancedContext = useEnhancedContext(userContext);

  const handleAccept = useCallback(
    (value: string) => {
      updateValue(value);
      closeModal();
    },
    [updateValue, closeModal],
  );

  return {
    isModalOpen,
    currentValue,
    openModal,
    closeModal,
    handleAccept,
    updateValue,
    modalProps: createModalProps({
      isModalOpen,
      closeModal,
      fieldName,
      fieldLabel,
      currentValue,
      handleAccept,
      enhancedContext,
      fieldConstraints,
    }),
  };
}

function useModalControls() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return { isModalOpen, openModal, closeModal };
}

function useSyncedValue(initialValue: string, onValueChange?: (value: string) => void) {
  const [currentValue, setCurrentValue] = useState(initialValue);

  useEffect(() => {
    setCurrentValue(initialValue);
  }, [initialValue]);

  const updateValue = useCallback(
    (value: string) => {
      setCurrentValue(value);
      onValueChange?.(value);
    },
    [onValueChange],
  );

  return { currentValue, updateValue };
}

function useEnhancedContext(fallbackContext: any) {
  const { userContext, isAvailable } = useAIFormContext();

  return {
    userContext: isAvailable ? userContext : fallbackContext,
    intelligentContext: isAvailable ? userContext : undefined,
  };
}

interface CreateModalPropsArgs {
  isModalOpen: boolean;
  closeModal: () => void;
  fieldName: string;
  fieldLabel: string;
  currentValue: string;
  handleAccept: (value: string) => void;
  enhancedContext: ReturnType<typeof useEnhancedContext>;
  fieldConstraints?: AIAssistConstraints;
}

function createModalProps({
  isModalOpen,
  closeModal,
  fieldName,
  fieldLabel,
  currentValue,
  handleAccept,
  enhancedContext,
  fieldConstraints,
}: CreateModalPropsArgs): UseAIAssistReturn['modalProps'] {
  return {
    isOpen: isModalOpen,
    onClose: closeModal,
    fieldName,
    fieldLabel,
    currentValue,
    onAccept: handleAccept,
    userContext: enhancedContext.userContext,
    intelligentContext: enhancedContext.intelligentContext,
    fieldConstraints,
  };
}
