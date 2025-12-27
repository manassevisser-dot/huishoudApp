# -*- coding: utf-8 -*-
"""
Brace, Parentheses & Semicolon Audit (NL)
----------------------------------------
- Telt globale { }, ( ), en ;
- Detecteert onbalans voor { } en ( ) via stack
- (Nieuw) Semicolon-analyse:
    * Telt werkelijk aantal ';'
    * Schat verwacht aantal ';' o.b.v. heuristieken voor JS/TS/TSX met semi-required style
      (LET OP: dit is een *schatting*; ASI kan semicolons overbodig maken)

CLI voorbeelden:
    # Snelle run (compacte samenvatting)
    python brace_audit.py --files src/screens/Wizard/WizardController.tsx --mode quick

    # Uitgebreide run (incl. per-regel subset + semicolon-diff)
    python brace_audit.py --files src/screens/Wizard/WizardController.tsx --mode full

Scope opties (werken in beide modes):
    --start-line N --end-line M
    --start-marker "/* START */" --end-marker "/* END */"
"""
import re
import json
from typing import List, Optional, Dict, Any, Tuple

SUPPORTED_EXT = {'.txt', '.md', '.ts', '.tsx', '.js', '.jsx', '.json', '.yaml', '.yml'}


def _index_to_line_col(text: str, index: int) -> Tuple[int, int]:
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
    stack: List[int] = []
    extra_closes: List[int] = []
    for idx, ch in enumerate(text, start=1):
        if ch == open_ch:
            stack.append(idx)
        elif ch == close_ch:
            if stack:
                stack.pop()
            else:
                extra_closes.append(idx)
    extra_opens = stack[:]
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
    if start_marker_line is not None and end_marker_line is not None:
        return start_marker_line <= line_no <= end_marker_line
    if start_line is not None and end_line is not None:
        return start_line <= line_no <= end_line
    return True


def _find_marker_lines(lines: List[str], start_marker: Optional[str], end_marker: Optional[str]) -> Tuple[Optional[int], Optional[int]]:
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
    return start_marker_line, end_marker_line


def _scoped_text(lines: List[str], start_line, end_line, start_marker_line, end_marker_line) -> Tuple[str, List[int]]:
    scoped_lines = []
    original_line_numbers = []
    for i, ln in enumerate(lines, start=1):
        if _within_scope(i, start_line, end_line, start_marker_line, end_marker_line):
            scoped_lines.append(ln)
            original_line_numbers.append(i)
    return "\n".join(scoped_lines), original_line_numbers


def _semicolon_expected_heuristic(lines: List[str]) -> int:
    """Schat expected semicolons in semi-required style.
    Heuristieken (ruw, maar praktisch):
      - Tel regels die er uitzien als statements die eindigen met een literal, ident, ) of ] of } en niet eindigen met , : ? && || + - * / = => ...
      - Negeer lege regels, pure commentregels en regels die duidelijk een block openen '({' of sluiten '})' zonder code ervoor.
      - Negeer control-flow en blok-definities (if/for/while/try/catch/function/class) tenzij er code vóór de '{' staat.
    NB: Dit blijft een schatting; ASI/stijlverschillen kunnen afwijken.
    """
    expected = 0
    stmt_end_re = re.compile(r"[\w\]\)\}'\"`\d]\s*(//.*)?$")  # eindigt op woord/]/)/}/quote/number
    bad_trail_re = re.compile(r"[,:?+\-*/%=&|^><]$|=>\s*$")       # trailing operator/colon/comma/arrow
    open_block_kw = re.compile(r"^\s*(if|for|while|switch|try|catch|finally|with)\b")
    func_class_kw = re.compile(r"^\s*(function|class|interface|type)\b")
    import_export_kw = re.compile(r"^\s*(import|export)\b")
    only_comment_re = re.compile(r"^\s*(//|/\*|\*/).*$")

    for raw in lines:
        ln = raw.rstrip()
        if not ln:
            continue
        if only_comment_re.match(ln):
            continue
        # Als de regel al een ';' bevat (eind of midden), tel die niet als expected (die is al 'werkelijk').
        # We willen expected onafhankelijk van werkelijk houden → toch schatten per regel.
        # Maar: regels die al met ';' eindigen zijn duidelijk statements.
        if ln.strip().endswith(';'):
            expected += 1
            continue
        # Negeer block-openers zonder voorafgaande code
        if open_block_kw.match(ln) and ln.strip().endswith('{'):
            continue
        if func_class_kw.match(ln) and ln.strip().endswith('{'):
            continue
        if import_export_kw.match(ln):
            # import/export statements eindigen vaak met semicolon
            if stmt_end_re.search(ln) and not bad_trail_re.search(ln):
                expected += 1
            continue
        # Regels die logisch een statement afsluiten
        if stmt_end_re.search(ln) and not bad_trail_re.search(ln):
            expected += 1
    return expected


