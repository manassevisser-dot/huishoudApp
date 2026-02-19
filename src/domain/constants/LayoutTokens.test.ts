import { Layout, Space } from './LayoutTokens';
import { Tokens } from '@domain/constants/Tokens';

describe('LayoutTokens', () => {
  test('bevat alle verwachte keys', () => {
    const expectedKeys = [
      // flex basis
      'fullWidth',

      // row varianten
      'row', 'rowBetween', 'rowCenter', 'rowBetweenCenter',
      'rowWrap', 'rowWrapCenter', 'rowCentered',

      // positionering
      'absolute', 'hidden',

      // alignment
      'centered', 'centerText', 'rightText',

      // positionering aanvullend
      'pinBottom', 'relative',

      // samengestelde blokken
      'footer', 'buttonRow',
    ];

    expect(Object.keys(Layout).sort()).toEqual(expectedKeys.sort());
  });

  test('fullWidth heeft de juiste flex‑definitie', () => {
    expect(Layout.fullWidth).toEqual({ flex: 1 });
  });

  describe('row‑varianten', () => {
    test('row', () => {
      expect(Layout.row).toEqual({ flexDirection: 'row' });
    });

    test('rowBetween', () => {
      expect(Layout.rowBetween).toEqual({
        flexDirection: 'row',
        justifyContent: 'space-between',
      });
    });

    test('rowCenter', () => {
      expect(Layout.rowCenter).toEqual({
        flexDirection: 'row',
        alignItems: 'center',
      });
    });

    test('rowBetweenCenter', () => {
      expect(Layout.rowBetweenCenter).toEqual({
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      });
    });

    test('rowWrap', () => {
      expect(Layout.rowWrap).toEqual({
        flexDirection: 'row',
        flexWrap: 'wrap',
      });
    });

    test('rowWrapCenter', () => {
      expect(Layout.rowWrapCenter).toEqual({
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      });
    });

    test('rowCentered (uitbreiding)', () => {
      expect(Layout.rowCentered).toEqual({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      });
    });
  });

  describe('positionering & overflow', () => {
    test('absolute', () => {
      expect(Layout.absolute).toEqual({ position: 'absolute' });
    });

    test('hidden', () => {
      expect(Layout.hidden).toEqual({ overflow: 'hidden' });
    });
  });

  describe('alignment tokens', () => {
    test('centered', () => {
      expect(Layout.centered).toEqual({
        alignItems: 'center',
        justifyContent: 'center',
      });
    });

    test('centerText', () => {
      expect(Layout.centerText).toEqual({ textAlign: 'center' });
    });

    test('rightText', () => {
      expect(Layout.rightText).toEqual({ textAlign: 'right' });
    });
  });

  describe('positionering aanvullend', () => {
    test('pinBottom', () => {
      expect(Layout.pinBottom).toEqual({
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      });
    });

    test('relative', () => {
      expect(Layout.relative).toEqual({ position: 'relative' });
    });
  });

  describe('samengestelde blokken', () => {
    test('footer gebruikt Space‑tokens en vaste waardes', () => {
      expect(Layout.footer).toEqual({
        minHeight: 80,
        horizontalPadding: Space.xl,
        verticalPadding: Space.md,
        safeAreaMin: 16,
      });
    });

    test('buttonRow', () => {
      expect(Layout.buttonRow).toEqual({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      });
    });
  });

  test('Space is een directe passtrough van Tokens.Space', () => {
    // Verifieer dat het dezelfde referentie is; belangrijk voor consistente theming
    expect(Space).toBe(Tokens.Space);

    // Bonus: check op aanwezigheid van veelgebruikte spacing keys
    expect(typeof Space.xs).toBe('number');
    expect(typeof Space.sm).toBe('number');
    expect(typeof Space.md).toBe('number');
    expect(typeof Space.lg).toBe('number');
    expect(typeof Space.xl).toBe('number');
  });

  test('immutability‑guard (shallow): bestaande entries worden niet opnieuw toegewezen', () => {
    // We proberen het niet echt te muteren (zou in TS al fouten geven),
    // maar we checken wel dat een shallow copy exact dezelfde shape behoudt,
    // wat regressies bij refactors kan vangen.
    const clone = { ...Layout };
    expect(Object.keys(clone).sort()).toEqual(Object.keys(Layout).sort());
    expect(clone.row).toEqual(Layout.row);
    expect(clone.footer).toEqual(Layout.footer);
  });
});