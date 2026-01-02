
// extract-noncode-from-summary.mjs
// Doel: lees samenvatting.txt, strip alle codeblokken (fences + CODE BLOCK markers),
// en schrijf de overgebleven tekst naar samenvatting_no_code.txt.

import { readFileSync, writeFileSync } from 'node:fs';

const INPUT  = 'samenvatting.txt';
const OUTPUT = 'samenvatting_no_code.txt';

const text = readFileSync(INPUT, 'utf-8');

// 1) Verwijder blokken tussen triple backticks ```...```
//   - ondersteunt ook taal-tags (```ts, ```typescript, ```javascript, ```js, etc.)
//   - non-greedy per block
const withoutFenced = text.replace(
  /```[a-zA-Z]*[\s\S]*?```/g,  // match elke fenced code block (met/zonder taal)
  ''
);

// 2) Verwijder blokken tussen onze custom markers:
//    ---CODE BLOCK START--- ... ---CODE BLOCK END---
const withoutCustomBlocks = withoutFenced.replace(
  /---CODE BLOCK START---[\s\S]*?---CODE BLOCK END---/g,
  ''
);

// 3) (Optioneel) Heuristische verwijdering van "code-achtige" blokken zonder fences.
//    Als jouw samenvatting soms plakken code heeft zonder fences of markers,
//    kun je onderstaande regel activeren. Het verwijdert alinea's met veel ;{}=()
//    LET OP: dit kan soms té agressief zijn; zet het uit als je tekst verliest.
/*
const withoutHeuristic = withoutCustomBlocks
  .split(/\r?\n\r?\n/)  // per alinea (lege regel scheiding)
  .filter(p => !/([;{}()=]{3,}|^\s*(import|export|describe|it|test|class|type)\b)/m.test(p))
  .join('\n\n');
*/

const cleaned = withoutCustomBlocks; // of: const cleaned = withoutHeuristic;

writeFileSync(OUTPUT, cleaned, 'utf-8');

console.log(`✅ Klaar. Alles behalve code is geschreven naar: ${OUTPUT}`);
``
