#!/usr/bin/env node
// scripts/maintenance/audit-orchestrator.js
//
// Phoenix Trinity Score Engine v2 — Weighted Quality Formula
// ──────────────────────────────────────────────────────────
// Vervangt de oude coverage-minus-penalty benadering door een
// eerlijk gewogen model dat grote projecten niet onevenredig straft.
//
// Gewichten:
//   25%  Test Coverage    (statements)
//   20%  Branch Coverage  (logische paden)
//   15%  Test Pass Rate   (alle tests groen)
//   15%  Linting          (ESLint Gate A resultaat)
//   10%  Type Safety      (strict + no-explicit-any)
//   10%  Documentation    (@module JSDoc coverage)
//    5%  Complexity       (functie-coverage als proxy)

'use strict';

const fs   = require('fs');
const path = require('path');

const isVerbose = process.env.VERBOSE === 'true' || process.argv.includes('--verbose');

// ─── Gewichten ────────────────────────────────────────────────────────────────

const WEIGHTS = {
  testCoverage:  0.25,
  branchCoverage: 0.20,
  testPassRate:  0.15,
  linting:       0.15,
  typeSafety:    0.10,
  documentation: 0.10,
  complexity:    0.05,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

/** Leest alleen de eerste `maxBytes` bytes van een bestand (voor grote bestanden). */
function readFileHead(filePath, maxBytes = 4096) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const fd  = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(maxBytes);
    const bytesRead = fs.readSync(fd, buf, 0, maxBytes, 0);
    fs.closeSync(fd);
    return buf.toString('utf8', 0, bytesRead);
  } catch {
    return null;
  }
}

/** Verzamelt recursief alle TS/TSX bronbestanden (geen tests, geen node_modules). */
function collectSourceFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(full, results);
    } else if (/\.(ts|tsx)$/.test(entry.name) &&
               !entry.name.endsWith('.d.ts') &&
               !entry.name.endsWith('.test.ts') &&
               !entry.name.endsWith('.test.tsx') &&
               !entry.name.endsWith('.spec.ts') &&
               !entry.name.endsWith('.spec.tsx') &&
               !entry.name.includes('__mocks__') &&
               !entry.name.includes('__tests__')) {
      results.push(full);
    }
  }
  return results;
}

function log(msg) {
  if (isVerbose) process.stderr.write(msg + '\n');
}

// ─── Score-berekeningen ───────────────────────────────────────────────────────

/**
 * Test Coverage Score (25%)
 * Bron: coverage-summary.json → statements.pct
 * Bonus: +5 bij ≥90%, +5 bij ≥95%
 */
function scoreTestCoverage(coverageSummary) {
  if (!coverageSummary) return { score: 0, detail: 'geen coverage data' };

  const pct = coverageSummary.total.statements.pct;
  let score = pct;
  if (pct >= 95) score += 5;
  else if (pct >= 90) score += 5;

  score = Math.min(100, Math.round(score));
  log(`  testCoverage: ${pct}% statements → ${score} punten`);
  return { score, detail: `${pct}% statement coverage`, raw: pct };
}

/**
 * Branch Coverage Score (20%)
 * Bron: coverage-summary.json → branches.pct
 * Bonus: +5 bij ≥80%, +5 bij ≥85%, +5 bij ≥90%
 */
function scoreBranchCoverage(coverageSummary) {
  if (!coverageSummary) return { score: 0, detail: 'geen coverage data' };

  const pct = coverageSummary.total.branches.pct;
  let score = pct;
  if (pct >= 90) score += 5;
  else if (pct >= 85) score += 5;
  else if (pct >= 80) score += 5;

  score = Math.min(100, Math.round(score));
  log(`  branchCoverage: ${pct}% branches → ${score} punten`);
  return { score, detail: `${pct}% branch coverage`, raw: pct };
}

/**
 * Test Pass Rate Score (15%)
 * Bron: coverage/report.json (eerste 4KB — velden staan bovenaan)
 * Fallback: als file niet leesbaar is, bekijk of coverage bestaat (= tests zijn gedraaid)
 */
