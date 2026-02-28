# 🏛️ Architecture Decision Records (ADR) & Clean Code 2025

## 🎯 Verantwoordelijkheid
Dit document vormt het architectuurkompas en de kwaliteitsmaatstaf voor het Phoenix-project. Het bevat alle bindende architectuurbesluiten (ADR's) en de bijbehorende Clean Code checklist die samen de 'Canon' vormen waaraan alle code moet voldoen.

## 🏗️ Architectuur
- **Laag**: Architecture & Governance (overkoepelend)
- **Patronen**: Decision Records, Quality Gates, Audit Framework
- **Doel**: Elke wijziging moet herleidbaar zijn naar een ADR; elke ADR is getoetst aan de Clean Code principes
- **Dependencies**:
  - Wordt toegepast door: Alle lagen (UI, Domain, Adapters)
  - Wordt gecontroleerd door: Audit scripts, CI/CD pipelines, code reviews

## 📋 ADR Overzicht

### 🔷 Kernprincipes (ADR-01 t/m ADR-04)

| ID | Titel | Samenvatting |
|----|-------|--------------|
| **ADR-01** | Separation of Concerns is leidend | UI, state, domeinlogica en infrastructuur zijn strikt gescheiden. Geen businesslogica in UI. |
| **ADR-02** | Type-Safety verplicht | Alle invoer en opslag wordt gevalideerd. Zod aan systeemgrenzen. `any` is verboden. |
| **ADR-03** | Domeinlogica in kernel | Kernberekeningen in pure functies, testbaar zonder renderer/UI. |
| **ADR-04** | UI Components zijn dumb | Pure projectors: props in → view uit. Geen parsing of complexe regels. |

### 🔷 Financiële & Data regels (ADR-05 t/m ADR-07)

| ID | Titel | Samenvatting |
|----|-------|--------------|
| **ADR-05** | Geld = minor-unit | Centen intern (geen floats). Centrale parsing/conversie bij grenzen. |
| **ADR-06** | Global Input Hardening | Gebruikersinvoer opschonen, valideren, limieten toepassen. UI gebruikt nooit parseFloat/Number direct. |
| **ADR-07** | Shadow Flags expliciet gemodelleerd | Boolean/enum flags met expliciete accessor functies. Geen impliciete status. |

### 🔷 State & Flow (ADR-08 t/m ADR-10)

| ID | Titel | Samenvatting |
|----|-------|--------------|
| **ADR-08** | App Status via FSM | Beperkte toestanden, expliciete transities, error recovery via Finite State Machine. |
| **ADR-09** | Views zijn Pure Projectors | Entry components zijn mapping van status → scherm. Geen embedded logica. |
| **ADR-10** | Schema Versioning & Storage Guards | Persistente structuren hebben `schemaVersion`. Storage altijd valideren bij load. |

### 🔷 Kwaliteit & Testing (ADR-11 t/m ADR-13)

| ID | Titel | Samenvatting |
|----|-------|--------------|
| **ADR-11** | Testing piramidemodel | Domeinlogica zwaar getest (≥80% coverage), UI licht. Golden master scenario's voor kritieke flows. |
| **ADR-12** | Auditability primair doel | Beslissingen herleidbaar via ADR-referenties. Gestructureerde logs, geen gevoelige data. |
| **ADR-13** | Finance Kernel voor inkomen/uitgaven | Netto/bestedingsruimte/afdrachten in centen. Pure functies, adapters voor I/O. |

### 🔷 Processen & Rollen (ADR-14 t/m ADR-17)

| ID | Titel | Samenvatting |
|----|-------|--------------|
| **ADR-14** | Reducers zijn dumb | State in, action+payload in, nieuwe state uit. Geen API calls of berekeningen. |
| **ADR-15** | Navigator/Debugger procesrollen | Ondersteunend voor analyse, geen architectuurwijzigingen. |
| **ADR-16** | Eenvoud boven theoretische perfectie | Bij gelijkwaardige oplossingen: kies de eenvoudigste. Max 20 regels per functie. |
| **ADR-17** | Accepted Risk geldig resultaat | Risico's expliciet documenteren, niet stilzwijgend negeren. |

### 🔷 Samenwerking met AI (ADR-18 en ADR-19)

| **ADR-18** | AI adviserend, mens beslist | AI levert analyse, mens maakt expliciete beslissingen. |
| **ADR-19** | Semantic Authority Constraint (SAC) | Geen AI-taal die besluiten impliceert. Alleen beschrijvende observaties. |

## 📋 Clean Code Checklist 2025


### 🏗️ Structureel 

| ID | Regel | Controle |
|----|-------|----------|
| **S-01** | Één verantwoordelijkheidsdoel per module | Bestandsnaam ↔ functie |
| **S-02** | UI = projector (geen logica) | Props in → View uit |
| **S-03** | Kernel-functies zijn pure | Geen I/O, geen globale state |
| **S-04** | TypeScript strict | `strict: true` + geen `any` |
| **S-05** | Geen duplicatie | Detectie via lint/grep |

### 🧪 Testability

| ID | Regel | ADR | Controle | Gewicht |
|----|-------|-----|----------|---------|
| **T-01** | Domeinlogica getest | ADR-11 | Unit tests in kernel |
| **T-02** | Gedrag getest, niet implementatie | ADR-11 | Testing Library selectors |
| **T-03** | Golden cases bestaan | ADR-11 | Kritieke scenario's gedekt |
| **T-04** | Coverage ≥ 80% kernel | ADR-11 | Coverage report |

### 📖 Consistency & Readability 

| ID | Regel | Controle | Gewicht |
|----|-------|----------|---------|
| **R-01** | ESLint/Prettier pass | `npm run lint` = 0 errors | 
| **R-02** | Functienaam = intentie | Namen beschrijven gedrag | 
| **R-03** | Commentaar alleen voor WAAROM | Geen commentaar-uitleg WAT | 

### 🔒 Security & Data Handling

| ID | Regel | ADR | Controle |
|----|-------|-----|----------|
| **SEC-01** | PII expliciet gemarkeerd | ADR-12 | PII-attest aanwezig |
| **SEC-02** | Geen gevoelige data in logs | ADR-12 | Zoekopdracht op logs |

## 📋 Clean Code 2025 - ADR Gekoppelde Praktijken

### Basisprincipes — Functies
- **ADR-01/14**: SRP-Validatie — Eén taak per functie; reducers/projectors strikt gescheiden
- **ADR-16**: Complexiteitslimiet — Max 20 regels; eenvoud boven abstractie
- **ADR-16**: Signature-beperking — Max 2 argumenten, anders object-injectie
- **ADR-17**: Guard Clause Pattern — Vroegtijdige return voor edge-cases
- **ADR-03/13**: Side-effect Analyse — Kernel functies verplicht pure zonder infra-leak

### React Best Practices — Component Structuur
- **ADR-04**: Component Schaling — Max 150 regels JSX; 'dumb' view principe
- **ADR-01**: Prop-Destructuring — Expliciete interface mapping aan de UI-grens
- **ADR-04**: Fragment Usage — Voorkom onnodige DOM-nesting
- **ADR-01**: Composition Pattern — Gebruik `children` voor scheiding layout/logica
- **ADR-01/04**: UI-Logica Extractie — Beslisregels naar Custom Hooks of Kernel
- **ADR-01**: Feature-Isolation — Bestanden per architecturale unit

### React Best Practices — Hooks
- **ADR-02**: State Typing — Generics verplicht bij `useState`; geen impliciete `any`
- **ADR-16**: Memoization Policy — `useCallback`/`useMemo` alleen bij noodzaak
- **ADR-01**: Hook-Abstraction — Herbruikbare logica buiten component scope
- **ADR-02**: Component Typing — Voorkeur voor standaard functies boven `React.FC`

### TypeScript Essentials — Type Safety
- **ADR-02**: Type-Integriteit — Verbod op `any`; gebruik `unknown` voor externe data
- **ADR-02**: Prop-Contracts — Interfaces verplicht voor alle component grenzen
- **ADR-08**: State-Modeling — Discriminated Unions verplicht voor FSM transities
- **ADR-07**: Constanten — Enums/Unions voor expliciete status-vlaggen
- **ADR-10/17**: Immutability — `Readonly` voor persistente opslag-structuren
- **ADR-02**: Utility Types — Gebruik `Omit`/`Pick` voor herleidbare type-transformaties

### TypeScript Essentials — Geavanceerd
- **ADR-02**: Generic Constraints — Type-parameters verplicht beperken
- **ADR-02/06**: Boundary Parsing — Zod verplicht aan systeemgrenzen (parse don't validate)
- **ADR-17**: Result Pattern — Expliciete success/error objecten voor foutafhandeling
- **ADR-00/12**: Compiler Strictness — Strikte tsconfig als basis voor audits

### Architectuur & Structuur — Code Organisatie
- **ADR-16**: Nesting Limiet — Shallow codebase; max 4 niveaus diep
- **ADR-01**: Feature-Based Mapping — Expliciete mappenstructuur per domein
- **ADR-01/03**: Layer Separation — Domeinlaag/Kernel fysiek gescheiden van UI
- **ADR-16**: Functional Paradigm — Functies boven classes voor minder complexiteit
- **ADR-16**: Abstractie-balans — DRY toepassen zonder over-engineering

### Architectuur & Structuur — Patterns
- **ADR-00**: Phoenix Transition — Strangler Fig voor legacy vervanging
- **ADR-15**: Legacy Wrapping — Façade pattern voor oude API-integratie
- **ADR-01**: Data-Access Isolation — Repository pattern scheidt infra van domein
- **ADR-08**: State-Integriteit — Discriminated Unions voorkomen onmogelijke FSM states

### Testing & Kwaliteit — Test Strategie
- **ADR-11**: Gedragstesten — Focus op user flows, niet op interne state
- **ADR-11**: Selector Policy — Testing Library selectors verplicht
- **ADR-11**: TDD Workflow — Red-Green-Refactor cyclus
- **ADR-11/13**: Flow Validatie — Testen van kritieke financiële flows

### Testing & Kwaliteit — Code Quality
- **ADR-12**: Linting Compliance — ESLint strict mode pass = audit eis
- **ADR-12**: Formatting — Prettier consistentie
- **ADR-12**: Git-Hooks — Husky pre-commit validatie verplicht
- **ADR-02**: Strict Type-Checks — `noImplicitAny` en `strictNullChecks`

### Refactoring Legacy Code — Strategieën
- **ADR-00**: Incrementele Verbetering — Boy Scout Rule binnen Phoenix scope
- **ADR-00**: Dependency Analysis — Mikado Method voor grote wijzigingen
- **ADR-16**: Impact-prioritering — Eenvoudigste refactor met meeste waarde eerst
- **ADR-00**: ADR-gedreven refactor — Geen wijziging zonder Canon-referentie

### Modern Tooling
- **ADR-01**: Path Aliasing — Schone imports via `@components/*`
- **ADR-16**: Tooling-Eenvoud — Gebruik moderne compilers voor performance
- **ADR-11**: Test-Runner — Vitest voor snelle kernel-validatie
- **ADR-12**: Statische Analyse — Biome/ESLint voor geautomatiseerde audits

### Observability
- **ADR-12**: Audit Logging — Gestructureerde logs voor herleidbaarheid
- **ADR-08**: Error Boundaries — FSM-gebaseerde error recovery
- **ADR-12**: Traceability — Distributed tracing voor dataflows
- **ADR-16**: Performance Budget — Monitoring van kritieke paden

### Leesbaarheid & Mentale Energie
- **ADR-12/15**: Intentie-Documentatie — Commentaar op 'waarom', niet 'wat'
- **ADR-16**: Magic Number Eliminatie — Constanten verplicht (ADR-05)
- **ADR-12**: API Documentatie — JSDoc voor kernel-functies
- **ADR-00**: Naming Consistency — Terminologie conform Phoenix Canon
- **ADR-16**: Nesting Beperking — Max 2-3 niveaus; voorkom mentale overload
- **ADR-17**: Error Handling — Voorspelbare afhandeling conform accepted risks

### React Native Specifiek
- **ADR-02**: Native Type-Safety — TypeScript als standaard
- **ADR-01**: Transform-isolatie — Babel configuratie
- **ADR-12**: Headless Check — CLI type-check integratie in CI
- **ADR-02**: Config-integriteit — `@react-native/typescript-config`

### React Native — Performance
- **ADR-16**: List-Optimization — `FlatList` voor geheugenbeheer
- **ADR-16**: Render-Efficiency — Memoize componenten bij UI-lag
- **ADR-00**: Engine-Compliance — Hermes engine
- **ADR-01**: Native Bridge — Isolatie van native modules

## 💡 Best Practices voor gebruik

### Tijdens ontwikkeling
1. **Elke feature start met ADR-check**: Welke ADR's zijn relevant?
2. **Commit messages bevatten ADR-referenties**: `feat: input hardening (ADR-06)`
3. **Code reviews toetsen aan Clean Code checklist**: Is S-01 t/m S-05 gerespecteerd?

### Tijdens ESLint
1. **ADRs als meetlat**: Wordt voldaan aan ADR-02 (type-safety)?

### Bij architectuurwijzigingen
1. **Nieuwe ADR nodig?** Documenteer met ID, titel, beschrijving
2. **Bestaande ADR wijzigen?** Update versie en rationale
3. **Link naar Clean Code items**: Welke checklist items worden geraakt?

## 🧩 Voorbeelden

### Code met ADR-referentie
```typescript
// ADR-05: Geld in centen
const toCents = (euro: number): number => Math.round(euro * 100);

// ADR-06: Input hardening (UI mag geen parseFloat)
export const parseUserInput = (input: string): number => {
  const cleaned = input.replace(/[^0-9,-]/g, ''); // ADR-06
  const parsed = Number(cleaned.replace(',', '.'));
  return Number.isFinite(parsed) ? toCents(parsed) : 0;
};
```

### Component met ADR-compliance
```tsx
// ADR-04: Dumb component (alleen projectie)
interface Props {
  amount: number; // in centen (ADR-05)
  onUpdate: (cents: number) => void;
}

export const AmountDisplay = ({ amount, onUpdate }: Props) => {
  // ADR-04: Geen logica, alleen formatting
  const euros = (amount / 100).toFixed(2);
  
  return (
    <View>
      <Text>€ {euros}</Text>
    </View>
  );
};
```

### Audit log met ADR-referentie
```typescript
// ADR-12: Auditability
AuditLogger.log('INFO', {
  event: 'transaction_push',
  adr: 'ADR-12',
  version: '2025-01-A',
  pointer: 3
});
```

## 🔗 Gerelateerd

- [Audit Scripts](../../scripts/audit/) — Geautomatiseerde checklist checks
- [Clean Code CI Workflow](../../.github/workflows/clean-code-check.yml)
- [TypeScript Config](../../tsconfig.json) — Strict mode (diverse ADR)
- [ESLint Config] (../../eslint.config.cjs) — Regelgeving (diverse ADR)