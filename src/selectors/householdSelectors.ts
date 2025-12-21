import { getHouseholdStatus, type HouseholdStats } from '../domain/household';
import type { FormState } from '../context/FormContext';
import { Member } from '../types/OUDhousehold';

export const selectHouseholdStats = (state: FormState): HouseholdStats => {
  // Bron 1: De directe invoer van de teller (C1)
  const countFromC1 = Number(state?.C1?.aantalVolwassen ?? 0);

  // Bron 2: De ledenlijst (C4)
  const leden = Array.isArray(state?.C4?.leden) ? (state.C4!.leden as Member[]) : [];
  const countFromC4 = leden.filter((m: Member) => m?.memberType === 'adult').length;

  // Gebruik de hoogste waarde (tijdens invoer is C1 leidend)
  const adultCount = Math.max(countFromC1, countFromC4);
  const childCount = leden.filter((m: Member) => m?.memberType === 'child').length;

  return { adultCount, childCount };
};

export const selectIsSpecialStatus = (state: FormState): boolean => {
  const stats = selectHouseholdStats(state);
  return getHouseholdStatus(stats) === 'SPECIAL_LARGE';
};
