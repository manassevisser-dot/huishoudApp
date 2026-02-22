// src/services/householdAlign.ts
/**
 * @file_intent Utility voor het synchroniseren van de `members`-array in de applicatiestaat met de opgegeven aantallen volwassenen en kinderen.
 * @repo_architecture Application Service Layer.
 * @term_definition Alignment = Het proces van het in overeenstemming brengen van de `members`-array met de gewenste structuur (aantal volwassenen/kinderen), waarbij bestaande data wordt behouden en nieuwe lege leden worden toegevoegd.
 * @contract De functie garandeert dat de output-array altijd de lengte `aantalMensen` heeft. Bestaande leden worden hergebruikt om data-integriteit te bewaren. Nieuwe leden worden als lege objecten geïnitialiseerd.
 * @ai_instruction Deze functie is kritisch voor de stabiliteit van de wizard-schermen die per lid velden renderen. Zorg dat de `fieldId`-generatie uniek en consistent blijft om React key-errors en state-verlies te voorkomen.
 */
import { Member } from '@core/types/core';

const makeId = (prefix: 'm', idx: number): string => `${prefix}-${idx}-${Date.now()}`;
const makefieldId = (idx: number): string => `field-member-${idx}`;

const createEmptyMember = (type: 'adult' | 'child', idx: number): Member => ({
  entityId: makeId('m', idx),
  fieldId: makefieldId(idx),
  memberType: type,
  firstName: '',
  lastName: '',
  gender: undefined,
  dateOfBirth: undefined,
  age: undefined,
});

// We groeperen de parameters in een interface voor de linter
interface GroupOptions {
  existing: Member[];
  targetCount: number;
  type: 'adult' | 'child';
  offset: number;
}

const processGroup = (options: GroupOptions): Member[] => {
  const { existing, targetCount, type, offset } = options;
  const result: Member[] = [];
  
  for (let i = 0; i < targetCount; i++) {
    const member = existing[i];
    const globalIdx = offset + i;
    
    if (member !== undefined) {
      result.push({
        ...member,
        fieldId: (typeof member.fieldId === 'string' && member.fieldId !== '') 
          ? member.fieldId 
          : makefieldId(globalIdx),
      });
    } else {
      result.push(createEmptyMember(type, globalIdx));
    }
  }
  return result;
};

export function alignMembers(
  current: Member[] | undefined,
  aantalMensen: number,
  aantalVolwassen: number,
): Member[] {
  const targetLen = Math.max(0, Number(aantalMensen ?? 0));
  const targetAdults = Math.max(0, Math.min(Number(aantalVolwassen ?? 0), targetLen));
  const targetChildren = targetLen - targetAdults;

  const base = Array.isArray(current) ? current : [];

  const adults = processGroup({
    existing: base.filter((m) => m.memberType === 'adult'),
    targetCount: targetAdults,
    type: 'adult',
    offset: 0
  });

  const children = processGroup({
    existing: base.filter((m) => m.memberType === 'child'),
    targetCount: targetChildren,
    type: 'child',
    offset: targetAdults
  });

  return [...adults, ...children];
}