const { execSync } = require('child_process');
const babelAliases = require('./babel.config.js')({ cache: () => {} })
  .plugins.find(p => p[0] === 'module-resolver')[1].alias;

const jestRaw = execSync('npx jest --showConfig', { encoding: 'utf-8' });

// Eval the config safely
const jestConfig = eval('(' + jestRaw + ')'); // eslint-disable-line no-eval
const jestAliases = jestConfig.moduleNameMapper;

// Side-by-side check
console.log('--- MISSING IN BABEL ---');
Object.keys(jestAliases).forEach(key => {
  if (!babelAliases[key.replace(/^\\^/, '').replace(/\\/\(\.\*\)$/, '')]) {
    console.log(key, '=>', jestAliases[key]);
  }
});

console.log('--- MISSING IN JEST ---');
Object.keys(babelAliases).forEach(key => {
  const jestKey = `^${key}/(.*)$`;
  if (!jestAliases[jestKey]) {
    console.log(key, '=>', babelAliases[key]);
  }
});
