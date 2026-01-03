
// collect-test-titles-from-summary.mjs
// Node 18+ / 20+
// Doel: haal uit samenvatting.txt alle beschrijvingen ('describe', 'it', 'test', incl. .each)
// Markeer dynamische titels met ${...} en schrijf compacte Markdown met klikbare links (pad + regel).

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ====== CONFIG (optioneel aanpassen) ======

// Als je op GitHub host, zet hier je BASE_URL + branch, dan maken we echte GitHub links met #L<line>
// bv: https://github.com/<org>/<repo>/blob/main/
const BASE_URL = ''; // laat leeg als je (nog) geen GitHub-URL wilt

// Als je lokaal in VS Code wil klikken: zet je repo-root absolute pad hier
// dan maken we vscode://file/<REPO_ROOT>/<path>:<line> links.
// Voorbeeld (macOS): '/Users/manasse/projects/pre7'
const REPO_ROOT = ''; // laat leeg als je VS Code linking niet nodig hebt

const SUMMARY_FILE = 'samenvatting.txt';
const MD_OUT       = 'test-title-index.md';
const JSON_OUT     = 'test-title-index.json';

// ====== Helpers ======

function loadSummary() {
  try {
    const full = resolve(SUMMARY_FILE);
    return readFileSync(full, 'utf-8');
  } catch (e) {
    console.error(`❌ Kan ${SUMMARY_FILE} niet lezen: ${e.message}`);
    process.exit(1);
  }
}

// Vind alle padvermeldingen naar *.test.tsx in de samenvatting (PASS/FAIL regels, stacktrace, losse paden)
function indexFileMentions(lines) {
  const mentions = [];
  const rePassFail = /^(PASS|FAIL)\s+([A-Za-z0-9._/\-]+\.test\.tsx)\b/;
  const reStack    = /\(([^()]+\.test\.tsx):(\d+):(\d+)\)/;
  const reBare     = /\b([A-Za-z0-9._/\-]+\.test\.tsx)\b/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    let m = line.match(rePassFail);
    if (m) {
      mentions.push({ index: i, path: m[2], status: m[1] });
      continue;
    }
    m = line.match(reStack);
    if (m) {
      mentions.push({ index: i, path: m[1], line: Number(m[2]), col: Number(m[3]) });
      continue;
    }
    // losse padvermelding (bv. een regel die een bestand toont)
    m = line.match(reBare);
    if (m) {
      mentions.push({ index: i, path: m[1] });
    }
  }
  return mentions;
}

// Klikbare link maken
function mkLink(path, line) {
  if (BASE_URL && line) {
    // GitHub-style link naar specifieke regel
    return `${BASE_URL}${path}#L${line}`;
  }
  if (REPO_ROOT && line) {
    // VS Code deep link
    const abs = `${REPO_ROOT}/${path}`.replace(/\/+/g, '/');
    return `vscode://file/${abs}:${line}`;
  }
  // Fallback: relative path (niet altijd klikbaar in alle viewers)
  return path;
}

