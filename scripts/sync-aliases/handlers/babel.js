const { updateBetweenMarkers } = require("../utils");

const updateBabel = (src, aliases, marker) => {
  const content = Object.entries(aliases)
    // 1. Sorteer aliassen: langste paden eerst (bijv. @domain/rules voor @domain)
    .sort(([keyA], [keyB]) => keyB.length - keyA.length)
    .map(([key, value]) => {
      const val = Array.isArray(value) ? value[0] : value;
      if (!val || typeof val !== 'string') return null;

      const babelKey = key.replace('/*', '');
      let babelVal = val.replace('/*', '');
      
      // FIX: Als het een alias is die voorheen een wildcard had, 
      // of als het naar een index.ts wijst, dwing het naar de map.
      if (val.includes('/*') || babelVal.endsWith('index.ts')) {
        babelVal = babelVal.replace('/index.ts', '');
      }

      // Zorg dat het pad altijd begint met ./
      if (!babelVal.startsWith('./') && !babelVal.startsWith('../')) {
        babelVal = `./${babelVal}`;
      }

      return `          '${babelKey}': '${babelVal}',`;
    })
    .filter(Boolean)
    .join('\n');

  return updateBetweenMarkers(src, marker.start, marker.end, content);
};

module.exports = updateBabel;