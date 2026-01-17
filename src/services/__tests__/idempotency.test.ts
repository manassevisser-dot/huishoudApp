// __tests__/maintenance/audit-orchestrator.test.js
const { TrinityState } = require('../../../scripts/maintenance/audit-orchestrator');
const fs = require('fs');
const _path = require('path');

// Mock fs voor gecontroleerde tests
jest.mock('fs');

describe('Trinity State Machine', () => {
  describe('Grade Calculation', () => {
    it('moet S grade geven bij 90%+ gemiddelde', () => {
      const state = new TrinityState();
      state.audit = 95;
      state.stability = 90;

      const grade = state.computeMaster();
      expect(grade).toBe('S');
    });

    it('moet A grade geven bij 75-89% gemiddelde', () => {
      const state = new TrinityState();
      state.audit = 85;
      state.stability = 80;

      const grade = state.computeMaster();
      expect(grade).toBe('A');
    });

    it('moet B grade geven bij 60-74% gemiddelde', () => {
      const state = new TrinityState();
      state.audit = 70;
      state.stability = 65;

      const grade = state.computeMaster();
      expect(grade).toBe('B');
    });

    it('moet C grade geven onder 60% gemiddelde', () => {
      const state = new TrinityState();
      state.audit = 50;
      state.stability = 40;

      const grade = state.computeMaster();
      expect(grade).toBe('C');
    });
  });

  describe('Coverage Parsing', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('moet coverage correct inlezen uit summary.json', () => {
      const mockCoverage = {
        total: {
          branches: { pct: 85.5 },
          lines: { total: 1000, covered: 850, pct: 85 },
          functions: { total: 100, covered: 90, pct: 90 },
        },
      };

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockCoverage));

      const state = new TrinityState();
      state.computeCoverage();

      expect(state.coverage).toBe(86); // Rounded
      expect(state.meta.lines.total).toBe(1000);
      expect(state.meta.lines.covered).toBe(850);
    });

    it('moet 0% coverage geven als bestand ontbreekt', () => {
      fs.existsSync.mockReturnValue(false);

      const state = new TrinityState();
      state.computeCoverage();

      expect(state.coverage).toBe(0);
      expect(state.warnings).toContain('Coverage file not found - run tests first');
    });

    it('moet errors catchen bij corrupt coverage bestand', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation(() => {
        throw new Error('Parse error');
      });

      const state = new TrinityState();
      state.computeCoverage();

      expect(state.coverage).toBe(0);
      expect(state.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Stability Calculation', () => {
    it('moet risk penalty toepassen op basis van uncovered lines', () => {
      const state = new TrinityState();
      state.coverage = 80;
      state.meta.lines = {
        total: 1000,
        covered: 800,
      };

      state.computeStability();

      // 200 uncovered lines = 20 penalty (capped at 20)
      expect(state.stability).toBe(60); // 80 - 20
      expect(state.meta.risk.penalty).toBe(20);
    });

    it('moet penalty cappen op 20', () => {
      const state = new TrinityState();
      state.coverage = 50;
      state.meta.lines = {
        total: 10000,
        covered: 5000,
      };

      state.computeStability();

      // 5000 uncovered = 500 penalty, but capped at 20
      expect(state.meta.risk.penalty).toBe(20);
      expect(state.stability).toBe(30); // 50 - 20
    });

    it('moet stability niet onder 0 laten zakken', () => {
      const state = new TrinityState();
      state.coverage = 10;
      state.meta.lines = {
        total: 1000,
        covered: 100,
      };

      state.computeStability();

      expect(state.stability).toBeGreaterThanOrEqual(0);
    });

    it('moet 0 stability geven zonder coverage data', () => {
      const state = new TrinityState();
      state.coverage = 0;
      state.meta.lines = undefined;

      state.computeStability();

      expect(state.stability).toBe(0);
    });
  });

  describe('JSON Output', () => {
    it('moet complete JSON structuur exporteren', () => {
      const state = new TrinityState();
      state.audit = 85;
      state.coverage = 80;
      state.stability = 75;
      state.master = 'A';

      const json = state.toJSON();

      expect(json).toHaveProperty('audit', 85);
      expect(json).toHaveProperty('coverage', 80);
      expect(json).toHaveProperty('stability', 75);
      expect(json).toHaveProperty('master', 'A');
      expect(json).toHaveProperty('timestamp');
      expect(json).toHaveProperty('errors');
      expect(json).toHaveProperty('warnings');
      expect(json).toHaveProperty('meta');
    });

    it('moet timestamp in ISO format hebben', () => {
      const state = new TrinityState();
      const json = state.toJSON();

      expect(json.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('Legacy Format', () => {
    it('moet backward compatible string genereren', () => {
      const state = new TrinityState();
      state.audit = 85;
      state.coverage = 80;
      state.stability = 75;
      state.master = 'A';

      const legacy = state.toLegacyString();

      expect(legacy).toBe('TRINITY_DATA|AUDIT:85|COV:80|STAB:75|MASTER:A');
    });

    it('moet parseable zijn met grep/cut', () => {
      const state = new TrinityState();
      state.audit = 92;
      state.coverage = 88;
      state.stability = 85;
      state.master = 'S';

      const legacy = state.toLegacyString();

      // Simuleer bash parsing
      const parts = legacy.split('|');
      expect(parts[0]).toBe('TRINITY_DATA');
      expect(parts[1]).toBe('AUDIT:92');
      expect(parts[4]).toBe('MASTER:S');
    });
  });

  describe('Idempotency', () => {
    it('moet deterministische output geven', () => {
      // Setup identical mock data
      const mockCoverage = {
        total: {
          branches: { pct: 85 },
          lines: { total: 1000, covered: 850, pct: 85 },
          functions: { total: 100, covered: 90, pct: 90 },
        },
      };

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockCoverage));

      // First run
      const state1 = new TrinityState();
      state1.compute();
      const json1 = state1.toJSON();

      // Second run
      const state2 = new TrinityState();
      state2.compute();
      const json2 = state2.toJSON();

      // Compare (exclude timestamp)
      delete json1.timestamp;
      delete json2.timestamp;

      expect(json1).toEqual(json2);
    });
  });

  describe('Full Integration', () => {
    it('moet complete Trinity flow doorlopen', () => {
      const mockCoverage = {
        total: {
          branches: { pct: 88 },
          lines: { total: 1000, covered: 880, pct: 88 },
          functions: { total: 100, covered: 95, pct: 95 },
        },
      };

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockCoverage));

      const state = new TrinityState();
      state.compute();

      expect(state.audit).toBe(85);
      expect(state.coverage).toBe(88);
      expect(state.stability).toBeGreaterThan(75);
      expect(['S', 'A', 'B']).toContain(state.master);
    });
  });

  describe('Error Handling', () => {
    it('moet gracefully falen bij ontbrekende coverage', () => {
      fs.existsSync.mockReturnValue(false);

      const state = new TrinityState();
      expect(() => state.compute()).not.toThrow();

      expect(state.warnings.length).toBeGreaterThan(0);
    });

    it('moet errors loggen maar doorgaan', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });

      const state = new TrinityState();
      state.compute();

      expect(state.errors.length).toBeGreaterThan(0);
      expect(state.coverage).toBe(0);
      expect(state.master).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('moet 100% coverage correct afhandelen', () => {
      const mockCoverage = {
        total: {
          branches: { pct: 100 },
          lines: { total: 1000, covered: 1000, pct: 100 },
          functions: { total: 100, covered: 100, pct: 100 },
        },
      };

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockCoverage));

      const state = new TrinityState();
      state.compute();

      expect(state.coverage).toBe(100);
      expect(state.stability).toBe(100);
    });

    it('moet 0% coverage correct afhandelen', () => {
      const mockCoverage = {
        total: {
          branches: { pct: 0 },
          lines: { total: 1000, covered: 0, pct: 0 },
          functions: { total: 100, covered: 0, pct: 0 },
        },
      };

      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(JSON.stringify(mockCoverage));

      const state = new TrinityState();
      state.compute();

      expect(state.coverage).toBe(0);
      expect(state.master).toBe('C');
    });
  });
});
