# CU01 CONTRACT: DOMAIN_RULES_ENGINE
INTERFACE:
  Input: { user_id, household_size, geo_scope }
  Output: { flag: 0|1, meta: { rule_id, version, geo, digest, ts } }
LOGIC:
  - If household_size > 5 AND geo_scope == 'EU-NL' -> flag: 1
  - Else -> flag: 0
ERROR_HANDLING:
  - Missing/Invalid Geo -> flag: 0 + Emit(GEO_VIOLATION)
  - Runtime Error -> flag: 0 + Emit(FAIL_SAFE_TRIGGER)
