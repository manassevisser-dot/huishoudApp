/**
 * @file_intent Beheert het visuele thema (bijv. 'light' of 'dark') van de applicatie. Het laadt, beheert en distribueert de huidige thema-instelling en stelt functies beschikbaar om het thema te wijzigen.
 * @repo_architecture UI Layer - State Management / Theming. Deze provider isoleert de logica voor themabeheer en maakt deze beschikbaar voor de hele applicatie via een React Context.
 * @term_definition
 *   - `Theme`: Een type dat de mogelijke thema's definieert (bv. 'light' | 'dark').
 *   - `useTheme`: De consumer-hook die componenten toegang geeft tot het huidige thema (`theme`) en de functies om het te wijzigen (`setTheme`, `toggleTheme`).
 *   - `master.theme`: Een verwijzing naar de `theme`-orchestrator in de `master`-laag. Deze wordt gebruikt voor het persisteren (opslaan en laden) van de themakeuze van de gebruiker.
 * @contract Componenten binnen de `ThemeProvider` kunnen de `useTheme`-hook gebruiken om het uiterlijk van de app aan te passen aan het actieve thema. De provider communiceert met de `master`-orchestrator om de themakeuze persistent te maken over sessies heen.
 * @ai_instruction Gebruik de `useTheme`-hook in elk component dat zich moet aanpassen aan het thema. Bijvoorbeeld: `const { theme } = useTheme(); const color = theme === 'light' ? 'black' : 'white';`. De logica voor het *opslaan* van de themakeuze is al afgehandeld via de `master`-orchestrator. Dit bestand hoeft alleen te worden gewijzigd als je bijvoorbeeld meer thema's wilt toevoegen. De daadwerkelijke stijl-waarden (kleuren, etc.) voor elk thema worden beheerd in `ui/styles`.
 */
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