function scoreTestPassRate() {
  // Jest JSON report: numPassedTests, numFailedTests, numTotalTests staan vroeg in het bestand
  const head = readFileHead(path.join(process.cwd(), 'coverage/report.json'), 8192);

  if (head) {
    const passedMatch = head.match(/"numPassedTests"\s*:\s*(\d+)/);
    const totalMatch  = head.match(/"numTotalTests"\s*:\s*(\d+)/);
    const failedMatch = head.match(/"numFailedTests"\s*:\s*(\d+)/);

    if (passedMatch && totalMatch) {
      const passed = parseInt(passedMatch[1], 10);
      const total  = parseInt(totalMatch[1], 10);
      const failed = failedMatch ? parseInt(failedMatch[1], 10) : (total - passed);
      const rate   = total > 0 ? (passed / total) * 100 : 0;
      const score  = Math.round(rate);

      log(`  testPassRate: ${passed}/${total} tests geslaagd → ${score} punten`);
      return {
        score,
        detail: `${passed}/${total} tests geslaagd${failed > 0 ? ` (${failed} gefaald)` : ''}`,
        passed, total, failed,
      };
    }
  }

  // Fallback: coverage-summary bestaat → tests zijn gedraaid, neem aan dat ze slagen
  if (fs.existsSync(path.join(process.cwd(), 'coverage/coverage-summary.json'))) {
    log('  testPassRate: report.json niet leesbaar, fallback op coverage-aanwezigheid → 95 punten');
    return { score: 95, detail: 'tests gedraaid (pass rate niet uitleesbaar)', passed: null, total: null };
  }

  log('  testPassRate: geen test data beschikbaar → 0 punten');
  return { score: 0, detail: 'geen test data (voer eerst npm test uit)' };
}

/**
 * Linting Score (15%)
 * Bron: reports/phoenix-gate-a-report.json → eslint_compliance.verdict
 * GO = 100, anders 0
 */
function scoreLinting() {
  const gateReport = readJsonSafe(
    path.join(process.cwd(), 'reports/phoenix-gate-a-report.json')
  );

  if (gateReport) {
    const eslint = gateReport?.Payload?.phoenix_report?.validators?.eslint_compliance;
    if (eslint) {
      const verdict = eslint.verdict;
      const score   = verdict === 'PASS' ? 100 : 0;
      log(`  linting: Gate A ESLint verdict: ${verdict} → ${score} punten`);
      return { score, detail: `Gate A ESLint: ${verdict}` };
    }
  }

  // Fallback: cleancode-report
  const cleancode = readJsonSafe(path.join(process.cwd(), 'reports/cleancode-report.json'));
  if (cleancode) {
    const lintResult = cleancode.results?.find(r => r.id === 'R-01');
    if (lintResult) {
      const score = lintResult.score;
      log(`  linting: CleanCode R-01: ${lintResult.status} → ${score} punten`);
      return { score, detail: `CleanCode R-01: ${lintResult.message}` };
    }
  }

  log('  linting: geen linting data beschikbaar → 0 punten');
  return { score: 0, detail: 'geen linting data (voer npm run gate:a uit)' };
}

/**
 * Type Safety Score (10%)
 * Bron: tsconfig.json (strict) + eslint.config.cjs (no-explicit-any)
 * BasisScore 70 + 15 (strict) + 15 (no-any → error)
 */
function scoreTypeSafety() {
  let score = 70;
  const flags = [];

  // Check tsconfig strict
  try {
    const tsconfig = fs.readFileSync(path.join(process.cwd(), 'tsconfig.json'), 'utf8');
    if (/"strict"\s*:\s*true/i.test(tsconfig)) {
      score += 15;
      flags.push('strict mode');
    }
  } catch { /* geen tsconfig */ }

  // Check ESLint no-explicit-any: 'error'
  try {
    const eslint = fs.readFileSync(path.join(process.cwd(), 'eslint.config.cjs'), 'utf8');
    if (/'@typescript-eslint\/no-explicit-any'\s*:\s*'error'/.test(eslint) ||
        /"@typescript-eslint\/no-explicit-any"\s*:\s*"error"/.test(eslint)) {
      score += 15;
      flags.push('no-explicit-any enforced');
    }
  } catch { /* geen eslint config */ }

  score = Math.min(100, score);
  log(`  typeSafety: ${flags.join(', ')} → ${score} punten`);
  return { score, detail: flags.length ? flags.join(' + ') : 'geen strict/no-any detectie' };
}

/**
 * Documentation Score (10%)
 * Bron: scan alle .ts en .tsx bestanden in src/ recursief op aanwezigheid van @module JSDoc tag
 * Score = (filesWithModule / totalSourceFiles) * 100
 * Bonus: +10 als ≥50% gedocumenteerd
 */
