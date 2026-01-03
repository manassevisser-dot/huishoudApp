const fs = require('fs');
function parseTsConfig(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('CONFIG_NOT_FOUND');
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    const m = raw.match(/"paths"\s*:\s*\{([\s\S]*?)\}/);
    if (!m) return {};
    const obj = JSON.parse(`{${m[0]}}`);
    return obj;
  }
}
function extractAliases(tsconfig, reserved) {
  const rawPaths = (tsconfig.compilerOptions && tsconfig.compilerOptions.paths)
                || (tsconfig.paths) || {};
  const clean = {};
  for (const [key, paths] of Object.entries(rawPaths)) {
    if (reserved.some(prefix => key.startsWith(prefix))) continue;
    if (Array.isArray(paths) && paths.length > 0 && typeof paths[0] === 'string') {
      clean[key] = paths;
    }
  }
  return clean;
}
module.exports = { parseTsConfig, extractAliases };
