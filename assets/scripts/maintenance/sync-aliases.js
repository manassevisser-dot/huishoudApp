#!/usr/bin/env node
/**
 * Sync path aliases from tsconfig.json → babel.config.js + jest.config.js
 *
 * Features:
 * - JSONC capable parse via TypeScript (comments, trailing commas)
 * - Dry-run mode (--dry-run)
 * - Backup creation (--backup)
 * - Validation (reserved names, duplicate aliases, target existence)
 * - Verbose mode (--verbose)
 *
 * Usage:
 *   node scripts/sync-aliases.js
 *   node scripts/sync-aliases.js --dry-run
 *   node scripts/sync-aliases.js --backup --verbose
 */

// ─────────────────────────────────────────────────────────────────────────────
// Imports & Config
// ─────────────────────────────────────────────────────────────────────────────
const fs   = require('fs');
const path = require('path');
const ts   = require('typescript');

const ROOT     = process.cwd();
const TSCONFIG = path.join(ROOT, 'tsconfig.json');
const BABEL    = path.join(ROOT, 'babel.config.js');
const JEST     = path.join(ROOT, 'jest.config.js');

const FLAGS = {
  dryRun : process.argv.includes('--dry-run'),
  backup : process.argv.includes('--backup'),
  verbose: process.argv.includes('--verbose'),
  help   : process.argv.includes('--help') || process.argv.includes('-h'),
};

