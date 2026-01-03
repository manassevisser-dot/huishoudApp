const { updateBetweenMarkers } = require('./utils');
function updateJest(content, aliases, markers) {
  const formatted = Object.entries(aliases)
    .map(([alias, paths]) => {
      const cleanAlias = alias.replace('/*', '');
      const cleanPath = paths[0].replace('/*', '');
      return ` '^${cleanAlias}/(.*)$': '<rootDir>/${cleanPath}/$1',`;
    })
    .join('\n');
  return updateBetweenMarkers(content, markers.start, markers.end, formatted);
}
module.exports = updateJest;
