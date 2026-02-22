const { updateBetweenMarkers } = require('../utils');

function updateJest(content, aliases, markers) {
  const formatted = Object.entries(aliases)
    // Sorteer: meest specifieke alias eerst
    .sort(([a], [b]) => b.length - a.length)
    .map(([alias, paths]) => {
      if (!paths || paths.length === 0) return null;

      const cleanAlias = alias.replace('/*', '');
      let cleanPath = Array.isArray(paths) ? paths[0] : paths;
      cleanPath = cleanPath.replace('/*', '').replace('/index.ts', '');

      return `      '^${cleanAlias}/(.*)$': '<rootDir>/${cleanPath}/$1',`;
    })
    .filter(Boolean)
    .join('\n');

  return updateBetweenMarkers(content, markers.start, markers.end, formatted);
}

module.exports = updateJest;
