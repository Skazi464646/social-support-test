/**
 * UI Constants
 * Contains all UI-related constants for styling, layout, and components
 */

// =============================================================================
// GRID LAYOUT CLASSES
// =============================================================================

export const GRID_LAYOUTS = {
  SINGLE_COLUMN: 'grid-cols-1',
  TWO_COLUMN: 'grid-cols-1 md:grid-cols-2',
  THREE_COLUMN: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  FOUR_COLUMN: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  RESPONSIVE_TWO: 'grid-cols-1 sm:grid-cols-2',
  RESPONSIVE_THREE: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
} as const;

// =============================================================================
// SPACING CLASSES
// =============================================================================

export const SPACING = {
  GAPS: {
    XS: 'gap-2',
    SM: 'gap-3',
    MD: 'gap-4', 
    LG: 'gap-6',
    XL: 'gap-8',
  },
  PADDING: {
    XS: 'p-2',
    SM: 'p-4',
    MD: 'p-6',
    LG: 'p-8',
    XL: 'p-12',
  },
  MARGIN: {
    XS: 'm-2',
    SM: 'm-4',
    MD: 'm-6',
    LG: 'm-8',
    XL: 'm-12',
  },
} as const;

// =============================================================================
// FORM COMPONENT CLASSES
// =============================================================================

export const FORM_CLASSES = {
  INPUT: 'w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:pointer-events-none',
  SELECT: 'w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:pointer-events-none',
  TEXTAREA: 'w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:pointer-events-none resize-none',
  CHECKBOX: 'rounded border-input text-primary focus:ring-ring focus:ring-2',
  CHECKBOX_WITH_DISABLED: 'rounded border-input text-primary focus:ring-ring focus:ring-2 disabled:opacity-50 disabled:pointer-events-none',
} as const;

// =============================================================================
// BUTTON VARIANT CLASSES
// =============================================================================

export const BUTTON_CLASSES = {
  BASE: 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  VARIANTS: {
    DEFAULT: 'bg-primary text-primary-foreground hover:bg-primary/90',
    DESTRUCTIVE: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    OUTLINE: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    SECONDARY: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    GHOST: 'hover:bg-accent hover:text-accent-foreground',
    LINK: 'text-primary underline-offset-4 hover:underline',
  },
  SIZES: {
    DEFAULT: 'h-10 px-4 py-2',
    SM: 'h-9 rounded-md px-3',
    LG: 'h-11 rounded-md px-8',
    ICON: 'h-10 w-10',
  },
} as const;

// =============================================================================
// ICON SIZES
// =============================================================================

export const ICON_SIZES = {
  XS: 'w-3 h-3',
  SM: 'w-4 h-4',
  MD: 'w-5 h-5',
  LG: 'w-6 h-6',
  XL: 'w-8 h-8',
} as const;

// =============================================================================
// CARD CLASSES
// =============================================================================

export const CARD_CLASSES = {
  BASE: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  HEADER: 'flex flex-col space-y-1.5 p-6',
  TITLE: 'text-2xl font-semibold leading-none tracking-tight',
  DESCRIPTION: 'text-sm text-muted-foreground',
  CONTENT: 'p-6 pt-0',
  FOOTER: 'flex items-center p-6 pt-0',
} as const;

// =============================================================================
// NOTICE/ALERT CLASSES
// =============================================================================

export const NOTICE_CLASSES = {
  INFO: {
    CONTAINER: 'border border-info-border bg-info-light rounded-lg p-4',
    ICON: 'text-info mt-0.5',
    TITLE: 'font-medium text-info-foreground mb-1',
    TEXT: 'text-sm text-info-light-foreground',
  },
  WARNING: {
    CONTAINER: 'border border-warning-border bg-warning-light rounded-lg p-4',
    ICON: 'text-warning mt-0.5',
    TITLE: 'font-medium text-warning-foreground mb-1',
    TEXT: 'text-sm text-warning-light-foreground',
  },
  ERROR: {
    CONTAINER: 'bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded',
    TITLE: 'font-medium',
  },
} as const;

// =============================================================================
// LAYOUT CLASSES
// =============================================================================

export const LAYOUT_CLASSES = {
  CONTAINER: 'container mx-auto px-4 py-8 max-w-4xl',
  FORM_SECTION: 'space-y-8',
  FORM_CARD: 'bg-card border rounded-lg p-6 shadow-sm',
  NAVIGATION: 'flex justify-between mt-6',
  CHECKBOX_GROUP: 'grid grid-cols-1 md:grid-cols-2 gap-3',
  CHECKBOX_LABEL: 'flex items-center space-x-3 cursor-pointer',
  CHECKBOX_TEXT: 'text-sm text-foreground select-none',
} as const;

// =============================================================================
// RESPONSIVE BREAKPOINTS
// =============================================================================

export const BREAKPOINTS = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  '2XL': '2xl',
} as const;

// =============================================================================
// ANIMATION CLASSES
// =============================================================================

export const ANIMATIONS = {
  FADE_IN: 'animate-in fade-in-0',
  FADE_OUT: 'animate-out fade-out-0',
  SLIDE_IN: 'animate-in slide-in-from-bottom-2',
  SLIDE_OUT: 'animate-out slide-out-to-bottom-2',
  ZOOM_IN: 'animate-in zoom-in-95',
  ZOOM_OUT: 'animate-out zoom-out-95',
} as const;

// =============================================================================
// CHARACTER COUNT DISPLAY
// =============================================================================

export const CHARACTER_COUNT = {
  SUFFIX: 'characters',
  SEPARATOR: '/',
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type GridLayout = typeof GRID_LAYOUTS[keyof typeof GRID_LAYOUTS];
export type SpacingSize = keyof typeof SPACING.GAPS | keyof typeof SPACING.PADDING | keyof typeof SPACING.MARGIN;
export type ButtonVariant = keyof typeof BUTTON_CLASSES.VARIANTS;
export type ButtonSize = keyof typeof BUTTON_CLASSES.SIZES;
export type IconSize = typeof ICON_SIZES[keyof typeof ICON_SIZES];
export type Breakpoint = typeof BREAKPOINTS[keyof typeof BREAKPOINTS];