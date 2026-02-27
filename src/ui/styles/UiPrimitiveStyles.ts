/**
 * @file_intent Biedt stijlregels die zich uitsluitend richten op de **layout en compositie** van UI-elementen. Het definieert de container-stijlen voor groeperingen zoals `Chip`s en `Radio`-buttons, en specificeert hun onderlinge plaatsing (flexbox, wrapping, gap), maar bevat nadrukkelijk géén semantische stijlen zoals kleuren, fonts of borders.
 * @repo_architecture UI Layer - Style Primitive (Composition). Dit bestand vormt een paar met de `PrimitiveStyleFactory` uit de `@domain`-laag. Terwijl `@domain` de *semantische* 'policy'-stijlen definieert (wat is 'primary', wat is 'error'?), levert dit bestand de puur visuele, agnostische 'composition'-stijlen. Dit scheidt de 'wat' van de 'hoe'.
 * @term_definition
 *   - `Composition Styles`: Stijlregels die de layout en de relatie tussen *meerdere* elementen (siblings) beschrijven, zoals `flexDirection`, `justifyContent`, en `gap`.
 *   - `Semantic Styles`: Stijlregels die de betekenis en het uiterlijk van een *individueel* element beschrijven, zoals `color`, `backgroundColor`, `fontSize`. Deze horen thuis in de `@domain` laag.
 *   - `getChipContainerStyle`: Een functie die de `flexbox` layout-stijl retourneert voor een container die `Chip`-componenten bevat.
 *   - `getRadioContainerStyle`: Een functie die de `flexbox` layout-stijl retourneert voor een container die `Radio`-button-componenten bevat.
 * @contract De functies in dit object (`get...Style()`) retourneren een `PrimitiveStyleRule` (een `ViewStyle` object) met layout-specifieke eigenschappen. Deze stijlen zijn bedoeld om te worden toegepast op de *container* van een groep UI-elementen, niet op de elementen zelf.
 * @ai_instruction Gebruik de stijlen uit dit bestand wanneer je de positionering van een groep van elementen (zoals chips, radio buttons, etc.) moet definiëren. Importeer `UiPrimitiveStyles` voor layout en compositie. Voor de individuele styling van de elementen zelf (kleuren, tekst, etc.), gebruik je de `PrimitiveStyleFactory` uit `@domain`. Dit bestand moet puur layout-stijlen bevatten; voeg hier geen semantische stijlen toe.
 */
import { Tokens } from '@ui/kernel';
import type { PrimitiveStyleRule } from '@ui/kernel';

export const UiPrimitiveStyles = {
  getChipContainerStyle(): PrimitiveStyleRule {
    return {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Tokens.Space.sm,
    };
  },

  getRadioContainerStyle(): PrimitiveStyleRule {
    return {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Tokens.Space.sm,
    };
  },
};