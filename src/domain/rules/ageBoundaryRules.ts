import { todayLocalNoon } from '@domain/helpers/DateHydrator';

/** Max ISO voor iemand die 18+ is (geboren op of voor deze datum). */
export function getAdultMaxISO(referenceDate: Date = todayLocalNoon()): string {
  const year = referenceDate.getFullYear() - 18;
  const month = referenceDate.getMonth();
  const day = referenceDate.getDate();
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Min ISO voor een kind (mag niet in de toekomst geboren zijn). */


/** Max ISO voor een kind (<18 jaar). */
export function getChildMaxISO(referenceDate: Date = todayLocalNoon()): string {
  const year = referenceDate.getFullYear() - 18;
  const month = referenceDate.getMonth();
  const day = referenceDate.getDate();
  const yesterday = new Date(year, month, day - 1, 12, 0, 0, 0);
  return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
}

import { isoDateOnlyToLocalNoon } from '@domain/helpers/DateHydrator';

/** Berekent leeftijd in jaren op basis van geboortedatum. */
export function calculateAge(birthDateISO: string): number | null {
  const birthDate = isoDateOnlyToLocalNoon(birthDateISO);
  if (birthDate === null) return null;
  const today = todayLocalNoon();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}