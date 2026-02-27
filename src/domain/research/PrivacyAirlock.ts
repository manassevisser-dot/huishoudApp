/**
 * @file_intent [WIP] Definieert een "Privacy Airlock". Dit is een cruciale, beveiligingsgerichte component die als een strikte barrière fungeert tussen ruwe, potentieel privacy-gevoelige gebruikersdata en een geanonimiseerde dataset bedoeld voor onderzoek.
 * @repo_architecture Domain Layer - Research (Work-In-Progress).
 * @term_definition
 *   - `Privacy Airlock`: Een softwarecomponent die data-stromen controleert om te voorkomen dat Persoonlijk Identificeerbare Informatie (PII) lekt naar systemen waar het niet thuishoort.
 *   - `PII (Personally Identifiable Information)`: Gegevens die direct of indirect naar een individu kunnen leiden, zoals naam, e-mailadres, etc.
 *   - `Anonimisering`: Het proces van het onomkeerbaar verwijderen of transformeren van PII uit een dataset.
 *   - `Data Assertion`: Een defensieve programmeertechniek (`assertNoPIILeak`) die de integriteit en veiligheid van data garandeert door een programma te stoppen als aan een kritieke voorwaarde (bv. "mag geen PII bevatten") niet wordt voldaan.
 * @contract Dit bestand exporteert de `collectAndDistributeData` functie. Deze functie accepteert ruwe UI-data en retourneert twee objecten: `localMember` (voor intern gebruik, bevat nog PII) en `researchPayload` (volledig geanonimiseerd). De interne `assertNoPIILeak` functie garandeert contractueel dat het `researchPayload` object geen PII bevat voordat het wordt geretourneerd.
 * @ai_instruction Dit bestand is kritiek voor de beveiliging. Gebruik `collectAndDistributeData` als het *enige* toegangspunt om onderzoeksdata te genereren. Het `researchPayload` object is het enige dat veilig kan worden verzonden naar externe endpoints. Het `localMember` object mag *nooit* de applicatie verlaten. De PII-detectie en -assertions (`containsPII`, `assertNoPIILeak`) zijn de kern van de beveiliging; wijzig deze niet zonder een grondige security-review. Aangezien dit een WIP-bestand is, zijn extra validatie en testen vereist voor productiegebruik.
 */

//src/domain/research/PrivacyAirlock.WIP.ts

import { ResearchValidator } from '@adapters/validation/ResearchContractAdapter';
import { ResearchMember, MemberType, RawUIData, AnonymizedResearchPayload } from '@core/types/research';

const RESEARCH_ID_LENGTH = 12;

/**
 * Helper interface om 'a_ny' casts te vermijden bij legacy velden uit de UI.
 * Inherit 'leeftijd' van RawUIData om TypeScript-mismatches te voorkomen.
 */
interface ExtendedRawData extends RawUIData {
  naam?: string;
  type?: string;
}

/* =========================
 * CONVERSIE & PARSING
 * ========================= */

export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(',', '.').trim();
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

export function parseName(fullName = ''): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) {
    return { firstName: parts[0] ?? '', lastName: '' };
  }
  const firstName = parts.shift() ?? '';
  const lastName = parts.join(' ');
  return { firstName, lastName };
}

export function toMemberType(input?: string): MemberType {
  const t = (input ?? '').trim().toLowerCase();
  
  const mapping: Record<string, MemberType> = {
    adult: 'adult',
    volwassene: 'adult',
    kind: 'child',
    child: 'child',
    baby: 'child',
    junior: 'child',
    puber: 'teenager',
    teenager: 'teenager',
    student: 'teenager',
    senior: 'senior',
    '65+': 'senior',
    pensionado: 'senior',
  };
  
  // ✅ FIX: Gooi een fout bij ongeldige input!
  if (!(t in mapping)) {
    throw new Error(`Ongeldige memberType: '${input}'. MemberType moet worden afgeleid uit geboortedatum.`);
  }
  
  return mapping[t];
}

/* =========================
 * ANONIMISERING & SECURITY
 * ========================= */


function encodeURISection(x: string): string {
  return encodeURIComponent(x); // of eigen implementatie
}


function toBase64(input: string): string {
  if (typeof btoa === 'function') return btoa(encodeURISection(input));
  return Buffer.from(input, 'utf8').toString('base64');
}

export function makeResearchId(localId: string): string {
  const hash = toBase64(localId)
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, RESEARCH_ID_LENGTH)
    .padEnd(RESEARCH_ID_LENGTH, '0');
  return `res_${hash.toLowerCase()}`;
}

const PII_KEYWORDS = [
  'naam', 'name', 'voornaam', 'achternaam',
  'e-mail', 'email', 'adres', 'telefoon', 'phone',
];