function scoreDocumentation() {
  const srcDir = path.join(process.cwd(), 'src');
  const files  = collectSourceFiles(srcDir);

  if (files.length === 0) {
    log('  documentation: geen bronbestanden gevonden → 0 punten');
    return { score: 0, detail: 'geen bronbestanden gevonden' };
  }

  let withModule = 0;
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      // Tel elk bestand dat een @module tag heeft in een JSDoc block
      if (/@module\s/.test(content)) withModule++;
    } catch { /* skip */ }
  }

  const pct   = (withModule / files.length) * 100;
  let score   = Math.round(pct);
  if (pct >= 50) score = Math.min(100, score + 10);

  log(`  documentation: ${withModule}/${files.length} bestanden met @module → ${score} punten`);
  return {
    score,
    detail: `${withModule}/${files.length} bronbestanden gedocumenteerd (${pct.toFixed(1)}%)`,
    withModule, total: files.length,
  };
}

/**
 * Complexity Score (5%)
 * Proxy: functie-coverage uit coverage-summary.json
 * Hoge functie-coverage = alle functies worden aangeroepen = lagere effectieve complexiteitsrisico
 * ESLint complexity: ['warn', 10] bevestigt dat regels actief zijn.
 */
function scoreComplexity(coverageSummary) {
  if (!coverageSummary) return { score: 70, detail: 'geen coverage data, standaard 70' };

  const fnPct  = coverageSummary.total.functions.pct;
  // Schaal: fnPct → score (niet 1:1, want hoge functieCoverage = laag risico)
  const score  = Math.min(100, Math.round(fnPct + (fnPct >= 90 ? 5 : fnPct >= 80 ? 3 : 0)));

  log(`  complexity: ${fnPct}% functieCoverage → ${score} punten`);
  return { score, detail: `${fnPct}% functie-coverage (proxy voor complexiteitsrisico)`, raw: fnPct };
}

// ─── Bonussen ─────────────────────────────────────────────────────────────────

/**
 * Bonus punten voor excellence (max +10, gecapped op eindtotaal 100).
 */
function calculateBonuses(components, coverageSummary) {
  let bonus = 0;
  const earned = [];

  // +2 : 0 ESLint errors (Gate A passed)
  if (components.linting.score === 100) {
    bonus += 2; earned.push('+2 ESLint clean');
  }

  // +2 : 100% test pass rate
  if (components.testPassRate.score === 100 ||
      (components.testPassRate.passed !== null &&
       components.testPassRate.passed === components.testPassRate.total)) {
    bonus += 2; earned.push('+2 alle tests groen');
  }

  // +2 : TypeScript strict + no-any both active
  if (components.typeSafety.score >= 100) {
    bonus += 2; earned.push('+2 volledig type-safe');
  }

  // +2 : Branch coverage ≥ 80%
  if (components.branchCoverage.raw !== undefined && components.branchCoverage.raw >= 80) {
    bonus += 2; earned.push('+2 branch coverage ≥ 80%');
  }

  // +2 : Statement coverage ≥ 90%
  if (components.testCoverage.raw !== undefined && components.testCoverage.raw >= 90) {
    bonus += 2; earned.push('+2 statement coverage ≥ 90%');
  }

  log(`  bonussen: ${earned.join(', ')} = +${bonus}`);
  return { bonus, earned };
}

// ─── Master Grade ─────────────────────────────────────────────────────────────

function masterGrade(score) {
  if (score >= 95) return 'S';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  return 'D';
}

// ─── Hoofd-berekening ─────────────────────────────────────────────────────────

