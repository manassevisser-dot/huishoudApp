const jestConfig = require('jest').getConfig();
const aliases = jestConfig.moduleNameMapper;

console.log(JSON.stringify(aliases, null, 2));
