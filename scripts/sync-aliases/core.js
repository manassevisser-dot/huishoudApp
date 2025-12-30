const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const { die, warn } = require('./utils');

function parseTsConfig(configPath) {
  if (!fs.existsSync(configPath)) die(`tsconfig.json niet gevonden`);
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const res = ts.parseConfigFileTextToJson(configPath, raw);
    if (res.error) die(`TSConfig Parse Error: ${res.error.messageText}`);
    return res.config;
  } catch (e) { die(`Leesfout: ${e.message}`); }
}

function extractAliases(tsconfig, rootDir, reservedPrefixes = []) {
  const paths = tsconfig?.compilerOptions?.paths;
  if (!paths) die('Geen paths in tsconfig');
  
  const aliases = [];
  const seen = new Set();

  for (const [key, value] of Object.entries(paths)) {
    if (key.startsWith('_') || key.startsWith('//')) continue;
    if (!Array.isArray(value) || value.length === 0) continue;

    const name = key.replace(/\/\*$/, '');
    const target = value[0].replace(/\/\*$/, '');

    if (reservedPrefixes.some(p => name.startsWith(p))) continue;
    if (seen.has(name)) { warn(`Dubbel: ${name}`); continue; }

    aliases.push({ name, target });
    seen.add(name);
  }
  if (aliases.length === 0) die('Geen aliassen gevonden');
  return aliases;
}

module.exports = { parseTsConfig, extractAliases };
