import { createContext } from 'react';

export type Theme = 'light' | 'dark';
export type Direction = 'ltr' | 'rtl';

export interface ThemeContextType {
  theme: Theme;
  direction: Direction;
  toggleTheme: () => void;
  toggleDirection: () => void;
  setTheme: (theme: Theme) => void;
  setDirection: (direction: Direction) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
