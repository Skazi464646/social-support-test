/**
 * Enhanced i18n formatting utilities with locale-aware formatting
 * Integrates with our formatting.ts utilities and i18n system
 */

import { useTranslation } from 'react-i18next';
import { 
  formatNumber as formatNumberUtil,
  formatCurrency as formatCurrencyUtil,
  formatDate as formatDateUtil,
  formatDuration as formatDurationUtil,
  formatFileSize as formatFileSizeUtil,
  formatPhoneNumber as formatPhoneNumberUtil,
  SupportedLocale 
} from './formatting';
import type { Namespace } from '../i18n/config';

// =============================================================================
// PLURALIZATION HELPER
// =============================================================================

/**
 * Enhanced pluralization that works with Arabic pluralization rules
 */
export function usePluralization() {
  const { t, i18n } = useTranslation();
  
  return {
    /**
     * Get pluralized translation with proper Arabic support
     * @param key - Translation key without the pluralization suffix
     * @param count - Number to use for pluralization
     * @param namespace - Optional namespace (defaults to current)
     * @param options - Additional i18next options
     */
    plural: (
      key: string, 
      count: number, 
      namespace?: Namespace,
      options?: any
    ): string => {
      const nsKey = namespace ? `${namespace}:${key}` : key;
      return t(nsKey, { 
        count, 
        defaultValue: `${count} ${key}`,
        ...options 
      }) as string;
    },

    /**
     * Format a count with its associated item name using pluralization
     * Examples: "1 file", "3 files", "ملف واحد", "3 ملفات"
     */
    formatCount: (
      itemKey: string,
      count: number,
      namespace?: Namespace
    ): string => {
      const locale = i18n.language as SupportedLocale;
      const formattedCount = formatNumberUtil(count, locale);
      const pluralKey = `${itemKey}_${count === 0 ? 'zero' : count === 1 ? 'one' : count === 2 ? 'two' : count <= 10 ? 'few' : count >= 11 ? 'many' : 'other'}`;
      
      const nsKey = namespace ? `${namespace}:plurals.${pluralKey}` : `plurals.${pluralKey}`;
      return t(nsKey, `${formattedCount} ${itemKey}`, { 
        count
      });
    }
  };
}

// =============================================================================
// FORMATTING HOOKS
// =============================================================================

/**
 * Hook for locale-aware number formatting
 */
export function useNumberFormatter() {
  const { i18n } = useTranslation();
  const locale = i18n.language as SupportedLocale;

  return {
    /**
     * Format a number according to current locale
     */
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => 
      formatNumberUtil(value, locale, options),

    /**
     * Format currency according to current locale
     */
    formatCurrency: (amount: number, currency?: string) => 
      formatCurrencyUtil(amount, locale, currency),

    /**
     * Format percentage according to current locale
     */
    formatPercentage: (value: number, decimals: number = 1) => 
      formatNumberUtil(value / 100, locale, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      }),
  };
}

/**
 * Hook for locale-aware date formatting
 */
export function useDateFormatter() {
  const { i18n } = useTranslation();
  const locale = i18n.language as SupportedLocale;

  return {
    /**
     * Format a date according to current locale
     */
    formatDate: (date: Date | string | number, format?: string) => 
      formatDateUtil(date, locale, format),

    /**
     * Format a duration in seconds to human readable format
     */
    formatDuration: (seconds: number, includeSeconds?: boolean) => 
      formatDurationUtil(seconds, locale, includeSeconds),

    /**
     * Format relative time (e.g., "2 hours ago")
     */
    formatRelativeTime: (date: Date | string | number) => {
      const { t } = useTranslation();
      const now = new Date();
      const targetDate = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      
      const diffMs = now.getTime() - targetDate.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) {
        return t('common:time.just_now', { defaultValue: 'Just now' });
      } else if (diffMinutes < 60) {
        return t('common:time.minutes_ago', { 
          count: diffMinutes,
          defaultValue: `${diffMinutes} minutes ago` 
        });
      } else if (diffHours < 24) {
        return t('common:time.hours_ago', { 
          count: diffHours,
          defaultValue: `${diffHours} hours ago` 
        });
      } else if (diffDays < 7) {
        return t('common:time.days_ago', { 
          count: diffDays,
          defaultValue: `${diffDays} days ago` 
        });
      } else {
        return formatDateUtil(targetDate, locale, 'PP');
      }
    },
  };
}

