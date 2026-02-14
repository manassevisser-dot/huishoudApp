// src/ui/providers/ThemeProvider.tsx
import * as React from 'react';
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';
import type { Theme } from '@domain/constants/Colors';

type ThemeContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider(
  { children, master }: { children: React.ReactNode; master: MasterOrchestratorAPI }
) {
  const [theme, setThemeState] = React.useState<Theme>('light');

  // Load via Master (app policy → infra)
  React.useEffect(() => {
    let mounted = true;
    master.theme.loadTheme().then((t: Theme) => { if (mounted) setThemeState(t); });
    return () => { mounted = false; };
  }, [master]);

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t);
    void master.theme.setTheme(t);
  }, [master]);

  const toggleTheme = React.useCallback(() => {
    setThemeState(prev => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      void master.theme.setTheme(next);
      return next;
    });
  }, [master]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = React.useContext(ThemeContext);
  if (ctx === undefined) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}