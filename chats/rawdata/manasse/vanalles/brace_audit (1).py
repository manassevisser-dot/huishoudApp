# -*- coding: utf-8 -*-
"""
Brace & Parentheses Audit Script (NL)
------------------------------------
Dit script scant tekstbestanden (.txt, .md, .ts, .tsx, .js, .jsx, .json, .yaml, .yml)
voor het aantal accolades { }, haakjes ( ), en rapporteert per regel en globaal
onbalans. Het ondersteunt een 'scope' (alleen tussen start- en eindmarkers of
specifieke regelrange).

Gebruik (CLI):
    python brace_audit.py --files Bugs.txt "9 - LEO (bugfix).txt" \
        --start-marker "/* START */" --end-marker "/* END */"

Of:
    python brace_audit.py --files Bugs.txt --start-line 100 --end-line 180

Zonder CLI kun je de functie `audit_files(...)` direct aanroepen.
"""
import re
import json
from typing import List, Optional, Dict, Any, Tuple

SUPPORTED_EXT = {'.txt', '.md', '.ts', '.tsx', '.js', '.jsx', '.json', '.yaml', '.yml'}


def _index_to_line_col(text: str, index: int) -> Tuple[int, int]:
    """Converteer 1-based tekstindex naar (regel, kolom), beide 1-based."""
    i0 = index - 1
    lines = text.splitlines(True)
    cum = 0
    for ln, seg in enumerate(lines, start=1):
        if cum + len(seg) > i0:
            col = i0 - cum + 1
            return ln, col
        cum += len(seg)
    return (len(lines), max(1, len(lines[-1]) if lines else 1))


def _find_unmatched(text: str, open_ch: str, close_ch: str) -> Dict[str, List[Dict[str, Any]]]:
    """Vind ongebalanceerde tekens met een eenvoudige stack; geef posities terug."""
    stack: List[int] = []  # indices van openers (1-based)
    extra_closes: List[int] = []
    for idx, ch in enumerate(text, start=1):
        if ch == open_ch:
            stack.append(idx)
        elif ch == close_ch:
            if stack:
                stack.pop()
            else:
                extra_closes.append(idx)
    extra_opens = stack[:]  # alles wat overblijft zijn extra openers
    return {
        'extra_close': [
            {'index': i, 'line': _index_to_line_col(text, i)[0], 'col': _index_to_line_col(text, i)[1]}
            for i in extra_closes
        ],
        'extra_open': [
            {'index': i, 'line': _index_to_line_col(text, i)[0], 'col': _index_to_line_col(text, i)[1]}
            for i in extra_opens
        ],
    }


def _within_scope(line_no: int, start_line: Optional[int], end_line: Optional[int],
                  start_marker_line: Optional[int], end_marker_line: Optional[int]) -> bool:
    """Bepaal of een regel binnen de gevraagde scope valt (line-range of markers)."""
    if start_marker_line is not None and end_marker_line is not None:
        return start_marker_line <= line_no <= end_marker_line
    if start_line is not None and end_line is not None:
        return start_line <= line_no <= end_line
    return True  # geen scope opgegeven → alles meenemen


def audit_text(text: str,
               start_line: Optional[int] = None,
               end_line: Optional[int] = None,
               start_marker: Optional[str] = None,
               end_marker: Optional[str] = None) -> Dict[str, Any]:
    """Audit op een tekststring met optionele scope-limieten."""
    lines = text.splitlines()

    # Marker-lijnen bepalen (eerste voorkomen)
    start_marker_line = None
    end_marker_line = None
    if start_marker:
        for i, ln in enumerate(lines, start=1):
            if start_marker in ln:
                start_marker_line = i
                break
    if end_marker:
        for i, ln in enumerate(lines, start=1):
            if end_marker in ln:
                end_marker_line = i
                break

    scoped_text_parts: List[str] = []
    for i, ln in enumerate(lines, start=1):
        if _within_scope(i, start_line, end_line, start_marker_line, end_marker_line):
            scoped_text_parts.append(ln)
    scoped_text = "\n".join(scoped_text_parts)

    # Globale tellingen (alleen binnen scope)
    counts = {
        '{': scoped_text.count('{'),
        '}': scoped_text.count('}'),
        '(': scoped_text.count('('),
        ')': scoped_text.count(')'),
    }

    # Per regel details (binnen scope)
    line_info = []
    for i, ln in enumerate(lines, start=1):
        if not _within_scope(i, start_line, end_line, start_marker_line, end_marker_line):
            continue
        c_open = ln.count('{')
        c_close = ln.count('}')
        p_open = ln.count('(')
        p_close = ln.count(')')
        if any([c_open, c_close, p_open, p_close]):
            pos = {
                '{': [m.start()+1 for m in re.finditer(r'\{', ln)],
                '}': [m.start()+1 for m in re.finditer(r'\}', ln)],
                '(': [m.start()+1 for m in re.finditer(r'\(', ln)],
                ')': [m.start()+1 for m in re.finditer(r'\)', ln)],
            }
            line_info.append({
                'line': i,
                'text': ln,
                'counts': {'{': c_open, '}': c_close, '(': p_open, ')': p_close},
                'pos': pos,
            })

    # Onbalans detectie op scoped_text
    unmatched_curly = _find_unmatched(scoped_text, '{', '}')
    unmatched_paren = _find_unmatched(scoped_text, '(', ')')

    return {
        'scope': {
            'start_line': start_line,
            'end_line': end_line,
            'start_marker_line': start_marker_line,
            'end_marker_line': end_marker_line,
            'start_marker': start_marker,
            'end_marker': end_marker,
        },
        'counts': counts,
        'lines': line_info,
        'unmatched': {
            'curly': unmatched_curly,
            'paren': unmatched_paren,
        }
    }


