/**
 * @file_intent Biedt een verzameling van zeer specifieke, context-afhankelijke business rules die de state van UI-elementen of de flow van een formulier besturen. Dit zijn vaak "lijm"-functies die data uit de `FormState` gebruiken om een `boolean` conditie te evalueren (bv. "moet dit veld getoond worden?").
 * @repo_architecture Domain Layer - Business Rules.
 * @term_definition
 *   - `Conditional Rule`: Een functie die een of meer datapunten uit de applicatiestaat combineert om een `boolean` resultaat te produceren. Dit resultaat wordt doorgaans gebruikt om UI-elementen conditioneel te tonen/verbergen, te activeren/deactiveren, of om navigatie te besturen.
 *   - `Fail-safe`: Een ontwerpkeuze waarbij een functie een veilige, neutrale waarde retourneert (bv. `0` of `false`) wanneer het onverwachte of ongeldige input ontvangt, in plaats van een error te gooien.
 * @contract Dit bestand exporteert een serie kleine, pure functies (`isPensionAge`, `showIncomeSection`, `hasChildren`, etc.). Ze nemen specifieke delen van de `FormState` (of afgeleide waarden) als input en retourneren een `boolean` of een berekende `number`. De functies zijn defensief geschreven, met veilige fallbacks en type-checks waar nodig.
 * @ai_instruction De conditionele regels in dit bestand worden aangeroepen door **orchestrators**. Een orchestrator evalueert een conditie (bv. `hasChildren(members, timeProvider)`) om te bepalen welke UI-componenten of -schermen moeten worden weergegeven. Het resultaat (`true` of `false`) wordt door de orchestrator gebruikt om de UI-staat te construeren die naar de "domme" mobiele UI wordt gestuurd. De UI zelf bevat geen conditionele logica, maar rendert enkel de staat die de orchestrator dicteert. Dit centraliseert de control flow en business logic in het domein en de orchestrator-lagen.
 */

import { type FormState, type Member } from '@core/types/core';
import { type TimeProvider } from '@domain/helpers/TimeProvider';
import { isMinor } from '@domain/rules/ageRules';

type Setup = FormState['data']['setup'];

// Constanten tegen magic numbers
const RETIREMENT_AGE = 67;
const CHILD_AGE_LIMIT = 15;
const NO_COUNT = 0;

/**
 * INKOMEN LOGICA
 */
export const isPensionAge = (leeftijd: number): boolean => leeftijd >= RETIREMENT_AGE;

/**
 * Toont een inkomensectie als de opgegeven categorie voor dit lid actief is.
 * We accepteren hier een string key, en lezen categories veilig als Record<string, boolean>.
 * Dit voorkomt 'unknown' index errors en 'unsafe-member-access'.
 */
export const showIncomeSection = (member: Member, type: string): boolean => {
  const cats = (member as { categories?: Record<string, boolean> }).categories;
  return cats?.[type] === true;
};

/**
 * TOESLAGEN & KINDEREN
 */
export const isChildUnder15 = (leeftijd: number): boolean => leeftijd < CHILD_AGE_LIMIT;

/**
 * Heeft het huishouden (minstens) één minderjarige?
 * - Ondersteunt dob als Date of non-empty string.
 * - Maakt Date veilig aan vanuit string en controleert op geldige datum.
 */
export const hasChildren = (members: Member[], provider: TimeProvider): boolean => {
  return members.some((m) => {
    const dob = (m as { dob?: string | Date | null | undefined }).dob;

    if (dob instanceof Date) {
      return isMinor(dob, provider);
    }

    if (typeof dob === 'string' && dob !== '') {
      const d = new Date(dob);
      return !Number.isNaN(d.getTime()) && isMinor(d, provider);
    }

    return false;
  });
};

/**
 * WONING LOGICA
 */
export const isWoningType = (
  currentType: Setup['woningType'],
  targetType: Setup['woningType']
): boolean => currentType === targetType;

/**
 * AUTO & SYNC
 * Map 'autoCount' (Setup) naar een getal.
 * Let op: dit gaat uit van 'Geen' | 'Een' | 'Twee' (zonder accent).
 * We gebruiken switch i.p.v. Record<> indexing om TS2344/TS2538 te vermijden.
 */
export const getAutoCountValue = (autoCount: Setup['autoCount']): number => {
  switch (autoCount) {
    case 'Geen': return NO_COUNT;
    case 'Een':  return 1;
    case 'Twee': return 2;
    default:     return NO_COUNT; // fail-safe
  }
};

/**
 * HUISHOUDEN
 */
export const isAdultInputVisible = (aantalMensen: Setup['aantalMensen']): boolean =>
  aantalMensen > NO_COUNT;

/**
 * Aantal kinderen = max(0, aantalMensen - aantalVolwassen)
 */
export const calculateChildrenCount = (
  aantalMensen: number,
  aantalVolwassen: number
): number => Math.max(NO_COUNT, aantalMensen - aantalVolwassen);

/**
 * NAVIGATIE & DEBUG
 */
export const isDebugEnabled = (flag: boolean): boolean => flag === true;

export const canNavigateNext = (current: number, total: number): boolean => current < total - 1;
export const canNavigateBack = (current: number): boolean => current > 0;