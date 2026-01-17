import { Member } from '@domain/household';

/**
 * PHOENIX LOGIC: Bepaalt de validiteit van het huishouden.
 * Een huishouden is 'complete' als elk lid (entityId) een naam en geboortedatum heeft.
 */
export const getHouseholdStatus = (members: Member[]): 'empty' | 'partial' | 'complete' => {
  if (!members || members.length === 0) return 'empty';

  const memberStatus = members.map((m) => {
    // Check of de minimale Phoenix-velden gevuld zijn
    const hasName = !!m.firstName && m.firstName.trim().length > 0;
    const hasDOB = !!m.dateOfBirth;

    return hasName && hasDOB;
  });

  const completeCount = memberStatus.filter((status) => status === true).length;

  if (completeCount === members.length) return 'complete';
  if (completeCount > 0) return 'partial';
  return 'empty';
};
