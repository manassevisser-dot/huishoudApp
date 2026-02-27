// src/domain/constants/Colors.ts

/**
 * Kleurenschema's voor het light- en dark-thema van de applicatie.
 *
 * @module domain/constants
 * @see {@link ./README.md | Constants — Details}
 *
 * @remarks
 * `Colors` is de **enige bron van waarheid** voor alle UI-kleuren.
 * Gebruik nooit hardcoded hex-waarden in componenten of stijl-bestanden;
 * verwijs altijd via `useAppStyles()` of `Colors[theme]`.
 *
 * Bij wijzigingen: zorg dat `light` én `dark` beide volledig en synchroon blijven.
 * Elke sleutel in `ColorScheme` moet in beide thema-objecten aanwezig zijn.
 */

/** Union van de twee ondersteunde UI-modi. */
export type Theme = 'light' | 'dark';

/**
 * Alle kleurrollen die in de applicatie worden gebruikt.
 * Elke rol heeft een semantische naam — niet een kleurwaarde (bijv. `primary`, niet `blue`).
 */
export interface ColorScheme {
  /** Achtergrond van de schermen en modals. */
  background:      string;
  /** Achtergrond van kaarten, sheets en elevated elementen. */
  surface:         string;
  /** Achtergrond van invoervelden. */
  inputBackground: string;

  /** Primaire tekst — hoog contrast op `background`. */
  textPrimary:     string;
  /** Secundaire tekst — metadatalabels, subtitels. */
  textSecondary:   string;
  /** Tertiaire tekst — placeholders, hints. */
  textTertiary:    string;
  /** Tekst op donkere of gekleurde achtergronden. */
  inverseText:     string;

  /** Standaard randen en dividers. */
  border:          string;
  /** Subtiele randen (bijna onzichtbaar op `background`). */
  borderSubtle:    string;

  /** Primaire actiekleur (knoppen, links, focus-ring). */
  primary:         string;
  /** Tekst/icoon op een `primary`-achtergrond. */
  onPrimary:       string;
  /** Secundaire actiekleur (chips, secundaire knoppen). */
  secondary:       string;
  /** Tekst/icoon op een `secondary`-achtergrond. */
  onSecondary:     string;

  /** Foutkleur voor validatiemeldingen en destructieve acties. */
  error:           string;
  /** Tekst/icoon op een `error`-achtergrond. */
  onError:         string;
  /** Waarschuwingskleur voor niet-kritieke meldingen. */
  warning:         string;
  /** Tekst/icoon op een `warning`-achtergrond. */
  onWarning:       string;
  /** Succeskleur voor bevestigingen en positieve feedback. */
  success:         string;
  /** Tekst/icoon op een `success`-achtergrond. */
  onSuccess:       string;

  /** Achtergrond van geselecteerde chips en radio-opties. */
  selected:        string;
  /** Tekst/icoon op een `selected`-achtergrond. */
  onSelected:      string;

  /**
   * Alias voor `surface` — behouden voor backwards-compatibiliteit.
   * @deprecated Gebruik `surface` voor nieuwe componenten.
   */
  card:            string;
  /** Schaduwkleur (altijd zwart; opacity verschilt per component). */
  shadow:          string;
  /** Kleur voor uitgeschakelde elementen. */
  disabled:        string;
}

/**
 * Kleurenobject per thema — de SSOT voor alle UI-kleuren.
 *
 * @example
 * const colors = Colors[theme]; // theme = 'light' | 'dark'
 * style={{ backgroundColor: colors.surface }}
 */
export const Colors: Record<Theme, ColorScheme> = {
  light: {
    background:      '#F2F2F7',
    surface:         '#FFFFFF',
    inputBackground: '#FFFFFF',
    textPrimary:     '#1C1C1E',
    textSecondary:   '#6E6E73',
    textTertiary:    '#8E8E93',
    inverseText:     '#FFFFFF',
    border:          '#D1D1D6',
    borderSubtle:    '#F2F2F7',
    primary:         '#007AFF',
    onPrimary:       '#FFFFFF',
    secondary:       '#E5E5EA',
    onSecondary:     '#1C1C1E',
    error:           '#FF3B30',
    onError:         '#FFFFFF',
    warning:         '#FF9500',
    onWarning:       '#FFFFFF',
    success:         '#34C759',
    onSuccess:       '#FFFFFF',
    selected:        '#007AFF',
    onSelected:      '#FFFFFF',
    shadow:          '#000000',
    card:            '#FFFFFF',
    disabled:        '#CCCCCC',
  },
  dark: {
    background:      '#0F172A',
    surface:         '#1E293B',
    inputBackground: '#1E293B',
    textPrimary:     '#F8FAFC',
    textSecondary:   '#94A3B8',
    textTertiary:    '#64748B',
    inverseText:     '#0F172A',
    border:          '#334155',
    borderSubtle:    '#1E293B',
    primary:         '#38BDF8',
    onPrimary:       '#0F172A',
    secondary:       '#334155',
    onSecondary:     '#F8FAFC',
    error:           '#FF453A',
    onError:         '#FFFFFF',
    warning:         '#FF9F0A',
    onWarning:       '#0F172A',
    success:         '#30D158',
    onSuccess:       '#0F172A',
    selected:        '#38BDF8',
    onSelected:      '#0F172A',
    shadow:          '#000000',
    card:            '#1E293B',
    disabled:        '#4D4D4D',
  },
};
