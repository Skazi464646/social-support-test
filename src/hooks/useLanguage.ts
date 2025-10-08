import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  type SupportedLanguage, 
  type LanguageConfig,
  SUPPORTED_LANGUAGES,
  getCurrentLanguageConfig,
  getSupportedLanguages,
} from '@/lib/i18n/config';

// =============================================================================
// TYPES
// =============================================================================

interface LanguageState {
  currentLanguage: SupportedLanguage;
  currentConfig: LanguageConfig;
  availableLanguages: LanguageConfig[];
  isChanging: boolean;
  isRTL: boolean;
}

interface UseLanguageReturn extends LanguageState {
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  toggleLanguage: () => Promise<void>;
  getOtherLanguage: () => LanguageConfig;
  isLanguageSupported: (code: string) => code is SupportedLanguage;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Advanced language management hook with persistence, RTL support, and formatting utilities
 */
export function useLanguage(): UseLanguageReturn {
  const { i18n } = useTranslation();
  const [isChanging, setIsChanging] = useState(false);

  // Get current language state
  const currentLanguage = (i18n.language || 'en') as SupportedLanguage;
  const currentConfig = getCurrentLanguageConfig();
  const availableLanguages = getSupportedLanguages();
  const isRTL = currentConfig.dir === 'rtl';

  // Update document attributes when language changes
  useEffect(() => {
    const updateDocumentAttributes = () => {
      const lang = i18n.language as SupportedLanguage;
      const config = SUPPORTED_LANGUAGES[lang] || SUPPORTED_LANGUAGES.en;
      
      // Update HTML attributes
      document.documentElement.lang = lang;
      document.documentElement.dir = config.dir;
      
      // Update meta tags for better SEO and accessibility
      let metaLanguage = document.querySelector('meta[name="language"]');
      if (!metaLanguage) {
        metaLanguage = document.createElement('meta');
        metaLanguage.setAttribute('name', 'language');
        document.head.appendChild(metaLanguage);
      }
      metaLanguage.setAttribute('content', lang);

      // Update lang attribute on body for CSS targeting
      document.body.setAttribute('data-language', lang);
      document.body.setAttribute('data-direction', config.dir);
    };

    updateDocumentAttributes();

    // Listen for language changes
    const handleLanguageChange = () => {
      updateDocumentAttributes();
      setIsChanging(false);
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Change language with loading state
  const changeLanguage = useCallback(async (language: SupportedLanguage) => {
    if (language === currentLanguage || !(language in SUPPORTED_LANGUAGES)) {
      return;
    }

    setIsChanging(true);

    try {
      // First, load the required namespaces for the new language
      const namespacesToLoad = ['form', 'validation'];
      for (const ns of namespacesToLoad) {
        try {
          const response = await fetch(`/locales/${language}/${ns}.json`);
          if (response.ok) {
            const data = await response.json();
            i18n.addResourceBundle(language, ns, data, true, true);
          }
        } catch (error) {
          console.warn(`[useLanguage] Failed to load ${language}/${ns}:`, error);
        }
      }
      
      // Change language in i18n
      await i18n.changeLanguage(language);
      
      // Store preference
      localStorage.setItem('i18n-language', language);
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { 
          language, 
          config: SUPPORTED_LANGUAGES[language],
          previous: currentLanguage,
        },
      }));


    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  }, [currentLanguage, i18n]);

  // Toggle between available languages
  const toggleLanguage = useCallback(async () => {
    const otherLanguage = getOtherLanguage();
    await changeLanguage(otherLanguage.code);
  }, [changeLanguage]);

  // Get the other available language (for 2-language toggle)
  const getOtherLanguage = useCallback((): LanguageConfig => {
    const languages = Object.values(SUPPORTED_LANGUAGES);
    return languages.find(lang => lang.code !== currentLanguage) || languages[0]!;
  }, [currentLanguage]);

  // Check if language is supported
  const isLanguageSupported = useCallback((code: string): code is SupportedLanguage => {
    return code in SUPPORTED_LANGUAGES;
  }, []);

  // Formatting utilities using current locale
  const formatNumber = useCallback((
    value: number, 
    options?: Intl.NumberFormatOptions
  ): string => {
    try {
      return new Intl.NumberFormat(currentConfig.locale, options).format(value);
    } catch (error) {
      console.warn('Number formatting failed:', error);
      return value.toString();
    }
  }, [currentConfig.locale]);

  const formatDate = useCallback((
    date: Date | string, 
    options?: Intl.DateTimeFormatOptions
  ): string => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) {
        return date.toString();
      }
      return new Intl.DateTimeFormat(currentConfig.locale, options).format(dateObj);
    } catch (error) {
      console.warn('Date formatting failed:', error);
      return date.toString();
    }
  }, [currentConfig.locale]);

  const formatCurrency = useCallback((
    amount: number, 
    currency?: string
  ): string => {
    try {
      const currencyCode = currency || (currentConfig.code === 'ar' ? 'AED' : 'USD');
      return new Intl.NumberFormat(currentConfig.locale, {
        style: 'currency',
        currency: currencyCode,
      }).format(amount);
    } catch (error) {
      console.warn('Currency formatting failed:', error);
      return amount.toString();
    }
  }, [currentConfig.locale, currentConfig.code]);

  return {
    // State
    currentLanguage,
    currentConfig,
    availableLanguages,
    isChanging,
    isRTL,
    
    // Actions
    changeLanguage,
    toggleLanguage,
    getOtherLanguage,
    isLanguageSupported,
    
    // Utilities
    formatNumber,
    formatDate,
    formatCurrency,
  };
}

// =============================================================================
// ADDITIONAL HOOKS
// =============================================================================

/**
 * Hook for RTL-aware layout adjustments
 */
export function useDirection() {
  const { isRTL, currentConfig } = useLanguage();

  return {
    isRTL,
    isLTR: !isRTL,
    dir: currentConfig.dir,
    
    // Utility functions for conditional styling
    rtlClass: (rtlClass: string, ltrClass?: string) => isRTL ? rtlClass : (ltrClass || ''),
    ltrClass: (ltrClass: string, rtlClass?: string) => !isRTL ? ltrClass : (rtlClass || ''),
    
    // Helper for margin/padding directional classes
    marginStart: (value: string) => isRTL ? `mr-${value}` : `ml-${value}`,
    marginEnd: (value: string) => isRTL ? `ml-${value}` : `mr-${value}`,
    paddingStart: (value: string) => isRTL ? `pr-${value}` : `pl-${value}`,
    paddingEnd: (value: string) => isRTL ? `pl-${value}` : `pr-${value}`,
  };
}

/**
 * Hook for locale-aware formatting with memoization
 */
export function useFormatting() {
  const { formatNumber, formatDate, formatCurrency } = useLanguage();

  return {
    formatNumber,
    formatDate,
    formatCurrency,
    
    // Specialized formatters
    formatPercent: useCallback((value: number, decimals = 1) => 
      formatNumber(value, { 
        style: 'percent', 
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }), 
      [formatNumber]
    ),
    
    formatInteger: useCallback((value: number) => 
      formatNumber(value, { maximumFractionDigits: 0 }), 
      [formatNumber]
    ),
    
    formatShortDate: useCallback((date: Date | string) => 
      formatDate(date, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }), 
      [formatDate]
    ),
    
    formatTime: useCallback((date: Date | string) => 
      formatDate(date, { 
        hour: '2-digit', 
        minute: '2-digit' 
      }), 
      [formatDate]
    ),
  };
}

export default useLanguage;