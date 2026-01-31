#!/usr/bin/env node
/**
 * Phoenix Alias Path Fixer
 * Corrigeert verkeerde paths in tsconfig.json
 */

const fs = require('fs');
const path = require('path');

const TSCONFIG = path.resolve(__dirname, '../../tsconfig.json');

console.log('🔧 Phoenix Alias Path Fixer\n');

// Read tsconfig
const content = fs.readFileSync(TSCONFIG, 'utf8');
let modified = content;

const fixes = [];

// Fix 1: @logic → src/core/logic
if (modified.includes('"@logic/*": ["src/logic/*"]')) {
  console.log('⚠️  Found: @logic/* → src/logic/* (WRONG)');
  modified = modified.replace(
    '"@logic/*": ["src/logic/*"]',
    '"@logic/*": ["src/core/logic/*"]'
  );
  fixes.push('Fixed @logic/* → src/core/logic/*');
  console.log('✅ Fixed: @logic/* → src/core/logic/*\n');
}

// Fix 2: @selectors → src/ui/selectors
if (modified.includes('"@selectors/*": ["src/selectors/*"]')) {
  console.log('⚠️  Found: @selectors/* → src/selectors/* (WRONG)');
  modified = modified.replace(
    '"@selectors/*": ["src/selectors/*"]',
    '"@selectors/*": ["src/ui/selectors/*"]'
  );
  fixes.push('Fixed @selectors/* → src/ui/selectors/*');
  console.log('✅ Fixed: @selectors/* → src/ui/selectors/*\n');
}

// Fix 3: Remove @assets (doesn't exist)
if (modified.includes('"@assets/*": ["assets/*"]')) {
  console.log('⚠️  Found: @assets/* → assets/* (MISSING)');
  // Remove the entire line including comma and newline
  modified = modified.replace(/\s*"@assets\/\*":\s*\["assets\/\*"\],?\n?/g, '');
  fixes.push('Removed @assets/* (folder does not exist)');
  console.log('✅ Removed: @assets/* (folder niet gevonden)\n');
}

// Fix 4: Remove @domain/core (overlaps with @domain/*)
if (modified.includes('"@domain/core": ["src/domain/core.ts"]')) {
  console.log('⚠️  Found: @domain/core (overlaps with @domain/*)');
  modified = modified.replace(/\s*"@domain\/core":\s*\["src\/domain\/core\.ts"\],?\n?/g, '');
  fixes.push('Removed @domain/core (covered by @domain/* glob)');
  console.log('✅ Removed: @domain/core (gedekt door glob)\n');
}

// Check if any changes were made
if (fixes.length === 0) {
  console.log('✅ Geen fixes nodig - tsconfig.json is al correct!\n');
  process.exit(0);
}

// Create backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const backupPath = `${TSCONFIG}.backup-${timestamp}`;
fs.copyFileSync(TSCONFIG, backupPath);
console.log(`💾 Backup gemaakt: ${path.basename(backupPath)}\n`);

// Write changes
fs.writeFileSync(TSCONFIG, modified, 'utf8');

// Summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ SUCCESVOL GEFIXED!\n');
console.log('Changelog:');
fixes.forEach((fix, idx) => {
  console.log(`  ${idx + 1}. ${fix}`);
});

console.log('\n💡 Volgende stappen:');
console.log('   1. npm run sync:aliases --strict  (valideer result)');
console.log('   2. npm test                        (check of alles werkt)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');