import { Member } from '../domain/household';

/**
 * Phoenix ID Generator
 * entityId: voor database/domein integriteit
 * fieldId: voor React rendering en form-mapping
 */
const makeId = (prefix: 'm', idx: number): string => `${prefix}-${idx}-${Date.now()}`;
const makeFieldId = (idx: number): string => `field-member-${idx}`;

/**
 * alignMembers: Zorgt dat de members-array synchroon loopt met de UI-keuzes
 */
export function alignMembers(
  current: Member[] | undefined,
  aantalMensen: number,
  aantalVolwassen: number,
): Member[] {
  const targetLen = Math.max(0, Number(aantalMensen ?? 0));
  const targetAdults = Math.max(0, Math.min(Number(aantalVolwassen ?? 0), targetLen));

  const base = Array.isArray(current) ? current.map((m) => ({ ...m })) : [];

  const createEmptyMember = (type: 'adult' | 'child', idx: number): Member => ({
    entityId: makeId('m', idx),
    fieldId: makeFieldId(idx),
    memberType: type,
    firstName: '',
    lastName: '',
    gender: undefined,
    dateOfBirth: undefined,
    age: undefined,
  });

  const next: Member[] = [];

  // 1. Adults verwerken
  const currentAdults = base.filter((m) => m.memberType === 'adult');
  for (let i = 0; i < targetAdults; i++) {
    if (currentAdults[i]) {
      next.push({ 
        ...currentAdults[i], 
        fieldId: currentAdults[i].fieldId || makeFieldId(i) 
      });
    } else {
      next.push(createEmptyMember('adult', i));
    }
  }

  // 2. Children verwerken
  const currentChildren = base.filter((m) => m.memberType === 'child');
  const targetChildren = targetLen - targetAdults;
  for (let i = 0; i < targetChildren; i++) {
    const globalIdx = targetAdults + i;
    if (currentChildren[i]) {
      next.push({ 
        ...currentChildren[i], 
        fieldId: currentChildren[i].fieldId || makeFieldId(globalIdx) 
      });
    } else {
      next.push(createEmptyMember('child', globalIdx));
    }
  }

  return next;
}