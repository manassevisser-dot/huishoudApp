import { migrateToPhoenix } from '../transactionService'; // Of waar je migratie staat
import { FormState } from '../../shared-types/form';

describe('Phoenix Migration Specialist', () => {
  it('should transform legacy C7 data to new Phoenix Finance cents', () => {
    const oldState = {
      C7: { items: [{ amount: "1.250,50" }] }
    };

    const migrated = migrateToPhoenix(oldState) as any;

    // Valideer resultaat: "1.250,50" -> 125050 centen
    expect(migrated.finance.inkomsten.bedrag).toBe(125050);
  });
});
