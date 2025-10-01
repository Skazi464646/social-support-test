import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to handle RTL/LTR direction switching
 * Automatically updates document direction when language changes
 */
export function useDirection() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';

    // Update document attributes
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;

    // Update CSS custom property for programmatic access
    document.documentElement.style.setProperty('--text-direction', direction);

    // Add class for CSS targeting
    document.documentElement.classList.remove('ltr', 'rtl');
    document.documentElement.classList.add(direction);
  }, [i18n.language]);

  return {
    direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
    isRTL: i18n.language === 'ar',
    isLTR: i18n.language !== 'ar',
  };
}