def audit_files(files: List[str],
                start_line: Optional[int] = None,
                end_line: Optional[int] = None,
                start_marker: Optional[str] = None,
                end_marker: Optional[str] = None) -> Dict[str, Any]:
    """Audit meerdere bestanden; geeft een JSON-achtig rapport terug."""
    report: Dict[str, Any] = {}
    for fn in files:
        try:
            with open(fn, 'r', encoding='utf-8') as f:
                text = f.read()
            report[fn] = audit_text(text, start_line, end_line, start_marker, end_marker)
        except FileNotFoundError:
            report[fn] = {'error': 'Bestand niet gevonden'}
        except Exception as e:
            report[fn] = {'error': f'Onverwachte fout: {e}'}
    return report


# ---------- CLI ----------
if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Brace & Parentheses Audit (NL)')
    parser.add_argument('--files', nargs='+', help='Bestanden om te scannen', required=True)
    parser.add_argument('--start-line', type=int, default=None, help='Startregel (1-based)')
    parser.add_argument('--end-line', type=int, default=None, help='Eindregel (1-based)')
    parser.add_argument('--start-marker', type=str, default=None, help='Markertekst voor start')
    parser.add_argument('--end-marker', type=str, default=None, help='Markertekst voor eind')
    parser.add_argument('--json', action='store_true', help='Output als JSON')

    args = parser.parse_args()

    result = audit_files(
        files=args.files,
        start_line=args.start_line,
        end_line=args.end_line,
        start_marker=args.start_marker,
        end_marker=args.end_marker,
    )

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        # Mooie tekstoutput
        for fn, data in result.items():
            print("\n=== Rapport: {} ===".format(fn))
            if 'error' in data:
                print("Fout: {}\n".format(data['error']))
                continue
            sc = data['scope']
            if any([sc['start_line'], sc['end_line'], sc['start_marker_line'], sc['end_marker_line']]):
                print("Scope:")
                print("  Regels: {}..{}".format(sc['start_line'], sc['end_line']))
                print("  Markers: {} (lijn {}), {} (lijn {})".format(sc['start_marker'], sc['start_marker_line'], sc['end_marker'], sc['end_marker_line']))
            counts = data['counts']
            print("Tellingen:")
            print("  {{ }}: {} open / {} dicht".format(counts['{'], counts['}']))
            print("  ( ): {} open / {} dicht".format(counts['('], counts[')']))
            print("Onbalans:")
            print("  Curly extra_close: {}".format(len(data['unmatched']['curly']['extra_close'])))
            print("  Curly extra_open:  {}".format(len(data['unmatched']['curly']['extra_open'])))
            print("  Paren extra_close: {}".format(len(data['unmatched']['paren']['extra_close'])))
            print("  Paren extra_open:  {}".format(len(data['unmatched']['paren']['extra_open'])))
            print("\nRegels met haakjes/accolades (subset):")
            for line in data['lines'][:50]:  # toon max 50 regels voor leesbaarheid
                c = line['counts']
                print("  L{:>4} | {{ }}: {}/{}  ( ): {}/{}".format(line['line'], c['{'], c['}'], c['('], c[')']))
                pos = line['pos']
                if any([pos['{'], pos['}'], pos['('], pos[')']]):
                    print("       Pos {{ }}: {} / {}".format(pos['{'], pos['}']))
                    print("       Pos ( ): {} / {}".format(pos['('], pos[')']))
            if len(data['lines']) > 50:
                print("  ... ({} extra regels verborgen) ...".format(len(data['lines']) - 50))
