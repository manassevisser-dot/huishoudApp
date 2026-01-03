#!/usr/bin/env node
/**
 * Phoenix Alias Fixer
 * Sync aliassen uit tsconfig.json naar babel.config.js, jest.config.js en jsconfig.json
 * via markerblokken:
 *   // @alias-start
 *   ... (auto generated)
 *   // @alias-end
 */
const fs = require('fs');
const path = require('path');
const { paths, markers, reservedPrefixes, flags } = require('./constants');
const { parseTsConfig, extractAliases } = require('./lib/tsconfig');
const updateBabel = require('./updateBabel');
const updateJest  = require('./updateJest');
const updateJson  = require('./updateJson');

function log(...a){ if (flags.verbose) console.log('[alias-fixer]', ...a); }
function info(...a){ console.log('[alias-fixer]', ...a); }
function warn(...a){ console.warn('[alias-fixer]', ...a); }

function ensureFile(p){ return fs.existsSync(p) ? fs.readFileSync(p,'utf8') : null; }
function writeIfChanged(p, next) {
  const prev = fs.existsSync(p) ? fs.readFileSync(p,'utf8') : '';
  if (prev === next) { log('no change:', path.basename(p)); return; }
  if (flags.dryRun) {
    info('DRY-RUN would update:', path.relative(paths.root, p));
    return;
  }
  fs.writeFileSync(p, next);
  info('✨ updated:', path.relative(paths.root, p));
}

function previewSnippet(name, text) {
  if (!flags.verbose) return;
  const lines = text.split('\n').slice(0, 5).join('\n');
  log(`preview ${name}:\n${lines}\n...`);
}

function runOne(targetPath, updater, marker, name) {
  const src = ensureFile(targetPath);
  if (!src) { warn(`${path.basename(targetPath)} not found; skip`); return; }
  const out = updater(src, aliases, marker);
  if (!out) { warn(`${name} markers not found; please add markers`); return; }
  // toon vooraf kort wat erin komt (alleen in --verbose)
  const formatted = out.split(marker.start)[1]?.split(marker.end)[0] ?? '';
  previewSnippet(name, formatted.trim());
  writeIfChanged(targetPath, out);
}

let aliases = {};
try {
  const cfg = parseTsConfig(paths.tsconfig);
  aliases = extractAliases(cfg, reservedPrefixes);
} catch (e) {
  console.error('[alias-fixer] fatal:', e.message);
  process.exit(1);
}
if (!aliases || Object.keys(aliases).length === 0) {
  warn('no aliases found in tsconfig paths; nothing to sync');
  process.exit(0);
}

// babel.config.js
runOne(paths.babel, updateBabel, markers.babel, 'babel');

// jest.config.js
runOne(paths.jest, updateJest, markers.jest, 'jest');

// jsconfig.json (VSCode optional)
const jsSrc = ensureFile(paths.jsconfig);
if (jsSrc) {
  const out = updateJson(jsSrc, aliases, markers.jsconfig);
  if (!out) warn('jsconfig markers not found; please add markers');
  else writeIfChanged(paths.jsconfig, out);
} else {
  log('jsconfig.json not found; optional, skip');
}
