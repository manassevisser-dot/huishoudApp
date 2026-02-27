// src/domain/research/PrivacyAirlock.test.ts
import {
  toNumber,
  parseName,
  toMemberType,
  makeResearchId,
  containsPII,
  assertNoPIILeak,
  collectAndDistributeData,
} from './PrivacyAirlock';

describe('PrivacyAirlock', () => {
  describe('toNumber', () => {
    it('parsed geldige string naar number', () => {
      expect(toNumber('123,45')).toBe(123.45);
      expect(toNumber('100')).toBe(100);
    });

    it('gebruikt fallback bij ongeldige input', () => {
      expect(toNumber('niet-een-getal')).toBe(0);
      expect(toNumber(null)).toBe(0);
      expect(toNumber(undefined)).toBe(0);
      expect(toNumber(NaN)).toBe(0);
    });
  });

  describe('parseName', () => {
    it('splitst volledige naam correct', () => {
      const result = parseName('Jan Pieter van der Berg');
      expect(result.firstName).toBe('Jan');
      expect(result.lastName).toBe('Pieter van der Berg');
    });

    it('handelt enkele naam af', () => {
      const result = parseName('Jan');
      expect(result.firstName).toBe('Jan');
      expect(result.lastName).toBe('');
    });

    it('handelt lege string af', () => {
      const result = parseName('');
      expect(result.firstName).toBe('');
      expect(result.lastName).toBe('');
    });
  });

  describe('toMemberType', () => {
    it('mapt bekende termen naar MemberType', () => {
      expect(toMemberType('kind')).toBe('child');
      expect(toMemberType('senior')).toBe('senior');
      expect(toMemberType('puber')).toBe('teenager');
    });

  it('should throw error for invalid memberType', () => {
  expect(() => toMemberType('onbekend')).toThrow(
    'Ongeldige memberType: \'onbekend\''
  );
});

it('should throw error for empty string', () => {
  expect(() => toMemberType('')).toThrow(
    'Ongeldige memberType: \'\''
  );
});

  it('genereert een consistente, veilige ID', () => {
    const id = makeResearchId('user-123');
    expect(id).toMatch(/^res_[a-z0-9]{12}$/);
    expect(id).toHaveLength(16);
  });
});

describe('containsPII', () => {
  it('detecteert e-mailadressen', () => {
    expect(containsPII('jan@voorbeeld.nl')).toBe(true);
  });

  it('detecteert gevoelige woorden', () => {
    expect(containsPII('Mijn naam is Jan')).toBe(true);
    expect(containsPII('Telefoonnummer')).toBe(true);
    expect(containsPII('mijn@email.nl')).toBe(true);
  });

  it('retourneert false bij veilige tekst', () => {
    expect(containsPII('Supermarkt')).toBe(false);
    expect(containsPII(null)).toBe(false);
    expect(containsPII(undefined)).toBe(false);
  });
});

describe('assertNoPIILeak', () => {
  it('gooit geen fout bij veilige payload', () => {
    expect(() =>
      assertNoPIILeak({ category: 'groceries', amount: 100 })
    ).not.toThrow();
  });

  it('gooit fout bij verboden veldnaam', () => {
    expect(() => assertNoPIILeak({ firstName: 'Jan' })).toThrow(/SECURITY ALERT/);
  });

  it('gooit fout bij PII in waarde', () => {
    expect(() =>
      assertNoPIILeak({ description: 'E-mail: jan@test.nl' })
    ).toThrow(/SECURITY ALERT/);
  });
});

describe('collectAndDistributeData', () => {
  it('produceert veilige research payload zonder PII', () => {
    const raw = {
      id: 'm-1',
      fieldId: 'f-1',
      fullName: 'Jan Jansen',
      memberType: 'adult',
      age: 35,
      amount: 100,
      category: 'income',
    };

    const { localMember, researchPayload } = collectAndDistributeData(raw, 0);

    // Local member mag PII bevatten
    expect(localMember.firstName).toBe('Jan');
    expect(localMember.lastName).toBe('Jansen');

    // Research payload mag géén PII bevatten
    expect(researchPayload.researchId).toMatch(/^res_/);
    expect(researchPayload.memberType).toBe('adult');
    expect(researchPayload.age).toBe(35);
    expect(researchPayload.amount).toBe(100);
    expect(researchPayload.category).toBe('income');

    // Valideer expliciet dat er geen PII in zit
    expect(() => assertNoPIILeak(researchPayload)).not.toThrow();
  });

  it('gebruikt defaults bij ontbrekende velden', () => {
    const raw = {};
    const { localMember, researchPayload } = collectAndDistributeData(raw, 99);

    expect(localMember.entityId).toBe('local-99');
    expect(localMember.firstName).toBe('Lid');
    expect(researchPayload.researchId).toMatch(/^res_/);
    expect(researchPayload.category).toBe('unassigned');
  });
});
});