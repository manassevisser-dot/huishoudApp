const path = require('path');
const TAG = '@alias-start';
const END_TAG = '@alias-end';

module.exports = {
  paths: {
    root: path.resolve(__dirname, '../../'),
    tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
    babel: path.resolve(__dirname, '../../babel.config.js'),
    jest: path.resolve(__dirname, '../../jest.config.js'),
    jsconfig: path.resolve(__dirname, '../../jsconfig.json'),
  },
  markers: {
    babel: { start: `// ${TAG}`, end: `// ${END_TAG}` },
    jest:  { start: `// ${TAG}`, end: `// ${END_TAG}` },
    jsconfig: { start: `// ${TAG}`, end: `// ${END_TAG}` },
  },
  reservedPrefixes: ['http://', 'https://', './', '../'],
  flags: {
    dryRun: process.argv.includes('--dry-run'),
    verbose: process.argv.includes('--verbose'),
  }
};
