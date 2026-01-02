
// split-code-and-text.mjs
// Gebruik: node split-code-and-text.mjs <INPUT_BESTAND> [CODE_OUT] [TEXT_OUT]
// Output-standaard: <input_basenaam>_code.txt en <input_basenaam>_no_code.txt

import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const [,, INPUT, CODE_OUT_CLI, TEXT_OUT_CLI] = process.argv;
if (!INPUT) {
  console.error('❌ Gebruik: node split-code-and-text.mjs <INPUT> [CODE_OUT] [TEXT_OUT]');
  process.exit(1);
}

// Lees en normaliseer newlines
let raw = readFileSync(INPUT, 'utf-8').replace(/\r\n/g, '\n');

// NB: Sommige exports bevatten richtext/json-headers. Als jouw bestand
// zulke headers heeft (bijv. {"type":"richtext"}), kun je die eerst afstrippen.
// Dit is optioneel; standaard laten we alles staan en herkennen we code-blokken.
const base = basename(INPUT).replace(/\.[^.]+$/, '');
const CODE_OUT = CODE_OUT_CLI || `${base}_code.txt`;
const TEXT_OUT = TEXT_OUT_CLI || `${base}_no_code.txt`;

// Helpers
const isFenceOpen = (line) => /^```/.test(line.trim());
const isFenceClose = (line) => /^```/.test(line.trim());

const isCustomStart = (line) => /---CODE BLOCK START---/i.test(line);
const isCustomEnd   = (line) => /---CODE BLOCK END---/i.test(line);

// “Taal-kopjes” zoals "TypeScript", "JavaScript", "TS", "JS" (case-insensitive)
// gevolgd door een lege regel of direct code-achtige regel.
const isLangHeader = (line) => /^(typescript|javascript|ts|js)\s*$/i.test(line.trim());

// Een regel “oogt” als code?
const looksLikeCodeLine = (line) => {
  const t = line.trim();
  if (!t) return false;
  // begint met typische code-sleutelwoorden:
  if (/^(import|export|class|interface|type|enum|const|let|var|function|describe|it|test|module\.exports)/.test(t)) return true;
  // bevat veel code-tekens:
  if (/[;{}()[\]=<>]/.test(t) && /[A-Za-z0-9]/.test(t)) return true;
  // lijkt op TSX/JSX:
  if (/^<\/?[A-Z][A-Za-z0-9]*/.test(t)) return true;
  // contextregels uit testlogs/code voorbeelden:
  if (/^\s*\/\/|\s*\/\*/.test(t)) return true; // comments
  return false;
};

// We lopen regel-voor-regel (state-machine)
const lines = raw.split('\n');

let inFence = false;
let inCustom = false;
let inLangBlock = false;    // na "TypeScript"/"JavaScript"-header
let pendingLangStart = false; // één regel na header alvast controleren

const codeChunks = [];
const textChunks = [];

let currentCode = [];
let currentText = [];

const flushCode = () => {
  if (currentCode.length) {
    codeChunks.push(currentCode.join('\n'));
    currentCode = [];
  }
};
const flushText = () => {
  if (currentText.length) {
    textChunks.push(currentText.join('\n'));
    currentText = [];
  }
};

// Houd een venster bij om “onbeveiligde” code-blokken op te pakken:
// Als we meerdere aaneengesloten “code-achtige” regels zien, groeperen we ze.
let inHeuristic = false;
let heuristicStreak = 0;
const HEURISTIC_THRESHOLD = 2; // vanaf 2 aaneengesloten code-achtige regels gaan we 'code-modus' in

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // 1) Custom markers
  if (!inFence && isCustomStart(line)) {
    // we flushen lopende text
    flushText();
    inCustom = true;
    currentCode.push(line);
    continue;
  }
  if (inCustom) {
    currentCode.push(line);
    if (isCustomEnd(line)) {
      inCustom = false;
      flushCode();
    }
    continue;
  }

  // 2) Fenced ``` blocks
  if (isFenceOpen(line) && !inFence) {
    flushText();
    inFence = true;
    currentCode.push(line);
    continue;
  }
  if (inFence) {
    currentCode.push(line);
    if (isFenceClose(line)) {
      inFence = false;
      flushCode();
    }
    continue;
  }

  // 3) Language headers (“TypeScript”, “JavaScript”, …)
  if (isLangHeader(line)) {
    // header zelf bij de tekst houden (desgewenst kun je hem naar code verplaatsen)
    currentText.push(line);
    pendingLangStart = true; // volgende regels mogelijk code
    inLangBlock = false;     // nog niet actief
    // kijk verder
    continue;
  }
  if (pendingLangStart) {
    // als de eerstvolgende regel of block “code-achtig” is, starten we een lang-block
    if (looksLikeCodeLine(line)) {
      // zet lopende tekst weg en open codeblok
      flushText();
      inLangBlock = true;
      currentCode.push(line);
    } else {
      // geen code: zet regel bij tekst (header + tekst)
      currentText.push(line);
    }
    // pending handled
    pendingLangStart = false;
    continue;
  }
  if (inLangBlock) {
    // eindig lang-block op “paragraaf-einde” (lege regel) of een duidelijke niet-code regel
    if (!line.trim()) {
      // lege regel sluit blok af
      currentCode.push(line);
      flushCode();
      inLangBlock = false;
    } else if (!looksLikeCodeLine(line)) {
      // een niet-code regel beëindigt de lang-block
      flushCode();
      inLangBlock = false;
      // en regel hoort bij tekst
      currentText.push(line);
    } else {
      // nog steeds code
      currentCode.push(line);
    }
    continue;
  }

  // 4) Heuristische code-detectie voor “losse” code zonder fences/markers
  if (looksLikeCodeLine(line)) {
    heuristicStreak += 1;
    if (!inHeuristic && heuristicStreak >= HEURISTIC_THRESHOLD) {
      // net de drempel gehaald → sluit tekst en start code
      flushText();
      inHeuristic = true;
      // voeg de vorige (drempel-1) regels alsnog toe aan code:
      // we schatten terug-reconstructie niet; simpel: ga nu verder.
    }
  } else {
    heuristicStreak = 0;
    if (inHeuristic) {
      // einde van heuristisch codeblok
      flushCode();
      inHeuristic = false;
    }
  }

  // Schrijf weg volgens huidige modus
  if (inHeuristic) {
    currentCode.push(line);
  } else {
    currentText.push(line);
  }
}

// einde bestand: flush buffers
if (inHeuristic || inLangBlock || inFence || inCustom) {
  // als iemand vergeten is af te sluiten, schrijf wat we hebben
  flushCode();
}
flushText();

// Samenstellen en kleine opschoning
const codeOut = codeChunks.filter(Boolean).join('\n\n').replace(/\n{3,}/g, '\n\n');
const textOut = textChunks.filter(Boolean).join('\n\n').replace(/\n{3,}/g, '\n\n');

writeFileSync(CODE_OUT, codeOut, 'utf-8');
writeFileSync(TEXT_OUT, textOut, 'utf-8');

const codeLines = codeOut ? codeOut.split('\n').length : 0;
const textLines = textOut ? textOut.split('\n').length : 0;

console.log(`✅ Klaar. Code: ${codeLines} regels → ${CODE_OUT}`);
console.log(`✅ Klaar. Tekst: ${textLines} regels → ${TEXT_OUT}`);
