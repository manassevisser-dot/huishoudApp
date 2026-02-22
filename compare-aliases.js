const fs = require('fs');

const jestAliasesRaw = fs.readFileSync('./jest-aliases.json', 'utf-8');
const babelAliasesRaw = fs.readFileSync('./babel-aliases.json', 'utf-8');

const jestAliases = JSON.parse(jestAliasesRaw);
const babelAliases = JSON.parse(babelAliasesRaw);

// Normalize paths for comparison
const normalize = (s) => s.replace(/\/$/, '');

const missingInBabel = [];
const missingInJest = [];

for (const key of Object.keys(jestAliases)) {
  if (!babelAliases[key] || normalize(babelAliases[key]) !== normalize(jestAliases[key][0])) {
    missingInBabel.push({ key, jest: jestAliases[key], babel: babelAliases[key] });
  }
}

for (const key of Object.keys(babelAliases)) {
  if (!jestAliases[key] || normalize(jestAliases[key][0]) !== normalize(babelAliases[key])) {
    missingInJest.push({ key, babel: babelAliases[key], jest: jestAliases[key] });
  }
}

console.log('❌ Aliassen in Jest maar niet correct in Babel:', missingInBabel);
console.log('❌ Aliassen in Babel maar niet correct in Jest:', missingInJest);

if (missingInBabel.length === 0 && missingInJest.length === 0) {
  console.log('✅ Alle aliassen matchen PERFECT tussen Jest en Babel!');
}
