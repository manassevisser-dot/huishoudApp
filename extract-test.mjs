
import { readFileSync, writeFileSync } from 'node:fs';

const INPUT = 'samenvatting.txt';
const OUTPUT = 'tests-index.txt';

const text = readFileSync(INPUT, { encoding: 'utf-8' });

// Regex zoals bij Python
const re = /([A-Za-z0-9._/\-]+\.test\.tsx|[A-Za-z0-9._/\-]+__tests__\/[^\s]+\.tsx)/g;

const matches = text.match(re) || [];
const unique = Array.from(new Set(matches.map(s => s.replace(/^['"]|['"]$/g, '')))).sort();

console.log(unique.join('\n'));
writeFileSync(OUTPUT, unique.join('\n'), { encoding: 'utf-8' });
console.log(`\n✅ ${unique.length} testbestanden geschreven naar: ${OUTPUT}`);
