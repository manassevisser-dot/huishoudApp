import { toCents } from '@domain/helpers/numbers';

describe('BT-04I & BT-03: Financial Integrity Audit', () => {
  it('moet floating-point errors (0.1 + 0.2) elimineren via centen-integers', () => {
    // In JS is 0.1 + 0.2 = 0.30000000000000004
    // Onze toCents moet dit exact 30 maken.
    const sum = toCents(0.1) + toCents(0.2);
    expect(sum).toBe(30);
    expect(Number.isInteger(sum)).toBe(true);
  });

  it('moet NL formaten (1.250,50) exact omzetten naar centen', () => {
    expect(toCents('1.250,50')).toBe(125050);
  });

  it('moet US formaten (1,250.50) exact omzetten naar centen', () => {
    expect(toCents('1,250.50')).toBe(125050);
  });

  it('moet "rommelige" invoer opschonen naar een valide integer', () => {
    expect(toCents('€ 10,25 EUR')).toBe(1025);
  });
});