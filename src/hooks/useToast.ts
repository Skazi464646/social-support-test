import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Toast, type ToastData } from '@/components/molecules/Toast';

interface ToastState {
  toasts: ToastData[];
}

type ToastAction = 
  | { type: 'ADD_TOAST'; toast: ToastData }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'CLEAR_TOASTS' };

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.id),
      };
    case 'CLEAR_TOASTS':
      return {
        ...state,
        toasts: [],
      };
    default:
      return state;
  }
};

// Global toast state
const toastState: ToastState = { toasts: [] };
const listeners = new Set<() => void>();

const dispatch = (action: ToastAction) => {
  Object.assign(toastState, toastReducer(toastState, action));
  listeners.forEach(listener => listener());
};

let toastCount = 0;
const genId = () => {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return toastCount.toString();
};

/**
 * Hook for managing toast notifications
 * 
 * @example
 * const toast = useToast();
 * 
 * const handleSuccess = () => {
 *   toast.success({
 *     title: "Success!",
 *     description: "Your action was completed successfully."
 *   });
 * };
 */
export const useToast = () => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    listeners.add(forceUpdate);
    return () => {
      listeners.delete(forceUpdate);
    };
  }, []);

  const addToast = React.useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = genId();
    dispatch({
      type: 'ADD_TOAST',
      toast: { ...toast, id },
    });
    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id });
  }, []);

  const clearToasts = React.useCallback(() => {
    dispatch({ type: 'CLEAR_TOASTS' });
  }, []);

  // Convenience methods
  const success = React.useCallback((toast: Omit<ToastData, 'id' | 'variant'>) => 
    addToast({ ...toast, variant: 'success' }), [addToast]);
  
  const error = React.useCallback((toast: Omit<ToastData, 'id' | 'variant'>) => 
    addToast({ ...toast, variant: 'error' }), [addToast]);
  
  const warning = React.useCallback((toast: Omit<ToastData, 'id' | 'variant'>) => 
    addToast({ ...toast, variant: 'warning' }), [addToast]);
  
  const info = React.useCallback((toast: Omit<ToastData, 'id' | 'variant'>) => 
    addToast({ ...toast, variant: 'info' }), [addToast]);

  return {
    toasts: toastState.toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  };
};

// Toast container component for portal rendering
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const portalRoot = document.getElementById('toast-root') || document.body;

  return ReactDOM.createPortal(
    React.createElement(
      'div',
      {
        className: 'fixed bottom-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse space-y-2 space-y-reverse sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col sm:space-y-2 sm:space-y-reverse md:max-w-[420px]'
      },
      toasts.map((toast) =>
        React.createElement(Toast, {
          key: toast.id,
          ...toast,
          onClose: () => removeToast(toast.id)
        })
      )
    ),
    portalRoot
  );
};