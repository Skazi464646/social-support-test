import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { ToastData } from '@/components/molecules/Toast';

interface ToastContextType {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  success: (toast: Omit<ToastData, 'id' | 'variant'>) => string;
  error: (toast: Omit<ToastData, 'id' | 'variant'>) => string;
  warning: (toast: Omit<ToastData, 'id' | 'variant'>) => string;
  info: (toast: Omit<ToastData, 'id' | 'variant'>) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastData = {
      id,
      variant: 'default',
      duration: 5000,
      ...toast,
    };
    
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((toast: Omit<ToastData, 'id' | 'variant'>) => {
    return addToast({ ...toast, variant: 'success' });
  }, [addToast]);

  const error = useCallback((toast: Omit<ToastData, 'id' | 'variant'>) => {
    return addToast({ ...toast, variant: 'error' });
  }, [addToast]);

  const warning = useCallback((toast: Omit<ToastData, 'id' | 'variant'>) => {
    return addToast({ ...toast, variant: 'warning' });
  }, [addToast]);

  const info = useCallback((toast: Omit<ToastData, 'id' | 'variant'>) => {
    return addToast({ ...toast, variant: 'info' });
  }, [addToast]);

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}