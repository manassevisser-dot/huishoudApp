// src/utils/strings.ts
import { stripEmojiAndLimit } from './numbers';

/**
 * cleanName:
 * - verwijdert emoji/rare tekens via stripEmojiAndLimit
 * - normaliseert whitespace (meerdere spaties -> 1)
 * - trimt begin/einde
 * - limiteert lengte (default 25)
 * UI mag ruwe input sturen; de reducer/actie gebruikt deze helper om canoniek op te slaan.
 */
export function cleanName(input: string | undefined | null, max: number = 25): string {
  const raw = typeof input === 'string' ? input : '';
  const noEmoji = stripEmojiAndLimit(raw, max);
  return noEmoji.replace(/\s+/g, ' ').trim();
}
