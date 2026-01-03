// src/services/privacyHelpers.ts
import { Member, MemberType, RawUIData, ResearchPayload } from '@domain/types';

/* =========================
 * CONVERSIE & PARSING
 * ========================= */

export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  if (typeof value === 'string') {
    const cleaned = value.replace(',', '.').trim();
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

export function parseName(fullName: string = ''): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return { firstName: parts[0] || '', lastName: '' };
  const firstName = parts.shift() || '';
  const lastName = parts.join(' ');
  return { firstName, lastName };
}

export function toMemberType(input?: string): MemberType {
  const t = (input ?? '').trim().toLowerCase();
  const mapping: Record<string, MemberType> = {
    'puber': 'teenager', 'teenager': 'teenager', 'student': 'teenager',
    'senior': 'senior', '65+': 'senior', 'pensionado': 'senior',
    'kind': 'child', 'child': 'child', 'baby': 'child', 'junior': 'child',
  };
  return mapping[t] || 'adult';
}

/* =========================
 * ANONYMISERING & SECURITY
 * ========================= */

function toBase64(input: string): string {
  if (typeof btoa === 'function') return btoa(encodeURIComponent(input));
  return Buffer.from(input, 'utf8').toString('base64');
}

export function makeResearchId(localId: string): string {
  const hash = toBase64(localId).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
  return `res_${hash.toLowerCase()}`;
}

export function containsPII(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === 'string') {
    const emailRe = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    const nameWords = /\b(naam|name|voornaam|achternaam|e-mail|email|adres|telefoon|phone)\b/i;
    return emailRe.test(value) || nameWords.test(value);
  }
  return false;
}

export function assertNoPIILeak(obj: any): void {
  const forbiddenKeys = ['firstName', 'lastName', 'fullName', 'email', 'phone', 'address', 'naam'];
  const checkDeep = (current: any) => {
    if (!current || typeof current !== 'object') return;
    for (const [key, val] of Object.entries(current)) {
      if (forbiddenKeys.some(k => key.toLowerCase().includes(k))) {
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
 * DATA DISTRIBUTION (De Kern)
 * ========================= */

export function collectAndDistributeData(
  raw: RawUIData,
  index: number
): { localMember: Member; researchPayload: ResearchPayload } {
// 1. Maak de legacy cast hier aan
const legacyRaw = raw as any; 

// 2. Gebruik legacyRaw.naam als fallback voor de parser
const parsed = parseName(raw.fullName || legacyRaw.naam || '');

// 3. Bepaal het type (ook hier met legacy fallback)
const memberType = toMemberType(raw.memberType || raw.type || legacyRaw.type);

 
  const localId = raw.id || `local-${index}`;
  

  const localMember: Member = {
    entityId: localId,
    fieldId: raw.fieldId || `f-${index}`,
    memberType,
    firstName: (parsed.firstName || raw.firstName || 'Lid').trim(),
    lastName: (parsed.lastName || raw.lastName || '').trim(),
    age: toNumber(raw.age || raw.leeftijd),
    finance: raw.finance || {},
  };
  

  const researchPayload: ResearchPayload = {
    researchId: makeResearchId(localId),
    memberType,
    age: localMember.age || 0,
    amount: toNumber(raw.amount),
    category: String(raw.category || 'unassigned'),
    timestamp: new Date().toISOString(),
  };

  assertNoPIILeak(researchPayload);

  return { localMember, researchPayload };
}