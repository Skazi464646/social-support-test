import { createContext, useContext, ReactNode } from 'react';

// =============================================================================
// CONTEXT
// =============================================================================

interface FormBlurContextType {
  onFieldBlur: () => void;
}

const FormBlurContext = createContext<FormBlurContextType | undefined>(undefined);

// =============================================================================
// PROVIDER
// =============================================================================

interface FormBlurProviderProps {
  children: ReactNode;
  onFieldBlur: () => void;
}

export function FormBlurProvider({ children, onFieldBlur }: FormBlurProviderProps) {
  const value: FormBlurContextType = {
    onFieldBlur,
  };

  return (
    <FormBlurContext.Provider value={value}>
      {children}
    </FormBlurContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useFormBlur() {
  const context = useContext(FormBlurContext);
  if (!context) {
    throw new Error('useFormBlur must be used within FormBlurProvider');
  }
  return context;
}