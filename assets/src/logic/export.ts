import { FormStateV1 } from '@state/schemas/FormStateSchema';

/**
 * WAI-005C: Export Aggregator (Phoenix Clean Version)
 * Doel: Export van de gevalideerde cent-integers zonder PII.
 */
export const aggregateExportData = (state: FormStateV1) => {
  // Alleen de shadow-flag voor speciale status conform instructie [2025-12-07]
  const volwassenen = state.C1?.aantalVolwassen ?? 0;

  return {
    version: '1.0-phoenix-export',
    schemaVersion: state.schemaVersion,
    exportDate: new Date().toISOString(),
    isSpecialStatus: volwassenen > 5,

    // Core data (Clean & Anonymized)
    household: {
      totalAdults: volwassenen,
      members:
        state.C4?.leden.map((m) => ({
          type: m.memberType,
          leeftijd: m.leeftijd,
        })) || [],
    },

    finances: {
      // De gegarandeerde integers uit de Phoenix migratie
      income: state.C7?.items || [],
      expenses: state.C10?.items || [],
    },
  };
};
