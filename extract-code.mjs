
// extract-code.mjs
// Gebruik: node extract-code.mjs <INPUT_PAD> [OUTPUT_PAD]
// Voorbeeld: node extract-code.mjs samenvatting_no_code.txt code_out.txt
//            node extract-code.mjs ./reports/mijnlog.txt
// Als OUTPUT_PAD ontbreekt, schrijven we naar "<INPUT_BASIS>_code.txt"

import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const [,, INPUT, OUTPUT_CLI] = process.argv;

if (!INPUT) {
  console.error('❌ Gebruik: node extract-code.mjs <INPUT_PAD> [OUTPUT_PAD]');
  process.exit(1);
}

const INPUT_TEXT = readFileSync(INPUT, 'utf-8');
const defaultOut = basename(INPUT).replace(/\.[^.]+$/, '') + '_code.txt';
const OUTPUT = OUTPUT_CLI || defaultOut;

// 1) Fenced code blocks (```<taal>? ... ```)
const fenced = [...INPUT_TEXT.matchAll(/```[a-zA-Z]*[\s\S]*?```/g)].map(m => m[0]);

// 2) Custom code blocks (---CODE BLOCK START--- ... ---CODE BLOCK END---)
const custom = [...INPUT_TEXT.matchAll(/---CODE BLOCK START---[\s\S]*?---CODE BLOCK END---/g)].map(m => m[0]);

// (Optioneel) heuristische vangnet voor “code-achtige” alinea’s ZONDER fences/markers.
// Zet aan als je weet dat er veel on‑gefenste code in je bron staat (kan agressief zijn).
// function looksLikeCode(p) {
//   return /(^\s*(import|export|class|interface|type|describe|it|test|module\.exports)\b)|([;{}()=]{3,})/m.test(p);
// }
// const heuristic = INPUT_TEXT.split(/\r?\n\r?\n/).filter(looksLikeCode);

// Combineer gevonden blokken (volgorde is hier niet kritisch voor export)
const allBlocks = [...fenced, ...custom /*, ...heuristic*/];

writeFileSync(OUTPUT, allBlocks.join('\n\n'), 'utf-8');
console.log(`✅ Code-extractie: ${allBlocks.length} blok(ken) → ${OUTPUT}`);
