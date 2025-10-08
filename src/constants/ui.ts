/**
 * UI Constants
 * 
 * Centralized UI-related constants for consistent styling and behavior
 */

// =============================================================================
// TEXTAREA DEFAULTS
// =============================================================================

export const TEXTAREA = {
  ROWS: {
    SMALL: 3,
    DEFAULT: 4,
    MEDIUM: 5,
    LARGE: 6,
  },
} as const;

// =============================================================================
// CARD PADDING
// =============================================================================

export const CARD_PADDING = {
  NONE: 'p-0',
  SMALL: 'p-1',
  DEFAULT: 'p-6',
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const SPACING = {
  SECTION: 'space-y-8',
  FIELD_GROUP: 'space-y-6',
  CHECKBOX_GROUP: 'space-y-4',
  SMALL_GAP: 'gap-3',
  DEFAULT_GAP: 'gap-6',
} as const;

// =============================================================================
// GRID LAYOUTS
// =============================================================================

export const GRID_LAYOUTS = {
  SINGLE_COLUMN: 'grid grid-cols-1 gap-6',
  TWO_COLUMNS: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  FULL_WIDTH_IN_GRID: 'md:col-span-2',
} as const;

// =============================================================================
// FORM FIELD MARGINS
// =============================================================================

export const FORM_FIELD_MARGIN = {
  TOP_SMALL: 'mt-0.5',
  TOP_DEFAULT: 'mt-1',
} as const;

// =============================================================================
// ICON SIZES
// =============================================================================

export const ICON_SIZE = {
  SMALL: 'w-4 h-4',
  DEFAULT: 'w-5 h-5',
  LARGE: 'w-6 h-6',
} as const;

// =============================================================================
// COMMON CLASSNAMES
// =============================================================================

export const COMMON_CLASSES = {
  FLEX_START: 'flex items-start',
  FLEX_CENTER: 'flex items-center',
  FLEX_COLUMN: 'flex-1',
} as const;
