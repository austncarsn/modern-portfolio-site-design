import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'prompt-os-theme';

/**
 * Theme management hook.
 * Persists to localStorage and toggles `.dark` class on <html>.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {}
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const isDark = theme === 'dark';

  return { theme, setTheme, toggleTheme, isDark } as const;
}

/**
 * Application Theme Tokens — JS Side
 * Used where CSS variables aren't practical (inline styles, chart configs).
 */
export const PALETTE = {
  primary: {
    50: '#EBF5FB', 100: '#D6EAF8', 200: '#AED6F1', 300: '#85C1E9',
    400: '#5DADE2', 500: '#3498DB', 600: '#2E86C1', 700: '#2874A6',
    800: '#21618C', 900: '#1B4F72',
  },
  neutral: {
    50: '#FAFAFA', 100: '#F5F5F5', 200: '#EEEEEE', 300: '#E0E0E0',
    400: '#BDBDBD', 500: '#9E9E9E', 600: '#757575', 700: '#616161',
    800: '#424242', 900: '#212121',
  },
  accent: {
    warm: '#F39C12', success: '#27AE60', danger: '#E74C3C', info: '#3498DB',
    purple: '#9B59B6', teal: '#1ABC9C', blue: '#334E68', sky: '#AEC6CF',
    slate: '#5D6D7E', charcoal: '#2C3E50',
  },
  surface: {
    paper: '#FDFBF7', elevated: '#FFFFFF', muted: '#F7F7F2',
    warm: '#F7F7F2', cool: '#F0F4F8',
  },
} as const;
