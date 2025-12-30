const fs = require('fs');
const { markers } = require('../config');
const { updateBetweenMarkers, createBackup, ok, warn } = require('../utils');

function updateJest(aliases, flags, filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes(markers.jest.start)) {
    warn(`Jest mist markers: ${markers.jest.start}`);
    return;
  }

  const newContent = aliases.map(a => {
      const esc = a.name.replace(/[@]/g, '\\@');
      return `    '^${esc}/(.*)$': '<rootDir>/${a.target}/$1',`;
  }).join('\n');

  const updated = updateBetweenMarkers(content, markers.jest.start, markers.jest.end, newContent);

  if (!flags.dryRun) {
    createBackup(filePath);
    fs.writeFileSync(filePath, updated, 'utf8');
    ok('Jest updated');
  }
}
module.exports = { updateJest };
