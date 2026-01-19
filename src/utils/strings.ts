/**
 * strings.ts
 * cleanName:
 * - verwijdert emoji/rare tekens (ASCII behoud)
 * - normaliseert whitespace (meerdere spaties -> 1)
 * - trimt begin/einde
 * - limiteert lengte (default 25)
 */
export function cleanName(input: string | undefined | null, max: number = 25): string {
  const raw = typeof input === 'string' ? input : '';

  // Filter: behoud alleen letters, cijfers en standaard leestekens (geen emoji)
  const noEmoji = raw.replace(/[^\x20-\x7E\u00C0-\u00FF]/g, '');

  // Limiteer lengte en schoon whitespace op
  return noEmoji.slice(0, max).replace(/\s+/g, ' ').trim();
}
