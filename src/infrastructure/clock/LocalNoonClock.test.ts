import { LocalNoonClock } from './LocalNoonClock';

describe('LocalNoonClock', () => {
  let clock: LocalNoonClock;

  beforeEach(() => {
    clock = new LocalNoonClock();
  });

  describe('getCurrentLocalNoon()', () => {
    it('moet voldoen aan het TimeProvider contract en een Date object retourneren', () => {
      const result = clock.getCurrentLocalNoon();
      expect(result).toBeInstanceOf(Date);
    });

    it('moet de tijd altijd op exact 12:00:00.000 zetten', () => {
      const result = clock.getCurrentLocalNoon();
      
      expect(result.getHours()).toBe(12);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('moet de huidige datum van vandaag gebruiken', () => {
      const result = clock.getCurrentLocalNoon();
      const today = new Date();
      
      expect(result.getDate()).toBe(today.getDate());
      expect(result.getMonth()).toBe(today.getMonth());
      expect(result.getFullYear()).toBe(today.getFullYear());
    });
  });
});

describe('LocalNoonClock', () => {
  let clock: LocalNoonClock;

  beforeEach(() => {
    clock = new LocalNoonClock();
  });

  it('moet de methode getCurrentLocalNoon bezitten (TimeProvider contract)', () => {
    expect(typeof clock.getCurrentLocalNoon).toBe('function');
  });

  it('moet altijd 12:00:00 lokale tijd retourneren', () => {
    const result = clock.getCurrentLocalNoon();
    
    expect(result.getHours()).toBe(12);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('moet de datum van vandaag gebruiken', () => {
    const result = clock.getCurrentLocalNoon();
    const today = new Date();
    
    expect(result.getDate()).toBe(today.getDate());
    expect(result.getMonth()).toBe(today.getMonth());
    expect(result.getFullYear()).toBe(today.getFullYear());
  });
});


describe('LocalNoonClock', () => {
  const clock = new LocalNoonClock();

  it('moet getCurrentLocalNoon() implementeren voor de TimeProvider interface', () => {
    const result = clock.getCurrentLocalNoon();
    
    expect(result).toBeInstanceOf(Date);
    expect(result.getHours()).toBe(12);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  describe('Static methods', () => {
    it('static now() moet 12:00 lokale tijd van vandaag retourneren', () => {
      const result = LocalNoonClock.now();
      const today = new Date();

      expect(result.getDate()).toBe(today.getDate());
      expect(result.getHours()).toBe(12);
    });

    it('static nowISO() moet een valide ISO string van 12:00 retourneren', () => {
      const iso = LocalNoonClock.nowISO();
      const date = new Date(iso);

      expect(typeof iso).toBe('string');
      expect(date.toISOString()).toBe(iso);
    });

    it('static at() moet een specifieke datum forceren naar 12:00', () => {
      const result = LocalNoonClock.at(2026, 2, 26);

      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(1); // Februari (0-indexed)
      expect(result.getDate()).toBe(26);
      expect(result.getHours()).toBe(12);
    });
  });
});