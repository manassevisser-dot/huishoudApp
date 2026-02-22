import { alignMembers } from './householdAlign';
import { Member } from '@core/types/core';

describe('householdAlign - alignMembers', () => {
  test('should create a fresh list of members when current is undefined', () => {
    const result = alignMembers(undefined, 2, 1);

    expect(result).toHaveLength(2);
    expect(result[0].memberType).toBe('adult');
    expect(result[1].memberType).toBe('child');
    expect(result[0].entityId).toContain('m-0-');
  });

  test('should keep existing data and add new empty members if target is higher', () => {
    const current: Member[] = [
      {
        entityId: 'old-1',
        fieldId: 'f1',
        memberType: 'adult',
        firstName: 'Jan',
        lastName: 'Jansen', // Verplicht veld
      },
    ];

    const result = alignMembers(current, 3, 2);

    expect(result).toHaveLength(3);
    expect(result[0].firstName).toBe('Jan');
    expect(result[1].memberType).toBe('adult');
    expect(result[2].memberType).toBe('child');
  });

  test('should remove members when target length is lower', () => {
    // Hier voegen we overal lastName toe om de TS-fout te voorkomen
    const current: Member[] = [
      { entityId: 'm1', fieldId: 'f1', memberType: 'adult', firstName: 'A', lastName: 'X' },
      { entityId: 'm2', fieldId: 'f2', memberType: 'adult', firstName: 'B', lastName: 'Y' },
      { entityId: 'c1', fieldId: 'f3', memberType: 'child', firstName: 'C', lastName: 'Z' },
    ];

    const result = alignMembers(current, 1, 1);

    expect(result).toHaveLength(1);
    expect(result[0].firstName).toBe('A');
  });

  test('should handle edge cases like negative numbers or missing fieldIds', () => {
    // Gebruik 'as Member' om TypeScript te vertellen dat we weten wat we doen voor deze edge-case test
    const current = [
      { entityId: 'm1', memberType: 'adult', firstName: '', lastName: '' },
    ] as Member[];

    const resultEmpty = alignMembers(current, -1, 0);
    expect(resultEmpty).toHaveLength(0);

    const resultfieldId = alignMembers(current, 1, 1);
    expect(resultfieldId[0].fieldId).toBeDefined();
  });

  test('should correctly transition adults to children if counts change', () => {
    const current: Member[] = [
      { entityId: 'm1', fieldId: 'f1', memberType: 'adult', firstName: 'Jan', lastName: 'Jansen' },
    ];

    const result = alignMembers(current, 1, 0);

    expect(result).toHaveLength(1);
    expect(result[0].memberType).toBe('child');
    expect(result[0].firstName).toBe('');
  });
});
