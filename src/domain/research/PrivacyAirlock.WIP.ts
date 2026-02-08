//src/domain/research/PrivacyAirlock.WIP.ts
import { Member } from '@core/types/core';
import { MemberType, RawUIData, AnonymizedResearchPayload } from '@core/types/research';

const RESEARCH_ID_LENGTH = 12;

/**
 * Helper interface om 'any' casts te vermijden bij legacy velden uit de UI.
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
    puber: 'teenager',
    teenager: 'teenager',
    student: 'teenager',
    senior: 'senior',
    '65+': 'senior',
    pensionado: 'senior',
    kind: 'child',
    child: 'child',
    baby: 'child',
    junior: 'child',
  };
  return mapping[t] ?? 'adult';
}

/* =========================
 * ANONYMISERING & SECURITY
 * ========================= */

function toBase64(input: string): string {
  if (typeof btoa === 'function') return btoa(encodeURIComponent(input));
  return Buffer.from(input, 'utf8').toString('base64');
}

export function makeResearchId(localId: string): string {
  const hash = toBase64(localId)
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, RESEARCH_ID_LENGTH);
  return `res_${hash.toLowerCase()}`;
}

export function containsPII(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    const emailRe = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    const nameWords = /\b(naam|name|voornaam|achternaam|e-mail|email|adres|telefoon|phone)\b/i;
    return emailRe.test(value) || nameWords.test(value);
  }
  return false;
}

export function assertNoPIILeak(obj: unknown): void {
  const forbiddenKeys = ['firstName', 'lastName', 'fullName', 'email', 'phone', 'address', 'naam'];
  
  const checkDeep = (current: unknown) => {
    if (typeof current !== 'object' || current === null) return;
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
 * DATA DISTRIBUTION (De Kern)
 * ========================= */

export function collectAndDistributeData(
  raw: RawUIData,
  index: number,
): { localMember: Member; researchPayload: AnonymizedResearchPayload } {
  const extended = raw as ExtendedRawData;
  
  const { firstName, lastName } = resolveMemberName(extended);
  const memberType = resolveMemberTypeForData(extended);

  const localId = (raw.id !== undefined && raw.id !== '') ? raw.id : `local-${index}`;
  const fieldId = (raw.fieldId !== undefined && raw.fieldId !== '') ? raw.fieldId : `f-${index}`;
  const age = toNumber(raw.age ?? raw.leeftijd);

  const localMember: Member = {
    entityId: localId,
    fieldId,
    memberType,
    firstName,
    lastName,
    age,
    finance: typeof raw.finance === 'object' && raw.finance !== null ? raw.finance : {},
  };

  const researchPayload: AnonymizedResearchPayload = {
    researchId: makeResearchId(localId),
    memberType,
    age: toNumber(localMember.age), 
    amount: toNumber(raw.amount),
    category: String(raw.category ?? 'unassigned'),
    timestamp: new Date().toISOString(),
  };

  assertNoPIILeak(researchPayload);

  // De namen hieronder moeten EXACT matchen met de namen op regel 148
  return { localMember, researchPayload };
}