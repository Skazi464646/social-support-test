import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { FormWizardState, FormWizardAction, FormStepData } from '@/types/form.types';

// =============================================================================
// CONTEXT
// =============================================================================

interface FormWizardContextType {
  state: FormWizardState;
  dispatch: React.Dispatch<FormWizardAction>;
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateFormData: (data: Partial<FormStepData>) => void;
  markStepComplete: (step: number) => void;
  resetForm: () => void;
  isStepAccessible: (step: number) => boolean;
  canProceedToStep: (step: number) => boolean;
}

const FormWizardContext = createContext<FormWizardContextType | undefined>(undefined);

// =============================================================================
// INITIAL STATE & REDUCER
// =============================================================================

const initialState: FormWizardState = {
  currentStep: 1,
  formData: {},
  completedSteps: new Set(),
  isSubmitting: false,
  submitError: null,
  lastSaved: null,
};

function formWizardReducer(state: FormWizardState, action: FormWizardAction): FormWizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 3) };
    
    case 'PREVIOUS_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    
    case 'UPDATE_FORM_DATA':
      return { 
        ...state, 
        formData: { ...state.formData, ...action.payload },
        lastSaved: new Date().toISOString(),
      };
    
    case 'MARK_STEP_COMPLETE':
      return {
        ...state,
        completedSteps: new Set([...state.completedSteps, action.payload]),
      };
    
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    
    case 'SET_SUBMIT_ERROR':
      return { ...state, submitError: action.payload };
    
    case 'RESET_FORM':
      return { ...initialState };
    
    case 'LOAD_FROM_STORAGE':
      return { 
        ...state, 
        formData: action.payload.formData || {},
        completedSteps: new Set(action.payload.completedSteps || []),
        lastSaved: action.payload.lastSaved || null,
      };
    
    default:
      return state;
  }
}

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

export function FormWizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formWizardReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('formWizardData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: data });
      } catch (error) {
        console.error('Failed to parse saved form data:', error);
        localStorage.removeItem('formWizardData');
      }
    }
  }, []);

  // Auto-save to localStorage on data change
  useEffect(() => {
    if (Object.keys(state.formData).length > 0) {
      const dataToSave = {
        formData: state.formData,
        completedSteps: Array.from(state.completedSteps),
        lastSaved: state.lastSaved,
      };
      localStorage.setItem('formWizardData', JSON.stringify(dataToSave));
    }
  }, [state.formData, state.completedSteps, state.lastSaved]);

  // Navigation helpers
  const goToStep = (step: number) => {
    if (step >= 1 && step <= 3 && isStepAccessible(step)) {
      dispatch({ type: 'SET_STEP', payload: step });
    }
  };

  const nextStep = () => {
    if (state.currentStep < 3 && canProceedToStep(state.currentStep + 1)) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const previousStep = () => {
    if (state.currentStep > 1) {
      dispatch({ type: 'PREVIOUS_STEP' });
    }
  };

  const updateFormData = (data: Partial<FormStepData>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  };

  const markStepComplete = (step: number) => {
    dispatch({ type: 'MARK_STEP_COMPLETE', payload: step });
  };

  const resetForm = () => {
    localStorage.removeItem('formWizardData');
    dispatch({ type: 'RESET_FORM' });
  };

  // Step accessibility logic
  const isStepAccessible = (step: number): boolean => {
    if (step === 1) return true;
    if (step === 2) return state.completedSteps.has(1);
    if (step === 3) return state.completedSteps.has(1) && state.completedSteps.has(2);
    return false;
  };

  const canProceedToStep = (step: number): boolean => {
    return isStepAccessible(step);
  };

  const value: FormWizardContextType = {
    state,
    dispatch,
    goToStep,
    nextStep,
    previousStep,
    updateFormData,
    markStepComplete,
    resetForm,
    isStepAccessible,
    canProceedToStep,
  };

  return (
    <FormWizardContext.Provider value={value}>
      {children}
    </FormWizardContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useFormWizard() {
  const context = useContext(FormWizardContext);
  if (!context) {
    throw new Error('useFormWizard must be used within FormWizardProvider');
  }
  return context;
}