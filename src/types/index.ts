// Global type definitions for the Social Support Portal
import * as React from 'react';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export type Theme = 'light' | 'dark' | 'system';
export type Direction = 'ltr' | 'rtl';
export type Language = 'en' | 'ar';

// Component variant types
export type ComponentSize = 'sm' | 'md' | 'lg';
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';

// Common props for form components
export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

// Button component props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ComponentVariant;
  size?: ComponentSize;
  loading?: boolean;
  asChild?: boolean;
}

// Navigation types
export interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Theme context types
export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}