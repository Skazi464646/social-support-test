import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import IntervalPlural from 'i18next-intervalplural-postprocessor';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export type SupportedLanguage = 'en' | 'ar';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  locale: string;
}

// =============================================================================
// LANGUAGE CONFIGURATION
// =============================================================================

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    locale: 'en-US',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    locale: 'ar-AE', // UAE Arabic as government context
  },
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const DEFAULT_NAMESPACE = 'common';

// =============================================================================
// PLURALIZATION RULES
// =============================================================================

/**
 * Arabic pluralization rules following Arabic grammar
 * Arabic has 6 forms: zero, one, two, few, many, other
 */
const arabicPluralRule = (count: number, ordinal: boolean): string => {
  if (ordinal) return 'other';
  
  const mod100 = count % 100;
  
  if (count === 0) return 'zero';
  if (count === 1) return 'one';
  if (count === 2) return 'two';
  if (count >= 3 && count <= 10) return 'few';
  if (mod100 >= 11 && mod100 <= 99) return 'many';
  return 'other';
};

// English uses default i18next pluralization rules (one vs other)

// Note: Pluralization rules will be added after i18n initialization

// =============================================================================
// NAMESPACE CONFIGURATION
// =============================================================================

export const NAMESPACES = [
  'common',      // Common UI elements, buttons, etc.
  'navigation',  // Navigation, menu items
  'form',        // Form-related translations
  'validation',  // Validation messages
  'ai',          // AI assistance related
  'errors',      // Error messages
  'success',     // Success messages
  'admin'        // Admin interface (future)
] as const;

export type Namespace = typeof NAMESPACES[number];

// =============================================================================
// RESOURCE LOADER (Dynamic Import Support)
// =============================================================================

/**
 * Lazy load a specific namespace for a language
 */
export const loadNamespace = async (language: SupportedLanguage, namespace: Namespace): Promise<any> => {
  try {
    const response = await fetch(`/locales/${language}/${namespace}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${language}/${namespace}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Failed to load namespace ${namespace} for ${language}:`, error);
    return {};
  }
};

/**
 * Load initial core namespaces (common, navigation)
 */
const loadCoreResources = async (): Promise<any> => {
  try {
    const coreNamespaces = ['common', 'navigation'] as const;
    
    // Load core namespaces for both languages
    const loadPromises = [];
    for (const lang of ['en', 'ar'] as const) {
      for (const ns of coreNamespaces) {
        loadPromises.push(
          loadNamespace(lang, ns).then(data => ({ lang, ns, data }))
        );
      }
    }
    
    const results = await Promise.all(loadPromises);
    
    // Organize results by language and namespace
    const resources: any = { en: {}, ar: {} };
    results.forEach(({ lang, ns, data }) => {
      resources[lang][ns] = data;
    });
    
    return resources;
  } catch (error) {
    console.warn('Failed to load core translation resources, using fallback:', error);
    
    // Enhanced fallback with namespaced resources
    return {
      en: {
        common: {
          language: { 
            english: 'English', 
            arabic: 'العربية', 
            switch_to: 'Switch to {{language}}',
            current: 'Current language: {{language}}'
          },
          actions: { 
            loading: 'Loading...', 
            error: 'Error', 
            retry: 'Retry', 
            cancel: 'Cancel', 
            submit: 'Submit', 
            save: 'Save', 
            close: 'Close', 
            back: 'Back', 
            next: 'Next',
            accept: 'Accept',
            edit: 'Edit',
            discard: 'Discard'
          },
          status: {
            success: 'Success',
            failed: 'Failed',
            pending: 'Pending',
            complete: 'Complete'
          },
          plurals: {
            item_zero: 'No items',
            item_one: '{{count}} item',
            item_other: '{{count}} items',
            file_zero: 'No files',
            file_one: '{{count}} file', 
            file_other: '{{count}} files',
            step_one: 'Step {{count}}',
            step_other: 'Step {{count}}'
          }
        },
        navigation: {
          home: 'Home',
          about: 'About', 
          contact: 'Contact',
          wizard: 'Application Form',
          components: 'Components',
          step1: 'Personal Information',
          step2: 'Financial Information', 
          step3: 'Situation Description'
        }
      },
      ar: {
        common: {
          language: { 
            english: 'English', 
            arabic: 'العربية', 
            switch_to: 'التبديل إلى {{language}}',
            current: 'اللغة الحالية: {{language}}'
          },
          actions: { 
            loading: 'جاري التحميل...', 
            error: 'خطأ', 
            retry: 'إعادة المحاولة', 
            cancel: 'إلغاء', 
            submit: 'إرسال', 
            save: 'حفظ', 
            close: 'إغلاق', 
            back: 'السابق', 
            next: 'التالي',
            accept: 'قبول',
            edit: 'تحرير',
            discard: 'تجاهل'
          },
          status: {
            success: 'نجح',
            failed: 'فشل',
            pending: 'في الانتظار',
            complete: 'مكتمل'
          },
          plurals: {
            item_zero: 'لا توجد عناصر',
            item_one: 'عنصر واحد',
            item_two: 'عنصران',
            item_few: '{{count}} عناصر',
            item_many: '{{count}} عنصراً',
            item_other: '{{count}} عنصر',
            file_zero: 'لا توجد ملفات',
            file_one: 'ملف واحد',
            file_two: 'ملفان',
            file_few: '{{count}} ملفات',
            file_many: '{{count}} ملفاً',
            file_other: '{{count}} ملف',
            step_one: 'الخطوة {{count}}',
            step_other: 'الخطوة {{count}}'
          }
        },
        navigation: {
          home: 'الرئيسية',
          about: 'حول', 
          contact: 'اتصل',
          wizard: 'نموذج الطلب',
          components: 'المكونات',
          step1: 'المعلومات الشخصية',
          step2: 'المعلومات المالية',
          step3: 'وصف الحالة'
        }
      },
    };
  }
};

