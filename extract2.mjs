
// extract-migration-members-code.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const INPUT  = 'samenvatting.txt';
const OUTPUT = 'migration-members-code.txt';

const text  = readFileSync(INPUT, 'utf-8');
const lines = text.split(/\r?\n/);

function looksLikeCode(line) {
  return /^[ \t]*(import|export|describe|it|test|\{|\}|\/\/|\/\*|\)|\(|const|let|type|class)/.test(line)
      || /[;{}()=]/.test(line);
}

const codeSnippets = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('migration.members.test.ts')) {
    const blockLines = lines.slice(i + 1, i + 60); // alleen de regels eronder
    const codeOnly   = blockLines.filter(looksLikeCode);
    if (codeOnly.length) {
      codeSnippets.push([
        '---CODE BLOCK START---',
        ...codeOnly,
        '---CODE BLOCK END---',
      ].join('\n'));
    }
  }
}

writeFileSync(OUTPUT, codeSnippets.join('\n\n'), 'utf-8');
console.log(`✅ ${codeSnippets.length} codeblok(ken) geschreven naar ${OUTPUT}`);
