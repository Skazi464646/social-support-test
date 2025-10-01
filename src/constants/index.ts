// Application constants

export const APP_CONFIG = {
  name: 'Social Support Portal',
  defaultLanguage: 'en' as const,
  supportedLanguages: ['en', 'ar'] as const,
  defaultTheme: 'system' as const,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  destructive: 'hsl(var(--destructive))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
} as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// Language configuration
export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
] as const;

// Route constants
export const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact',
  form: '/form',
  success: '/success',
} as const;