def audit_text(text: str,
               start_line: Optional[int] = None,
               end_line: Optional[int] = None,
               start_marker: Optional[str] = None,
               end_marker: Optional[str] = None) -> Dict[str, Any]:
    lines = text.splitlines()
    start_marker_line, end_marker_line = _find_marker_lines(lines, start_marker, end_marker)
    scoped_text, original_line_numbers = _scoped_text(lines, start_line, end_line, start_marker_line, end_marker_line)

    counts = {
        '{': scoped_text.count('{'),
        '}': scoped_text.count('}'),
        '(': scoped_text.count('('),
        ')': scoped_text.count(')'),
        ';': scoped_text.count(';'),
    }

    # Per regel info (subset in full mode)
    line_info = []
    for i, ln in enumerate(lines, start=1):
        if not _within_scope(i, start_line, end_line, start_marker_line, end_marker_line):
            continue
        c_open = ln.count('{')
        c_close = ln.count('}')
        p_open = ln.count('(')
        p_close = ln.count(')')
        semi = ln.count(';')
        if any([c_open, c_close, p_open, p_close, semi]):
            pos = {
                '{': [m.start()+1 for m in re.finditer(r'\{', ln)],
                '}': [m.start()+1 for m in re.finditer(r'\}', ln)],
                '(': [m.start()+1 for m in re.finditer(r'\(', ln)],
                ')': [m.start()+1 for m in re.finditer(r'\)', ln)],
                ';': [m.start()+1 for m in re.finditer(r';', ln)],
            }
            line_info.append({
                'line': i,
                'text': ln,
                'counts': {'{': c_open, '}': c_close, '(': p_open, ')': p_close, ';': semi},
                'pos': pos,
            })

    # Onbalans
    unmatched_curly = _find_unmatched(scoped_text, '{', '}')
    unmatched_paren = _find_unmatched(scoped_text, '(', ')')

    # Semicolon expected (heuristic)
    expected_semis = _semicolon_expected_heuristic(scoped_text.split('\n'))

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
        },
        'semicolons': {
            'actual': counts[';'],
            'expected_estimate': expected_semis,
            'delta': counts[';'] - expected_semis
        }
    }


def audit_files(files: List[str],
                start_line: Optional[int] = None,
                end_line: Optional[int] = None,
                start_marker: Optional[str] = None,
                end_marker: Optional[str] = None) -> Dict[str, Any]:
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
    parser = argparse.ArgumentParser(description='Brace, Paren & Semicolon Audit (NL)')
    parser.add_argument('--files', nargs='+', help='Bestanden om te scannen', required=True)
    parser.add_argument('--start-line', type=int, default=None, help='Startregel (1-based)')
    parser.add_argument('--end-line', type=int, default=None, help='Eindregel (1-based)')
    parser.add_argument('--start-marker', type=str, default=None, help='Markertekst voor start')
    parser.add_argument('--end-marker', type=str, default=None, help='Markertekst voor eind')
    parser.add_argument('--json', action='store_true', help='Output als JSON')
    parser.add_argument('--mode', choices=['quick', 'full'], default='quick', help='Snelle samenvatting of uitgebreide output')

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
            print("  ;  : {} gevonden".format(counts[';']))

            print("Onbalans:")
            print("  Curly extra_close: {}".format(len(data['unmatched']['curly']['extra_close'])))
            print("  Curly extra_open:  {}".format(len(data['unmatched']['curly']['extra_open'])))
            print("  Paren extra_close: {}".format(len(data['unmatched']['paren']['extra_close'])))
            print("  Paren extra_open:  {}".format(len(data['unmatched']['paren']['extra_open'])))

            semi = data['semicolons']
            print("Puntkomma's:")
            print("  Werkelijk: {}".format(semi['actual']))
            print("  Verwacht (schatting): {}".format(semi['expected_estimate']))
            print("  Delta (werkelijk - verwacht): {}".format(semi['delta']))

            if args.mode == 'full':
                print("\nRegels met haakjes/accolades/puntkomma's (subset):")
                for line in data['lines'][:50]:
                    c = line['counts']
                    print("  L{:>4} | {{ }}: {}/{}  ( ): {}/{}  ;: {}".format(line['line'], c['{'], c['}'], c['('], c[')'], c[';']))
                    pos = line['pos']
                    if any([pos['{'], pos['}'], pos['('], pos[')'], pos[';']]):
                        print("       Pos {{ }}: {} / {}".format(pos['{'], pos['}']))
                        print("       Pos ( ): {} / {}".format(pos['('], pos[')']))
                        print("       Pos ;  : {}".format(pos[';']))
                if len(data['lines']) > 50:
                    print("  ... ({} extra regels verborgen) ...".format(len(data['lines']) - 50))
