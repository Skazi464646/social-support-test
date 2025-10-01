import { useEffect, useState, ReactNode } from 'react';
import {
  ThemeContext,
  Theme,
  Direction,
  ThemeContextType,
} from './theme-context';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultDirection?: Direction;
}

function useThemeInitialization(
  defaultTheme: Theme,
  defaultDirection: Direction
) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [direction, setDirectionState] = useState<Direction>(defaultDirection);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedDirection = localStorage.getItem('direction') as Direction;

    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setThemeState(mediaQuery.matches ? 'dark' : 'light');
    }

    if (savedDirection) {
      setDirectionState(savedDirection);
    }
  }, []);

  return { theme, setThemeState, direction, setDirectionState };
}

function useThemeActions(
  theme: Theme,
  direction: Direction,
  setThemeState: (theme: Theme) => void,
  setDirectionState: (direction: Direction) => void
) {
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    root.setAttribute('dir', direction);

    localStorage.setItem('theme', theme);
    localStorage.setItem('direction', direction);
  }, [theme, direction]);

  const toggleTheme = () => {
    setThemeState(theme === 'light' ? 'dark' : 'light');
  };

  const toggleDirection = () => {
    setDirectionState(direction === 'ltr' ? 'rtl' : 'ltr');
  };

  return { toggleTheme, toggleDirection };
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  defaultDirection = 'ltr',
}: ThemeProviderProps) {
  const { theme, setThemeState, direction, setDirectionState } =
    useThemeInitialization(defaultTheme, defaultDirection);

  const { toggleTheme, toggleDirection } = useThemeActions(
    theme,
    direction,
    setThemeState,
    setDirectionState
  );

  const value: ThemeContextType = {
    theme,
    direction,
    toggleTheme,
    toggleDirection,
    setTheme: setThemeState,
    setDirection: setDirectionState,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