// Titel‑extractie uit samenvatting (niet uit echte files)
// We scannen de hele tekst en bij elke match zoeken we het dichtstbijzijnde pad + regelnummer in de buurt.
function extractTitlesFromSummary(text, lines, mentions) {
  const results = []; // { file, status?, title, kind, isDynamic, sumLine?, fileLine? }

  // Regex voor aanroepen: describe(...) / it(...) / test(...) inclusief .each([...])(
  const reQuoted = /\b(describe|it|test)\s*(?:\.each\s*\([\s\S]*?\)\s*)?\(\s*(['"])([\s\S]*?)\2\s*,/gim;
  const reBack   = /\b(describe|it|test)\s*(?:\.each\s*\([\s\S]*?\)\s*)?\(\s*`([\s\S]*?)`\s*,/gim;

  // Voor 'line-of-index' binnen samenvatting
  const sumLineOfIndex = (idx) => {
    // tel \n tot idx
    let line = 1;
    for (let i = 0; i < idx && i < text.length; i++) {
      if (text.charCodeAt(i) === 10) line++;
    }
    return line;
  };

  const collect = (match, isBacktick) => {
    const kindRaw = match[1].toLowerCase();
    const kind = kindRaw; // 'describe' | 'it' | 'test'
    const rawTitle = isBacktick ? match[2] : match[3];
    const title    = rawTitle.replace(/\s+/g, ' ').trim();
    const isDynamic = /\$\{[^}]+\}/.test(rawTitle);

    const startIdx = match.index ?? 0;
    const sumLine  = sumLineOfIndex(startIdx);

    // Zoek dichtstbijzijnde padvermelding rondom deze match (± 50 regels)
    const window = 50;
    const nearest = findNearestMention(sumLine, lines, mentions, window);

    results.push({
      file: nearest?.path,
      status: nearest?.status,
      title,
      kind,
      isDynamic,
      sumLine,
      fileLine: nearest?.line, // regelnummer uit stacktrace als beschikbaar
    });
  };

  // Doorloop alle matches
  let m;
  while ((m = reQuoted.exec(text)) !== null) collect(m, false);
  while ((m = reBack.exec(text)) !== null)   collect(m, true);

  // groepeer op file
  return groupByFile(results);
}

// Vind de dichtstbijzijnde path‑vermelding rondom een samenvattingsregel
function findNearestMention(sumLine, lines, mentions, window = 50) {
  // bouw mapping: summary line index -> mention
  // mentions.index is array index in lines
  let best;
  let bestDist = Infinity;

  for (const m of mentions) {
    const mLine = m.index + 1; // lines[] is 0-based, we willen 1-based lijn
    const dist = Math.abs(mLine - sumLine);
    if (dist <= window && dist < bestDist) {
      best = m;
      bestDist = dist;
    }
  }
  return best;
}

function groupByFile(items) {
  const map = new Map(); // path -> { status?, titles: [...] }
  for (const it of items) {
    const key = it.file || '(onbekend-bestand)';
    const cur = map.get(key) || { status: it.status, titles: [] };
    // status updaten als nog niet bekend
    if (!cur.status && it.status) cur.status = it.status;
    cur.titles.push({
      kind: it.kind,
      title: it.isDynamic ? `⚠️ (dynamic) ${it.title}` : it.title,
      sumLine: it.sumLine,
      fileLine: it.fileLine,
      link: mkLink(key, it.fileLine),
    });
    map.set(key, cur);
  }
  // naar array
  return Array.from(map.entries()).map(([file, payload]) => ({ file, ...payload }));
}

// Markdown opbouwen (compact)
function buildMarkdownReport(groups) {
  const out = [];
  out.push('# Test Title Index (samenvatting.txt)');
  out.push('');
  out.push('Dit document is automatisch uit **samenvatting.txt** gegenereerd. Het toont alle `describe` en `it/test`-titels (incl. `.each`) per bestand, met markering voor dynamische titels.');
  out.push('');

  for (const g of groups) {
    out.push(`## \`${g.file}\`${g.status ? ` — **${g.status}**` : ''}`);
    if (!g.titles?.length) {
      out.push('- ℹ️ Geen titels gevonden.');
      out.push('');
      continue;
    }
    const descs = g.titles.filter(t => t.kind === 'describe');
    const its   = g.titles.filter(t => t.kind !== 'describe');

    if (descs.length) {
      out.push('**Describe**');
      for (const d of descs) {
        const where = d.fileLine ? `L${d.fileLine}` : `sumL${d.sumLine}`;
        out.push(`- ${where} ${d.title}`);
      }
      out.push('');
    }
    if (its.length) {
      out.push('**It/Test**');
      for (const t of its) {
        const where = t.fileLine ? `L${t.fileLine}` : `sumL${t.sumLine}`;
        out.push(`- ${where} ${t.title}`);
      }
      out.push('');
    }
  }

  return out.join('\n');
}

// ====== MAIN ======
const text  = loadSummary();
const lines = text.split(/\r?\n/);
const mentions = indexFileMentions(lines);
const groups   = extractTitlesFromSummary(text, lines, mentions);

// Schrijf outputs
const md = buildMarkdownReport(groups);
writeFileSync(MD_OUT, md, 'utf-8');
writeFileSync(JSON_OUT, JSON.stringify(groups, null, 2), 'utf-8');

console.log(`✅ Klaar. Rapporten geschreven naar:\n- ${MD_OUT}\n- ${JSON_OUT}`);
console.log(`🔎 Gevonden bestanden: ${groups.length}`);