// Reserved alias prefixes (avoid colliding with ecosystem namespaces)
const RESERVED_PREFIXES = [
  '@types', '@react', '@expo', '@jest', '@babel',
  '@node', '@native', '@test', '@testing-library',
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers (logging, IO)
// ─────────────────────────────────────────────────────────────────────────────
function die(msg, code = 1) {
  console.error(`❌ ${msg}`);
  process.exit(code);
}
function info(msg)   { console.info(`ℹ️ ${msg}`); }
function ok(msg)     { console.info(`✅ ${msg}`); }
function warn(msg)   { console.info(`⚠️ ${msg}`); }
function verbose(msg){ if (FLAGS.verbose) console.info(`🔍 ${msg}`); }


const vm = require('vm');

function validateJsSyntax(code, filename = 'jest.config.js') {
  try {
    vm.runInNewContext(code, { module: { exports: {} }, require, __dirname: ROOT, __filename: filename });
    return true;
  } catch (e) {
    warn(`Syntax check failed for ${filename}: ${e.message}`);
    return false;
  }
}


// ── Status helpers ─────────────────────────────────────────────────────────
function statusOk(changed, message = 'updated')      { return { ok: true,  changed, skipped: false, reason: message }; }
function statusSkip(reason = 'skipped')              { return { ok: true,  changed: false, skipped: true,  reason }; }
function statusDryRun(message = 'dry-run (no write)'){ return { ok: true,  changed: false, skipped: true,  reason: message }; }
function statusFail(reason = 'failed')               { return { ok: false, changed: false, skipped: false, reason }; }

function showHelp() {
  console.info(`
📋 Sync Path Aliases
Usage:
  node scripts/sync-aliases.js [options]

Options:
  --dry-run     Show what would change without writing files
  --backup      Create .bak files before modifying
  --verbose     Show detailed processing information
  --help, -h    Show this help message

Examples:
  node scripts/sync-aliases.js
  node scripts/sync-aliases.js --dry-run --verbose
  node scripts/sync-aliases.js --backup
`);
  process.exit(0);
}

function createBackup(filePath) {
  const backupPath = `${filePath}.bak`;
  fs.copyFileSync(filePath, backupPath);
  verbose(`Created backup: ${path.basename(backupPath)}`);
}

function directoryExists(dirPath) {
  try { return fs.statSync(dirPath).isDirectory(); }
  catch { return false; }
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities (markers, generation)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Replace content between markers (inclusive) with new block.
 * Returns updated string, or null if markers are missing.
 */
function replaceBetweenMarkers(src, startMarker, endMarker, newBlock) {
  const re = new RegExp(
    `${escapeForRegex(startMarker)}[\\s\\S]*?${escapeForRegex(endMarker)}`,
    'm'
  );
  if (!re.test(src)) return null;
  return src.replace(re, `${startMarker}\n${newBlock}\n${endMarker}`);
}

function replaceBetweenMarkersIndex(src, startMarker, endMarker, newBlock) {
  const start = src.indexOf(startMarker);
  const end   = src.indexOf(endMarker);
  if (start === -1 || end === -1 || end < start) return null;

  const before = src.slice(0, start);
  const after  = src.slice(end + endMarker.length);

  // Bouw het nieuwe stuk precies zoals het in je bestand moet staan
  const middle = `${startMarker}\n${newBlock}\n${endMarker}`;
  return `${before}${middle}${after}`;
}

function escapeForRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds Pretty alias block lines.
 * - For Babel (module-resolver):  'alias: {\n  "@ui": "./src/ui",\n}\n'
 * - For Jest (moduleNameMapper):  lines like '^@ui/(.*)$': '<rootDir>/src/ui/$1',
 */
function buildBabelAliasBlock(aliases) {
  const lines = aliases.map(a => `  '${a.name}': './${a.target}',`).join('\n');
  return `alias: {\n${lines}\n}`;
}


function buildJestBlock(aliases) {
  // elke regel eindigt op een komma (veilig voor toekomstige bijvoegingen)
  const lines = aliases.map(a => {
    const name = a.name.replace('@', '\\@'); // escape '@' in regex literal
    return `  '^${name}/(.*)$': '<rootDir>/${a.target}/$1',`;
  }).join('\n');

  return `moduleNameMapper: {\n${lines}\n},`;
}


// ─────────────────────────────────────────────────────────────────────────────
// Core steps
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Step 1: Read & Parse tsconfig.json via TypeScript (supports JSONC)
 */
function readAliasesFromTsconfig() {
  if (!fs.existsSync(TSCONFIG)) {
    die('tsconfig.json not found in project root');
  }
  verbose(`Reading ${TSCONFIG}`);
  let tsconfig;
  try {
    const raw = fs.readFileSync(TSCONFIG, 'utf8');
    const result = ts.parseConfigFileTextToJson(TSCONFIG, raw);
    if (result.error) {
      const message = ts.flattenDiagnosticMessageText(result.error.messageText, '\n');
      die(`Failed to parse tsconfig.json: ${message}`);
    }
    tsconfig = result.config;
    verbose('Successfully parsed tsconfig.json via TypeScript');
  } catch (err) {
    die(`Failed to read tsconfig.json: ${err.message}`);
  }

  const paths = tsconfig?.compilerOptions?.paths;
  if (!paths || typeof paths !== 'object') {
    die('No compilerOptions.paths found in tsconfig.json');
  }

  // Step 2: Validate/extract aliases
  const aliases = [];
  const seenNames = new Set();
  const seenTargets = new Set();

  for (const [key, value] of Object.entries(paths)) {
    if (!Array.isArray(value) || value.length === 0) {
      warn(`Skipping "${key}": value is not a non-empty array`);
      continue;
    }
    // Normalize: remove trailing '/*'
    const name   = String(key).replace(/\/\*$/, '');
    const target = String(value[0]).replace(/\/\*$/, '');

    const isReserved = RESERVED_PREFIXES.some(prefix => name.startsWith(prefix));
    if (isReserved) {
      warn(`Skipping "${name}": reserved prefix`);
      continue;
    }
    if (seenNames.has(name)) {
      warn(`Duplicate alias name: "${name}" (skipping)`);
      continue;
    }
    if (seenTargets.has(target)) {
      warn(`Duplicate target: "${target}" (already used)`);
    }

    const targetPath = path.join(ROOT, target);
    if (!directoryExists(targetPath)) {
      warn(`Target directory does not exist: ${target}`);
      // still allow; we only warn
    }

    aliases.push({ name, target });
    seenNames.add(name);
    seenTargets.add(target);
  }

  if (aliases.length === 0) {
    die('No valid aliases found in tsconfig.json');
  }

  ok(`Found ${aliases.length} valid alias(es):`);
  aliases.forEach(a => info(`  ${a.name} → ${a.target}`));
  console.info();
  return aliases;
}

/**
 * Step 3: Update babel.config.js (marker-based preferred)
 * Markers expected in babel.config.js:
 *   /* @aliases-start *\/
 *     alias: {
 *       '@ui': './src/ui',
 *     },
 *   /* @aliases-end *\/
 */

function updateBabel(aliases) {
  if (!fs.existsSync(BABEL)) return statusSkip('babel.config.js not found');

  verbose('Processing babel.config.js');
  const startMarker = '/* @aliases-start */';
  const endMarker   = '/* @aliases-end */';

  let babelSrc = fs.readFileSync(BABEL, 'utf8');
  const aliasBlock = buildBabelAliasBlock(aliases);

  // vervang alleen tussen markers
  let updated = replaceBetweenMarkers(babelSrc, startMarker, endMarker, `${aliasBlock},`);
  if (updated === null) return statusSkip('no markers in babel.config.js');

  if (FLAGS.dryRun) {
    verbose('[DRY RUN] Would update babel.config.js via markers');
    return statusDryRun('babel: markers found');
  }

  if (FLAGS.backup) createBackup(BABEL);
  fs.writeFileSync(BABEL, updated, 'utf8');
  ok('Updated babel.config.js (markers)');
  return statusOk(true, 'babel updated');
}


/**
 * Step 4: Update jest.config.js (marker-based)
 * Markers expected in jest.config.js:
 *   /* @aliases-start *\/
 *     moduleNameMapper: {
 *       '^@ui/(.*)$': '<rootDir>/src/ui/$1',
 *     },
 *   /* @aliases-end *\/
 */

function updateJest(aliases) {
  if (!fs.existsSync(JEST)) return statusSkip('jest.config.js not found');
  verbose('Processing jest.config.js');

  const startMarker = '/* @aliases-start */';
  const endMarker   = '/* @aliases-end */';

  const jestSrc    = fs.readFileSync(JEST, 'utf8');
  const newBlock   = buildJestBlock(aliases);
  const updated    = replaceBetweenMarkersIndex(jestSrc, startMarker, endMarker, newBlock);

  if (updated === null) return statusSkip('no markers in jest.config.js');

  // Dry-run → toon wat we zouden doen
  if (FLAGS.dryRun) {
    verbose('[DRY RUN] Would update jest.config.js via markers');
    verbose('--- BEGIN NEW BLOCK ---\n' + newBlock + '\n--- END NEW BLOCK ---');
    return statusDryRun('jest: markers found');
  }

  // Syntax‑guard vóór write
  if (!validateJsSyntax(updated, 'jest.config.js (updated preview)')) {
    return statusFail('jest syntax invalid after replace (aborting write)');
  }

  if (FLAGS.backup) createBackup(JEST);
  fs.writeFileSync(JEST, updated, 'utf8');
  ok('Updated jest.config.js (markers)');
  return statusOk(true, 'jest updated');
}

// ─────────────────────────────────────────────────────────────────────────────
// JSConfig update (optional via --jsconfig)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Update or create jsconfig.json with the same compilerOptions.paths
 * derived from tsconfig.json (aliases array).
 */

const JSCONFIG = path.join(ROOT, 'jsconfig.json');

function updateJsconfig(aliases) {
  const WANT_JSCONFIG = process.argv.includes('--jsconfig');
  if (!WANT_JSCONFIG) return statusSkip('jsconfig disabled');

  verbose('Processing jsconfig.json');

  const pathsObj = Object.fromEntries(
    aliases.map(a => [ `${a.name}/*`, [ `${a.target}/*` ] ])
  );

  let jsconf, existing = false;
  if (fs.existsSync(JSCONFIG)) {
    existing = true;
    try {
      jsconf = JSON.parse(fs.readFileSync(JSCONFIG, 'utf8'));
    } catch (err) {
      warn(`jsconfig.json invalid JSON: ${err.message}. Recreating.`);
      jsconf = {};
    }
  } else {
    jsconf = {};
  }

  jsconf.compilerOptions = jsconf.compilerOptions || {};
  jsconf.compilerOptions.baseUrl = jsconf.compilerOptions.baseUrl || '.';
  jsconf.compilerOptions.paths = pathsObj;

  if (!Array.isArray(jsconf.exclude)) jsconf.exclude = [];
  if (!jsconf.exclude.includes('node_modules')) jsconf.exclude.push('node_modules');

  const pretty = JSON.stringify(jsconf, null, 2) + '\n';

  if (FLAGS.dryRun) {
    verbose(`[DRY RUN] Would ${existing ? 'update' : 'create'} jsconfig.json`);
    return statusDryRun(existing ? 'jsconfig would update' : 'jsconfig would create');
  }

  if (FLAGS.backup && existing) createBackup(JSCONFIG);
  fs.writeFileSync(JSCONFIG, pretty, 'utf8');
  ok(`${existing ? 'Updated' : 'Created'} jsconfig.json`);
  return statusOk(true, existing ? 'jsconfig updated' : 'jsconfig created');
}


/**
 * Step 5: Summary
 */

function summary(status = {}) {
  const { sBabel, sJest, sJsconf } = status;

  const asLine = (label, s) => {
    if (!s) return `• ${label}: ⚠️ n/a`;
    if (s.ok && s.skipped && s.reason?.includes('dry-run')) return `• ${label}: ✨ dry-run (ok, no write)`;
    if (s.ok && s.skipped)  return `• ${label}: ⚠️ ${s.reason}`;
    if (s.ok)               return `• ${label}: ✅ ${s.reason || 'ok'}`;
    return                      `• ${label}: ❌ ${s.reason || 'failed'}`;
  };

  console.info();
  if (FLAGS.dryRun) {
    ok('✨ Dry-run complete (no files modified)');
    console.info(asLine('Babel',  sBabel));
    console.info(asLine('Jest',   sJest));
    console.info(asLine('jsconfig', sJsconf));
  } else {
    ok('✨ Alias sync complete!');
    console.info(asLine('Babel',  sBabel));
    console.info(asLine('Jest',   sJest));
    console.info(asLine('jsconfig', sJsconf));

    info('\nNext steps:');
    info('  1) Clear Expo cache (RN): npx expo start -c');
    info('  2) Restart TypeScript server in your IDE');
    info("  3) Test imports: import { X } from '@domain/Y'");
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────


function main() {
  if (FLAGS.help) showHelp();

  info('🚀 Starting alias sync...\n');
  const aliases = readAliasesFromTsconfig();

  const sBabel   = updateBabel(aliases);
  const sJest    = updateJest(aliases);
  const sJsconf  = updateJsconfig(aliases); // only active with --jsconfig

  summary({ sBabel, sJest, sJsconf });
}

try {
  main();
} catch (err) {
  die(`Unexpected error: ${err.message}\n${err.stack}`);
}