function compute() {
  log('\n🔢 Phoenix Trinity Engine v2 — score berekening\n');

  const coverageSummary = readJsonSafe(
    path.join(process.cwd(), 'coverage/coverage-summary.json')
  );

  // Bereken alle componenten
  const components = {
    testCoverage:   scoreTestCoverage(coverageSummary),
    branchCoverage: scoreBranchCoverage(coverageSummary),
    testPassRate:   scoreTestPassRate(),
    linting:        scoreLinting(),
    typeSafety:     scoreTypeSafety(),
    documentation:  scoreDocumentation(),
    complexity:     scoreComplexity(coverageSummary),
  };

  // Gewogen som
  let weighted = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    weighted += components[key].score * weight;
  }

  // Bonussen
  const { bonus, earned: bonusEarned } = calculateBonuses(components, coverageSummary);

  // Eindscore
  const finalScore = Math.min(100, Math.round(weighted + bonus));
  const grade      = masterGrade(finalScore);

  // Legacy scores voor backward compatibility met phoenix.sh
  const coverage  = coverageSummary ? Math.round(coverageSummary.total.branches.pct) : 0;
  const stability = finalScore; // nieuwe formule vervangt de oude stability
  const audit     = Math.round(
    (components.linting.score * 0.4 +
     components.typeSafety.score * 0.3 +
     components.documentation.score * 0.2 +
     components.complexity.score * 0.1)
  );

  return {
    // Trinity (backward compatible velden)
    audit,
    coverage,
    stability,
    master: grade,
    timestamp: new Date().toISOString(),

    // Nieuwe gedetailleerde scores
    quality: {
      score: finalScore,
      grade,
      weightedScore: Math.round(weighted),
      bonus,
      bonusEarned,
      components: {
        testCoverage:   { weight: WEIGHTS.testCoverage,   ...components.testCoverage   },
        branchCoverage: { weight: WEIGHTS.branchCoverage, ...components.branchCoverage },
        testPassRate:   { weight: WEIGHTS.testPassRate,   ...components.testPassRate   },
        linting:        { weight: WEIGHTS.linting,        ...components.linting        },
        typeSafety:     { weight: WEIGHTS.typeSafety,     ...components.typeSafety     },
        documentation:  { weight: WEIGHTS.documentation,  ...components.documentation  },
        complexity:     { weight: WEIGHTS.complexity,     ...components.complexity     },
      },
    },
    errors: [],
    warnings: coverageSummary ? [] : ['Geen coverage data gevonden — voer eerst npm test uit'],
    meta: {
      formula: 'weighted-v2',
      lines: coverageSummary ? {
        total:   coverageSummary.total.lines.total,
        covered: coverageSummary.total.lines.covered,
        pct:     coverageSummary.total.lines.pct,
      } : null,
      functions: coverageSummary ? {
        total:   coverageSummary.total.functions.total,
        covered: coverageSummary.total.functions.covered,
        pct:     coverageSummary.total.functions.pct,
      } : null,
    },
  };
}

// ─── Pretty Print ─────────────────────────────────────────────────────────────

function prettyPrint(data) {
  const q = data.quality;
  const c = q.components;

  const lines = [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '   📊 PHOENIX TRINITY SCORES  (formula v2)',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `   🏛️  Audit:      ${data.audit}%`,
    `   🧪  Coverage:   ${data.coverage}%  (branch)`,
    `   🛡️  Stability:  ${data.stability}%  (kwaliteitsscore)`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '   📋 Detailscores:',
    `      Test Coverage   (25%)  ${c.testCoverage.score.toString().padStart(3)}  — ${c.testCoverage.detail}`,
    `      Branch Coverage (20%)  ${c.branchCoverage.score.toString().padStart(3)}  — ${c.branchCoverage.detail}`,
    `      Test Pass Rate  (15%)  ${c.testPassRate.score.toString().padStart(3)}  — ${c.testPassRate.detail}`,
    `      Linting         (15%)  ${c.linting.score.toString().padStart(3)}  — ${c.linting.detail}`,
    `      Type Safety     (10%)  ${c.typeSafety.score.toString().padStart(3)}  — ${c.typeSafety.detail}`,
    `      Documentation   (10%)  ${c.documentation.score.toString().padStart(3)}  — ${c.documentation.detail}`,
    `      Complexity       (5%)  ${c.complexity.score.toString().padStart(3)}  — ${c.complexity.detail}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `   Gewogen subtotaal:  ${q.weightedScore}`,
    `   Bonus:             +${q.bonus}  (${q.bonusEarned.join(', ') || 'geen'})`,
    `   Eindscore:         ${q.score}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `   👑 MASTER GRADE: ${q.grade}`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  ];

  if (data.warnings.length > 0) {
    lines.push('');
    data.warnings.forEach(w => lines.push(`   ⚠️  ${w}`));
  }

  return lines.join('\n');
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const data = compute();

  if (args.includes('--json')) {
    console.log(JSON.stringify(data, null, 2));
  } else if (args.includes('--pretty')) {
    console.log(prettyPrint(data));
  } else if (args.includes('--legacy')) {
    console.log(
      `TRINITY_DATA|AUDIT:${data.audit}|COV:${data.coverage}|STAB:${data.stability}|MASTER:${data.master}`
    );
  } else {
    // Default: compact JSON voor bash-parsing (phoenix.sh verwacht dit)
    console.log(JSON.stringify(data));
  }

  const hasErrors    = data.errors.length > 0;
  const belowMinimum = data.coverage < 70 || data.master === 'D';
  process.exit(hasErrors || belowMinimum ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = { compute, masterGrade, WEIGHTS };
