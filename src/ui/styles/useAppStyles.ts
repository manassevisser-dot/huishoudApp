/**
 * @file_intent Dient als de primaire "assembler" en "entry-point" voor het gehele styling-systeem van de applicatie. De `useAppStyles`-hook consumeert het huidige thema, stelt een compleet, geoptimaliseerd en platform-specifiek stylesheet samen, en stelt dit beschikbaar aan alle UI-componenten.
 * @repo_architecture UI Layer - Style Root. Dit is de hoogste laag van het styling-systeem en het enige wat de meeste componenten hoeven te importeren om stijlen te gebruiken. Het orkestreert de input van de `@domain/registry/StyleRegistry` (semantische regels), `@domain/constants` (tokens & kleuren), en `@ui/styles/PlatformStyles` (platform-specifieke aanpassingen zoals schaduws).
 * @term_definition
 *   - `useAppStyles`: De custom React-hook die het centrale `styles`-object en de `colors` voor het huidige thema levert.
 *   - `getAppStyles`: De core-functie (buiten de React-context) die het stylesheet assembleert en cachet.
 *   - `StyleRegistry`: Een verzameling van `make...` functies in de `@domain`-laag die de thematiseerbare, semantische stijlregels definiëren.
 *   - `Style Cache`: Een mechanisme (`styleCache`) dat de gegenereerde `StyleSheet`-objecten per thema opslaat om te voorkomen dat stijlen bij elke render opnieuw worden berekend.
 *   - `Assembler`: Het proces binnen `getAppStyles` waarbij de resultaten van alle `make...` functies worden samengevoegd tot één groot stijl-object.
 * @contract De `useAppStyles`-hook retourneert een object `{ styles, colors, Tokens }`. `styles` is een volledig geassembleerd en gecached `StyleSheet`-object, klaar voor gebruik in componenten (`<View style={styles.card} />`). De functie `getAppStyles` voert drie stappen uit: 1. Het assembleert alle stijlregels uit de `StyleRegistry`. 2. Het past platform-specifieke schaduws toe met `applyShadows`. 3. Het creëert een geoptimaliseerd `StyleSheet` en slaat dit op in de cache.
 * @ai_instruction Om stijlen in een component te gebruiken, importeer en roep je de `useAppStyles`-hook aan: `const { styles, colors } = useAppStyles();`. Wijzigingen in de *definitie* van een stijl (bv. de kleur van een `button`) horen thuis in de `StyleRegistry` in de `@domain`-laag, niet in dit bestand. Dit bestand orkestreert alleen de assemblage. Voeg een nieuwe import van een `make...` functie toe als je een compleet nieuwe categorie stijlen introduceert in de `StyleRegistry`.
 */
// src/ui/styles/useAppStyles.ts
/**
 * @file_intent De brug tussen de StyleRegistry (domein) en React Native StyleSheet (platform).
 * @repo_architecture Mobile Industry (MI) - UI Style Layer.
 * @term_definition StyleRegistry = De Single Source of Truth voor visuele regels, gevoed door kleurthema's.
 * @contract Stateless factory met caching. Transformeert pure tokens naar geoptimaliseerde platform-stijlen.
 * @ai_instruction Wijzigingen in individuele componentstijlen horen thuis in de @domain/registry/StyleRegistry, niet hier.
 */
import { StyleSheet } from 'react-native';
import { useTheme } from '@ui/providers/ThemeProvider';
import { Colors, Theme } from '@domain/constants/Colors';
import { Tokens } from '@domain/constants/Tokens';
import { applyShadows, AnyStyle } from './PlatformStyles';

// Importeer ALLES uit de StyleRegistry — de SSOT
import {
  makeLayout,
  makeHeader,
  makeButtons,
  makeCards,
  makeChips,
  makeDashboard,
  makeSummary,
  makeTypography,
  makeAlerts,
  makeToggles,
  makeCheckboxes,
  makeHelpers,
  makeContainers,
} from '@domain/registry/StyleRegistry';

// Cache per thema
const styleCache: Partial<Record<Theme, ReturnType<typeof StyleSheet.create>>> = {};

export function getAppStyles(theme: Theme) {
  const cachedStyles = styleCache[theme];
  if (cachedStyles !== undefined) {
    return cachedStyles;
  }

  const c = Colors[theme];

  // 1. Assembleer alle domein-regels (pure tokens, geen platform-code)
  const assembled = {
    ...makeLayout(c),
    ...makeHeader(c),
    ...makeButtons(c),
    ...makeCards(c),
    ...makeChips(c),
    ...makeDashboard(c),
    ...makeSummary(c),
    ...makeTypography(c),
    ...makeAlerts(c),
    ...makeToggles(c),
    ...makeCheckboxes(c),
    ...makeHelpers(c),
    ...makeContainers(c),
  };

  // 2. Pas platform-specifieke shadows toe (de enige RN-afhankelijke stap)
  const withShadows = applyShadows(
    assembled as unknown as Record<string, AnyStyle>,
    c
  );

  // 3. Maak StyleSheet (RN optimalisatie)
  const styles = StyleSheet.create(withShadows);
  styleCache[theme] = styles;
  return styles;
}

export type AppStyles = ReturnType<typeof getAppStyles>;

export function useAppStyles() {
  const { theme } = useTheme();
  const styles = getAppStyles(theme);
  const colors = Colors[theme];
  return { styles, colors, Tokens };
}