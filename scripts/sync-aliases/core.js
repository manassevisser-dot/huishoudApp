const fs = require('fs');
const ts = require('typescript');

/**
 * Parsen van tsconfig.json met ondersteuning voor JSONC (comments)
 */
function parseTsConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    throw new Error('CONFIG_NOT_FOUND');
  }

  const rawContent = fs.readFileSync(configPath, 'utf8');
  const result = ts.parseConfigFileTextToJson(configPath, rawContent);

  if (result.error) {
    throw new Error('CONFIG_PARSE_ERROR');
  }

  return result.config;
}

/**
 * Haalt aliassen uit tsconfig/jsconfig en maakt ze schoon
 */
function extractAliases(tsconfig, rootDir, reserved) {
  const rawPaths = (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) || {};
  const cleanAliases = {};

  for (const [key, paths] of Object.entries(rawPaths)) {
    // Sla gereserveerde prefixes over
    if (reserved.some(prefix => key.startsWith(prefix))) continue;

    // Validatie van de data-structuur om 'replace' errors te voorkomen
    if (Array.isArray(paths) && paths.length > 0 && typeof paths[0] === 'string') {
      cleanAliases[key] = paths;
    }
  }

  return cleanAliases;
}

module.exports = { 
  extractAliases, 
  parseTsConfig 
};