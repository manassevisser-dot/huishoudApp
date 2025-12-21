import { aggregateExportData } from '../export';

describe('WAI-005C: Export Aggregator', () => {
  const mockState: any = {
    schemaVersion: '1.0',
    C1: { aantalVolwassen: 6 }, // Trigger voor special status
    C4: { leden: [{ id: '1', naam: 'Jan Jansen', memberType: 'adult' }] },
    C7: { items: [{ id: 'i1', amount: 5000 }] },
  };

  const result = aggregateExportData(mockState);

  it('moet namen strippen uit de export', () => {
    expect(result.household.members[0]).not.toHaveProperty('naam');
  });

  it('moet de special status vlag zetten bij > 5 volwassenen', () => {
    expect(result.isSpecialStatus).toBe(true);
  });

  it('moet metadata op districtsniveau bevatten', () => {
    expect(result.metadata.scope).toBe('district-level');
    expect(result.metadata.provincesIncluded).toBe(4);
  });
});
