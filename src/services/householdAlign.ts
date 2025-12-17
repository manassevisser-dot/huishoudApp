// src/services/householdAlign.ts
import { Member } from '../types/household';

/**
 * Brengt leden[] in lijn met C1:
 * - Lengte === aantalMensen
 * - Eerste aantalVolwassen = 'adult', rest = 'child'
 * - Behoudt bestaande invoer waar mogelijk (type-safe)
 */
export function alignMembers(
  current: Member[] | undefined,
  aantalMensen: number,
  aantalVolwassen: number,
): Member[] {
  const targetLen = Math.max(0, Number(aantalMensen || 0));
  const targetAdults = Math.max(0, Math.min(Number(aantalVolwassen || 0), targetLen));

  let next = Array.isArray(current) ? current.map((m) => ({ ...m })) : [];

  // 1) Lengte exact maken
  if (next.length > targetLen) {
    next = next.slice(0, targetLen);
  } else if (next.length < targetLen) {
    // Vul adults eerst (vooraan), vervolgens children
    let leadingAdults = next.filter((m) => m?.memberType === 'adult').length;

    while (leadingAdults < targetAdults && next.length < targetLen) {
      const idx = leadingAdults;
      next.splice(idx, 0, {
        id: next[idx]?.id ?? `m-${idx}`,
        memberType: 'adult',
        naam: next[idx]?.naam ?? '',
        gender: next[idx]?.gender,
        dateOfBirth: next[idx]?.dateOfBirth,
        leeftijd: next[idx]?.leeftijd,
      });
      leadingAdults++; // exact één increment per insert
    }

    while (next.length < targetLen) {
      const idx = next.length;
      next.push({
        id: `m-${idx}`,
        memberType: 'child',
        naam: '',
        gender: undefined,
        dateOfBirth: undefined,
        leeftijd: undefined,
      });
    }
  }

  // 2) Hard-set type per index (eerste N = adult, rest = child)
  for (let i = 0; i < next.length; i++) {
    const shouldType: Member['memberType'] = i < targetAdults ? 'adult' : 'child';

    if (next[i]?.memberType !== shouldType) {
      next[i] = { ...next[i], memberType: shouldType };
    }
  }

  return next;
}
