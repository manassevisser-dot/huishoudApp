# ADR-18-CEO-2025-12-24 — Verbod op provincie-checks

- **Status:** Accepted (CEO Mandate)
- **Datum:** 2025-12-24
- **Context:** Poging tot introductie van sub-geo granulariteit (provincies) door AI-rollen gedetecteerd en geblokkeerd na raadpleging Flow Protocol v3.7.
- **Decision:** Het is strikt verboden om provincie- of districtsdata te gebruiken binnen de logica-pipelines of domeinmodellen. Geo-fencing blijft beperkt tot de goedgekeurde `geo_scope` enum (EU-NL, EU, GLOBAL).
- **Consequences:**
    - Vermindert PII-risico (re-identificatie).
    - Dwingt ADR-18 (Manasse-mandaat) af op contractniveau.
    - Elke afwijking resulteert in een binaire `geo_policy_violation`.
