/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-family)', 'ui-sans-serif', 'system-ui'],
        arabic: ['"Noto Sans Arabic"', '"IBM Plex Sans Arabic"', '"Dubai"', '"Tahoma"', 'sans-serif'],
        english: ['Inter', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // Custom plugin for RTL utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Directional margin utilities
        '.ms-0': { 'margin-inline-start': '0' },
        '.ms-1': { 'margin-inline-start': theme('spacing.1') },
        '.ms-2': { 'margin-inline-start': theme('spacing.2') },
        '.ms-3': { 'margin-inline-start': theme('spacing.3') },
        '.ms-4': { 'margin-inline-start': theme('spacing.4') },
        '.ms-auto': { 'margin-inline-start': 'auto' },
        
        '.me-0': { 'margin-inline-end': '0' },
        '.me-1': { 'margin-inline-end': theme('spacing.1') },
        '.me-2': { 'margin-inline-end': theme('spacing.2') },
        '.me-3': { 'margin-inline-end': theme('spacing.3') },
        '.me-4': { 'margin-inline-end': theme('spacing.4') },
        '.me-auto': { 'margin-inline-end': 'auto' },

        // Directional padding utilities
        '.ps-0': { 'padding-inline-start': '0' },
        '.ps-1': { 'padding-inline-start': theme('spacing.1') },
        '.ps-2': { 'padding-inline-start': theme('spacing.2') },
        '.ps-3': { 'padding-inline-start': theme('spacing.3') },
        '.ps-4': { 'padding-inline-start': theme('spacing.4') },
        '.ps-6': { 'padding-inline-start': theme('spacing.6') },
        
        '.pe-0': { 'padding-inline-end': '0' },
        '.pe-1': { 'padding-inline-end': theme('spacing.1') },
        '.pe-2': { 'padding-inline-end': theme('spacing.2') },
        '.pe-3': { 'padding-inline-end': theme('spacing.3') },
        '.pe-4': { 'padding-inline-end': theme('spacing.4') },
        '.pe-6': { 'padding-inline-end': theme('spacing.6') },

        // Text alignment
        '.text-start': { 'text-align': 'start' },
        '.text-end': { 'text-align': 'end' },

        // Border utilities
        '.border-s': { 'border-inline-start-width': '1px' },
        '.border-e': { 'border-inline-end-width': '1px' },
        '.border-s-0': { 'border-inline-start-width': '0' },
        '.border-e-0': { 'border-inline-end-width': '0' },

        // Rounded corners
        '.rounded-s': {
          'border-start-start-radius': theme('borderRadius.DEFAULT'),
          'border-end-start-radius': theme('borderRadius.DEFAULT'),
        },
        '.rounded-e': {
          'border-start-end-radius': theme('borderRadius.DEFAULT'),
          'border-end-end-radius': theme('borderRadius.DEFAULT'),
        },

        // Direction-aware transform utilities
        '.rtl\\:scale-x-[-1]': {
          '[dir="rtl"] &': {
            '--tw-scale-x': '-1',
            transform: 'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
          },
        },
      };

      addUtilities(newUtilities);
    },
  ],
};
