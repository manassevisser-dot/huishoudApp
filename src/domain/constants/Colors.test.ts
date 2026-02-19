// src/domain/constants/Colors.test.ts
import { Colors, ColorScheme, Theme } from './Colors';

describe('Colors', () => {
  it('definieert zowel light als dark thema', () => {
    expect(Colors).toHaveProperty('light');
    expect(Colors).toHaveProperty('dark');
  });

  it('bevat alleen geldige kleurstrings in elk thema', () => {
    const themes: Theme[] = ['light', 'dark'];
    const requiredKeys = Object.keys(Colors.light) as Array<keyof ColorScheme>;

    themes.forEach((theme) => {
      const scheme = Colors[theme];
      requiredKeys.forEach((key) => {
        const value = scheme[key];
        expect(value).toEqual(expect.any(String));
        expect(value).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  it('garandeert dat card === surface (backwards compat)', () => {
    expect(Colors.light.card).toBe(Colors.light.surface);
    expect(Colors.dark.card).toBe(Colors.dark.surface);
  });
});
  it('snapshot van alle Colors', () => {
    expect(Colors).toMatchSnapshot();
  })