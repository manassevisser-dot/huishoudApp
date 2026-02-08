#!/usr/bin/env node
/**
 * Extracts TypeScript (.ts/.tsx) code blocks from chat MD/TXT/JSON files.
 * Writes them into toDownload/<source>_blocks.ts by APPENDING chunks.
 * Each chunk gets a header containing:
 *   - original chat filename
 *   - block index
 *   - timestamp
 *
 * Zero dependencies — works inside Firebase web terminal.
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node extract-ts-code.mjs <file...>");
  process.exit(1);
}

const OUTPUT_DIR = "toDownload";

// ensure output folder exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/* ---------------------------------------------------------
   Helpers
--------------------------------------------------------- */

function looksLikeTs(code) {
  return (
    /^(import|export)\s/m.test(code) ||
    /\binterface\s+\w+/.test(code) ||
    /\btype\s+\w+/.test(code) ||
    /\bclass\s+\w+/.test(code) ||
    /\.tsx?/.test(code) ||
    /React\./.test(code) ||
    /<[\w]+(?:\s|>)/.test(code)
  );
}

function guessLangFromFence(info, code) {
  const lower = (info || "").toLowerCase().trim();
  if (["ts", "tsx", "typescript"].includes(lower)) return lower;
  return looksLikeTs(code) ? "ts" : "";
}

/* ---------------------------------------------------------
   Markdown Extractor
--------------------------------------------------------- */

function* extractFromMarkdown(text, sourceFile) {
  const lines = text.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced block
    const fenceStart = line.match(/^```([\w.+-]*)\s*$/);
    if (fenceStart) {
      const langInfo = fenceStart[1] || "";
      i++;
      const buf = [];
      while (i < lines.length && !/^```$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      const code = buf.join("\n");
      if (i < lines.length) i++;

      const lang = guessLangFromFence(langInfo, code);
      if (lang === "ts" || lang === "tsx") {
        yield { code, lang, sourceFile };
      }
      continue;
    }

    // Indented code
    if (/^( {4}|\t)/.test(line)) {
      const buf = [line.replace(/^( {4}|\t)/, "")];
      i++;
      while (i < lines.length && /^( {4}|\t)/.test(lines[i])) {
        buf.push(lines[i].replace(/^( {4}|\t)/, ""));
        i++;
      }
      const code = buf.join("\n");
      if (looksLikeTs(code)) {
        yield { code, lang: "ts", sourceFile };
      }
      continue;
    }

    i++;
  }
}

/* ---------------------------------------------------------
   JSON Extractor
--------------------------------------------------------- */

function* extractFromJson(text, sourceFile) {
  function tryJson(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  const root = tryJson(text);

  function* walk(node) {
    if (typeof node === "string") {
      yield* extractFromMarkdown(node, sourceFile);
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) yield* walk(item);
      return;
    }
    if (node && typeof node === "object") {
      for (const v of Object.values(node)) yield* walk(v);
    }
  }

  if (root !== null) {
    yield* walk(root);
  } else {
    // JSONL fallback
    for (const line of text.split(/\n/)) {
      const o = tryJson(line);
      if (!o) continue;
      yield* walk(o);
    }
  }
}

/* ---------------------------------------------------------
   Dispatcher
--------------------------------------------------------- */

function* extract(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const ext = path.extname(filePath).toLowerCase();

  if ([".md", ".markdown", ".txt"].includes(ext)) {
    yield* extractFromMarkdown(raw, filePath);
  } else if (ext === ".json" || ext === ".jsonl") {
    yield* extractFromJson(raw, filePath);
  } else {
    yield* extractFromMarkdown(raw, filePath);
  }
}

/* ---------------------------------------------------------
   MAIN — APPEND TO ONE FILE PER CHAT
--------------------------------------------------------- */

let globalCounter = 0;

for (const filePath of args) {
  const base = path.basename(filePath).replace(/\.[^.]+$/, "");
  const targetFile = path.join(OUTPUT_DIR, `${base}.ts`);

  for (const block of extract(filePath)) {
    globalCounter++;

    const timestamp = new Date().toISOString();

    const header =
      `\n\n` +
      `// ==========================================================\n` +
      `// Extracted from: ${path.basename(block.sourceFile)}\n` +
      `// Block #:       ${globalCounter}\n` +
      `// Timestamp:     ${timestamp}\n` +
      `// ==========================================================\n`;

    fs.appendFileSync(targetFile, header + block.code.trim() + "\n", "utf8");

    console.log(`✔︎ Appended block #${globalCounter} → ${targetFile}`);
  }
}

console.log(`---`);
console.log(`Done. Appended ${globalCounter} TS/TSX blocks into toDownload/.`);