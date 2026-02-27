// src/domain/rules/__tests__/ageBoundaries.test.ts
/**
 * @file_intent Unit tests voor de leeftijd-sandbox regels
 * @test_strategy
 *   - Test leeftijdsgrenzen (MIN_AGE = 18, MAX_AGE = 85)
 *   - Test exacte grenswaarden
 *   - Test mock TimeProvider voor consistente testresultaten
 *   - Test alle paden: onder, binnen, boven de grenzen
 */

import { isWithinAgeBoundaries } from './ageBoundaryRules';
import { calculateAge } from './ageRules';
import type { TimeProvider } from '@domain/helpers/TimeProvider';

// Mock calculateAge functie
jest.mock('./ageRules', () => ({
  calculateAge: jest.fn(),
}));

describe('ageBoundaries', () => {
  // Mock TimeProvider
const mockProvider: TimeProvider = {
  getCurrentLocalNoon: jest.fn().mockReturnValue(new Date('2024-01-01T12:00:00Z')),
};

  const mockDob = new Date('1990-01-01');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================================================================
  // BINNEN GRENZEN (18-85)
  // =========================================================================

  describe('when age is within boundaries', () => {
    it('should return true for age exactly MIN_AGE (18)', () => {
      // Arrange
      (calculateAge as jest.Mock).mockReturnValue(18);

      // Act
      const result = isWithinAgeBoundaries(mockDob, mockProvider);

      // Assert
      expect(calculateAge).toHaveBeenCalledWith(mockDob, mockProvider);
      expect(result).toBe(true);
    });

    it('should return true for age exactly MAX_AGE (85)', () => {
      // Arrange
      (calculateAge as jest.Mock).mockReturnValue(85);

      // Act
      const result = isWithinAgeBoundaries(mockDob, mockProvider);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for age in the middle of range (30)', () => {
      // Arrange
      (calculateAge as jest.Mock).mockReturnValue(30);

      // Act
      const result = isWithinAgeBoundaries(mockDob, mockProvider);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for age 50 (mid-range)', () => {
      // Arrange
      (calculateAge as jest.Mock).mockReturnValue(50);

      // Act
      const result = isWithinAgeBoundaries(mockDob, mockProvider);

      // Assert
      expect(result).toBe(true);
    });
  });

  // =========================================================================
  // ONDER GRENZEN (< 18)
  // =========================================================================

  describe('when age is below minimum', () => {
    it('should return false for age 17', () => {
      // Arrange
      (calculateAge as jest.Mock).mockReturnValue(17);

      // Act
      const result = isWithinAgeBoundaries(mockDob, mockProvider);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for age 0 (newborn)', () => {
      // Arrange
      (calculateAge as jest.Mock).mockReturnValue(0);

      // Act
      const result = isWithinAgeBoundaries(mockDob, mockProvider);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for negative age (future birth date)', () => {
      // Arrange
      (calculateAge as jest.Mock).mockReturnValue(-5);

      // Act
      const result = isWithinAgeBoundaries(mockDob, mockProvider);

      // Assert
      expect(result).toBe(false);
    });
  });

  // =========================================================================
  // BOVEN GRENZEN (> 85)
  // =========================================================================

  describe('when age is above maximum', () => {
    it('should return false for age 86', () => {
      // Arrange
      (calculateAge as jest.Mock).mockReturnValue(86);

      // Act
      const result = isWithinAgeBoundaries(mockDob, mockProvider);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for age 100', () => {
      // Arrange
      (calculateAge as jest.Mock).mockReturnValue(100);

      // Act
      const result = isWithinAgeBoundaries(mockDob, mockProvider);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for age 150 (max realistic)', () => {
      // Arrange
      (calculateAge as jest.Mock).mockReturnValue(150);

      // Act
      const result = isWithinAgeBoundaries(mockDob, mockProvider);

      // Assert
      expect(result).toBe(false);
    });
  });

  // =========================================================================
  // EDGE CASES
  // =========================================================================

  describe('edge cases', () => {
    it('should handle undefined dob gracefully', () => {
      // Arrange
      (calculateAge as jest.Mock).mockReturnValue(NaN);

      // Act
      const result = isWithinAgeBoundaries(undefined as any, mockProvider);

      // Assert
      expect(calculateAge).toHaveBeenCalledWith(undefined, mockProvider);
      expect(result).toBe(false); // NaN >= 18 is false
    });

    it('should handle null dob gracefully', () => {
      // Arrange
      (calculateAge as jest.Mock).mockReturnValue(NaN);

      // Act
      const result = isWithinAgeBoundaries(null as any, mockProvider);

      // Assert
      expect(result).toBe(false);
    });

    it('should pass the correct TimeProvider to calculateAge', () => {
      // Arrange
      const customProvider: TimeProvider = {
  getCurrentLocalNoon: jest.fn().mockReturnValue(new Date('2030-01-01')),
};
      (calculateAge as jest.Mock).mockReturnValue(40);

      // Act
      isWithinAgeBoundaries(mockDob, customProvider);

      // Assert
      expect(calculateAge).toHaveBeenCalledWith(mockDob, customProvider);
    });

    it('should use the result from calculateAge directly', () => {
      // Arrange
      (calculateAge as jest.Mock).mockReturnValue(25);

      // Act
      const result = isWithinAgeBoundaries(mockDob, mockProvider);

      // Assert
      expect(calculateAge).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });
  });

  // =========================================================================
  // INTEGRATIE MET ECHTE calculateAge (OPTIONEEL)
  // =========================================================================

  describe('integration with real calculateAge', () => {
    // Herstel de echte implementatie voor deze tests
    beforeEach(() => {
      jest.unmock('./ageRules');
    });

    it('should calculate age correctly with real calculateAge', () => {
      // Dit is een integratietest - gebruik echte calculateAge
      const { calculateAge: realCalculateAge } = jest.requireActual('./ageRules');
      (calculateAge as jest.Mock).mockImplementation(realCalculateAge);

      const birthDate = new Date('1990-01-01');
      const today = new Date('2024-01-01');
      const provider: TimeProvider = { 
  getCurrentLocalNoon: () => today 
};

      const result = isWithinAgeBoundaries(birthDate, provider);

      // 2024 - 1990 = 34 jaar
      expect(result).toBe(true);
    });
  });
});