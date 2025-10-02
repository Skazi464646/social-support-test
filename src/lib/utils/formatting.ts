/**
 * Locale-aware formatting utilities for dates, numbers, and currencies
 * Supports Arabic (ar) and English (en) locales with proper RTL formatting
 */

import { format, formatDistance, formatRelative } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

// Locale mapping for date-fns
const DATE_LOCALES = {
  en: enUS,
  ar: ar,
} as const;

// Currency mapping for each locale
const CURRENCY_CODES = {
  en: 'USD',
  ar: 'AED', // UAE Dirham for Arabic
} as const;

export type SupportedLocale = keyof typeof DATE_LOCALES;

/**
 * Format a date according to the specified locale
 * @param date - Date to format
 * @param locale - Target locale ('en' | 'ar')
 * @param formatStr - Optional format string (default: 'PPP')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  locale: SupportedLocale = 'en',
  formatStr: string = 'PPP'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  try {
    return format(dateObj, formatStr, {
      locale: DATE_LOCALES[locale],
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateObj.toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US');
  }
}

/**
 * Format a date as a short string (e.g., "Dec 25, 2023" or "٢٥ ديسمبر ٢٠٢٣")
 */
export function formatDateShort(date: Date | string | number, locale: SupportedLocale = 'en'): string {
  return formatDate(date, locale, 'PP');
}

/**
 * Format a date as a long string (e.g., "Monday, December 25th, 2023")
 */
export function formatDateLong(date: Date | string | number, locale: SupportedLocale = 'en'): string {
  return formatDate(date, locale, 'PPPP');
}

/**
 * Format relative time (e.g., "2 hours ago", "في ٣ أيام")
 */
export function formatRelativeTime(
  date: Date | string | number,
  baseDate: Date = new Date(),
  locale: SupportedLocale = 'en'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  try {
    return formatRelative(dateObj, baseDate, {
      locale: DATE_LOCALES[locale],
    });
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return dateObj.toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US');
  }
}

/**
 * Format a distance between dates (e.g., "2 hours", "٣ أيام")
 */
export function formatDateDistance(
  date: Date | string | number,
  baseDate: Date = new Date(),
  locale: SupportedLocale = 'en'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  try {
    return formatDistance(dateObj, baseDate, {
      locale: DATE_LOCALES[locale],
      addSuffix: true,
    });
  } catch (error) {
    console.error('Date distance formatting error:', error);
    return '';
  }
}

/**
 * Format a number according to the specified locale
 * @param number - Number to format
 * @param locale - Target locale ('en' | 'ar')
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 */
export function formatNumber(
  number: number,
  locale: SupportedLocale = 'en',
  options: Intl.NumberFormatOptions = {}
): string {
  if (typeof number !== 'number' || isNaN(number)) {
    return '0';
  }

  const localeCode = locale === 'ar' ? 'ar-AE' : 'en-US';
  
  try {
    return new Intl.NumberFormat(localeCode, options).format(number);
  } catch (error) {
    console.error('Number formatting error:', error);
    return number.toString();
  }
}

/**
 * Format a currency amount according to the specified locale
 * @param amount - Amount to format
 * @param locale - Target locale ('en' | 'ar')
 * @param currency - Optional currency code (overrides default)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  locale: SupportedLocale = 'en',
  currency?: string
): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return formatCurrency(0, locale, currency);
  }

  const currencyCode = currency || CURRENCY_CODES[locale];
  const localeCode = locale === 'ar' ? 'ar-AE' : 'en-US';
  
  try {
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${amount} ${currencyCode}`;
  }
}

/**
 * Format a percentage according to the specified locale
 */
export function formatPercentage(
  value: number,
  locale: SupportedLocale = 'en',
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 1
): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }

  const localeCode = locale === 'ar' ? 'ar-AE' : 'en-US';
  
  try {
    return new Intl.NumberFormat(localeCode, {
      style: 'percent',
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value / 100);
  } catch (error) {
    console.error('Percentage formatting error:', error);
    return `${value}%`;
  }
}

/**
 * Format a large number with abbreviations (e.g., 1.2K, 1.5M)
 */
export function formatCompactNumber(
  number: number,
  locale: SupportedLocale = 'en'
): string {
  if (typeof number !== 'number' || isNaN(number)) {
    return '0';
  }

  const localeCode = locale === 'ar' ? 'ar-AE' : 'en-US';
  
  try {
    return new Intl.NumberFormat(localeCode, {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(number);
  } catch (error) {
    console.error('Compact number formatting error:', error);
    return formatNumber(number, locale);
  }
}

/**
 * Format a file size in bytes to human readable format
 */
export function formatFileSize(
  bytes: number,
  locale: SupportedLocale = 'en',
  decimals: number = 2
): string {
  if (bytes === 0) return '0 Bytes';
  if (typeof bytes !== 'number' || isNaN(bytes)) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = locale === 'ar' 
    ? ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت']
    : ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formatNumber(value, locale)} ${sizes[i]}`;
}

/**
 * Format a duration in seconds to human readable format
 */
export function formatDuration(
  seconds: number,
  locale: SupportedLocale = 'en',
  includeSeconds: boolean = true
): string {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    return locale === 'ar' ? '٠ ثانية' : '0 seconds';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (hours > 0) {
    const hourLabel = locale === 'ar' 
      ? (hours === 1 ? 'ساعة' : hours === 2 ? 'ساعتان' : 'ساعات')
      : (hours === 1 ? 'hour' : 'hours');
    parts.push(`${formatNumber(hours, locale)} ${hourLabel}`);
  }

  if (minutes > 0) {
    const minuteLabel = locale === 'ar'
      ? (minutes === 1 ? 'دقيقة' : minutes === 2 ? 'دقيقتان' : 'دقائق')
      : (minutes === 1 ? 'minute' : 'minutes');
    parts.push(`${formatNumber(minutes, locale)} ${minuteLabel}`);
  }

  if (includeSeconds && (remainingSeconds > 0 || parts.length === 0)) {
    const secondLabel = locale === 'ar'
      ? (remainingSeconds === 1 ? 'ثانية' : remainingSeconds === 2 ? 'ثانيتان' : 'ثوان')
      : (remainingSeconds === 1 ? 'second' : 'seconds');
    parts.push(`${formatNumber(remainingSeconds, locale)} ${secondLabel}`);
  }

  return parts.join(locale === 'ar' ? ' و ' : ' and ');
}

/**
 * Format a phone number according to locale conventions
 */
export function formatPhoneNumber(
  phoneNumber: string,
  locale: SupportedLocale = 'en'
): string {
  if (!phoneNumber) return '';

  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (locale === 'ar') {
    // Arabic phone number formatting (UAE style)
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('971')) {
      return `+971 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    }
  } else {
    // US phone number formatting
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
  }

  return phoneNumber; // Return original if no pattern matches
}

/**
 * Utility to get the appropriate locale code for browser APIs
 */
export function getBrowserLocale(locale: SupportedLocale): string {
  return locale === 'ar' ? 'ar-AE' : 'en-US';
}

/**
 * Utility to check if a locale uses RTL direction
 */
export function isRTLLocale(locale: SupportedLocale): boolean {
  return locale === 'ar';
}