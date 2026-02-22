const { updateBetweenMarkers } = require('../utils');

function updateJson(content, aliases, markers) {
  const formatted = Object.entries(aliases)
    .map(([alias, paths]) => `      "${alias}": ["${paths[0]}"],`)
    .join('\n');
  return updateBetweenMarkers(content, markers.start, markers.end, formatted);
}

module.exports = updateJson;