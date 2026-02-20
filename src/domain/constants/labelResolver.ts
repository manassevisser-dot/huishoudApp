/**
 * @file_intent Biedt een functie om een UI-label op te halen uit een string-token.
 * @repo_architecture Domain Layer - Constants.
 * @term_definition Token = Een string die een label representeert (bijv. 'wizard.title'). Label = De daadwerkelijke, voor de gebruiker zichtbare tekst.
 * @contract Dit bestand exporteert `labelFromToken`, een functie die een string-token omzet naar een leesbaar label door `WizStrings` te raadplegen. Als het token niet wordt gevonden, retourneert het de token-string zelf als fallback.
 * @ai_instruction Deze functie is een brug tussen de abstracte content-tokens en de concrete UI-tekst. Gebruik deze functie waar dynamische labels nodig zijn die afhankelijk zijn van de `WizStrings` configuratie. Het is een sleutelcomponent voor internationalisatie (i18n) en content management.
 */
// src/domain/constants/labelResolver.ts
import WizStrings from '@config/WizStrings';

export function labelFromToken(token: string): string {
  // Probeer in vaste secties:
  if (token in (WizStrings.wizard ?? {}))     return (WizStrings.wizard as Record<string,string>)[token] ?? token;
  if (token in (WizStrings.dashboard ?? {}))  return (WizStrings.dashboard as Record<string,string>)[token] ?? token;
  if (token in (WizStrings.common ?? {}))     return (WizStrings.common as Record<string,string>)[token] ?? token;
  // Fallback
  return token;
}