/**
 * Regex die een Nederlandse postcode met letters herkent (bijv. '1234AB' of '1234 AB').
 * De letters maken een postcode herleidbaar tot straatniveau — dat is PII.
 * Alleen de cijfers (wijkniveau) zijn toegestaan in research payloads.
 */
const POSTCODE_WITH_LETTERS_RE = /\b[1-9]\d{3}\s?[A-Z]{2}\b/;

/**
 * Transformeert een postcode naar wijkniveau voor research.
 * '1234AB' → '1234'  |  '1234 AB' → '1234'  |  '' → ''
 *
 * Gebruik deze functie UITSLUITEND bij het bouwen van AnonymizedResearchPayload.
 * Sla de waarde die niet gestript is nooit op buiten data.setup.
 */
export function extractWijkLevelResearch(postcode: string): string {
  return postcode.replace(/[^0-9]/g, '').match(/^\d{4}/)?.[0] ?? '';
}

export function containsPII(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value !== 'string') return false;
  const lower = value.toLowerCase();
  const hasKeyword = PII_KEYWORDS.some(keyword => lower.includes(keyword));
  const hasEmail   = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(value);
  const hasFullPostcode = POSTCODE_WITH_LETTERS_RE.test(value); // '1234AB' = PII
  return hasKeyword || hasEmail || hasFullPostcode;
}

export function assertNoPIILeak(obj: unknown): void {
  const forbiddenKeys = ['firstName', 'lastName', 'fullName', 'email', 'phone', 'address', 'naam'];
  
  const checkDeep = (current: unknown) => {
    if (typeof current !== 'object' || current === null) return;
    
    // We casten naar Record om door de keys te kunnen loop-en
    const entries = Object.entries(current as Record<string, unknown>);
    
    for (const [key, val] of entries) {
      const lowerKey = key.toLowerCase();
      if (forbiddenKeys.some((k) => lowerKey.includes(k.toLowerCase()))) {
        throw new Error(`SECURITY ALERT: Verboden veld "${key}" in Research Payload.`);
      }
      if (typeof val === 'string' && containsPII(val)) {
        throw new Error(`SECURITY ALERT: PII gedetecteerd in waarde van "${key}".`);
      }
      if (typeof val === 'object') checkDeep(val);
    }
  };
  checkDeep(obj);
}

/* =========================
 * INTERNE HELPERS
 * ========================= */

function resolveMemberName(raw: ExtendedRawData): { firstName: string; lastName: string } {
  const nameSource = (raw.fullName !== undefined && raw.fullName !== '') 
    ? raw.fullName 
    : (raw.naam ?? '');
    
  const parsed = parseName(nameSource);

  const finalFirstName = (parsed.firstName !== '') 
    ? parsed.firstName 
    : (raw.firstName ?? 'Lid');

  const finalLastName = (parsed.lastName !== '') 
    ? parsed.lastName 
    : (raw.lastName ?? '');

  return { firstName: finalFirstName.trim(), lastName: finalLastName.trim() };
}

function resolveMemberTypeForData(raw: ExtendedRawData): MemberType {
  if (raw.memberType !== undefined && raw.memberType !== '') return toMemberType(raw.memberType);
  if (raw.type !== undefined && raw.type !== '') return toMemberType(raw.type);
  return 'adult';
}

/* =========================
 * HELPER FUNCTIE
 * ========================= */

function finalizeResearchData(payload: AnonymizedResearchPayload): AnonymizedResearchPayload {
  assertNoPIILeak(payload);
  return ResearchValidator.validatePayload(payload);
}

/* =========================
 * DATA DISTRIBUTION (De Kern)
 * ========================= */

export function collectAndDistributeData(
  raw: RawUIData,
  index: number,
): { localMember: ResearchMember; researchPayload: AnonymizedResearchPayload } { {
  const extended = raw as ExtendedRawData;
  
  const { firstName, lastName } = resolveMemberName(extended);
  const memberType = resolveMemberTypeForData(extended);

  const localId = (raw.id !== undefined && raw.id !== '') ? raw.id : `local-${index}`;
  const fieldId = (raw.fieldId !== undefined && raw.fieldId !== '') ? raw.fieldId : `f-${index}`;
  const age = toNumber(raw.age ?? raw.leeftijd);

  const localMember: ResearchMember= {
    entityId: localId,
    fieldId,
    memberType,
    firstName,
    lastName,
    age,
    finance: typeof raw.finance === 'object' && raw.finance !== null ? raw.finance : {},
  };

  const researchPayload = finalizeResearchData({
    researchId: makeResearchId(localId),
    memberType,
    age: toNumber(localMember.age), 
    amount: toNumber(raw.amount),
    category: String(raw.category ?? 'unassigned'),
    timestamp: new Date().toISOString(),
  });

  return { localMember, researchPayload };
}
}