const path = require('path');

// --- SINGLE SOURCE OF TRUTH VOOR MARKERS ---
const TAG = "@alias-start"; // Verander dit hier, en het verandert overal
const END_TAG = "@alias-end";

const markers = {
  // We bouwen de markers dynamisch op zodat ze overal consistent zijn
  babel:    { start: `// ${TAG}`, end: `// ${END_TAG}` },
  jest:     { start: `// ${TAG}`, end: `// ${END_TAG}` },
  jsconfig: { start: `// ${TAG}`, end: `// ${END_TAG}` },
};

const fs = require('fs');

// Helper om het juiste Jest bestand te vinden
const getJestPath = () => {
  const tsPath = path.resolve(__dirname, '../../jest.config.ts');
  const jsPath = path.resolve(__dirname, '../../jest.config.js');
  return fs.existsSync(tsPath) ? tsPath : jsPath;
};

module.exports = {
  paths: {
    root: path.resolve(__dirname, '../../'),
    tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
    babel: path.resolve(__dirname, '../../babel.config.js'),
    jest: getJestPath(), // <--- Dit is nu dynamisch
    jsconfig: path.resolve(__dirname, '../../jsconfig.json'),
  },
  
  markers,
  
  // Gereserveerde prefixes die we nooit als alias willen
  reservedPrefixes: ['http://', 'https://', './', '../'],

  flags: {
    dryRun: process.argv.includes('--dry-run'),
    verbose: process.argv.includes('--verbose'),
    backup: process.argv.includes('--backup'),
    restore: process.argv.includes('--restore'),
    help: process.argv.includes('--help'),
  }
};