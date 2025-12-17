// src/services/householdAlign.ts

/**
 * Brengt leden[] in lijn met C1:
 * - Lengte === aantalMensen
 * - Eerste aantalVolwassen = 'adult', rest = 'child'
 * - Behoudt bestaande invoer waar mogelijk (type-safe)
 */

import { Member } from '../types/household';

// Genereer unieke IDs (deterministisch genoeg voor UI; geen conflict met bestaande IDs)
const makeId = (prefix: 'm', idx: number) => `m-${idx}-${Date.now()}`;

/**
 * ALIGN zonder data-erfenis:
 * - Lengte === aantalMensen
 * - Eerste aantalVolwassen = 'adult', rest = 'child'
 * - Bestaande adults/children behouden waar mogelijk (per categorie, op volgorde)
 * - Nieuwe leden krijgen ALTIJD lege velden (geen naam/DOB/leeftijd/gender)
 * - IDs worden uniek gemaakt; dubbele IDs in input worden gesaneerd
 */
export function alignMembers(
  current: Member[] | undefined,
  aantalMensen: number,
  aantalVolwassen: number,
): Member[] {
  const targetLen = Math.max(0, Number(aantalMensen ?? 0));
  const targetAdults = Math.max(0, Math.min(Number(aantalVolwassen ?? 0), targetLen));

  // 0) Normaliseer invoer-array en sanitiseer dubbele IDs
  let base = Array.isArray(current) ? current.map((m) => ({ ...m })) : [];
  {
    const seen = new Set<string>();
    for (let i = 0; i < base.length; i++) {
      const id = typeof base[i]?.id === 'string' ? base[i]!.id : `m-${i}`;
      if (seen.has(id)) {
        base[i] = { ...base[i], id: makeId('m', i) };
      } else {
        seen.add(id);
        base[i] = { ...base[i], id };
      }
    }
  }

  // 1) Splits huidige invoer in adults/children (op volgorde)
  const adults = base.filter((m) => m?.memberType === 'adult');
  const children = base.filter((m) => m?.memberType === 'child');

  // 2) Hulpfunctie: maak een leeg lid
  const emptyMember = (type: Member['memberType'], idxForId: number): Member => ({
    id: makeId('m', idxForId),
    memberType: type,
    naam: undefined,
    gender: undefined,
    dateOfBirth: undefined,
    leeftijd: undefined,
  });

  // 3) Bouw nieuwe lijst deterministisch op, zonder data-erfenis voor nieuw toegevoegde leden
  const next: Member[] = [];

  // 3a) Adults: eerst behoud van bestaande adults tot targetAdults, daarna lege adults
  const adultsToKeep = Math.min(adults.length, targetAdults);
  for (let i = 0; i < adultsToKeep; i++) {
    // behoud bestaande adult (alle velden blijven zoals ze zijn)
    next.push({ ...adults[i], memberType: 'adult' });
  }
  for (let i = adultsToKeep; i < targetAdults; i++) {
    // vul met LEGE adults (geen naam/DOB/leeftijd/gender)
    next.push(emptyMember('adult', i));
  }

  // 3b) Children: restlengte is targetLen - targetAdults
  const targetChildren = targetLen - targetAdults;
  const childrenToKeep = Math.min(children.length, targetChildren);
  for (let i = 0; i < childrenToKeep; i++) {
    // behoud bestaande child
    next.push({ ...children[i], memberType: 'child' });
  }
  for (let i = childrenToKeep; i < targetChildren; i++) {
    // vul met LEGE children
    const idxForId = targetAdults + i;
    next.push(emptyMember('child', idxForId));
  }

  // 4) Unieke IDs garanderen in de uiteindelijke lijst (extra zekerheid)
  {
    const seen = new Set<string>();
    for (let i = 0; i < next.length; i++) {
      const id = typeof next[i]?.id === 'string' ? next[i]!.id : makeId('m', i);
      if (seen.has(id)) {
        next[i] = { ...next[i], id: makeId('m', i) };
      } else {
        seen.add(id);
        next[i] = { ...next[i], id };
      }
    }
  }

  return next;
}
