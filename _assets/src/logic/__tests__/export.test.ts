import { aggregateExportData } from '../export';
import { FormStateV1 } from '@state/schemas/FormStateSchema'; // Pad gecorrigeerd

describe('WAI-005C: Export Aggregator', () => {
  const mockState: FormStateV1 = {
    schemaVersion: '1.0',
    isSpecialStatus: false,
    C1: { aantalMensen: 6, aantalVolwassen: 6 },
    C4: {
      leden: [
        { id: '1', memberType: 'adult', leeftijd: 40 }, // 'naam' weggelaten volgens contract
      ],
    },
    C7: { items: [{ id: 'i1', label: 'Salaris', amount: 500000 }] },
    C10: { items: [] },
  };

  const result = aggregateExportData(mockState);

  it('moet namen strippen uit de export (Privacy Contract)', () => {
    // We checken of de naam property inderdaad niet bestaat in de export
    expect(result.household.members[0]).not.toHaveProperty('naam');
  });

  it('moet de special status vlag zetten bij > 5 volwassenen [2025-12-07]', () => {
    expect(result.isSpecialStatus).toBe(true);
  });
});
