// src/domain/rules/dataFilters.test.ts

import { dataFilterRules } from './dataFilters';
import type { Member } from '@core/types/core';

describe('dataFilterRules', () => {
  describe('member_income_repeater', () => {
    it('retourneert lege array bij ontbrekende of null household', () => {
      const ctx = {
        getValue: (key: string) => {
          if (key === 'household') return undefined;
          return null;
        },
      } as any;

      expect(dataFilterRules.member_income_repeater(ctx)).toEqual([]);
    });

    it('retourneert lege array bij household zonder members', () => {
      const ctx = {
        getValue: (key: string) => {
          if (key === 'household') return { /* geen members */ };
          return null;
        },
      } as any;

      expect(dataFilterRules.member_income_repeater(ctx)).toEqual([]);
    });

    it('retourneert lege array bij members die geen array is', () => {
      const ctx = {
        getValue: (key: string) => {
          if (key === 'household') return { members: 'not an array' };
          return null;
        },
      } as any;

      expect(dataFilterRules.member_income_repeater(ctx)).toEqual([]);
    });

    it('retourneert members array als deze geldig is', () => {
      const mockMembers: Member[] = [
        { entityId: 'm1', age: 30, firstName: 'Jan', lastName: 'Jansen' },
        { entityId: 'm2', age: 5, firstName: 'Piet', lastName: 'Pietersen' },
      ];

      const ctx = {
        getValue: (key: string) => {
          if (key === 'household') return { members: mockMembers };
          return null;
        },
      } as any;

      expect(dataFilterRules.member_income_repeater(ctx)).toBe(mockMembers);
    });
  });
});