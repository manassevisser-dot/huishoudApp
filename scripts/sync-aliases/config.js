const path = require('path');
const ROOT = process.cwd();

const TAG = "@alias-start"; 
const END_TAG = "@alias-end";

const markers = {
  babel:    { start: `// ${TAG}`, end: `// ${END_TAG}` },
  jest:     { start: `// ${TAG}`, end: `// ${END_TAG}` },
  jsconfig: { start: `// ${TAG}`, end: `// ${END_TAG}` },
};

module.exports = {
  paths: {
    root: ROOT,
    tsconfig: path.join(ROOT, 'tsconfig.json'),
    jsconfig: path.join(ROOT, 'jsconfig.json'),
    babel: path.join(ROOT, 'babel.config.js'),
    jest: path.join(ROOT, 'jest.config.js'),
  },
  markers,
  // LET OP: '@test' is hier verwijderd zodat @test-utils werkt!
  reservedPrefixes: ['@types', '@react', '@expo', '@jest', '@babel', '@node', '@native', '@testing-library'],

  flags: {
    dryRun: process.argv.includes('--dry-run'),
    verbose: process.argv.includes('--verbose'),
    backup: process.argv.includes('--backup'),
    restore: process.argv.includes('--restore'),
    help: process.argv.includes('--help'),
  }
};
