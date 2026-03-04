// src/ui/providers/ThemeProvider.tsx

import * as React from 'react';
import { Logger } from '@adapters/audit/AuditLoggerAdapter';  // ✅ Import toevoegen
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';
import type { Theme } from '@ui/kernel';

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

  const logThemeError = (event: string, ctx: Record<string, unknown>) => 
    Logger.warning(event, { error: ctx.error instanceof Error ? ctx.error.message : String(ctx.error), ...ctx });

  const persistTheme = React.useCallback((t: Theme) => 
    master.theme.setTheme(t).catch(err => logThemeError('theme.save_failed', { theme: t, error: err })), 
  [master]);

  React.useEffect(() => {
    master.theme.onThemeChange(setThemeState);
    let mounted = true;
    master.theme.loadTheme().then(t => { if (mounted) setThemeState(t); })
      .catch(err => logThemeError('theme.load_failed', { defaultTheme: 'light', error: err }));
    return () => { mounted = false; }; // ✅ Geen unsub?.() - onThemeChange returns void
  }, [master]);

  // ✅ Alleen persistTheme in deps - master is al "gevangen" door persistTheme's useCallback
  const setTheme = React.useCallback((t: Theme) => { setThemeState(t); persistTheme(t); }, [persistTheme]);
  const toggleTheme = React.useCallback(() => 
    setThemeState(prev => { const next = prev === 'light' ? 'dark' : 'light'; persistTheme(next); return next; }), 
  [persistTheme]);

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const ctx = React.useContext(ThemeContext);
  if (ctx === undefined) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}