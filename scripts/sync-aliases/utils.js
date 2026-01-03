const fs = require('fs');
const path = require('path');
const { flags } = require('./config');

function die(msg, code = 1) {
  console.error(`❌ ${msg}`);
  process.exit(code);
}

function info(msg) { console.log(`ℹ️  ${msg}`); }
function ok(msg) { console.log(`✅ ${msg}`); }
function warn(msg) { console.log(`⚠️  ${msg}`); }

function createBackup(filePath) {
  if (!flags.backup) return;
  const backupPath = `${filePath}.bak.${Date.now()}`;
  fs.copyFileSync(filePath, backupPath);
  if (flags.verbose) console.log(`🔍 Backup: ${path.basename(backupPath)}`);
}

function restoreLatestBackup(filePath) {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath);
  try {
    const files = fs.readdirSync(dir).filter(f => f.startsWith(base + '.bak.')).sort().reverse();
    if (files.length > 0) {
      fs.copyFileSync(path.join(dir, files[0]), filePath);
      ok(`Hersteld: ${base}`);
    }
  } catch (e) { warn(`Herstel mislukt voor ${base}`); }
}

function updateBetweenMarkers(content, startMarker, endMarker, newContent) {
  const parts = content.split(startMarker);
  if (parts.length < 2) return null;
  const subParts = parts[1].split(endMarker);
  if (subParts.length < 2) return null;
  return [parts[0], startMarker, `\n${newContent}\n`, endMarker, subParts[1]].join('');
}

module.exports = { die, info, ok, warn, createBackup, restoreLatestBackup, updateBetweenMarkers };
