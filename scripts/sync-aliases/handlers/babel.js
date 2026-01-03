const fs = require('fs');
const { markers } = require('../config');
const { updateBetweenMarkers, createBackup, ok, warn } = require('../utils');

function updateBabel(aliases, flags, filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes(markers.babel.start)) {
    warn(`Babel mist markers: ${markers.babel.start}`);
    return;
  }

  const newContent = aliases.map(a => `            '${a.name}': './${a.target}',`).join('\n');
  const updated = updateBetweenMarkers(content, markers.babel.start, markers.babel.end, newContent);
  
  if (!flags.dryRun) {
    createBackup(filePath);
    fs.writeFileSync(filePath, updated, 'utf8');
    ok('Babel updated');
  }
}
module.exports = { updateBabel };
