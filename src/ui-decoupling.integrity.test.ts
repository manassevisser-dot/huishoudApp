/**
 * Regressietest — UI Decoupling Integrity Guard
 * Scope: FPR-only (Domme UI)
 * Protocol: GEN4.1 – Blind Test Protocol
 * Contract: CU-FPR-ALIAS-LOCKED
 *
 * ⚠️ Deze test mag NIET falen bij correct gedecouplede code.
 * ✅ Moet direct falen bij:
 *   - DATA_KEYS / SUB_KEYS imports in src/ui/
 *   - Directe toegang tot state.data[...]
 *   - Dispatch calls met section/field/value
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs'; // 👈 Nodig voor tijdelijk configbestand

const UI_ROOT = path.resolve(__dirname, './ui');

describe('UI Decoupling Integrity Guard (FPR-only)', () => {
  test('UI-DECOUPLE-001: Geen DATA_KEYS imports in UI-laag', () => {
    const result = execSync(
      `grep -r "DATA_KEYS" ${UI_ROOT} --include="*.ts" --include="*.tsx" --exclude="*.test.ts" --exclude="*.test.tsx" || true`,
      { encoding: 'utf-8' }
    );

    const violations = result
      .split('\n')
      .filter(line => line.trim() !== '')
      .filter(line => !line.includes('.test.ts') && !line.includes('.test.tsx'))
      .join('\n');

    expect(violations.trim()).toBe('');
  });

  test('UI-DECOUPLE-002: Geen SUB_KEYS imports in UI-laag', () => {
    const result = execSync(
      `grep -r "SUB_KEYS" ${UI_ROOT} --include="*.ts" --include="*.tsx" || true`,
      { encoding: 'utf-8' }
    );
    expect(result.trim()).toBe('');
  });

  test('UI-DECOUPLE-003: Geen directe state.data toegang in UI-laag', () => {
    const result = execSync(
      `grep -r "state\\.data\\[" ${UI_ROOT} --include="*.ts" --include="*.tsx" || true`,
      { encoding: 'utf-8' }
    );
    expect(result.trim()).toBe('');
  });

  test('UI-DECOUPLE-006: Geen directe domain imports in UI-laag', () => {
    // @ui/kernel is de Anti-Corruption Layer (ACL) en het ENIGE toegestane
    // kruispunt van @domain naar UI. Alle andere UI-bestanden mogen NIET
    // rechtstreeks uit @domain importeren.
    //
    // Uitzondering: useAppStyles.ts is de geautoriseerde assemblagebrug die
    // make…-functies uit @domain/styles samenvoegt tot één gecached stylesheet.
    // Dit is by design — zie src/ui/styles/README.md.
    const result = execSync(
      `grep -r "from '@domain/" ${UI_ROOT} --include="*.ts" --include="*.tsx" --exclude-dir="kernel" --exclude="*.test.ts" --exclude="*.test.tsx" || true`,
      { encoding: 'utf-8' }
    );

    const violations = result
      .split('\n')
      .filter(line => line.trim() !== '')
      .filter(line => !line.includes('useAppStyles.ts'))
      .join('\n');

    expect(violations.trim()).toBe('');
  });

  test('UI-RW-017: Geen dispatch calls met section/field in UI-laag', () => {
    const result = execSync(
      `grep -r "dispatch.*section" ${UI_ROOT} --include="*.ts" --include="*.tsx" || true`,
      { encoding: 'utf-8' }
    );
    expect(result.trim()).toBe('');
  });

  test('BT-01B-boundary-bans: ESLint no-restricted-imports compliant', () => {
    // 🔧 Oude aanpak met --rule was platformafhankelijk en gaf foutmeldingen op Windows.
    // Nu gebruiken we een tijdelijk ESLint-configuratiebestand.
    const tmpConfig = path.join(__dirname, 'tmp-eslintrc.json');

    try {
      // Schrijf de gewenste regels naar een tijdelijk bestand
      fs.writeFileSync(tmpConfig, JSON.stringify({
        rules: {
          'no-restricted-imports': ['error', { patterns: ['@domain/*'] }]
        }
      }));

      // Voer ESLint uit met het tijdelijke configbestand.
      // De '|| true' zorgt dat de exit-code wordt genegeerd, zodat we de output kunnen inspecteren.
      const result = execSync(
        `npx eslint ${UI_ROOT} --no-eslintrc --config ${tmpConfig} --quiet || true`,
        { encoding: 'utf-8', stdio: 'pipe' }
      );

      // Als ESLint overtredingen vindt, is de output niet leeg → test faalt.
      expect(result.trim()).toBe('');
    } finally {
      // Ruim het tijdelijke bestand altijd op
      if (fs.existsSync(tmpConfig)) {
        fs.unlinkSync(tmpConfig);
      }
    }
  }, 30000); // timeout blijft behouden
});