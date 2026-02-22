/**
 * @file_intent Definieert herbruikbare, gedeelde TypeScript-types voor styling binnen een React Native applicatie. Het doel is om een consistente en type-veilige manier te bieden voor het doorgeven van style-props aan componenten.
 * @repo_architecture Shared Types Layer - Cross-cutting concern. Deze types worden door de hele UI-laag heen gebruikt.
 * @term_definition
 *   - `Style`: Een union-type dat elke geldige React Native style kan representeren (View, Text, of Image).
 *   - `StyleProp<T>`: Een generiek utility-type voor style-props dat een enkel style-object, een array van styles, of 'null'/'undefined' toestaat. Dit is een standaardpatroon in React Native.
 *   - `StylableProps`: Een herbruikbare interface voor component-props, die aangeeft dat een component een 'style'-prop accepteert.
 * @contract Dit bestand exporteert de types `Style`, `StyleProp<T>` en de interface `StylableProps`. Dit zijn pure type-definities en hebben geen runtime-impact. Ze zijn bedoeld voor import door UI-componenten in de hele codebase.
 * @ai_instruction Gebruik deze types bij het maken of aanpassen van React Native componenten die een `style`-prop hebben. Implementeer de `StylableProps`-interface voor de props van een component om consistentie te garanderen. Gebruik `StyleProp<ViewStyle>` (of `TextStyle`, `ImageStyle`) als het type voor de `style`-prop zelf.
 */
// src/types/react-native.d.ts
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export type Style = ViewStyle | TextStyle | ImageStyle;
export type StyleProp<T> = T | T[] | null | undefined;

// For sections that accept style
export interface StylableProps {
  style?: StyleProp<ViewStyle>;
}