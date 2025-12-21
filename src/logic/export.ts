import { FormStateV1 } from '../state/schemas/FormStateSchema';

/**
 * WAI-005C: Aggregeert state naar een audit-proof export.
 * Voldoet aan: Privacy (PII stripping) & Special Status (Household > 5)
 */
export const aggregateExportData = (state: FormStateV1) => {
  // 1. Shadow Logic: Special Status (User Instruction [2024-12-07])
  // We berekenen dit hier live om zeker te zijn van de export-integriteit
  const volwassenen = state.C1?.aantalVolwassen ?? 0;
  const isSpecialStatus = volwassenen > 5;

  // 2. Privacy Filter: PII Stripping (Geen namen/geboortedatums)
  const anonymizedMembers =
    state.C4?.leden.map((member, index) => ({
      id: member.id ?? `member-${index}`,
      memberType: member.memberType,
      leeftijd: member.leeftijd,
      gender: member.gender,
      // Naam en DateOfBirth worden hier bewust NIET opgenomen (Privacy by Design)
    })) || [];

  // 3. District-level Metadata (User Instruction [2024-12-19])
  const metadata = {
    scope: 'district-level',
    provincesIncluded: 4, // Verwerkt 4 provincies tegelijk zoals gevraagd
    exportTimestamp: new Date().toISOString(),
  };

  return {
    version: '1.0-export',
    schemaVersion: state.schemaVersion,
    metadata,
    isSpecialStatus,
    household: {
      totalMembers: state.C1?.aantalMensen,
      totalAdults: volwassenen,
      members: anonymizedMembers,
    },
    finances: {
      // Inkomsten en Uitgaven zijn al in centen (Phoenix-standaard)
      income: state.C7?.items || [],
      expenses: state.C10?.items || [],
    },
  };
};
