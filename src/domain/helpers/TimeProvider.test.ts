// src/domain/helpers/TimeProvider.test.ts
import { TimeProvider } from './TimeProvider';

describe('TimeProvider interface', () => {
  // ✅ Gebruik een mock implementatie met vaste datum voor ALLE tests
  class FixedDateProvider implements TimeProvider {
    constructor(private fixedDate: Date) {}
    
    getCurrentLocalNoon(): Date {
      return new Date(this.fixedDate); // Copy om mutatie te voorkomen
    }
  }

  describe('contract compliance', () => {
    it('should accept any class that implements the interface', () => {
      // Dit is de enige echte "contract" test - de rest is overbodig
      const provider: TimeProvider = new FixedDateProvider(new Date());
      expect(provider).toBeDefined();
      expect(typeof provider.getCurrentLocalNoon).toBe('function');
    });
  });

  describe('provider behavior with dependency injection', () => {
    it('should work with DI pattern', () => {
      // Test het patroon, niet de implementatie
      class ServiceThatNeedsTime {
        constructor(private timeProvider: TimeProvider) {}
        
        getCurrentHour(): number {
          return this.timeProvider.getCurrentLocalNoon().getHours();
        }
      }

      const morningProvider = new FixedDateProvider(new Date(2024, 0, 15, 9, 0, 0));
      const afternoonProvider = new FixedDateProvider(new Date(2024, 0, 15, 15, 0, 0));

      const morningService = new ServiceThatNeedsTime(morningProvider);
      const afternoonService = new ServiceThatNeedsTime(afternoonProvider);

      expect(morningService.getCurrentHour()).toBe(9);
      expect(afternoonService.getCurrentHour()).toBe(15);
    });

    it('should return new Date instances each call (immutability)', () => {
      const provider = new FixedDateProvider(new Date(2024, 0, 15, 12, 0, 0));
      
      const result1 = provider.getCurrentLocalNoon();
      const result2 = provider.getCurrentLocalNoon();
      
      expect(result1).not.toBe(result2); // Different instances
      expect(result1).toEqual(result2);  // Same value
    });

    it('should not be affected by mutation of returned date', () => {
      const provider = new FixedDateProvider(new Date(2024, 0, 15, 12, 0, 0));
      
      const result = provider.getCurrentLocalNoon();
      result.setFullYear(2025); // Mutate
      
      const nextResult = provider.getCurrentLocalNoon();
      expect(nextResult.getFullYear()).toBe(2024); // Original preserved
    });
  });

  describe('testing scenarios with fixed dates', () => {
    it('should allow testing with fixed dates', () => {
      const testDate = new Date('2024-03-20T12:00:00');
      const provider = new FixedDateProvider(testDate);
      
      const year = provider.getCurrentLocalNoon().getFullYear();
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      
      expect(isLeapYear).toBe(true);
    });

    it('should allow testing across date boundaries', () => {
      const testCases = [
        { date: '2023-12-31', expectedYear: 2023 },
        { date: '2024-01-01', expectedYear: 2024 },
        { date: '2024-12-31', expectedYear: 2024 },
        { date: '2025-01-01', expectedYear: 2025 },
      ];

      testCases.forEach(({ date, expectedYear }) => {
        const provider = new FixedDateProvider(new Date(`${date}T12:00:00`));
        expect(provider.getCurrentLocalNoon().getFullYear()).toBe(expectedYear);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle invalid dates', () => {
      const provider = new FixedDateProvider(new Date('invalid'));
      const result = provider.getCurrentLocalNoon();
      
      expect(isNaN(result.getTime())).toBe(true);
    });
  });
});

// ✅ GEEN implementaties met new Date() meer!
// ✅ Alleen FixedDateProvider gebruikt new Date() voor vaste testdata
// ✅ Geen RealTimeProvider, AmsterdamTimeProvider, OffsetProvider, etc.