// =============================================================================
// ENHANCED LANGUAGE DETECTION
// =============================================================================

// Future enhancement: Custom language detector with advanced detection logic
// Currently using simpler browser detection via i18next-browser-languagedetector

// =============================================================================
// I18N INITIALIZATION
// =============================================================================

export const initializeI18n = async (): Promise<typeof i18n> => {
  try {
    // Load translation resources
    const resources = await loadCoreResources();

    // Enhanced initialization with pluralization and namespaces
    const initOptions = {
      fallbackLng: DEFAULT_LANGUAGE,
      lng: DEFAULT_LANGUAGE,
      supportedLngs: ['en', 'ar'],
      debug: import.meta.env.DEV,
      
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18n-language',
        lookupFromPathIndex: 0,
        lookupFromSubdomainIndex: 0,
        checkWhitelist: true,
      },

      interpolation: {
        escapeValue: false,
        formatSeparator: ',',
      },

      // Pluralization support
      pluralSeparator: '_',
      keySeparator: '.',
      nsSeparator: ':',

      resources,
      ns: ['common', 'navigation'],
      defaultNS: DEFAULT_NAMESPACE,
    };

    await i18n
      .use(IntervalPlural)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init(initOptions);

    // Add Arabic pluralization rules after initialization
    try {
      if (i18n.services?.pluralResolver && !i18n.services.pluralResolver.getRule('ar')) {
        i18n.services.pluralResolver.addRule('ar', {
          numbers: [0, 1, 2, 3, 11],
          plurals: arabicPluralRule
        });
      }
    } catch (error) {
      console.warn('Failed to add Arabic pluralization rules:', error);
    }

    // Set up language change handler
    i18n.on('languageChanged', (lng: string) => {
      localStorage.setItem('i18n-language', lng);
      document.documentElement.lang = lng;
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    });

    // Set initial document attributes
    const currentLang = i18n.language || 'en';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    return i18n;
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    
    // Minimal fallback
    await i18n.init({
      fallbackLng: 'en',
      lng: 'en',
      resources: {
        en: { common: { loading: 'Loading...' } },
        ar: { common: { loading: 'جاري التحميل...' } }
      },
      interpolation: { escapeValue: false },
    });
    
    return i18n;
  }
};

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Get language configuration for a specific language code
 */
export const getLanguageConfig = (code: string): LanguageConfig | null => {
  return SUPPORTED_LANGUAGES[code as SupportedLanguage] || null;
};

/**
 * Get current language configuration
 */
export const getCurrentLanguageConfig = (): LanguageConfig => {
  const currentLang = i18n.language as SupportedLanguage;
  return SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE];
};

/**
 * Check if a language code is supported
 */
export const isLanguageSupported = (code: string): code is SupportedLanguage => {
  return code in SUPPORTED_LANGUAGES;
};

/**
 * Get all supported languages as array
 */
export const getSupportedLanguages = (): LanguageConfig[] => {
  return Object.values(SUPPORTED_LANGUAGES);
};

/**
 * Format number according to current locale
 */
export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
  const config = getCurrentLanguageConfig();
  return new Intl.NumberFormat(config.locale, options).format(value);
};

/**
 * Format date according to current locale
 */
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const config = getCurrentLanguageConfig();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(config.locale, options).format(dateObj);
};

/**
 * Format currency according to current locale
 */
export const formatCurrency = (amount: number, currency?: string): string => {
  const config = getCurrentLanguageConfig();
  const currencyCode = currency || (config.code === 'ar' ? 'AED' : 'USD');
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

export default i18n;