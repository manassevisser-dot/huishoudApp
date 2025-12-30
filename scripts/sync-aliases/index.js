#!/usr/bin/env node
const { paths, flags, reservedPrefixes } = require('./config');
const { die, ok, info, restoreLatestBackup } = require('./utils');
const { parseTsConfig, extractAliases } = require('./core');
const { updateBabel } = require('./handlers/babel');
const { updateJest } = require('./handlers/jest');
const { updateJsconfig } = require('./handlers/json');

function main() {
  if (flags.help) { console.log('Gebruik: node scripts/sync-aliases/index.js [--dry-run] [--backup]'); process.exit(0); }
  
  if (flags.restore) {
    restoreLatestBackup(paths.babel);
    restoreLatestBackup(paths.jest);
    restoreLatestBackup(paths.jsconfig);
    ok('Restore voltooid');
    process.exit(0);
  }

  info('🚀 Sync Aliases...');
  
  try {
    const tsconfig = parseTsConfig(paths.tsconfig);
    const aliases = extractAliases(tsconfig, paths.root, reservedPrefixes);
    
    updateBabel(aliases, flags, paths.babel);
    updateJest(aliases, flags, paths.jest);
    updateJsconfig(aliases, flags, paths.jsconfig);
    
    if (flags.dryRun) ok('Dry-run klaar.');
    else ok('Sync voltooid!');
    
  } catch (e) { die(e.message); }
}
main();
