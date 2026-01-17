const updateBabel = (src, aliases, marker) => {
  const content = Object.entries(aliases)
    .map(([key, value]) => {
      const val = Array.isArray(value) ? value[0] : value;
      if (!val || typeof val !== 'string') return null;

      const babelKey = key.replace('/*', '');
      let babelVal = val.replace('/*', '');
      
      // Zorg dat het pad altijd begint met ./ als het dat nog niet doet
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