#!/usr/bin/env node
/**
 * Sync path aliases from tsconfig.json → babel.config.js + jest.config.js
 * 
 * Features:
 * - JSONC support (comments, trailing commas)
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

const fs = require('fs');
const path = require('path');
const ts = require('typescript');


/* ============================================================================
 * Configuration
 * ========================================================================== */

const ROOT = process.cwd();
const TSCONFIG = path.join(ROOT, 'tsconfig.json');
const BABEL = path.join(ROOT, 'babel.config.js');
const JEST = path.join(ROOT, 'jest.config.js');

const FLAGS = {
  dryRun: process.argv.includes('--dry-run'),
  backup: process.argv.includes('--backup'),
  verbose: process.argv.includes('--verbose'),
  help: process.argv.includes('--help') || process.argv.includes('-h'),
};

// Reserved alias prefixes (npm/node conventions)
const RESERVED_PREFIXES = [
  '@types', '@react', '@expo', '@jest', '@babel', 
  '@node', '@native', '@test', '@testing-library',
];

/* ============================================================================
 * Utilities
 * ========================================================================== */

function die(msg, code = 1) {
  console.error(`❌ ${msg}`);
  process.exit(code);
}

function info(msg) {
  console.log(`ℹ️  ${msg}`);
}

function ok(msg) {
  console.log(`✅ ${msg}`);
}

function warn(msg) {
  console.log(`⚠️  ${msg}`);
}

function verbose(msg) {
  if (FLAGS.verbose) {
    console.log(`🔍 ${msg}`);
  }
}

function showHelp() {
  console.log(`
📋 Sync Path Aliases

Usage:
  node scripts/sync-aliases.js [options]

Options:
  --dry-run    Show what would change without writing files
  --backup     Create .bak files before modifying
  --verbose    Show detailed processing information
  --help, -h   Show this help message

Examples:
  node scripts/sync-aliases.js
  node scripts/sync-aliases.js --dry-run --verbose
  node scripts/sync-aliases.js --backup
  `);
  process.exit(0);
}

/**
 * Strip JSONC comments and trailing commas
 * (Note: mostly redundant now that we use ts.parseConfigFileTextToJson, 
 * but kept for potential other uses)
 */
function sanitizeJsonc(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/,\s*([}\]])/g, '$1');
}

/**
 * Create backup of file
 */
function createBackup(filePath) {
  const backupPath = `${filePath}.bak`;
  fs.copyFileSync(filePath, backupPath);
  verbose(`Created backup: ${path.basename(backupPath)}`);
}

/**
 * Check if directory exists
 */
function directoryExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

/* ============================================================================
 * Main Logic
 * ========================================================================== */

