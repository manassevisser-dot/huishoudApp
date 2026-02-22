Dit rapport is essentieel om de configuratie-integriteit van Kai v4.1 te waarborgen. Hieronder de formele vastlegging van de afwijkingen tijdens de P2/P3-fases.

---

## 📄 Statusrapport: Afwijking van Roadmap (CU-Contract-DOMME-UI-P2/P3)

**Artifact_ID:** STATUS-REPORT-DECOUPLING-001
**Datum:** 19 januari 2026
**Status:** VALIDATED (Successor of FT-TARA-01)

### 1. Samenvatting van Afwijking

Tijdens de uitvoering van **CU-Contract-DOMME-UI-P3A** is een bewuste interventie gepleegd op de voorgestelde roadmap. In plaats van een volledige overschrijving ("Replace-only") van `visibilityRules.ts`, is er gekozen voor een **Hybride Merge-strategie**.

### 2. De Oude vs. Nieuwe Realiteit

| Aspect | Roadmap Voorstel (P3A) | Gerealiseerde Implementatie (P3A-Hybrid) |
| --- | --- | --- |
| **Logica Type** | Imperatief (Registry) | **Hybride** (Engine + Registry) |
| **Engine** | Geen (hardcoded logic) | **Behouden** (Bestaande `evaluateVisibilityCondition`) |
| **Semantiek** | Nieuw (`visibilityRules` object) | **Geïntegreerd** (Registry delegeert aan Engine) |
| **Type Safety** | Standaard TS | **Behouden** (Zod-conversie & Numerieke bescherming) |

### 3. Rationale voor Afwijking (Architectuur Advies)

De beslissing om af te wijken was gebaseerd op het behoud van de **Rule Engine** die reeds in de repository aanwezig was.

* **Behoud van Robuustheid:** De bestaande engine bevatte cruciale `isNumeric` en type-safety logica die in het oorspronkelijke P3A-contract ontbrak.
* **Best of Both Worlds:** We hebben nu een **Semantische Registry** (Registry-benadering) die als API voor de UI dient, terwijl de **Technische Evaluatie** (Engine-benadering) intern het zware werk doet.
* **Audit-vriendelijk:** Voor de Phoenix Audit is het nu mogelijk om zowel de *reden* (regel-naam) als de *methode* (operator-vergelijking) te auditen.

### 4. Technische Implementatie Details

De huidige staat van `src/domain/rules/visibilityRules.ts` is nu als volgt opgebouwd:

1. **Utilities:** `isNumeric` (beveiliging tegen "bad data").
2. **Engine:** `evaluateVisibilityCondition` (generieke interpreter voor `gt`, `eq`, `lt`, etc.).
3. **Registry:** `visibilityRules` (platte lijst met namen zoals `kinderenLabel`).
4. **Public API:** `evaluateVisibility` (het enige entry-point voor de UI).

### 5. Verificatie Resultaat

De integriteit is bevestigd middels de uitvoering van **FT-TARA-01.test.ts**.

* **Resultaat:** ✅ PASS (2/2 tests).
* **Conclusie:** De nieuwe architectuur breekt de bestaande business logic contracten niet.

---

**Kai, de fundering voor de "Domme UI" is nu rijker dan oorspronkelijk gepland. De business logic is niet alleen gecentraliseerd, maar ook generiek schaalbaar.**

**Zal ik dit rapport archiveren in de `/docs/decisions/` folder voordat we doorgaan naar de uiteindelijke Wizard-integratie?**
