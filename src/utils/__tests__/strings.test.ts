import { cleanName } from '../strings';

describe('cleanName', () => {
  it('should return an empty string when input is null or undefined', () => {
    // Dit dekt de "input === 'string' ? input : ''" branch
    expect(cleanName(null)).toBe('');
    expect(cleanName(undefined)).toBe('');
  });

  it('should remove emojis and non-ASCII characters', () => {
    // Dit dekt de replace regex branch
    expect(cleanName('John 🚀 Doe')).toBe('John Doe');
    expect(cleanName('User!@#%')).toBe('User!@#%');
  });

  it('should normalize whitespace and trim', () => {
    // Dit dekt de \s+ replace en .trim()
    expect(cleanName('  John    Doe  ')).toBe('John Doe');
  });

  it('should respect the max length parameter', () => {
    // Dit dekt de .slice(0, max) branch
    const longName = 'DitIsEenHeleLangeNaamDieIngekortMoetWorden';
    expect(cleanName(longName, 10)).toBe('DitIsEenHe');
  });

  it('should use the default max length of 25', () => {
    // Dit dekt de default parameter branch (max = 25)
    const longName = 'DezeNaamIsLangerDanVijfentwintigTekens';
    const result = cleanName(longName);
    expect(result.length).toBe(25);
    expect(result).toBe('DezeNaamIsLangerDanVijfen');
  });
});