function main() {
  if (FLAGS.help) {
    showHelp();
  }

  info('🚀 Starting alias sync...\n');

  /* ---------- Step 1: Read & Parse tsconfig.json ---------- */
  
  if (!fs.existsSync(TSCONFIG)) {
    die('tsconfig.json not found in project root');
  }

  verbose(`Reading ${TSCONFIG}`);

  // [LOCATIE A] Variabele declareren in de scope van main
  let tsconfig;

  // [LOCATIE B] Het veilige lees- en parse-blok
  try {
    const rawContent = fs.readFileSync(TSCONFIG, 'utf8');
    const result = ts.parseConfigFileTextToJson(TSCONFIG, rawContent);

    if (result.error) {
      const message = ts.flattenDiagnosticMessageText(result.error.messageText, '\n');
      die(`❌ Failed to parse tsconfig.json: ${message}`);
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

  /* ---------- Step 2: Extract & Validate Aliases ---------- */

  const aliases = [];
  const seenNames = new Set();
  const seenTargets = new Set();

  for (const [key, value] of Object.entries(paths)) {
    // Validate value is array
    if (!Array.isArray(value) || value.length === 0) {
      warn(`Skipping "${key}": value is not a non-empty array`);
      continue;
    }

    // Extract alias name (remove trailing /*)
    const name = key.replace(/\/\*$/, '');
    const target = value[0].replace(/\/\*$/, '');

    // Check for reserved names
    const isReserved = RESERVED_PREFIXES.some(prefix => 
      name.startsWith(prefix)
    );
    if (isReserved) {
      warn(`Skipping "${name}": reserved prefix`);
      continue;
    }

    // Check for duplicates
    if (seenNames.has(name)) {
      warn(`Duplicate alias name: "${name}" (skipping)`);
      continue;
    }
    if (seenTargets.has(target)) {
      warn(`Duplicate target: "${target}" (used by "${name}")`);
    }

    // Validate target exists
    const targetPath = path.join(ROOT, target);
    if (!directoryExists(targetPath)) {
      warn(`Target directory does not exist: ${target}`);
    }

    aliases.push({ name, target });
    seenNames.add(name);
    seenTargets.add(target);
  }

  if (aliases.length === 0) {
    die('No valid aliases found in tsconfig.json');
  }

  ok(`Found ${aliases.length} valid alias(es):\n`);
  aliases.forEach(a => info(`  ${a.name} → ${a.target}`));
  console.log();

  /* ---------- Step 3: Update babel.config.js ---------- */

  if (!fs.existsSync(BABEL)) {
    warn('babel.config.js not found (skipping)');
  } else {
    verbose('Processing babel.config.js');

    let babelSrc = fs.readFileSync(BABEL, 'utf8');

    // Generate alias block
    const babelAliasBlock = aliases
      .map(a => `              '${a.name}': './${a.target}',`)
      .join('\n');

    const babelFullBlock = `alias: {\n${babelAliasBlock}\n            }`;

    // Check if alias block exists
    const hasAliasBlock = /alias:\s*\{/.test(babelSrc);
    
    if (!hasAliasBlock) {
      warn('babel.config.js: No alias block found');
      info('Please add alias block manually inside module-resolver config');
    } else {
      // Replace existing alias block
      const updatedBabel = babelSrc.replace(
        /alias:\s*\{[^}]*\}/s,
        babelFullBlock
      );

      if (FLAGS.dryRun) {
        verbose('[DRY RUN] Would update babel.config.js');
      } else {
        if (FLAGS.backup) {
          createBackup(BABEL);
        }
        fs.writeFileSync(BABEL, updatedBabel, 'utf8');
        ok('Updated babel.config.js');
      }
    }
  }

  /* ---------- Step 4: Update jest.config.js ---------- */

  if (!fs.existsSync(JEST)) {
    warn('jest.config.js not found (skipping)');
  } else {
    verbose('Processing jest.config.js');

    let jestSrc = fs.readFileSync(JEST, 'utf8');

    // Generate moduleNameMapper
    const jestMapper = aliases
      .map(a => {
        // Escape @ in regex
        const escapedName = a.name.replace('@', '\\@');
        return `    '^${escapedName}/(.*)$': '<rootDir>/${a.target}/$1',`;
      })
      .join('\n');

    const jestFullBlock = `moduleNameMapper: {\n${jestMapper}\n  }`;

    // Check if moduleNameMapper exists
    const hasMapper = /moduleNameMapper:\s*\{/.test(jestSrc);

    if (!hasMapper) {
      warn('jest.config.js: No moduleNameMapper found');
      info('Please add moduleNameMapper manually to jest config');
    } else {
      // Replace existing mapper
      const updatedJest = jestSrc.replace(
        /moduleNameMapper:\s*\{[^}]*\}/s,
        jestFullBlock
      );

      if (FLAGS.dryRun) {
        verbose('[DRY RUN] Would update jest.config.js');
      } else {
        if (FLAGS.backup) {
          createBackup(JEST);
        }
        fs.writeFileSync(JEST, updatedJest, 'utf8');
        ok('Updated jest.config.js');
      }
    }
  }

  /* ---------- Step 5: Summary ---------- */

  console.log();
  if (FLAGS.dryRun) {
    ok('✨ Dry-run complete (no files modified)');
  } else {
    ok('✨ Alias sync complete!');
    info('\nNext steps:');
    info('  1. Clear Metro cache: npx react-native start --reset-cache');
    info('  2. Restart TypeScript server in your IDE');
    info('  3. Test imports: import { X } from \'@domain/Y\'');
  }
}

/* ============================================================================
 * Entry Point
 * ========================================================================== */

try {
  main();
} catch (err) {
  die(`Unexpected error: ${err.message}\n${err.stack}`);
}