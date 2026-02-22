/**
 * @file_intent Definieert de kleurenschema's voor de light- en dark-thema's van de applicatie.
 * @repo_architecture Domain Layer - Constants.
 * @term_definition Theme = De UI-modus, 'light' of 'dark'. ColorScheme = Een interface die alle kleurrollen definieert die in de app worden gebruikt voor een thema. Colors = De hoofdconstante die de ColorScheme-objecten voor beide thema's bevat.
 * @contract Dit bestand exporteert `Colors`, een `Record<Theme, ColorScheme>`, die een consistente, type-veilige manier biedt om themakleuren te benaderen. Exporteert ook de `Theme` en `ColorScheme` types.
 * @ai_instruction Bij het wijzigen van kleuren, zorg ervoor dat zowel `light` als `dark` thema's synchroon worden bijgewerkt en alle sleutels in `ColorScheme` in beide aanwezig zijn. Dit bestand is de enige bron van waarheid voor alle UI-kleuren.
 */
// src/domain/constants/Colors.ts
export type Theme = 'light' | 'dark';

export interface ColorScheme {
  background: string;
  surface: string;
  inputBackground: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  inverseText: string;
  border: string;
  borderSubtle: string;
  primary: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  error: string;
  onError: string;
  warning: string;
  onWarning: string;
  success: string;
  onSuccess: string;
  selected: string;
  onSelected: string;
  card: string; // ← alias voor surface (backwards compat)
  shadow: string;
  disabled: string;
}

export const Colors: Record<Theme, ColorScheme> = {
  light: {
    background: '#F2F2F7',
    surface: '#FFFFFF',
    inputBackground: '#FFFFFF',
    textPrimary: '#1C1C1E',
    textSecondary: '#6E6E73',
    textTertiary: '#8E8E93',
    inverseText: '#FFFFFF',
    border: '#D1D1D6',
    borderSubtle: '#F2F2F7',
    primary: '#007AFF',
    onPrimary: '#FFFFFF',
    secondary: '#E5E5EA',
    onSecondary: '#1C1C1E',
    error: '#FF3B30',
    onError: '#FFFFFF',
    warning: '#FF9500',
    onWarning: '#FFFFFF',
    success: '#34C759',
    onSuccess: '#FFFFFF',
    selected: '#007AFF',
    onSelected: '#FFFFFF',
    shadow: '#000000',
    card: '#FFFFFF', 
    disabled: '#CCCCCC',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    inputBackground: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    inverseText: '#0F172A',
    border: '#334155',
    borderSubtle: '#1E293B',
    primary: '#38BDF8',
    onPrimary: '#0F172A',
    secondary: '#334155',
    onSecondary: '#F8FAFC',
    error: '#FF453A',
    onError: '#FFFFFF',
    warning: '#FF9F0A',
    onWarning: '#0F172A',
    success: '#30D158',
    onSuccess: '#0F172A',
    selected: '#38BDF8',
    onSelected: '#0F172A',
    shadow: '#000000',
    card: '#1E293B',
    disabled: '#4D4D4D',
  },
};
