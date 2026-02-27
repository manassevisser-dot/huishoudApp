// src/domain/constants/Colors.test.ts
import { Colors, ColorScheme, Theme } from './Colors';

describe('Colors', () => {
  it('definieert zowel light als dark thema', () => {
    expect(Colors).toHaveProperty('light');
    expect(Colors).toHaveProperty('dark');
  });

  it('bevat alleen geldige kleurstrings in elk thema', () => {
    // Verbeterde regex: moet beginnen met # gevolgd door 3 of 6 hex karakters
    const isHexColor = (color: string) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

    // Check light theme
    Object.entries(Colors.light).forEach(([key, value]) => {
      expect(isHexColor(value)).toBe(true);
    });

    // Check dark theme
    Object.entries(Colors.dark).forEach(([key, value]) => {
      expect(isHexColor(value)).toBe(true);
    });
  }); // <-- Deze ontbrak in jouw code

  it("zorgt ervoor dat light en dark thema's exact dezelfde sleutels hebben", () => {
    const lightKeys = Object.keys(Colors.light).sort();
    const darkKeys = Object.keys(Colors.dark).sort();
    expect(lightKeys).toEqual(darkKeys);
  });
});

describe('Theme and ColorScheme Types', () => {
  it("Theme type accepteert alleen 'light' of 'dark'", () => {
    const lightTheme: Theme = 'light';
    const darkTheme: Theme = 'dark';

    expect(lightTheme).toBe('light');
    expect(darkTheme).toBe('dark');
    
    // De @ts-expect-error zorgt dat dit bestand wel compileert 
    // terwijl we testen dat TS hier een fout zou geven.
    // @ts-expect-error
    const invalidTheme: Theme = 'blue'; 
  });

  it('Colors.light voldoet aan het ColorScheme type', () => {
    // In plaats van een dummy object, testen we de echte implementatie
    const lightScheme: ColorScheme = Colors.light;
    
    expect(lightScheme).toHaveProperty('primary');
    expect(lightScheme).toHaveProperty('background');
    expect(lightScheme).toHaveProperty('textPrimary');
  });
});