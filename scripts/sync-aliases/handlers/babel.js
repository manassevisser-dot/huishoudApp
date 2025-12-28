const { updateBetweenMarkers } = require('../utils');

const updateBabel = (src, aliases, marker) => {
  const content = Object.entries(aliases)
    .map(([key, value]) => {
      const val = Array.isArray(value) ? value[0] : value;
      if (!val || typeof val !== 'string') return null;

      const babelKey = key.replace('/*', '');
      const babelVal = val.replace('/*', '');
      return `          '${babelKey}': '${babelVal}',`;
    })
    .filter(Boolean)
    .join('\n');
  return updateBetweenMarkers(src, marker.start, marker.end, content);
};

module.exports = updateBabel;