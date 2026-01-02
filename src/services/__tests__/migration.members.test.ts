import { collectAndDistributeData } from '../privacyHelpers';
import { migrateTransactionsToPhoenix } from '../transactionService';
import { makeLegacyMember } from '../../test-utils/factories/memberFactory';

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
        firstName: 'Jan' // Gecheckt: wordt nu gesplitst door de helper
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