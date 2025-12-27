import { createHash } from 'crypto';

/**
 * CU01: Domain Rules Engine (Phoenix Safe-Base v4.2)
 * STATUS: CEO-APPROVED & AVA-AUDITED [GO]
 * MANDAAT: ADR-18 Strikte Geo-fencing | Geen SUB-NATIONAL | Huishoudens > 5
 */
export function evaluateDomainRules(input: any): any {
  const RULE_ID = 'ADR-18';
  const RULE_VERSION = 'v1';
  const POLICY_VERSION = 'ADR-18@v1';

  // F3: Whitelist per geo_scope (ADR-18 Enforcement) - GEEN SUB-NATIONAL
  const GEO_WHITELISTS: Record<string, string[]> = {
    'EU-NL': ['household_size', 'postal_code', 'country_code'],
    EU: ['household_size', 'country_code'],
    GLOBAL: ['household_size'],
  };

  try {
    const geo_scope = input?.geo_scope;

    // 1. Validatie van Geo Scope & Input Schema (Stricter per Ava)
    if (!geo_scope || !GEO_WHITELISTS[geo_scope]) {
      return emitFailSafe('invalid_geo', RULE_ID, RULE_VERSION, POLICY_VERSION, input);
    }

    const data = input.data || {};
    const allowed = GEO_WHITELISTS[geo_scope];
    const keys = Object.keys(data);

    // F2/F3: Check op onbekende velden of type-fouten
    const hasForbidden = keys.some((k) => !allowed.includes(k));
    const isInvalidType =
      typeof data.household_size !== 'number' ||
      !Number.isFinite(data.household_size) ||
      !Number.isInteger(data.household_size);

    if (hasForbidden || isInvalidType) {
      return emitFailSafe('geo_policy_violation', RULE_ID, RULE_VERSION, POLICY_VERSION, input);
    }

    // 2. Provenance: Deterministische Hash (Canonical)
    const canonical = Object.fromEntries(
      Object.keys(data)
        .sort()
        .map((k) => [k, data[k]]),
    );
    const input_digest = `sha256:${createHash('sha256').update(JSON.stringify(canonical)).digest('hex')}`;

    // De binaire regel
    const flag = data.household_size > 5 ? 1 : 0;

    // 3. F1: EXACTE NAMING CONFORM CONTRACT
    return {
      flag,
      rule_id: RULE_ID,
      rule_version: RULE_VERSION,
      geo_scope: geo_scope,
      policy_version: POLICY_VERSION,
      input_digest,
      evaluated_at: new Date().toISOString(),
    };
  } catch (e) {
    return emitFailSafe('runtime_error', RULE_ID, RULE_VERSION, POLICY_VERSION, input);
  }
}

function emitFailSafe(cause: string, rid: string, rv: string, pv: string, input: any): any {
  // F2: Formeel Binaire Event inclusief Digest voor forensics
  const event = {
    event_type: cause === 'geo_policy_violation' ? 'geo_policy_violation' : 'rule_eval_error',
    cause,
    rule_id: rid,
    rule_version: rv,
    geo_scope: input?.geo_scope || 'UNKNOWN',
    policy_version: pv,
    input_digest: 'sha256:failed',
    occurred_at: new Date().toISOString(),
  };

  console.info(JSON.stringify({ PHOENIX_EVENT: event }));

  return {
    flag: 0,
    rule_id: rid,
    rule_version: rv,
    geo_scope: input?.geo_scope || 'UNKNOWN',
    policy_version: pv,
    input_digest: 'sha256:failed',
    evaluated_at: new Date().toISOString(),
  };
}
