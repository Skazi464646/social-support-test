import { useEffect } from 'react';

/**
 * Custom hook to prevent body scrolling when modals are open
 * @param isLocked - Whether to lock the body scroll
 */
export function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (isLocked) {
      // Add classes to both html and body for comprehensive scroll lock
      document.documentElement.classList.add('modal-open');
      document.body.classList.add('modal-open');
    } else {
      // Remove classes to restore scroll
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    }

    // Cleanup function
    return () => {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
    };
  }, [isLocked]);
}