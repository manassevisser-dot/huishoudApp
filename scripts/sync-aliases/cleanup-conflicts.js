#!/usr/bin/env node
/**
 * Phoenix Alias Cleanup Script
 * Eenmalige cleanup om bestaande conflicten op te lossen:
 * 1. @utils fallback arrays fixen
 * 2. Single-file aliases verwijderen die overlappen met globs
 * 3. Backup maken van originele bestanden
 */

const fs = require('fs');
const path = require('path');

// === GEBRUIK PHOENIX LOGGER ===
const logger = require('../utils/logger');

const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

function log(level, msg) {
  logger[level](msg);
}

// === TSConfig Fixes ===

function fixTsConfig(filePath) {
  log('info', 'Analyseer tsconfig.json...');
  
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = content;
  let changes = [];
  
  // 1. Fix @utils fallback array
  const utilsPattern = /"@utils\/\*":\s*\[\s*"src\/utils\/\*",\s*"src\/domain\/helpers\/\*",\s*"src\/domain\/validation\/\*"\s*\]/;
  
  if (utilsPattern.test(modified)) {
    log('warn', 'Gevonden: @utils met fallback array (3 folders)');
    
    // Replace met alleen primary folder
    modified = modified.replace(
      utilsPattern,
      '"@utils/*": ["src/utils/*"]'
    );
    
    changes.push('Fixed @utils fallback array → alleen src/utils/*');
    log('ok', 'Fix: @utils wijst nu alleen naar src/utils/*');
  }
  
  // 2. Verwijder overlappende single-file aliases
  const overlaps = [
    { pattern: /"@shared-types\/finance":\s*\["src\/core\/types\/finance\.ts"\],?\n?/g, name: '@shared-types/finance' },
    { pattern: /"@shared-types\/form":\s*\["src\/core\/types\/form\.ts"\],?\n?/g, name: '@shared-types/form' },
    { pattern: /"@shared-types\/fields":\s*\["src\/core\/types\/form\.ts"\],?\n?/g, name: '@shared-types/fields' },
    { pattern: /"@shared-types\/wizard":\s*\["src\/core\/types\/wizard\.ts"\],?\n?/g, name: '@shared-types/wizard' }
  ];
  
  overlaps.forEach(({ pattern, name }) => {
    if (pattern.test(modified)) {
      log('warn', `Gevonden: ${name} (overlapt met @shared-types/*)`);
      modified = modified.replace(pattern, '');
      changes.push(`Removed ${name} (gedekt door glob)`);
      log('ok', `Fix: ${name} verwijderd`);
    }
  });
  
  // 3. Clean up trailing commas en dubbele newlines
  modified = modified.replace(/,(\s*\})/g, '$1'); // Remove trailing commas
  modified = modified.replace(/\n\n\n+/g, '\n\n'); // Max 2 newlines
  
  if (changes.length === 0) {
    log('ok', 'tsconfig.json is al clean!');
    return null;
  }
  
  return { original: content, modified, changes };
}

// === Babel Config Fixes ===

function fixBabelConfig(filePath) {
  log('info', 'Analyseer babel.config.js...');
  
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = content;
  let changes = [];
  
  // 1. Remove single-file aliases that overlap with globs
  const singleFileAliases = [
    { pattern: /'@shared-types\/finance':\s*'\.\/src\/core\/types\/finance\.ts',?\n?\s*/g, name: '@shared-types/finance' },
    { pattern: /'@shared-types\/form':\s*'\.\/src\/core\/types\/form\.ts',?\n?\s*/g, name: '@shared-types/form' },
    { pattern: /'@shared-types\/fields':\s*'\.\/src\/core\/types\/form\.ts',?\n?\s*/g, name: '@shared-types/fields' },
    { pattern: /'@shared-types\/wizard':\s*'\.\/src\/core\/types\/wizard\.ts',?\n?\s*/g, name: '@shared-types/wizard' }
  ];
  
  singleFileAliases.forEach(({ pattern, name }) => {
    if (pattern.test(modified)) {
      log('warn', `Gevonden: ${name} (redundant met @shared-types glob)`);
      modified = modified.replace(pattern, '');
      changes.push(`Removed ${name} from Babel`);
      log('ok', `Fix: ${name} verwijderd`);
    }
  });
  
  // 2. Ensure @utils points only to primary folder
  const utilsPattern = /'@utils':\s*'\.\/src\/utils'/;
  if (!utilsPattern.test(modified)) {
    log('warn', '@utils niet gevonden of incorrect ingesteld');
  }
  
  if (changes.length === 0) {
    log('ok', 'babel.config.js is al clean!');
    return null;
  }
  
  return { original: content, modified, changes };
}

// === Jest Config Fixes ===

