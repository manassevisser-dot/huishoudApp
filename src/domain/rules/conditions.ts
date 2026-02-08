// src/domain/rules/conditions.ts
import { z } from 'zod';
import { HouseholdSchema } from '../../state/schemas/sections/household.schema';
import { SetupSchema } from '../../state/schemas/sections/setup.schema';
import { isMinor } from './ageRules';
import { TimeProvider } from '../helpers/TimeProvider';

// Types afgeleid van de Zod-schema's
type Household = z.infer<typeof HouseholdSchema>;
type Member = Household['members'][number];
type Setup = z.infer<typeof SetupSchema>;

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