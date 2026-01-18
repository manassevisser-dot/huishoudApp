import { collectAndDistributeData, assertNoPIILeak, parseName, toNumber } from '../privacyHelpers';
import { migrateTransactionsToPhoenix } from '../transactionService';
import { makeLegacyMember } from '../../test-utils/factories/memberFactory';
import { TransactionService, undoLastTransaction } from '../transactionService';
import { StorageShim } from '@/adapters/storage/storage';

// Mock de StorageShim om zij-effecten te voorkomen
jest.mock('@/adapters/storage/storage', () => ({
  StorageShim: {
    loadState: jest.fn(),
    clearAll: jest.fn(),
  },
}));
describe('Migration Member Mapping', () => {
  it('moet oude leden correct transformeren naar Phoenix Member objecten', async () => {
    // Gebruik de legacy data structuur die we in de factory hebben gedefinieerd
    const oldState = {
      household: {
        leden: [
          { id: 'old-1', naam: 'Jan Janssen', type: 'adult' },
          { id: 'old-2', naam: 'Kees de Vries', type: 'child' },
        ],
      },
    };

    const result: any = await migrateTransactionsToPhoenix(oldState);
    const members = result.data.household.members;

    expect(members).toHaveLength(2);
    expect(members[0]).toEqual(
      expect.objectContaining({
        entityId: 'old-1',
        memberType: 'adult',
        firstName: 'Jan', // Gecheckt: wordt nu gesplitst door de helper
      }),
    );
  });

  it('moet fallback IDs genereren bij ontbrekende id', async () => {
    const stateWithNoIds = {
      household: {
        leden: [{ naam: 'Anoniem', type: 'adult' }],
      },
    };

    const resultNoId: any = await migrateTransactionsToPhoenix(stateWithNoIds);
    const first = resultNoId.data.household.members[0];

    // Checkt op m-0, member-0 of local-0 patronen
    expect(first.entityId).toEqual(expect.stringMatching(/^(m-|member-|local-)\d+$/));
  });

  it('moet namen splitsen voor UX maar types behouden voor onderzoek', async () => {
    const input = {
      household: {
        leden: [{ id: 'id-1', naam: 'Tom Janssen', type: 'teenager' }],
      },
    };

    const result: any = await migrateTransactionsToPhoenix(input);
    const member = result.data.household.members[0];

    expect(member.firstName).toBe('Tom');
    expect(member.lastName).toBe('Janssen');
    expect(member.memberType).toBe('teenager');
  });

  it('moet bij onbekend type terugvallen op adult', async () => {
    const unknown = {
      household: {
        leden: [{ id: 'x', naam: 'Onbekend', type: 'iets-anders' }],
      },
    };

    const result: any = await migrateTransactionsToPhoenix(unknown);
    // Onze toMemberType helper zorgt voor de 'adult' fallback
    expect(result.data.household.members[0].memberType).toBe('adult');
  });

  // Test voor de orchestrator/privacy helper logica
  it('moet voor n8n een anonieme payload genereren via collectAndDistributeData', () => {
    // We gebruiken hier de factory die 'naam', 'type' en 'leeftijd' bevat
    const legacyInput = makeLegacyMember();

    const { localMember, researchPayload } = collectAndDistributeData(legacyInput, 0);

    // UX Check (Local)
    expect(localMember.firstName).toBe('Jan');
    expect(localMember.lastName).toBe('Janssen');

    // Privacy Check (Research)
    expect(researchPayload).not.toHaveProperty('firstName');
    expect(researchPayload).not.toHaveProperty('lastName');
    expect(researchPayload).not.toHaveProperty('naam');

    // Data Check (Research)
    expect(researchPayload.memberType).toBe('teenager'); // 'puber' -> 'teenager'
    expect(researchPayload.researchId).toBeDefined();
  });
});
describe('Privacy Helpers - Deep Coverage', () => {
  it('moet een error gooien als er PII in de research payload lekt (Security Check)', () => {
    // Gebruik een hoofdletter-variant om de toLowerCase() te testen
    const leakyPayload = {
      metadata: {
        FIRSTNAME: 'Jan',
      },
    };

    // Assert: we checken alleen op de aanwezigheid van 'SECURITY ALERT'
    expect(() => assertNoPIILeak(leakyPayload)).toThrow(/SECURITY ALERT/);
  });

  it('moet PII detecteren in waarden (E-mail check)', () => {
    const leakyValue = {
      researchId: 'res_123',
      note: 'Contact me op jan@gmail.com',
    };
    expect(() => assertNoPIILeak(leakyValue)).toThrow('PII gedetecteerd');
  });

  it('moet namen met tussenvoegsels correct parseren', () => {
    const { firstName, lastName } = parseName('Jan van de Velde');
    expect(firstName).toBe('Jan');
    expect(lastName).toBe('van de Velde');
  });

  it('moet toNumber correct afhandelen met Europese decimalen', () => {
    expect(toNumber('12,50')).toBe(12.5);
    expect(toNumber('not-a-number', 99)).toBe(99);
  });
});
describe('TransactionService: Deep Migration Scenarios', () => {
  it('moet setup data vinden in diep geneste oude structuren (SetupSource branches)', async () => {
    // Scenario: Data zit niet in .setup, maar direct in .data.household
    const messyState = {
      data: {
        household: {
          aantalMensen: 4,
          heeftHuisdieren: true,
        },
      },
    };

    const result = await migrateTransactionsToPhoenix(messyState);

    expect(result.data.setup.aantalMensen).toBe(4);
    expect(result.data.setup.heeftHuisdieren).toBe(true);
  });

  it('moet omgaan met een volledig lege state (Default branches)', async () => {
    // Test safeState = oldState || {}; en de fallback naar lege arrays
    const result = await migrateTransactionsToPhoenix(null);

    expect(result.data.household.members).toEqual([]);
    expect(result.data.transactions).toEqual([]);
    expect(result.data.setup.aantalMensen).toBe(0);
  });
});
describe('TransactionService: Service Methods', () => {
  it('moet een waarschuwing loggen bij undo (Regel 64)', async () => {
    const result = await undoLastTransaction();
    expect(result).toBeNull();
    // Dit raakt de Logger.warn en de return
  });

  it('moet alle transacties ophalen via de service (Regel 74)', async () => {
    const mockState = {
      data: {
        finance: {
          income: { items: [] },
          expenses: {
            items: [
              { id: '1', description: 'Test', amountCents: 10000 }, // €100,00
            ],
          },
        },
      },
    };
    (StorageShim.loadState as jest.Mock).mockResolvedValue(mockState);

    const txs = await TransactionService.getAllTransactions();
    expect(txs).toHaveLength(1);
    expect(txs[0].id).toBe('1');
  });

  it('moet een lege lijst geven als er geen state is', async () => {
    (StorageShim.loadState as jest.Mock).mockResolvedValue(null);
    const txs = await TransactionService.getAllTransactions();
    expect(txs).toEqual([]);
  });

  it('moet de clearAll aanroep doorgeven naar de shim (Regel 80)', async () => {
    await TransactionService.clearAll();
    expect(StorageShim.clearAll).toHaveBeenCalled();
  });
});
describe('GM-009: Migration Output Snapshot', () => {
  it('moet een volledige migratie-payload consistent transformeren', async () => {
    const complexLegacyState = {
      household: {
        leden: [
          { id: '1', naam: 'Hendrik van de Berg', type: 'senior', leeftijd: '70' },
          { id: '2', naam: 'Kleine Puk', type: 'baby', leeftijd: 1 },
          { id: '3', naam: 'Studentje', type: 'student' },
        ],
      },
      transactions: [{ id: 't1', amount: 100 }],
    };

    const migrated = await migrateTransactionsToPhoenix(complexLegacyState);

    // We filteren de lastModified/timestamp eruit voor de snapshot omdat deze altijd verandert
    const stableOutput = {
      ...migrated,
      meta: { ...migrated.meta, lastModified: '2024-01-01T00:00:00.000Z' },
    };

    expect(stableOutput).toMatchSnapshot();
  });
});