function fixJestConfig(filePath) {
  log('info', 'Analyseer jest.config.ts...');
  
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = content;
  let changes = [];
  
  // 1. Remove exact-match single-file aliases (ze zijn nu redundant)
  const singleFilePatterns = [
    { pattern: /'\^@shared-types\/finance\$':\s*'<rootDir>\/src\/core\/types\/finance\.ts',?\n?\s*/g, name: '@shared-types/finance' },
    { pattern: /'\^@shared-types\/form\$':\s*'<rootDir>\/src\/core\/types\/form\.ts',?\n?\s*/g, name: '@shared-types/form' },
    { pattern: /'\^@shared-types\/fields\$':\s*'<rootDir>\/src\/core\/types\/form\.ts',?\n?\s*/g, name: '@shared-types/fields' },
    { pattern: /'\^@shared-types\/wizard\$':\s*'<rootDir>\/src\/core\/types\/wizard\.ts',?\n?\s*/g, name: '@shared-types/wizard' }
  ];
  
  singleFilePatterns.forEach(({ pattern, name }) => {
    if (pattern.test(modified)) {
      log('warn', `Gevonden: ${name} exact-match (redundant met glob)`);
      modified = modified.replace(pattern, '');
      changes.push(`Removed ${name} exact-match from Jest`);
      log('ok', `Fix: ${name} exact-match verwijderd`);
    }
  });
  
  if (changes.length === 0) {
    log('ok', 'jest.config.ts is al clean!');
    return null;
  }
  
  return { original: content, modified, changes };
}

// === Backup & Apply ===

function createBackup(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const backupPath = `${filePath}.backup-${timestamp}`;
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

function applyFix(filePath, result) {
  if (!result) return false;
  
  const backupPath = createBackup(filePath);
  log('info', `Backup gemaakt: ${path.basename(backupPath)}`);
  
  if (!DRY_RUN) {
    fs.writeFileSync(filePath, result.modified, 'utf8');
    log('ok', `Toegepast op ${path.basename(filePath)}`);
  } else {
    log('warn', `[DRY-RUN] Zou ${path.basename(filePath)} updaten`);
  }
  
  return true;
}

// === Main ===

function main() {
  const rootDir = path.resolve(__dirname, '../../');
  
  console.log('\n🦅 Phoenix Alias Cleanup\n');
  
  if (DRY_RUN) {
    log('warn', '🔸 DRY RUN MODE - Geen wijzigingen worden opgeslagen\n');
  }
  
  const files = {
    tsconfig: path.join(rootDir, 'tsconfig.json'),
    babel: path.join(rootDir, 'babel.config.js'),
    jest: path.join(rootDir, 'jest.config.ts')
  };
  
  // Check if files exist
  Object.entries(files).forEach(([name, fpath]) => {
    if (!fs.existsSync(fpath)) {
      log('error', `${name} niet gevonden: ${fpath}`);
      process.exit(1);
    }
  });
  
  let totalChanges = 0;
  const allChanges = [];
  
  // Process each file
  console.log('📋 Stap 1: TypeScript Config\n');
  const tsResult = fixTsConfig(files.tsconfig);
  if (tsResult) {
    applyFix(files.tsconfig, tsResult);
    allChanges.push(...tsResult.changes);
    totalChanges++;
  }
  
  console.log('\n📋 Stap 2: Babel Config\n');
  const babelResult = fixBabelConfig(files.babel);
  if (babelResult) {
    applyFix(files.babel, babelResult);
    allChanges.push(...babelResult.changes);
    totalChanges++;
  }
  
  console.log('\n📋 Stap 3: Jest Config\n');
  const jestResult = fixJestConfig(files.jest);
  if (jestResult) {
    applyFix(files.jest, jestResult);
    allChanges.push(...jestResult.changes);
    totalChanges++;
  }
  
  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 SAMENVATTING\n');
  
  if (totalChanges === 0) {
    log('ok', 'Geen cleanup nodig - alle configs zijn al optimaal! 🎉');
  } else {
    log('info', `Bestanden aangepast: ${totalChanges}`);
    log('info', `Totaal fixes: ${allChanges.length}\n`);
    
    if (VERBOSE) {
      console.log('Changelog:');
      allChanges.forEach((change, idx) => {
        console.log(`  ${idx + 1}. ${change}`);
      });
      console.log('');
    }
    
    if (DRY_RUN) {
      log('warn', 'Draai zonder --dry-run om wijzigingen door te voeren.');
    } else {
      log('ok', 'Cleanup succesvol voltooid! ✨');
      console.log('\n💡 Volgende stappen:');
      console.log('   1. npm run sync:aliases --strict  (valideer result)');
      console.log('   2. npm test                        (check of alles werkt)');
      console.log('   3. git add . && git commit         (commit de fixes)');
    }
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run
try {
  main();
} catch (error) {
  log('error', `Fatale fout: ${error.message}`);
  if (VERBOSE) {
    console.error(error.stack);
  }
  process.exit(1);
}