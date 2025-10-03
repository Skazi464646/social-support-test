/**
 * Optimized AI Assistance Hook with Dynamic Imports
 * Lazy loads AI services only when needed for better performance
 */

import { useState, useCallback, useRef } from 'react';

interface UseOptimizedAIAssistProps {
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

interface AIServiceCache {
  aiService?: any;
  openaiService?: any;
  isLoading: boolean;
}

export function useOptimizedAIAssist({
  fieldName,
  fieldLabel,
  initialValue = '',
  userContext = {},
  fieldConstraints,
  onValueChange,
}: UseOptimizedAIAssistProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [isAIServicesLoading, setIsAIServicesLoading] = useState(false);
  const [aiServicesError, setAIServicesError] = useState<Error | null>(null);
  
  // Cache AI services to avoid repeated imports
  const aiServiceCacheRef = useRef<AIServiceCache>({ 
    isLoading: false 
  });

  // Lazy load AI services when needed
  const loadAIServices = useCallback(async () => {
    if (aiServiceCacheRef.current.aiService || aiServiceCacheRef.current.isLoading) {
      return aiServiceCacheRef.current;
    }

    setIsAIServicesLoading(true);
    setAIServicesError(null);
    aiServiceCacheRef.current.isLoading = true;

    try {
      // Dynamic imports for AI services
      const [aiServiceModule, openaiServiceModule] = await Promise.all([
        import('@/lib/api/ai-service'),
        import('@/lib/api/openai-service'),
      ]);

      aiServiceCacheRef.current = {
        aiService: aiServiceModule,
        openaiService: openaiServiceModule,
        isLoading: false,
      };

      setIsAIServicesLoading(false);
      return aiServiceCacheRef.current;
    } catch (error) {
      console.error('[AI Services] Failed to load AI services:', error);
      setAIServicesError(error as Error);
      setIsAIServicesLoading(false);
      aiServiceCacheRef.current.isLoading = false;
      throw error;
    }
  }, []);

  const openModal = useCallback(async () => {
    try {
      // Preload AI services when user opens modal
      await loadAIServices();
      setIsModalOpen(true);
    } catch (error) {
      console.error('[AI Modal] Failed to load AI services:', error);
      // Still open modal but it will show error state
      setIsModalOpen(true);
    }
  }, [loadAIServices]);

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

  // Enhanced modal props with loading states
  const modalProps = {
    isOpen: isModalOpen,
    onClose: closeModal,
    fieldName,
    fieldLabel,
    currentValue,
    onAccept: handleAccept,
    userContext,
    fieldConstraints,
    isAIServicesLoading,
    aiServicesError,
    aiServices: aiServiceCacheRef.current,
  };

  return {
    // State
    isModalOpen,
    currentValue,
    isAIServicesLoading,
    aiServicesError,
    
    // Actions
    openModal,
    closeModal,
    handleAccept,
    updateValue,
    loadAIServices,
    
    // Modal props
    modalProps,
  };
}

// =============================================================================
// UTILITIES FOR AI SERVICE MANAGEMENT
// =============================================================================

/**
 * Preload AI services for better performance
 */
export async function preloadAIServices() {
  try {
    const [aiService, openaiService] = await Promise.all([
      import('@/lib/api/ai-service'),
      import('@/lib/api/openai-service'),
    ]);
    
    console.log('[Performance] AI services preloaded successfully');
    return { aiService, openaiService };
  } catch (error) {
    console.error('[Performance] Failed to preload AI services:', error);
    throw error;
  }
}

/**
 * Check if AI services are available without loading them
 */
export function checkAIServicesAvailability() {
  // Check if we have necessary environment variables or config
  const hasOpenAIKey = typeof import.meta !== 'undefined' && 
    import.meta.env?.VITE_OPENAI_API_KEY;
  
  const hasAIConfig = typeof import.meta !== 'undefined' && 
    import.meta.env?.VITE_AI_SERVICE_ENDPOINT;

  return {
    hasOpenAI: !!hasOpenAIKey,
    hasAIService: !!hasAIConfig,
    isAvailable: !!(hasOpenAIKey || hasAIConfig),
  };
}

/**
 * Smart AI service loader that chooses best available service
 */
export async function loadBestAvailableAIService() {
  const availability = checkAIServicesAvailability();
  
  if (!availability.isAvailable) {
    throw new Error('No AI services are configured');
  }

  try {
    if (availability.hasOpenAI) {
      const openaiService = await import('@/lib/api/openai-service');
      console.log('[AI Services] Using OpenAI service');
      return { type: 'openai', service: openaiService };
    }
    
    if (availability.hasAIService) {
      const aiService = await import('@/lib/api/ai-service');
      console.log('[AI Services] Using custom AI service');
      return { type: 'custom', service: aiService };
    }
    
    throw new Error('No valid AI service configuration found');
  } catch (error) {
    console.error('[AI Services] Failed to load AI service:', error);
    throw error;
  }
}