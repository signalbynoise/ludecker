'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from './components/ui/button';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun className="theme-toggle__icon" /> : <Moon className="theme-toggle__icon" />}
    </Button>
  );
}
