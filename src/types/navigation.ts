/**
 * @file_intent Definieert de centrale TypeScript-types voor de navigatie-stack van de applicatie met React Navigation. Het zorgt voor type-veiligheid door een contract op te stellen van alle beschikbare schermen en hun parameters.
 * @repo_architecture Shared Types Layer - UI/Application Infrastructure. Dit is de "single source of truth" voor de navigatiestructuur.
 * @term_definition
 *   - `RootStackParamList`: Een mapping van alle schermnamen (routes) naar hun verwachte route-parameters. Dit is het hart van de type-veiligheid in React Navigation.
 *   - `AppNavigation`: Een type-alias voor de `navigation` prop. Het zorgt ervoor dat functies zoals `navigation.navigate()` alleen geldige schermnamen accepteren.
 *   - `AppRoute<T>`: Een type-alias voor de `route` prop. Het zorgt ervoor dat `route.params` de juiste types hebben voor een specifiek scherm.
 *   - `ScreenProps<T>`: Een generieke interface die `navigation` en `route` bundelt, bedoeld om de props van een schermcomponent te typeren.
 * @contract Het bestand exporteert `RootStackParamList` en de afgeleide types `AppNavigation`, `AppRoute`, en `ScreenProps`. Elke toevoeging van een nieuw scherm aan de app MOET hier worden geregistreerd om type-veilige navigatie te garanderen.
 * @ai_instruction Wanneer je een nieuw scherm toevoegt, voeg dan de naam van het scherm toe aan de `RootStackParamList`. Als het scherm parameters accepteert, definieer ze hier (bv. `MyScreen: { userId: string }`). Gebruik vervolgens `ScreenProps<'MyScreen'>` als type voor de props van je schermcomponent om toegang te krijgen tot de getypeerde `route` en `navigation` objecten.
 */
import { NavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Landing: undefined;
  Dashboard: undefined;
  CsvUpload: undefined;
  WizardController: undefined;
  WizardScreen: { stepId: string }; // Als je params hebt
  // Add all your other screens here
};

export type AppNavigation = NavigationProp<RootStackParamList>;
export type AppRoute<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;

export interface ScreenProps<T extends keyof RootStackParamList = keyof RootStackParamList> {
  navigation: AppNavigation;
  route: AppRoute<T>;
}