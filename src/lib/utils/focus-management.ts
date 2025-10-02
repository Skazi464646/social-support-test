// =============================================================================
// FOCUS MANAGEMENT UTILITIES FOR RTL SUPPORT
// =============================================================================

/**
 * Enhanced focus management utilities that work correctly in both LTR and RTL modes
 */

/**
 * Focus the next focusable element in reading direction
 * In LTR: moves to the next element (rightward/downward)
 * In RTL: moves to the next element (leftward/downward)
 */
export function focusNextInReadingDirection(currentElement?: HTMLElement): boolean {
  const isRtl = document.documentElement.dir === 'rtl';
  const focusableElements = getFocusableElements();
  
  if (!focusableElements.length) return false;
  
  const currentIndex = currentElement 
    ? focusableElements.indexOf(currentElement)
    : -1;
    
  let nextIndex: number;
  
  if (currentIndex === -1) {
    // No current element, focus first or last based on direction
    nextIndex = isRtl ? focusableElements.length - 1 : 0;
  } else {
    // Move to next element in reading direction
    if (isRtl) {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
    } else {
      nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
    }
  }
  
  const nextElement = focusableElements[nextIndex];
  if (nextElement) {
    nextElement.focus();
    return true;
  }
  
  return false;
}

/**
 * Focus the previous focusable element in reading direction
 * In LTR: moves to the previous element (leftward/upward)
 * In RTL: moves to the previous element (rightward/upward)
 */
export function focusPreviousInReadingDirection(currentElement?: HTMLElement): boolean {
  const isRtl = document.documentElement.dir === 'rtl';
  const focusableElements = getFocusableElements();
  
  if (!focusableElements.length) return false;
  
  const currentIndex = currentElement 
    ? focusableElements.indexOf(currentElement)
    : -1;
    
  let prevIndex: number;
  
  if (currentIndex === -1) {
    // No current element, focus last or first based on direction
    prevIndex = isRtl ? 0 : focusableElements.length - 1;
  } else {
    // Move to previous element in reading direction
    if (isRtl) {
      prevIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
    } else {
      prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
    }
  }
  
  const prevElement = focusableElements[prevIndex];
  if (prevElement) {
    prevElement.focus();
    return true;
  }
  
  return false;
}

/**
 * Handle arrow key navigation that respects RTL/LTR direction
 */
export function handleDirectionalArrowKeys(
  event: KeyboardEvent,
  _container?: HTMLElement
): boolean {
  const isRtl = document.documentElement.dir === 'rtl';
  const { key } = event;
  
  // For arrow keys, we need to adjust behavior in RTL
  switch (key) {
    case 'ArrowLeft':
      if (isRtl) {
        return focusNextInReadingDirection(event.target as HTMLElement);
      } else {
        return focusPreviousInReadingDirection(event.target as HTMLElement);
      }
      
    case 'ArrowRight':
      if (isRtl) {
        return focusPreviousInReadingDirection(event.target as HTMLElement);
      } else {
        return focusNextInReadingDirection(event.target as HTMLElement);
      }
      
    case 'ArrowDown':
      return focusNextInReadingDirection(event.target as HTMLElement);
      
    case 'ArrowUp':
      return focusPreviousInReadingDirection(event.target as HTMLElement);
      
    case 'Tab':
      // Tab behavior should be natural, browser handles RTL correctly
      return false;
      
    default:
      return false;
  }
}

/**
 * Get all focusable elements in the document or within a container
 */
export function getFocusableElements(container?: HTMLElement): HTMLElement[] {
  const root = container || document;
  
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');
  
  const elements = Array.from(root.querySelectorAll(focusableSelectors)) as HTMLElement[];
  
  // Filter out elements that are not visible
  return elements.filter(element => {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      element.offsetParent !== null
    );
  }).sort((a, b) => {
    // Sort by tab index, then by DOM position
    const aTabIndex = parseInt(a.getAttribute('tabindex') || '0');
    const bTabIndex = parseInt(b.getAttribute('tabindex') || '0');
    
    if (aTabIndex !== bTabIndex) {
      return aTabIndex - bTabIndex;
    }
    
    // Use DOM position
    return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
}

/**
 * Focus trap for modals that respects RTL/LTR direction
 */
export function createFocusTrap(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container);
  
  if (!focusableElements.length) {
    return () => {}; // No cleanup needed
  }
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab (backward)
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab (forward)
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    } else {
      // Handle arrow keys with RTL awareness
      if (handleDirectionalArrowKeys(event, container)) {
        event.preventDefault();
      }
    }
  };
  
  // Focus the first element
  firstElement?.focus();
  
  // Add event listener
  container.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Hook for RTL-aware focus management
 */
export function useRTLFocusManagement() {
  const isRtl = document.documentElement.dir === 'rtl';
  
  return {
    isRtl,
    focusNext: focusNextInReadingDirection,
    focusPrevious: focusPreviousInReadingDirection,
    handleArrowKeys: handleDirectionalArrowKeys,
    createFocusTrap,
    getFocusableElements,
  };
}

/**
 * Focus ring styles that work with RTL
 */
export const focusRingStyles = {
  default: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  button: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  input: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  card: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
} as const;