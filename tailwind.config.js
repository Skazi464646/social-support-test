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
        // Core colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: 'hsl(var(--surface))',
        
        // Primary colors
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
          active: 'hsl(var(--primary-active))',
          light: 'hsl(var(--primary-light))',
          'light-foreground': 'hsl(var(--primary-light-foreground))',
        },
        
        // Secondary colors
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          hover: 'hsl(var(--secondary-hover))',
          border: 'hsl(var(--secondary-border))',
        },
        
        // Semantic colors
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
          light: 'hsl(var(--success-light))',
          'light-foreground': 'hsl(var(--success-light-foreground))',
          border: 'hsl(var(--success-border))',
        },
        
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          light: 'hsl(var(--warning-light))',
          'light-foreground': 'hsl(var(--warning-light-foreground))',
          border: 'hsl(var(--warning-border))',
        },
        
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          light: 'hsl(var(--destructive-light))',
          'light-foreground': 'hsl(var(--destructive-light-foreground))',
          border: 'hsl(var(--destructive-border))',
        },
        
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
          light: 'hsl(var(--info-light))',
          'light-foreground': 'hsl(var(--info-light-foreground))',
          border: 'hsl(var(--info-border))',
        },
        
        // Supporting colors
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
          border: 'hsl(var(--muted-border))',
        },
        
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          hover: 'hsl(var(--accent-hover))',
        },
        
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
          border: 'hsl(var(--popover-border))',
        },
        
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          border: 'hsl(var(--card-border))',
        },
        
        // Text hierarchy
        text: {
          primary: 'hsl(var(--text-primary))',
          secondary: 'hsl(var(--text-secondary))',
          tertiary: 'hsl(var(--text-tertiary))',
          disabled: 'hsl(var(--text-disabled))',
        },
        
        // Interactive elements
        'input-focus': 'hsl(var(--input-focus))',
        tooltip: {
          DEFAULT: 'hsl(var(--tooltip))',
          foreground: 'hsl(var(--tooltip-foreground))',
        },
      },
      borderRadius: {
        'xs': '0.25rem',   // 4px - Extra small for badges, tags
        'sm': '0.375rem',  // 6px - Small for inputs, small buttons
        'md': '0.5rem',    // 8px - Default for buttons
        'lg': '0.75rem',   // 12px - Large for cards, modals
        'xl': '1rem',      // 16px - Extra large for prominent cards
        '2xl': '1.25rem',  // 20px - Very large for hero elements
        '3xl': '1.5rem',   // 24px - Massive for special containers
        'full': '9999px',  // Full rounded for pills
      },
      boxShadow: {
        // Subtle elevation shadows with warm tones
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.08)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        // AEGold glow for focus/hover states (using AEGold-500: #B68A35)
        'gold-sm': '0 0 0 3px rgba(182, 138, 53, 0.1)',
        'gold-md': '0 0 0 4px rgba(182, 138, 53, 0.15)',
        'gold-lg': '0 0 0 6px rgba(182, 138, 53, 0.2)',
        // None
        'none': 'none',
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
