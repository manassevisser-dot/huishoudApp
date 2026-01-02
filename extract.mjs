
// extract-migration-members-blocks.mjs
// Doel: zoek in samenvatting.txt naar elke regel met 'migration.members.test.ts'
// en pak daarna ~60 regels context eronder. Schrijf alle blokken naar een outputbestand.

import { readFileSync, writeFileSync } from 'node:fs';

const INPUT  = 'samenvatting.txt';
const OUTPUT = 'migration-members-blocks.txt';

const text  = readFileSync(INPUT, 'utf-8');
const lines = text.split(/\r?\n/);

const hits = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('migration.members.test.ts')) {
    // 60 regels context na de match (neem ook de matchregel zelf mee)
    const block = lines.slice(i, i + 60).join('\n');
    hits.push(`---BLOCK START---\n${block}\n---BLOCK END---`);
  }
}

// Schrijf naar output
writeFileSync(OUTPUT, hits.join('\n\n'), 'utf-8');

// Log naar console
console.log(`✅ ${hits.length} blok(ken) gevonden en geschreven naar ${OUTPUT}`);
