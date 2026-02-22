/**
 * @file_intent Biedt een robuuste utility-functie, `cleanName`, voor het opschonen en normaliseren van strings. De functie is specifiek ontworpen om user-generated content, zoals namen, te sanitizen door ongewenste tekens (zoals emoji's) te verwijderen, de lengte te limiteren en witruimte consistent te maken.
 * @repo_architecture Utils Layer - String Manipulation. Dit is een op zichzelf staande, pure functie zonder afhankelijkheden van andere applicatielagen. Het is een generieke utility die overal kan worden ingezet waar betrouwbare string-formattering vereist is.
 * @term_definition
 *   - `Sanitization`: Het proces van het "opschonen" van een input-string door ongewenste of potentieel problematische karakters te verwijderen.
 *   - `Normalization`: Het proces van het omzetten van een string naar een standaard, canonieke vorm. In dit geval verwijst het specifiek naar het consolideren van meerdere witruimte-tekens naar één enkele spatie.
 *   - `Character Filtering`: De techniek die wordt gebruikt om karakters te verwijderen. `cleanName` gebruikt een regular expression om alleen een specifieke set van ASCII en Latijnse karakters toe te staan, waardoor de rest wordt gefilterd.
 * @contract De `cleanName` functie accepteert een `string | undefined | null` als eerste argument en een optionele `max` (getal, standaard 25) als tweede. De functie retourneert altijd een `string`. Het proces is als volgt: 1. Input die geen string is, wordt als een lege string behandeld. 2. Alle karakters die niet binnen de ASCII- en Latin-1 Supplement-range vallen, worden verwijderd. 3. De string wordt ingekort tot de `max` lengte. 4. Opeenvolgende witruimte-tekens worden vervangen door één spatie. 5. De resulterende string wordt getrimd (witruimte aan begin/eind verwijderd).
 * @ai_instruction Gebruik de `cleanName` functie wanneer je door gebruikers ingevoerde tekst (zoals een naam, titel of korte beschrijving) moet weergeven en je zeker wilt zijn van een nette, consistente opmaak zonder onverwachte tekens. Bijvoorbeeld: `const displayName = cleanName(user.inputName, 30);`. Dit is een formattering- en sanitizing-tool, niet bedoeld als primaire bescherming tegen security-aanvallen zoals XSS.
 */
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