/**
 * Hook for file and phone number formatting
 */
export function useUtilityFormatter() {
  const { i18n } = useTranslation();
  const locale = i18n.language as SupportedLocale;

  return {
    /**
     * Format file size in bytes to human readable format
     */
    formatFileSize: (bytes: number, decimals?: number) => 
      formatFileSizeUtil(bytes, locale, decimals),

    /**
     * Format phone number according to locale conventions
     */
    formatPhoneNumber: (phoneNumber: string) => 
      formatPhoneNumberUtil(phoneNumber, locale),
  };
}

// =============================================================================
// SCOPED TRANSLATION HOOKS
// =============================================================================

/**
 * Hook for scoped translations within a specific namespace
 */
export function useScopedTranslation(namespace: Namespace) {
  const { t, i18n } = useTranslation(namespace);
  
  return {
    t: (key: string, options?: any) => t(key, options),
    i18n,
    
    /**
     * Get translation with fallback handling
     */
    tWithFallback: (key: string, fallback: string, options?: any) => 
      t(key, { defaultValue: fallback, ...options }),
    
    /**
     * Check if a translation key exists
     */
    exists: (key: string) => i18n.exists(`${namespace}:${key}`),
  };
}

/**
 * Specialized hooks for common namespaces
 */
export const useCommonTranslation = () => useScopedTranslation('common');
export const useNavigationTranslation = () => useScopedTranslation('navigation');
export const useFormTranslation = () => useScopedTranslation('form');
export const useValidationTranslation = () => useScopedTranslation('validation');
export const useAITranslation = () => useScopedTranslation('ai');
export const useErrorTranslation = () => useScopedTranslation('errors');

// =============================================================================
// NAMESPACE LOADER UTILITIES
// =============================================================================

/**
 * Dynamically load a namespace if not already loaded
 */
export async function ensureNamespaceLoaded(namespace: Namespace): Promise<void> {
  const { i18n } = useTranslation();
  
  if (!i18n.hasLoadedNamespace(namespace)) {
    try {
      await i18n.loadNamespaces(namespace);
    } catch (error) {
      console.warn(`Failed to load namespace ${namespace}:`, error);
    }
  }
}

/**
 * Preload namespaces for better performance
 */
export async function preloadNamespaces(namespaces: Namespace[]): Promise<void> {
  const { i18n } = useTranslation();
  
  const promises = namespaces
    .filter(ns => !i18n.hasLoadedNamespace(ns))
    .map(ns => i18n.loadNamespaces(ns));
  
  try {
    await Promise.all(promises);
  } catch (error) {
    console.warn('Failed to preload some namespaces:', error);
  }
}

// =============================================================================
// TRANSLATION VALIDATION
// =============================================================================

/**
 * Validate that all required translation keys exist for both languages
 */
export function validateTranslations(requiredKeys: string[], namespace?: Namespace): boolean {
  const { i18n } = useTranslation();
  const languages = ['en', 'ar'];
  
  for (const lang of languages) {
    for (const key of requiredKeys) {
      const fullKey = namespace ? `${namespace}:${key}` : key;
      if (!i18n.exists(fullKey, { lng: lang })) {
        console.warn(`Missing translation: ${fullKey} (${lang})`);
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Get missing translation keys for debugging
 */
export function getMissingTranslations(requiredKeys: string[], namespace?: Namespace): string[] {
  const { i18n } = useTranslation();
  const languages = ['en', 'ar'];
  const missing: string[] = [];
  
  for (const lang of languages) {
    for (const key of requiredKeys) {
      const fullKey = namespace ? `${namespace}:${key}` : key;
      if (!i18n.exists(fullKey, { lng: lang })) {
        missing.push(`${fullKey} (${lang})`);
      }
    }
  }
  
  return missing;
}