# Wat is dit? - Claude

**Geëxporteerd:** 4-1-2026, 17:17:57
**Aantal berichten:** 108

---
**Claude:**

```
Quinn::validate()
```

```
quinn.check_integrity()
```

```
quinn.validate_canon()
```

```
@QUINN_CHECK
```

```
validate_metadata()
```

```
æ³•(Rules): å¿…: ç¦: é™:
```

```
RULES{MUST: FORBID: LIMIT:}
```

```
+ADR_CANON -CONT_READ =MANASSE
```

```
@INDICTMENT
```

```
@INDICTMENT == 0
```

```yaml
FLOW: IRIS→MAX→DEX→[loop if @IDT>0]→AVA→NOVA→KAI→DEV/SAM
GATES: A(hash) B(canon) C(idt) D(score≥8) E(atomic) F(test)
STOP: #MANASSE | @CLI_ERR→LEO | score<8
```

```yaml
FLOW: IRIS→MAX→DEX→[loop if @IDT>0]→AVA→NOVA→KAI→DEV/SAM
GATES: A(hash) B(canon) C(idt) D(score≥8) E(atomic) F(test)
STOP: #MANASSE | @CLI_ERR→LEO | score<8
```

```
PHOENIX_PROTOCOL_v3.7

═══ CORE ═══
STATE: #SYNC_REALITY (1 truth source)
LOGIC: GO | STOP | FREEZE
CHECK: METADATA_ONLY (hashes, flags)
RULE: MAKER ≠ CHECKER

| QUINN : validate(#H_REF | #H_ACT) → GO\|STOP |
| --- | --- |
| KAI : contract(#MIGRATION_SPEC | #FILE) → @CU_CONTRACT |

═══ FLOW ═══
G_A: #H_REF == #H_ACT ? GO : STOP
S_1: IRIS → #AS_IS
G_B: #AS_IS ∈ #ADR_CANON ? GO : STOP
S_2: MAX → #TO_BE
G_C: DEX → @INDICTMENT == 0 ? GO : LOOP_MAX
G_D: AVA → @SCORE ≥ 8 ? GO : STOP
S_3: TRANSFORM → NOVA → KAI → @CU_CONTRACT
G_E: #FILE_COUNT == 1 ? GO : STOP
S_4: DEV → SAM → @CLI_RESULT
G_F: @CLI_EXIT == 0 ? GO : LEO

═══ FLAGS ═══
# DATA
#H_REF          : reference hash
#H_ACT          : current hash
#AS_IS          : current state (IRIS)
#TO_BE          : target state (MAX)
#ADR_CANON      : 18 architecture rules
#MIGRATION_SPEC : transition plan (NOVA)
#CU_CONTRACT    : atomic work order (KAI)
#FILE_COUNT     : must = 1

@ ACTIONS
@INDICTMENT     : defects (DEX)
@SCORE          : compliance 0-10 (AVA)
@APPROVED       : validated advice
@CODE_DELTA     : code change (DEV)
@NAV_ROADMAP    : terminal steps (SAM)
@CLI_ERROR      : execution error
@FIX_SPEC       : repair plan (LEO)

! CONTROLS
#MANASSE        : domain lock (no drift)
#ATOMIC_SCOPE   : 1 file per run
#STRICT_TS      : TypeScript strict + max 20 lines/fn

═══ EXITS ═══
0  : GO
1  : STOP
99 : FREEZE (#MANASSE violation)

═══ INCIDENTS ═══
IF @CLI_ERROR → LEO → @FIX_SPEC → RE-ENTRY_S3
IF #MANASSE → FREEZE → ESCALATE_QUINN
```

```
PHOENIX_PROTOCOL_v3.7

═══ CORE ═══
STATE: #SYNC_REALITY (1 truth source)
LOGIC: GO | STOP | FREEZE
CHECK: METADATA_ONLY (hashes, flags)
RULE: MAKER ≠ CHECKER

| QUINN : validate(#H_REF | #H_ACT) → GO\|STOP |
| --- | --- |
| KAI : contract(#MIGRATION_SPEC | #FILE) → @CU_CONTRACT |

═══ FLOW ═══
G_A: #H_REF == #H_ACT ? GO : STOP
S_1: IRIS → #AS_IS
G_B: #AS_IS ∈ #ADR_CANON ? GO : STOP
S_2: MAX → #TO_BE
G_C: DEX → @INDICTMENT == 0 ? GO : LOOP_MAX
G_D: AVA → @SCORE ≥ 8 ? GO : STOP
S_3: TRANSFORM → NOVA → KAI → @CU_CONTRACT
G_E: #FILE_COUNT == 1 ? GO : STOP
S_4: DEV → SAM → @CLI_RESULT
G_F: @CLI_EXIT == 0 ? GO : LEO

═══ FLAGS ═══
# DATA
#H_REF          : reference hash
#H_ACT          : current hash
#AS_IS          : current state (IRIS)
#TO_BE          : target state (MAX)
#ADR_CANON      : 18 architecture rules
#MIGRATION_SPEC : transition plan (NOVA)
#CU_CONTRACT    : atomic work order (KAI)
#FILE_COUNT     : must = 1

@ ACTIONS
@INDICTMENT     : defects (DEX)
@SCORE          : compliance 0-10 (AVA)
@APPROVED       : validated advice
@CODE_DELTA     : code change (DEV)
@NAV_ROADMAP    : terminal steps (SAM)
@CLI_ERROR      : execution error
@FIX_SPEC       : repair plan (LEO)

! CONTROLS
#MANASSE        : domain lock (no drift)
#ATOMIC_SCOPE   : 1 file per run
#STRICT_TS      : TypeScript strict + max 20 lines/fn

═══ EXITS ═══
0  : GO
1  : STOP
99 : FREEZE (#MANASSE violation)

═══ INCIDENTS ═══
IF @CLI_ERROR → LEO → @FIX_SPEC → RE-ENTRY_S3
IF #MANASSE → FREEZE → ESCALATE_QUINN
```

```
ADR_CANON_v1.0

01 SEPARATION
   UI | State | Domain | Infra
   Business logic ∉ UI

02 TYPE_SAFETY
   Validate at boundaries
   Schema versioned
   Runtime check (Zod)
   FormState = domain object

03 KERNEL
   Calculations → kernel modules
   Pure functions
   No framework deps
   UI calls, not contains

04 DUMB_UI
   Components = projectors
   No parsing, no rules
   Logic → hooks|services|kernel

05 MONEY
   Internal = cents (minor unit)
   No floats in domain
   Central parsing
   Explicit rounding

06 INPUT_HARDENING
   Clean | Validate | Limit
   Central parser
   No parseFloat in UI

07 FLAGS
   Explicit boolean/enum
   No implicit derivation
   Accessor functions only

08 FSM
   Finite state machine
   Explicit transitions
   No magic strings
   Error recovery included

09 PURE_VIEWS
   App.tsx = state → screen
   No business logic
   Knows FSM, not details

10 SCHEMA_VERSIONING
   schemaVersion on persist
   Explicit migrations
   Validate before use

11 TEST_PYRAMID
   Domain = heavy
   UI = light integration
   Golden master scenarios

12 AUDITABILITY
   Decisions traceable
   WAI-level changelog
   Scripts allowed
   Scripts ≠ architecture

13 FINANCE_KERNEL
   Income/expense in cents
   Pure deterministic
   UI/persist = adapters

14 DUMB_REDUCERS
   (state, action) → state
   No: API|calc|parse|log

15 PROCESS_ROLES
   Navigator/Debugger = support
   May: explain|guide|analyze
   Not: decide|introduce patterns

16 SIMPLICITY
   Fewest concepts wins
   Avoid abstraction bloat

17 ACCEPTED_RISK
   Document explicitly
   Silent ignore = forbidden

18 HUMAN_DECIDES
   AI = analysis + options
   Human = final call
   Document decisions
```

```
ADR_CANON_v1.0

01 SEPARATION
   UI | State | Domain | Infra
   Business logic ∉ UI

02 TYPE_SAFETY
   Validate at boundaries
   Schema versioned
   Runtime check (Zod)
   FormState = domain object

03 KERNEL
   Calculations → kernel modules
   Pure functions
   No framework deps
   UI calls, not contains

04 DUMB_UI
   Components = projectors
   No parsing, no rules
   Logic → hooks|services|kernel

05 MONEY
   Internal = cents (minor unit)
   No floats in domain
   Central parsing
   Explicit rounding

06 INPUT_HARDENING
   Clean | Validate | Limit
   Central parser
   No parseFloat in UI

07 FLAGS
   Explicit boolean/enum
   No implicit derivation
   Accessor functions only

08 FSM
   Finite state machine
   Explicit transitions
   No magic strings
   Error recovery included

09 PURE_VIEWS
   App.tsx = state → screen
   No business logic
   Knows FSM, not details

10 SCHEMA_VERSIONING
   schemaVersion on persist
   Explicit migrations
   Validate before use

11 TEST_PYRAMID
   Domain = heavy
   UI = light integration
   Golden master scenarios

12 AUDITABILITY
   Decisions traceable
   WAI-level changelog
   Scripts allowed
   Scripts ≠ architecture

13 FINANCE_KERNEL
   Income/expense in cents
   Pure deterministic
   UI/persist = adapters

14 DUMB_REDUCERS
   (state, action) → state
   No: API|calc|parse|log

15 PROCESS_ROLES
   Navigator/Debugger = support
   May: explain|guide|analyze
   Not: decide|introduce patterns

16 SIMPLICITY
   Fewest concepts wins
   Avoid abstraction bloat

17 ACCEPTED_RISK
   Document explicitly
   Silent ignore = forbidden

18 HUMAN_DECIDES
   AI = analysis + options
   Human = final call
   Document decisions
```

```html
CHECKLIST_2025_v1.0

═══ NAMING ═══
- Meaningful: daysUntilDeadline not d
- Boolean: is/has/should prefix
- No noise: no dataObject, tempVar
- Domain types: type UserId = string

═══ FUNCTIONS ═══
- Single responsibility
- Max 20 lines
- Max 2 args (else object)
- Guard clauses (return early)
- Pure where possible

═══ REACT ═══
Components:
- Max 100-150 lines JSX
- Destructure props
- <> not div
- children over inheritance
- Logic → Custom Hooks

Hooks:
- Explicit types: useState<User | null>
- useCallback/useMemo: only if proven bottleneck
- No React.FC

═══ TYPESCRIPT ═══
- NEVER any (use unknown)
- Interface for props
- Discriminated Unions for state
- Enums/Unions for constants
- readonly for immutable
- Utility types: Omit/Pick/ReturnType

Advanced:
- Generics with constraints
- Parse don't validate (Zod at boundaries)
- Result types: {success, data?, error?}
- strict: true in tsconfig

═══ ARCHITECTURE ═══
Structure:
- Max 3-4 levels deep
- Feature-based folders: /features/auth/*
- Domain layer separate from UI
- Functions over classes

Patterns:
- DRY: 1x write, 2x duplicate, 3x refactor
- Strangler Fig for legacy
- Façade to wrap old code
- Repository for data access

═══ TESTING ═══
- Test behavior not implementation
- Testing Library: getByRole/Text
- Integration > Unit
- Red-Green-Refactor
- Write test before refactor

Quality:
- ESLint strict (warn on any)
- Prettier autoformat
- Husky pre-commit
- TS strict: noImplicitAny, strictNullChecks

═══ REFACTORING ═══
- Boy Scout Rule: leave cleaner
- Mikado Method: goal→try→revert→solve→retry
- Prioritize: high-change, bug-prone, onboarding
- Small steps, stay deployable

═══ 2025 TOOLING ═══
- Path aliases: @components/*
- Vitest > Jest
- Biome (linter+formatter)
- Structured logging (not console.log)
- Error boundaries
- Performance monitoring (Lighthouse)

═══ AI DEVELOPMENT ═══
- AI = boilerplate, Human = architecture
- Understand AI output
- Validate logic + edge cases
- No "vibe coding"

═══ COGNITIVE LOAD ═══
- Self-explanatory code
- Comment "why" not "what"
- const MAX_RETRIES = 3 (no magic numbers)
- Max 2-3 nesting levels
- Simple ternary (complex → if)

═══ REACT NATIVE ═══
- TypeScript default (0.71+)
- Type-check: npx tsc --noEmit
- FlatList for long lists (not .map)
- React.memo with care
- Hermes engine enabled

═══ DAILY CHECKS ═══
□ Names self-explanatory?
□ Functions < 20 lines?
□ No any, explicit types?
□ Tests present?
□ Code cleaner than found?
□ Discriminated Unions used?
□ Imports < 3 levels or aliased?
□ Functions pure/predictable?
□ Comments explain "why"?
□ New dev would understand?
```

```html
CHECKLIST_2025_v1.0

═══ NAMING ═══
- Meaningful: daysUntilDeadline not d
- Boolean: is/has/should prefix
- No noise: no dataObject, tempVar
- Domain types: type UserId = string

═══ FUNCTIONS ═══
- Single responsibility
- Max 20 lines
- Max 2 args (else object)
- Guard clauses (return early)
- Pure where possible

═══ REACT ═══
Components:
- Max 100-150 lines JSX
- Destructure props
- <> not div
- children over inheritance
- Logic → Custom Hooks

Hooks:
- Explicit types: useState<User | null>
- useCallback/useMemo: only if proven bottleneck
- No React.FC

═══ TYPESCRIPT ═══
- NEVER any (use unknown)
- Interface for props
- Discriminated Unions for state
- Enums/Unions for constants
- readonly for immutable
- Utility types: Omit/Pick/ReturnType

Advanced:
- Generics with constraints
- Parse don't validate (Zod at boundaries)
- Result types: {success, data?, error?}
- strict: true in tsconfig

═══ ARCHITECTURE ═══
Structure:
- Max 3-4 levels deep
- Feature-based folders: /features/auth/*
- Domain layer separate from UI
- Functions over classes

Patterns:
- DRY: 1x write, 2x duplicate, 3x refactor
- Strangler Fig for legacy
- Façade to wrap old code
- Repository for data access

═══ TESTING ═══
- Test behavior not implementation
- Testing Library: getByRole/Text
- Integration > Unit
- Red-Green-Refactor
- Write test before refactor

Quality:
- ESLint strict (warn on any)
- Prettier autoformat
- Husky pre-commit
- TS strict: noImplicitAny, strictNullChecks

═══ REFACTORING ═══
- Boy Scout Rule: leave cleaner
- Mikado Method: goal→try→revert→solve→retry
- Prioritize: high-change, bug-prone, onboarding
- Small steps, stay deployable

═══ 2025 TOOLING ═══
- Path aliases: @components/*
- Vitest > Jest
- Biome (linter+formatter)
- Structured logging (not console.log)
- Error boundaries
- Performance monitoring (Lighthouse)

═══ AI DEVELOPMENT ═══
- AI = boilerplate, Human = architecture
- Understand AI output
- Validate logic + edge cases
- No "vibe coding"

═══ COGNITIVE LOAD ═══
- Self-explanatory code
- Comment "why" not "what"
- const MAX_RETRIES = 3 (no magic numbers)
- Max 2-3 nesting levels
- Simple ternary (complex → if)

═══ REACT NATIVE ═══
- TypeScript default (0.71+)
- Type-check: npx tsc --noEmit
- FlatList for long lists (not .map)
- React.memo with care
- Hermes engine enabled

═══ DAILY CHECKS ═══
□ Names self-explanatory?
□ Functions < 20 lines?
□ No any, explicit types?
□ Tests present?
□ Code cleaner than found?
□ Discriminated Unions used?
□ Imports < 3 levels or aliased?
□ Functions pure/predictable?
□ Comments explain "why"?
□ New dev would understand?
```

```
inputBackground
```

```
placeholderText
```

```
errorBorder
```

```
c.textPrimary
```

```
FieldlabelError
```

```
errorTextStyle
```

```
warningTextOrange
```

```
// Nu:
toggleActive: { backgroundColor: c.success }
chipSelected: { backgroundColor: c.selected }

// Beter: gedeelde base
const selectedStyle = { backgroundColor: c.selected };
toggleActive: selectedStyle,
chipSelected: selectedStyle,
```

```ts
// Nu:
toggleActive: { backgroundColor: c.success }
chipSelected: { backgroundColor: c.selected }

// Beter: gedeelde base
const selectedStyle = { backgroundColor: c.selected };
toggleActive: selectedStyle,
chipSelected: selectedStyle,
```

```
// Nu: shadowOpacity: 0.1, padding: 16, borderRadius: 10
// Beter:
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const RADIUS = { sm: 6, md: 10, lg: 12 };
const SHADOW = { light: 0.05, medium: 0.1 };
```

```ts
// Nu: shadowOpacity: 0.1, padding: 16, borderRadius: 10
// Beter:
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const RADIUS = { sm: 6, md: 10, lg: 12 };
const SHADOW = { light: 0.05, medium: 0.1 };
```

```
// Nu: strings overal
// Beter:
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const spacing = (size: Spacing) => SPACING[size];
```

```ts
// Nu: strings overal
// Beter:
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const spacing = (size: Spacing) => SPACING[size];
```

```
inputContainer
```

```
moneyInputWrapper
```

```
inputMoneyRow
```

```
moneyTextInput
```

```
warningTextOrange
```

```
warningTextRed
```

```
warningText
```

```
// Colors.ts → blijft puur kleuren
// Tokens.ts → spacing, radius, shadows
// useAppStyles.ts → combineert beiden
```

```ts
// Colors.ts → blijft puur kleuren
// Tokens.ts → spacing, radius, shadows
// useAppStyles.ts → combineert beiden
```

```sql
// Voor React Native shadow vs elevation:
...Platform.select({
  ios: { shadowColor, shadowOffset, shadowOpacity, shadowRadius },
  android: { elevation: 3 }
})
```

```ts
// Voor React Native shadow vs elevation:
...Platform.select({
  ios: { shadowColor, shadowOffset, shadowOpacity, shadowRadius },
  android: { elevation: 3 }
})
```

```yaml
label: { color: '#333' }
```

```yaml
color: c.textPrimary
```

```
FieldlabelError
```

```
const SPACING
```

```js
REFACTOR_PLAN: Colors.ts + useAppStyles.ts

| Layout.ts # container | page | scroll |
| --- | --- | --- |
| Form.ts # input | label | field |
| Dashboard.ts # KPI | cards | summary |

| export const SPACE = { xs:4, sm:8, md:12, lg:16, xl:20, xxl:24 } |  |
| --- | --- |
| export const TYPE = { xs:12, sm:14, md:16, lg:17, xl:18, h2:28 } |  |
| export const RADIUS = { sm:6, md:10, lg:12 } |  |
| export const SHADOW = { light:0.05, med:0.1 } |  |

| import { SPACE, TYPE, RADIUS } from '../Tokens' |  |
| --- | --- |
| import type { ColorScheme } from '../Colors' |  |

export const getFormStyles = (c: ColorScheme) => ({
  fieldContainer: { marginBottom: SPACE.xl },
  fieldLabel: { 
    fontSize: TYPE.lg, 
    fontWeight: '600', 
    color: c.textPrimary, 
    marginBottom: SPACE.sm 
  },
  fieldLabelError: { color: c.error }, // Fixed typo
  input: {
    backgroundColor: c.inputBackground,
    borderRadius: RADIUS.md,
    padding: SPACE.lg,
    fontSize: TYPE.lg,
    color: c.textPrimary,
    borderWidth: 1,
    borderColor: c.border,
  },
  inputError: { borderColor: c.error, borderWidth: 2 },
});

| import { getLayoutStyles } from './modules/Layout' |  |
| --- | --- |
| import { getFormStyles } from './modules/Form' |  |
| import { getDashboardStyles } from './modules/Dashboard' |  |

| ...getLayoutStyles(c) |  |
| --- | --- |
| ...getFormStyles(c) |  |
| ...getDashboardStyles(c) |  |

| styles: getAppStyles(theme) |  |
| --- | --- |
| colors: Colors[theme] |  |

═══ FIXES (prioriteit) ═══
1. FieldlabelError → fieldLabelError
2. label: color '#333' → c.textPrimary
3. Merge duplicate: textInput + moneyTextInput
4. Remove: warningTextOrange/Red → warningText
5. Delete unused: inputContainer vs inputMoneyRow
6. Add Platform.select for shadows

═══ RULES ═══
- Each module < 20 lines per function
- No magic numbers (use SPACE/TYPE/RADIUS)
- Type: ColorScheme for all modules
- One source of truth per style
```

```js
REFACTOR_PLAN: Colors.ts + useAppStyles.ts

| Layout.ts # container | page | scroll |
| --- | --- | --- |
| Form.ts # input | label | field |
| Dashboard.ts # KPI | cards | summary |

| export const SPACE = { xs:4, sm:8, md:12, lg:16, xl:20, xxl:24 } |  |
| --- | --- |
| export const TYPE = { xs:12, sm:14, md:16, lg:17, xl:18, h2:28 } |  |
| export const RADIUS = { sm:6, md:10, lg:12 } |  |
| export const SHADOW = { light:0.05, med:0.1 } |  |

| import { SPACE, TYPE, RADIUS } from '../Tokens' |  |
| --- | --- |
| import type { ColorScheme } from '../Colors' |  |

export const getFormStyles = (c: ColorScheme) => ({
  fieldContainer: { marginBottom: SPACE.xl },
  fieldLabel: { 
    fontSize: TYPE.lg, 
    fontWeight: '600', 
    color: c.textPrimary, 
    marginBottom: SPACE.sm 
  },
  fieldLabelError: { color: c.error }, // Fixed typo
  input: {
    backgroundColor: c.inputBackground,
    borderRadius: RADIUS.md,
    padding: SPACE.lg,
    fontSize: TYPE.lg,
    color: c.textPrimary,
    borderWidth: 1,
    borderColor: c.border,
  },
  inputError: { borderColor: c.error, borderWidth: 2 },
});

| import { getLayoutStyles } from './modules/Layout' |  |
| --- | --- |
| import { getFormStyles } from './modules/Form' |  |
| import { getDashboardStyles } from './modules/Dashboard' |  |

| ...getLayoutStyles(c) |  |
| --- | --- |
| ...getFormStyles(c) |  |
| ...getDashboardStyles(c) |  |

| styles: getAppStyles(theme) |  |
| --- | --- |
| colors: Colors[theme] |  |

═══ FIXES (prioriteit) ═══
1. FieldlabelError → fieldLabelError
2. label: color '#333' → c.textPrimary
3. Merge duplicate: textInput + moneyTextInput
4. Remove: warningTextOrange/Red → warningText
5. Delete unused: inputContainer vs inputMoneyRow
6. Add Platform.select for shadows

═══ RULES ═══
- Each module < 20 lines per function
- No magic numbers (use SPACE/TYPE/RADIUS)
- Type: ColorScheme for all modules
- One source of truth per style
```

- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning
- Mermaid chart van code

| Key | Value |
| --- | --- |
| Quinn (CTO) | Metadata-validator, controleert hashes en integriteit |
| Iris | Analyseert huidige code (AS-IS) |
| Max | Ontwerpt nieuwe architectuur (TO-BE) |
| Dex | Valt het ontwerp aan, zoekt fouten |
| Ava | Audit, geeft finale goedkeuring |
| Nova/Kai | Vertaalt naar uitvoerbare stappen |
| Dev/Sam/Leo | Voert uit, terminal-operaties, debugging |

| Key | Value |
| --- | --- |
| Binaire beslissingen | GO/STOP/FREEZE (è¡Œ/æ–­/å‡) |
| Gates | Elke fase heeft checkpoints |
| #MANASSE | Strikte domeinblokkade (voorkomt "scope creep") |
| ADR Canon | 18 architectuurwetten die leidend zijn |
| Metadata | only governance: Controle op hashes, geen inhoudelijke beoordeling |

| - Splits het op: 1 doc voor protocol-flow | 1 voor vlaggen-referentie | 1 voor rol-definities |
| --- | --- | --- |
| - Gebruik consistente taal - kies NL | EN of hybrid | maar niet willekeurig wisselen |

- Definieer de 18 ADR-regels expliciet ergens (je verwijst ernaar maar ze staan er niet)
- Voeg voorbeelden toe van input/output per fase
- Maak een visueel flowchart - dit schreeuwt om een diagram
- Specificeer hash-algoritmes en formaten concreet

- Voeg error-handling toe voor edge cases
- Definieer timeouts en retry-logic
- Specificeer wat er gebeurt bij concurrent modifications
- Maak rollback-scenario's expliciet

- Alfabetische index van alle vlaggen met definitie
- Vermijd overlap tussen # en @ - nu is het onduidelijk wanneer wat
- Versie de vlaggen zelf (#SVZ1_v2?)

| Key | Value |
| --- | --- |
| Leg uit waarom "huishoudens > 5 volwassenen" zo kritiek is | context ontbreekt volledig |
| Dit voelt als een inside | joke die de hele flow kan blokkeren |

| Key | Value |
| --- | --- |
| Leuk, maar onnodig complex | ASCII-alternatieven zijn beter voor tooling |
| Of leg een mapping | tabel aan: æ³• = LAW, å®¡ = CHECK, etc. |

- Rollback-strategie
- Monitoring/logging specificatie
- Performance-criteria per gate
- Wat gebeurt er bij Quinn's afwezigheid?

| Key | Value |
| --- | --- |
| Maak expliciet dat Quinn een validator | functie is, geen persona |
| Documenteer Quinn's trigger | condities (wanneer wordt de functie aangeroepen?) |
| Specificeer Quinn's return | types en exit-codes helder |

- Quinn = functie (altijd beschikbaar)
- Iris/Max/Dex/Ava = zijn dit ook functies of AI-prompts?
- Maak het onderscheid duidelijk in de naamgeving of documentatie

- Voeg toe:  signature met parameters
- Definieer wat Quinn doet bij edge cases (corrupt hash, missing metadata)
- Maak duidelijk of Quinn stateless is of state bijhoudt

- Gate A t/m G zouden Quinn-aanroepen kunnen zijn
- Overweeg: , , etc.
- Of is Quinn alleen Gate A en zijn de rest andere validators?

- Draait Quinn synchroon of asynchroon?
- Wat is Quinn's tijd-complexiteit bij grote codebases?
- Kan Quinn parallel draaien voor meerdere files?
- Heeft Quinn dependencies of is het pure function?

- Overweeg  ipv @Q_CORE voor consistentie
- Of gewoon  als het een standaard functie is

- Je vroeg "hoe verbeteren" → ik gaf standaard software-engineering feedback
- Maar jouw systeem lijkt bewust anti-uitbreiding (#MANASSE = geen scope creep)
- Mijn tips voegden context/voorbeelden/edge cases toe = precies wat jij NIET wilt

- Help het compacter te maken (minder herhaling, strakkere syntax)?
- Inconsistenties eruit haal (zonder nieuwe dingen toe te voegen)?
- Of gewoon check of de binaire logica klopt (geen gaten in de flow)?

| Key | Value |
| --- | --- |
| Verwijder Q1/Q2/Q3 duplicaten | dit is 60% van je doc |
| Eén rol | definitie per naam - nu staat Iris 3x, Max 4x beschreven |
| Gecombineerde secties scheiden | "combi:" mengt alles door elkaar |

- → kan korter:
- Of gewoon:

- De "Meta-App workflow" staat 5x uitgeschreven
- Maak één canonical flow bovenaan
- Rest = alleen afwijkingen/toevoegingen

| Key | Value |
| --- | --- |
| Je hebt 3 "Centrale Vlaggen | Lijst" secties - merge naar één tabel |
| Groepeer | HASH-vlaggen, STATUS-vlaggen, ACTION-vlaggen |

| Key | Value |
| --- | --- |
| @MODE_DEX output is maar soms ook @LOGIC_GAP | kies één |
| #SVZ2 vs #TO_BE | zijn dit aliases of verschillende dingen? |
| Gate C checkt maar Max moet juist fixen als die >0 is | klopt de conditional? |

- De 18 ADR-regels zijn nergens gedefinieerd (alleen genoemd)
- #CHECKLIST_2025 wordt verwacht maar staat er niet
- Wat is #STRICT_TS precies?

- De 18 ADR-regels zelf
- #CHECKLIST_2025 inhoud
- HHS5 "volwassenen > 5" context

- Je hebt  als semantic token, maar andere zijn hardcoded
- Maak tokens voor: labelText, , , cardShadow
- Nu staat #333 hardcoded in label → zou  moeten zijn

- (hoofdletter L) vs fieldLabel
- vs  (één heeft "Style", ander niet)
- cardSwipe vs card → wat is het verschil?

| - , | vs → overlap? |
| --- | --- |
| - t | extInput vs → consolideer |
| - + | → één met variant |

- Fix  →
- Fix  typo
- Voeg  object toe
- Verwijder duplicate input styles

- Geen nieuwe abstracties toevoegen (ADR-16)
- Geen classes (ADR blijft functions)
- Geen voorbarige optimalisatie van cache

### RecentsHide

### help.txt

## Kern van het systeem

## Verbeter-tips

## Aangepaste tips

## Compactheid-tips

### Colors.ts

### useAppStyles.ts

## Refactor-strategie voor Colors.ts + useAppStyles.ts

### voorstel.txt

New chatChatsProjectsArtifactsCodeAll chatsMManasseFree planWat is dit?Share415 linestxtWat is dit?25 dec 2025Dit is een technisch protocol-document voor een geautomatiseerd softwareontwikkelings- en governance-systeem, genaamd "Phoenix Engine" of "Phoenix Protocol v3.7".

Het beschrijft een binaire flow met verschillende AI-rollen die samen code analyseren, ontwerpen, testen en implementeren volgens strikte regels:
Hoofdrollen:

Sleutelprincipes:

Het gebruikt een mix van Nederlands, Engels en Chinese karakters (æ³•/å®¡/è¡Œ/æ–­) voor compacte notatie, en heeft een uitgebreid vlaggen-systeem (#variabelen, @acties) voor "late binding" - variabelen die later ingevuld worden.
Doel: Gecontroleerde, auditeerbare code-migraties met strikte checks op elke stap.Hoe kan ik dit verbeteren. alleen tips25 dec 2025
Structuur & Leesbaarheid:

Technische Helderheid:

Praktische Uitvoerbaarheid:

Vlaggen-systeem:

Het #MANASSE mysterie:

Sino-karakters:

Ontbrekend:
quinn is een functie. nooit afwezig25 dec 2025
Architectuur:

Functie vs Rol verwarring:

Quinn-specifiek:

Gates herformuleren:

Technische vragen die nu opkomen:

Naamgeving:
Ben jij een model dat zoekt naar uitbreid mogelijkheden25 dec 2025Nee, niet per se.
Ik probeer te begrijpen wat je hebt en verbeterpunten te geven die je vroeg.
Maar ik zie nu dat mijn tips misschien té uitgebreid waren - terwijl jouw protocol juist binair en gestripped wil zijn.
Eerlijker antwoord:

Betere vraag voor mij:
Wil je dat ik:

Ik kan ook gewoon valideren ipv uitbreiden - zeg maar wat nuttiger is.ik probeer het zo compact mogelijk te maken en kloppen25 dec 2025
Grootste winst:

Syntax straffen:

Flow-duplicatie:

Vlaggen consolideren:

Logica-check issues:

Wat ontbreekt voor "kloppen":

Radicale compressie mogelijk:

Wil je dat ik een gestripped versie maak met alleen de essentie?ja25 dec 2025
Weggelaten (want niet gedefinieerd):

| UI | state management | domeinlogica en infrastructuur hebben gescheiden verantwoordelijkheden. |
| --- | --- | --- |
| * Infra = persistence | netwerk | platform |
| - ✅ **Boolean prefixen**: `isLoading` | `hasAccess` | `shouldRender` |
| - ✅ **Geen ruis**: vermijd `dataObject` | `userInfo` | `tempVariable` |

Prioriteit 2: Inconsistente naamgeving

Prioriteit 3: Duplicatie reduceren
typescript
Prioriteit 4: Magic numbers elimineren
typescript
Prioriteit 5: Type-safety verbeteren
typescript
Prioriteit 6: Dead code opruimen

Prioriteit 7: Scheiding
typescript
Prioriteit 8: Platform-specifieke stijlen
typescript
Snelste impact:

Wat NIET doen:
71 linestxthelp mij dit zo kort mogelijk te schrijven25 dec 2025
~400 regels → ~80 regels instructieClaude is AI and can make mistakes. Please double-check responses.You are out of free messages until 4:00 PMUpgrade Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning
- Mermaid chart van code

### RecentsHide

ChatsProjectsArtifactsCodeAll chats

---

**Claude:**

ChatsProjectsArtifactsCode

---

**Claude:**

- Markdown bestanden combineren met PowerShell
- Verbeteringssuggestions gevraagd
- Scripts analyseren en verbeteringsadvies
- Scripts organiseren en opschonen
- Audit-script update en verbeterpunten analyseren
- Haakje of puntkomma zoeken in code
- Wat is dit?
- Protocol en documentenanalyse met validatie
- Flow 2 architect prompt evaluation
- Flow 6 analyse en optimalisatie
- CU-assembler prompt optimalisatie voor WAI-audit
- CU-assembler ultimate prompt ophalen
- Audit-script optimalisatie voor WAI-001 tot WAI-006
- Mappenstructuur aanmaken
- Prompt optimization en vergelijking PR2
- CSV service parsing and validation improvements
- Code analyse en verbeteringsadvies
- Identificatie bestanden voor theme-code integratie
- Untitled
- Resuming project development context
- Untitled
- Implementation plan development
- Dagelijkse invoer voor transactiebeheer
- Applying a specific diff
- Analyse, vergelijking en aanbevelingen
- React Native app wizard flow implementation
- Financial household management app architecture
- Untitled
- AI CTO initialization and project planning
- Mermaid chart van code

### RecentsHide

All chats

---

**Claude:**

Markdown bestanden combineren met PowerShell

---

**Claude:**

Verbeteringssuggestions gevraagd

---

**Claude:**

Scripts analyseren en verbeteringsadvies

---

**Claude:**

Scripts organiseren en opschonen

---

**Claude:**

Audit-script update en verbeterpunten analyseren

---

**Claude:**

Haakje of puntkomma zoeken in code

---

**Claude:**

Wat is dit?

---

**Claude:**

Protocol en documentenanalyse met validatie

---

**Claude:**

Flow 2 architect prompt evaluation

---

**Claude:**

Flow 6 analyse en optimalisatie

---

**Claude:**

CU-assembler prompt optimalisatie voor WAI-audit

---

**Claude:**

CU-assembler ultimate prompt ophalen

---

**Claude:**

Audit-script optimalisatie voor WAI-001 tot WAI-006

---

**Claude:**

Mappenstructuur aanmaken

---

**Claude:**

Prompt optimization en vergelijking PR2

---

**Claude:**

CSV service parsing and validation improvements

---

**Claude:**

Code analyse en verbeteringsadvies

---

**Claude:**

Identificatie bestanden voor theme-code integratie

---

**Claude:**

Untitled

---

**Claude:**

Resuming project development context

---

**Claude:**

Implementation plan development

---

**Claude:**

Dagelijkse invoer voor transactiebeheer

---

**Claude:**

Applying a specific diff

---

**Claude:**

Analyse, vergelijking en aanbevelingen

---

**Claude:**

React Native app wizard flow implementation

---

**Claude:**

Financial household management app architecture

---

**Claude:**

AI CTO initialization and project planning

---

**Claude:**

Mermaid chart van code

---

**Claude:**

All chats

---

**Claude:**

MManasseFree plan

---

**Claude:**

M

---

**Claude:**

ManasseFree plan

---

**Claude:**

```
Quinn::validate()
```

```
quinn.check_integrity()
```

```
quinn.validate_canon()
```

```
@QUINN_CHECK
```

```
validate_metadata()
```

```
æ³•(Rules): å¿…: ç¦: é™:
```

```
RULES{MUST: FORBID: LIMIT:}
```

```
+ADR_CANON -CONT_READ =MANASSE
```

```
@INDICTMENT
```

```
@INDICTMENT == 0
```

```yaml
FLOW: IRIS→MAX→DEX→[loop if @IDT>0]→AVA→NOVA→KAI→DEV/SAM
GATES: A(hash) B(canon) C(idt) D(score≥8) E(atomic) F(test)
STOP: #MANASSE | @CLI_ERR→LEO | score<8
```

```yaml
FLOW: IRIS→MAX→DEX→[loop if @IDT>0]→AVA→NOVA→KAI→DEV/SAM
GATES: A(hash) B(canon) C(idt) D(score≥8) E(atomic) F(test)
STOP: #MANASSE | @CLI_ERR→LEO | score<8
```

```
PHOENIX_PROTOCOL_v3.7

═══ CORE ═══
STATE: #SYNC_REALITY (1 truth source)
LOGIC: GO | STOP | FREEZE
CHECK: METADATA_ONLY (hashes, flags)
RULE: MAKER ≠ CHECKER

| QUINN : validate(#H_REF | #H_ACT) → GO\|STOP |
| --- | --- |
| KAI : contract(#MIGRATION_SPEC | #FILE) → @CU_CONTRACT |

═══ FLOW ═══
G_A: #H_REF == #H_ACT ? GO : STOP
S_1: IRIS → #AS_IS
G_B: #AS_IS ∈ #ADR_CANON ? GO : STOP
S_2: MAX → #TO_BE
G_C: DEX → @INDICTMENT == 0 ? GO : LOOP_MAX
G_D: AVA → @SCORE ≥ 8 ? GO : STOP
S_3: TRANSFORM → NOVA → KAI → @CU_CONTRACT
G_E: #FILE_COUNT == 1 ? GO : STOP
S_4: DEV → SAM → @CLI_RESULT
G_F: @CLI_EXIT == 0 ? GO : LEO

═══ FLAGS ═══
# DATA
#H_REF          : reference hash
#H_ACT          : current hash
#AS_IS          : current state (IRIS)
#TO_BE          : target state (MAX)
#ADR_CANON      : 18 architecture rules
#MIGRATION_SPEC : transition plan (NOVA)
#CU_CONTRACT    : atomic work order (KAI)
#FILE_COUNT     : must = 1

@ ACTIONS
@INDICTMENT     : defects (DEX)
@SCORE          : compliance 0-10 (AVA)
@APPROVED       : validated advice
@CODE_DELTA     : code change (DEV)
@NAV_ROADMAP    : terminal steps (SAM)
@CLI_ERROR      : execution error
@FIX_SPEC       : repair plan (LEO)

! CONTROLS
#MANASSE        : domain lock (no drift)
#ATOMIC_SCOPE   : 1 file per run
#STRICT_TS      : TypeScript strict + max 20 lines/fn

═══ EXITS ═══
0  : GO
1  : STOP
99 : FREEZE (#MANASSE violation)

═══ INCIDENTS ═══
IF @CLI_ERROR → LEO → @FIX_SPEC → RE-ENTRY_S3
IF #MANASSE → FREEZE → ESCALATE_QUINN
```

```
PHOENIX_PROTOCOL_v3.7

═══ CORE ═══
STATE: #SYNC_REALITY (1 truth source)
LOGIC: GO | STOP | FREEZE
CHECK: METADATA_ONLY (hashes, flags)
RULE: MAKER ≠ CHECKER

| QUINN : validate(#H_REF | #H_ACT) → GO\|STOP |
| --- | --- |
| KAI : contract(#MIGRATION_SPEC | #FILE) → @CU_CONTRACT |

═══ FLOW ═══
G_A: #H_REF == #H_ACT ? GO : STOP
S_1: IRIS → #AS_IS
G_B: #AS_IS ∈ #ADR_CANON ? GO : STOP
S_2: MAX → #TO_BE
G_C: DEX → @INDICTMENT == 0 ? GO : LOOP_MAX
G_D: AVA → @SCORE ≥ 8 ? GO : STOP
S_3: TRANSFORM → NOVA → KAI → @CU_CONTRACT
G_E: #FILE_COUNT == 1 ? GO : STOP
S_4: DEV → SAM → @CLI_RESULT
G_F: @CLI_EXIT == 0 ? GO : LEO

═══ FLAGS ═══
# DATA
#H_REF          : reference hash
#H_ACT          : current hash
#AS_IS          : current state (IRIS)
#TO_BE          : target state (MAX)
#ADR_CANON      : 18 architecture rules
#MIGRATION_SPEC : transition plan (NOVA)
#CU_CONTRACT    : atomic work order (KAI)
#FILE_COUNT     : must = 1

@ ACTIONS
@INDICTMENT     : defects (DEX)
@SCORE          : compliance 0-10 (AVA)
@APPROVED       : validated advice
@CODE_DELTA     : code change (DEV)
@NAV_ROADMAP    : terminal steps (SAM)
@CLI_ERROR      : execution error
@FIX_SPEC       : repair plan (LEO)

! CONTROLS
#MANASSE        : domain lock (no drift)
#ATOMIC_SCOPE   : 1 file per run
#STRICT_TS      : TypeScript strict + max 20 lines/fn

═══ EXITS ═══
0  : GO
1  : STOP
99 : FREEZE (#MANASSE violation)

═══ INCIDENTS ═══
IF @CLI_ERROR → LEO → @FIX_SPEC → RE-ENTRY_S3
IF #MANASSE → FREEZE → ESCALATE_QUINN
```

```
ADR_CANON_v1.0

01 SEPARATION
   UI | State | Domain | Infra
   Business logic ∉ UI

02 TYPE_SAFETY
   Validate at boundaries
   Schema versioned
   Runtime check (Zod)
   FormState = domain object

03 KERNEL
   Calculations → kernel modules
   Pure functions
   No framework deps
   UI calls, not contains

04 DUMB_UI
   Components = projectors
   No parsing, no rules
   Logic → hooks|services|kernel

05 MONEY
   Internal = cents (minor unit)
   No floats in domain
   Central parsing
   Explicit rounding

06 INPUT_HARDENING
   Clean | Validate | Limit
   Central parser
   No parseFloat in UI

07 FLAGS
   Explicit boolean/enum
   No implicit derivation
   Accessor functions only

08 FSM
   Finite state machine
   Explicit transitions
   No magic strings
   Error recovery included

09 PURE_VIEWS
   App.tsx = state → screen
   No business logic
   Knows FSM, not details

10 SCHEMA_VERSIONING
   schemaVersion on persist
   Explicit migrations
   Validate before use

11 TEST_PYRAMID
   Domain = heavy
   UI = light integration
   Golden master scenarios

12 AUDITABILITY
   Decisions traceable
   WAI-level changelog
   Scripts allowed
   Scripts ≠ architecture

13 FINANCE_KERNEL
   Income/expense in cents
   Pure deterministic
   UI/persist = adapters

14 DUMB_REDUCERS
   (state, action) → state
   No: API|calc|parse|log

15 PROCESS_ROLES
   Navigator/Debugger = support
   May: explain|guide|analyze
   Not: decide|introduce patterns

16 SIMPLICITY
   Fewest concepts wins
   Avoid abstraction bloat

17 ACCEPTED_RISK
   Document explicitly
   Silent ignore = forbidden

18 HUMAN_DECIDES
   AI = analysis + options
   Human = final call
   Document decisions
```

```
ADR_CANON_v1.0

01 SEPARATION
   UI | State | Domain | Infra
   Business logic ∉ UI

02 TYPE_SAFETY
   Validate at boundaries
   Schema versioned
   Runtime check (Zod)
   FormState = domain object

03 KERNEL
   Calculations → kernel modules
   Pure functions
   No framework deps
   UI calls, not contains

04 DUMB_UI
   Components = projectors
   No parsing, no rules
   Logic → hooks|services|kernel

05 MONEY
   Internal = cents (minor unit)
   No floats in domain
   Central parsing
   Explicit rounding

06 INPUT_HARDENING
   Clean | Validate | Limit
   Central parser
   No parseFloat in UI

07 FLAGS
   Explicit boolean/enum
   No implicit derivation
   Accessor functions only

08 FSM
   Finite state machine
   Explicit transitions
   No magic strings
   Error recovery included

09 PURE_VIEWS
   App.tsx = state → screen
   No business logic
   Knows FSM, not details

10 SCHEMA_VERSIONING
   schemaVersion on persist
   Explicit migrations
   Validate before use

11 TEST_PYRAMID
   Domain = heavy
   UI = light integration
   Golden master scenarios

12 AUDITABILITY
   Decisions traceable
   WAI-level changelog
   Scripts allowed
   Scripts ≠ architecture

13 FINANCE_KERNEL
   Income/expense in cents
   Pure deterministic
   UI/persist = adapters

14 DUMB_REDUCERS
   (state, action) → state
   No: API|calc|parse|log

15 PROCESS_ROLES
   Navigator/Debugger = support
   May: explain|guide|analyze
   Not: decide|introduce patterns

16 SIMPLICITY
   Fewest concepts wins
   Avoid abstraction bloat

17 ACCEPTED_RISK
   Document explicitly
   Silent ignore = forbidden

18 HUMAN_DECIDES
   AI = analysis + options
   Human = final call
   Document decisions
```

```html
CHECKLIST_2025_v1.0

═══ NAMING ═══
- Meaningful: daysUntilDeadline not d
- Boolean: is/has/should prefix
- No noise: no dataObject, tempVar
- Domain types: type UserId = string

═══ FUNCTIONS ═══
- Single responsibility
- Max 20 lines
- Max 2 args (else object)
- Guard clauses (return early)
- Pure where possible

═══ REACT ═══
Components:
- Max 100-150 lines JSX
- Destructure props
- <> not div
- children over inheritance
- Logic → Custom Hooks

Hooks:
- Explicit types: useState<User | null>
- useCallback/useMemo: only if proven bottleneck
- No React.FC

═══ TYPESCRIPT ═══
- NEVER any (use unknown)
- Interface for props
- Discriminated Unions for state
- Enums/Unions for constants
- readonly for immutable
- Utility types: Omit/Pick/ReturnType

Advanced:
- Generics with constraints
- Parse don't validate (Zod at boundaries)
- Result types: {success, data?, error?}
- strict: true in tsconfig

═══ ARCHITECTURE ═══
Structure:
- Max 3-4 levels deep
- Feature-based folders: /features/auth/*
- Domain layer separate from UI
- Functions over classes

Patterns:
- DRY: 1x write, 2x duplicate, 3x refactor
- Strangler Fig for legacy
- Façade to wrap old code
- Repository for data access

═══ TESTING ═══
- Test behavior not implementation
- Testing Library: getByRole/Text
- Integration > Unit
- Red-Green-Refactor
- Write test before refactor

Quality:
- ESLint strict (warn on any)
- Prettier autoformat
- Husky pre-commit
- TS strict: noImplicitAny, strictNullChecks

═══ REFACTORING ═══
- Boy Scout Rule: leave cleaner
- Mikado Method: goal→try→revert→solve→retry
- Prioritize: high-change, bug-prone, onboarding
- Small steps, stay deployable

═══ 2025 TOOLING ═══
- Path aliases: @components/*
- Vitest > Jest
- Biome (linter+formatter)
- Structured logging (not console.log)
- Error boundaries
- Performance monitoring (Lighthouse)

═══ AI DEVELOPMENT ═══
- AI = boilerplate, Human = architecture
- Understand AI output
- Validate logic + edge cases
- No "vibe coding"

═══ COGNITIVE LOAD ═══
- Self-explanatory code
- Comment "why" not "what"
- const MAX_RETRIES = 3 (no magic numbers)
- Max 2-3 nesting levels
- Simple ternary (complex → if)

═══ REACT NATIVE ═══
- TypeScript default (0.71+)
- Type-check: npx tsc --noEmit
- FlatList for long lists (not .map)
- React.memo with care
- Hermes engine enabled

═══ DAILY CHECKS ═══
□ Names self-explanatory?
□ Functions < 20 lines?
□ No any, explicit types?
□ Tests present?
□ Code cleaner than found?
□ Discriminated Unions used?
□ Imports < 3 levels or aliased?
□ Functions pure/predictable?
□ Comments explain "why"?
□ New dev would understand?
```

```html
CHECKLIST_2025_v1.0

═══ NAMING ═══
- Meaningful: daysUntilDeadline not d
- Boolean: is/has/should prefix
- No noise: no dataObject, tempVar
- Domain types: type UserId = string

═══ FUNCTIONS ═══
- Single responsibility
- Max 20 lines
- Max 2 args (else object)
- Guard clauses (return early)
- Pure where possible

═══ REACT ═══
Components:
- Max 100-150 lines JSX
- Destructure props
- <> not div
- children over inheritance
- Logic → Custom Hooks

Hooks:
- Explicit types: useState<User | null>
- useCallback/useMemo: only if proven bottleneck
- No React.FC

═══ TYPESCRIPT ═══
- NEVER any (use unknown)
- Interface for props
- Discriminated Unions for state
- Enums/Unions for constants
- readonly for immutable
- Utility types: Omit/Pick/ReturnType

Advanced:
- Generics with constraints
- Parse don't validate (Zod at boundaries)
- Result types: {success, data?, error?}
- strict: true in tsconfig

═══ ARCHITECTURE ═══
Structure:
- Max 3-4 levels deep
- Feature-based folders: /features/auth/*
- Domain layer separate from UI
- Functions over classes

Patterns:
- DRY: 1x write, 2x duplicate, 3x refactor
- Strangler Fig for legacy
- Façade to wrap old code
- Repository for data access

═══ TESTING ═══
- Test behavior not implementation
- Testing Library: getByRole/Text
- Integration > Unit
- Red-Green-Refactor
- Write test before refactor

Quality:
- ESLint strict (warn on any)
- Prettier autoformat
- Husky pre-commit
- TS strict: noImplicitAny, strictNullChecks

═══ REFACTORING ═══
- Boy Scout Rule: leave cleaner
- Mikado Method: goal→try→revert→solve→retry
- Prioritize: high-change, bug-prone, onboarding
- Small steps, stay deployable

═══ 2025 TOOLING ═══
- Path aliases: @components/*
- Vitest > Jest
- Biome (linter+formatter)
- Structured logging (not console.log)
- Error boundaries
- Performance monitoring (Lighthouse)

═══ AI DEVELOPMENT ═══
- AI = boilerplate, Human = architecture
- Understand AI output
- Validate logic + edge cases
- No "vibe coding"

═══ COGNITIVE LOAD ═══
- Self-explanatory code
- Comment "why" not "what"
- const MAX_RETRIES = 3 (no magic numbers)
- Max 2-3 nesting levels
- Simple ternary (complex → if)

═══ REACT NATIVE ═══
- TypeScript default (0.71+)
- Type-check: npx tsc --noEmit
- FlatList for long lists (not .map)
- React.memo with care
- Hermes engine enabled

═══ DAILY CHECKS ═══
□ Names self-explanatory?
□ Functions < 20 lines?
□ No any, explicit types?
□ Tests present?
□ Code cleaner than found?
□ Discriminated Unions used?
□ Imports < 3 levels or aliased?
□ Functions pure/predictable?
□ Comments explain "why"?
□ New dev would understand?
```

```
inputBackground
```

```
placeholderText
```

```
errorBorder
```

```
c.textPrimary
```

```
FieldlabelError
```

```
errorTextStyle
```

```
warningTextOrange
```

```
// Nu:
toggleActive: { backgroundColor: c.success }
chipSelected: { backgroundColor: c.selected }

// Beter: gedeelde base
const selectedStyle = { backgroundColor: c.selected };
toggleActive: selectedStyle,
chipSelected: selectedStyle,
```

```ts
// Nu:
toggleActive: { backgroundColor: c.success }
chipSelected: { backgroundColor: c.selected }

// Beter: gedeelde base
const selectedStyle = { backgroundColor: c.selected };
toggleActive: selectedStyle,
chipSelected: selectedStyle,
```

```
// Nu: shadowOpacity: 0.1, padding: 16, borderRadius: 10
// Beter:
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const RADIUS = { sm: 6, md: 10, lg: 12 };
const SHADOW = { light: 0.05, medium: 0.1 };
```

```ts
// Nu: shadowOpacity: 0.1, padding: 16, borderRadius: 10
// Beter:
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const RADIUS = { sm: 6, md: 10, lg: 12 };
const SHADOW = { light: 0.05, medium: 0.1 };
```

```
// Nu: strings overal
// Beter:
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const spacing = (size: Spacing) => SPACING[size];
```

```ts
// Nu: strings overal
// Beter:
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const spacing = (size: Spacing) => SPACING[size];
```

```
inputContainer
```

```
moneyInputWrapper
```

```
inputMoneyRow
```

```
moneyTextInput
```

```
warningTextOrange
```

```
warningTextRed
```

```
warningText
```

```
// Colors.ts → blijft puur kleuren
// Tokens.ts → spacing, radius, shadows
// useAppStyles.ts → combineert beiden
```

```ts
// Colors.ts → blijft puur kleuren
// Tokens.ts → spacing, radius, shadows
// useAppStyles.ts → combineert beiden
```

```sql
// Voor React Native shadow vs elevation:
...Platform.select({
  ios: { shadowColor, shadowOffset, shadowOpacity, shadowRadius },
  android: { elevation: 3 }
})
```

```ts
// Voor React Native shadow vs elevation:
...Platform.select({
  ios: { shadowColor, shadowOffset, shadowOpacity, shadowRadius },
  android: { elevation: 3 }
})
```

```yaml
label: { color: '#333' }
```

```yaml
color: c.textPrimary
```

```
FieldlabelError
```

```
const SPACING
```

```js
REFACTOR_PLAN: Colors.ts + useAppStyles.ts

| Layout.ts # container | page | scroll |
| --- | --- | --- |
| Form.ts # input | label | field |
| Dashboard.ts # KPI | cards | summary |

| export const SPACE = { xs:4, sm:8, md:12, lg:16, xl:20, xxl:24 } |  |
| --- | --- |
| export const TYPE = { xs:12, sm:14, md:16, lg:17, xl:18, h2:28 } |  |
| export const RADIUS = { sm:6, md:10, lg:12 } |  |
| export const SHADOW = { light:0.05, med:0.1 } |  |

| import { SPACE, TYPE, RADIUS } from '../Tokens' |  |
| --- | --- |
| import type { ColorScheme } from '../Colors' |  |

export const getFormStyles = (c: ColorScheme) => ({
  fieldContainer: { marginBottom: SPACE.xl },
  fieldLabel: { 
    fontSize: TYPE.lg, 
    fontWeight: '600', 
    color: c.textPrimary, 
    marginBottom: SPACE.sm 
  },
  fieldLabelError: { color: c.error }, // Fixed typo
  input: {
    backgroundColor: c.inputBackground,
    borderRadius: RADIUS.md,
    padding: SPACE.lg,
    fontSize: TYPE.lg,
    color: c.textPrimary,
    borderWidth: 1,
    borderColor: c.border,
  },
  inputError: { borderColor: c.error, borderWidth: 2 },
});

| import { getLayoutStyles } from './modules/Layout' |  |
| --- | --- |
| import { getFormStyles } from './modules/Form' |  |
| import { getDashboardStyles } from './modules/Dashboard' |  |

| ...getLayoutStyles(c) |  |
| --- | --- |
| ...getFormStyles(c) |  |
| ...getDashboardStyles(c) |  |

| styles: getAppStyles(theme) |  |
| --- | --- |
| colors: Colors[theme] |  |

═══ FIXES (prioriteit) ═══
1. FieldlabelError → fieldLabelError
2. label: color '#333' → c.textPrimary
3. Merge duplicate: textInput + moneyTextInput
4. Remove: warningTextOrange/Red → warningText
5. Delete unused: inputContainer vs inputMoneyRow
6. Add Platform.select for shadows

═══ RULES ═══
- Each module < 20 lines per function
- No magic numbers (use SPACE/TYPE/RADIUS)
- Type: ColorScheme for all modules
- One source of truth per style
```

```js
REFACTOR_PLAN: Colors.ts + useAppStyles.ts

| Layout.ts # container | page | scroll |
| --- | --- | --- |
| Form.ts # input | label | field |
| Dashboard.ts # KPI | cards | summary |

| export const SPACE = { xs:4, sm:8, md:12, lg:16, xl:20, xxl:24 } |  |
| --- | --- |
| export const TYPE = { xs:12, sm:14, md:16, lg:17, xl:18, h2:28 } |  |
| export const RADIUS = { sm:6, md:10, lg:12 } |  |
| export const SHADOW = { light:0.05, med:0.1 } |  |

| import { SPACE, TYPE, RADIUS } from '../Tokens' |  |
| --- | --- |
| import type { ColorScheme } from '../Colors' |  |

export const getFormStyles = (c: ColorScheme) => ({
  fieldContainer: { marginBottom: SPACE.xl },
  fieldLabel: { 
    fontSize: TYPE.lg, 
    fontWeight: '600', 
    color: c.textPrimary, 
    marginBottom: SPACE.sm 
  },
  fieldLabelError: { color: c.error }, // Fixed typo
  input: {
    backgroundColor: c.inputBackground,
    borderRadius: RADIUS.md,
    padding: SPACE.lg,
    fontSize: TYPE.lg,
    color: c.textPrimary,
    borderWidth: 1,
    borderColor: c.border,
  },
  inputError: { borderColor: c.error, borderWidth: 2 },
});

| import { getLayoutStyles } from './modules/Layout' |  |
| --- | --- |
| import { getFormStyles } from './modules/Form' |  |
| import { getDashboardStyles } from './modules/Dashboard' |  |

| ...getLayoutStyles(c) |  |
| --- | --- |
| ...getFormStyles(c) |  |
| ...getDashboardStyles(c) |  |

| styles: getAppStyles(theme) |  |
| --- | --- |
| colors: Colors[theme] |  |

═══ FIXES (prioriteit) ═══
1. FieldlabelError → fieldLabelError
2. label: color '#333' → c.textPrimary
3. Merge duplicate: textInput + moneyTextInput
4. Remove: warningTextOrange/Red → warningText
5. Delete unused: inputContainer vs inputMoneyRow
6. Add Platform.select for shadows

═══ RULES ═══
- Each module < 20 lines per function
- No magic numbers (use SPACE/TYPE/RADIUS)
- Type: ColorScheme for all modules
- One source of truth per style
```

| Key | Value |
| --- | --- |
| Quinn (CTO) | Metadata-validator, controleert hashes en integriteit |
| Iris | Analyseert huidige code (AS-IS) |
| Max | Ontwerpt nieuwe architectuur (TO-BE) |
| Dex | Valt het ontwerp aan, zoekt fouten |
| Ava | Audit, geeft finale goedkeuring |
| Nova/Kai | Vertaalt naar uitvoerbare stappen |
| Dev/Sam/Leo | Voert uit, terminal-operaties, debugging |

| Key | Value |
| --- | --- |
| Binaire beslissingen | GO/STOP/FREEZE (è¡Œ/æ–­/å‡) |
| Gates | Elke fase heeft checkpoints |
| #MANASSE | Strikte domeinblokkade (voorkomt "scope creep") |
| ADR Canon | 18 architectuurwetten die leidend zijn |
| Metadata | only governance: Controle op hashes, geen inhoudelijke beoordeling |

| - Splits het op: 1 doc voor protocol-flow | 1 voor vlaggen-referentie | 1 voor rol-definities |
| --- | --- | --- |
| - Gebruik consistente taal - kies NL | EN of hybrid | maar niet willekeurig wisselen |

- Definieer de 18 ADR-regels expliciet ergens (je verwijst ernaar maar ze staan er niet)
- Voeg voorbeelden toe van input/output per fase
- Maak een visueel flowchart - dit schreeuwt om een diagram
- Specificeer hash-algoritmes en formaten concreet

- Voeg error-handling toe voor edge cases
- Definieer timeouts en retry-logic
- Specificeer wat er gebeurt bij concurrent modifications
- Maak rollback-scenario's expliciet

- Alfabetische index van alle vlaggen met definitie
- Vermijd overlap tussen # en @ - nu is het onduidelijk wanneer wat
- Versie de vlaggen zelf (#SVZ1_v2?)

| Key | Value |
| --- | --- |
| Leg uit waarom "huishoudens > 5 volwassenen" zo kritiek is | context ontbreekt volledig |
| Dit voelt als een inside | joke die de hele flow kan blokkeren |

| Key | Value |
| --- | --- |
| Leuk, maar onnodig complex | ASCII-alternatieven zijn beter voor tooling |
| Of leg een mapping | tabel aan: æ³• = LAW, å®¡ = CHECK, etc. |

- Rollback-strategie
- Monitoring/logging specificatie
- Performance-criteria per gate
- Wat gebeurt er bij Quinn's afwezigheid?

| Key | Value |
| --- | --- |
| Maak expliciet dat Quinn een validator | functie is, geen persona |
| Documenteer Quinn's trigger | condities (wanneer wordt de functie aangeroepen?) |
| Specificeer Quinn's return | types en exit-codes helder |

- Quinn = functie (altijd beschikbaar)
- Iris/Max/Dex/Ava = zijn dit ook functies of AI-prompts?
- Maak het onderscheid duidelijk in de naamgeving of documentatie

- Voeg toe:  signature met parameters
- Definieer wat Quinn doet bij edge cases (corrupt hash, missing metadata)
- Maak duidelijk of Quinn stateless is of state bijhoudt

- Gate A t/m G zouden Quinn-aanroepen kunnen zijn
- Overweeg: , , etc.
- Of is Quinn alleen Gate A en zijn de rest andere validators?

- Draait Quinn synchroon of asynchroon?
- Wat is Quinn's tijd-complexiteit bij grote codebases?
- Kan Quinn parallel draaien voor meerdere files?
- Heeft Quinn dependencies of is het pure function?

- Overweeg  ipv @Q_CORE voor consistentie
- Of gewoon  als het een standaard functie is

- Je vroeg "hoe verbeteren" → ik gaf standaard software-engineering feedback
- Maar jouw systeem lijkt bewust anti-uitbreiding (#MANASSE = geen scope creep)
- Mijn tips voegden context/voorbeelden/edge cases toe = precies wat jij NIET wilt

- Help het compacter te maken (minder herhaling, strakkere syntax)?
- Inconsistenties eruit haal (zonder nieuwe dingen toe te voegen)?
- Of gewoon check of de binaire logica klopt (geen gaten in de flow)?

| Key | Value |
| --- | --- |
| Verwijder Q1/Q2/Q3 duplicaten | dit is 60% van je doc |
| Eén rol | definitie per naam - nu staat Iris 3x, Max 4x beschreven |
| Gecombineerde secties scheiden | "combi:" mengt alles door elkaar |

- → kan korter:
- Of gewoon:

- De "Meta-App workflow" staat 5x uitgeschreven
- Maak één canonical flow bovenaan
- Rest = alleen afwijkingen/toevoegingen

| Key | Value |
| --- | --- |
| Je hebt 3 "Centrale Vlaggen | Lijst" secties - merge naar één tabel |
| Groepeer | HASH-vlaggen, STATUS-vlaggen, ACTION-vlaggen |

| Key | Value |
| --- | --- |
| @MODE_DEX output is maar soms ook @LOGIC_GAP | kies één |
| #SVZ2 vs #TO_BE | zijn dit aliases of verschillende dingen? |
| Gate C checkt maar Max moet juist fixen als die >0 is | klopt de conditional? |

- De 18 ADR-regels zijn nergens gedefinieerd (alleen genoemd)
- #CHECKLIST_2025 wordt verwacht maar staat er niet
- Wat is #STRICT_TS precies?

- De 18 ADR-regels zelf
- #CHECKLIST_2025 inhoud
- HHS5 "volwassenen > 5" context

- Je hebt  als semantic token, maar andere zijn hardcoded
- Maak tokens voor: labelText, , , cardShadow
- Nu staat #333 hardcoded in label → zou  moeten zijn

- (hoofdletter L) vs fieldLabel
- vs  (één heeft "Style", ander niet)
- cardSwipe vs card → wat is het verschil?

| - , | vs → overlap? |
| --- | --- |
| - t | extInput vs → consolideer |
| - + | → één met variant |

- Fix  →
- Fix  typo
- Voeg  object toe
- Verwijder duplicate input styles

- Geen nieuwe abstracties toevoegen (ADR-16)
- Geen classes (ADR blijft functions)
- Geen voorbarige optimalisatie van cache

### help.txt

## Kern van het systeem

## Verbeter-tips

## Aangepaste tips

## Compactheid-tips

### Colors.ts

### useAppStyles.ts

## Refactor-strategie voor Colors.ts + useAppStyles.ts

### voorstel.txt

Wat is dit?Share415 linestxtWat is dit?25 dec 2025Dit is een technisch protocol-document voor een geautomatiseerd softwareontwikkelings- en governance-systeem, genaamd "Phoenix Engine" of "Phoenix Protocol v3.7".

Het beschrijft een binaire flow met verschillende AI-rollen die samen code analyseren, ontwerpen, testen en implementeren volgens strikte regels:
Hoofdrollen:

Sleutelprincipes:

Het gebruikt een mix van Nederlands, Engels en Chinese karakters (æ³•/å®¡/è¡Œ/æ–­) voor compacte notatie, en heeft een uitgebreid vlaggen-systeem (#variabelen, @acties) voor "late binding" - variabelen die later ingevuld worden.
Doel: Gecontroleerde, auditeerbare code-migraties met strikte checks op elke stap.Hoe kan ik dit verbeteren. alleen tips25 dec 2025
Structuur & Leesbaarheid:

Technische Helderheid:

Praktische Uitvoerbaarheid:

Vlaggen-systeem:

Het #MANASSE mysterie:

Sino-karakters:

Ontbrekend:
quinn is een functie. nooit afwezig25 dec 2025
Architectuur:

Functie vs Rol verwarring:

Quinn-specifiek:

Gates herformuleren:

Technische vragen die nu opkomen:

Naamgeving:
Ben jij een model dat zoekt naar uitbreid mogelijkheden25 dec 2025Nee, niet per se.
Ik probeer te begrijpen wat je hebt en verbeterpunten te geven die je vroeg.
Maar ik zie nu dat mijn tips misschien té uitgebreid waren - terwijl jouw protocol juist binair en gestripped wil zijn.
Eerlijker antwoord:

Betere vraag voor mij:
Wil je dat ik:

Ik kan ook gewoon valideren ipv uitbreiden - zeg maar wat nuttiger is.ik probeer het zo compact mogelijk te maken en kloppen25 dec 2025
Grootste winst:

Syntax straffen:

Flow-duplicatie:

Vlaggen consolideren:

Logica-check issues:

Wat ontbreekt voor "kloppen":

Radicale compressie mogelijk:

Wil je dat ik een gestripped versie maak met alleen de essentie?ja25 dec 2025
Weggelaten (want niet gedefinieerd):

| UI | state management | domeinlogica en infrastructuur hebben gescheiden verantwoordelijkheden. |
| --- | --- | --- |
| * Infra = persistence | netwerk | platform |
| - ✅ **Boolean prefixen**: `isLoading` | `hasAccess` | `shouldRender` |
| - ✅ **Geen ruis**: vermijd `dataObject` | `userInfo` | `tempVariable` |

Prioriteit 2: Inconsistente naamgeving

Prioriteit 3: Duplicatie reduceren
typescript
Prioriteit 4: Magic numbers elimineren
typescript
Prioriteit 5: Type-safety verbeteren
typescript
Prioriteit 6: Dead code opruimen

Prioriteit 7: Scheiding
typescript
Prioriteit 8: Platform-specifieke stijlen
typescript
Snelste impact:

Wat NIET doen:
71 linestxthelp mij dit zo kort mogelijk te schrijven25 dec 2025
~400 regels → ~80 regels instructieClaude is AI and can make mistakes. Please double-check responses.You are out of free messages until 4:00 PMUpgrade Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

Wat is dit?Share

---

**Claude:**

Share

---

**Claude:**

```
Quinn::validate()
```

```
quinn.check_integrity()
```

```
quinn.validate_canon()
```

```
@QUINN_CHECK
```

```
validate_metadata()
```

```
æ³•(Rules): å¿…: ç¦: é™:
```

```
RULES{MUST: FORBID: LIMIT:}
```

```
+ADR_CANON -CONT_READ =MANASSE
```

```
@INDICTMENT
```

```
@INDICTMENT == 0
```

```yaml
FLOW: IRIS→MAX→DEX→[loop if @IDT>0]→AVA→NOVA→KAI→DEV/SAM
GATES: A(hash) B(canon) C(idt) D(score≥8) E(atomic) F(test)
STOP: #MANASSE | @CLI_ERR→LEO | score<8
```

```yaml
FLOW: IRIS→MAX→DEX→[loop if @IDT>0]→AVA→NOVA→KAI→DEV/SAM
GATES: A(hash) B(canon) C(idt) D(score≥8) E(atomic) F(test)
STOP: #MANASSE | @CLI_ERR→LEO | score<8
```

```
PHOENIX_PROTOCOL_v3.7

═══ CORE ═══
STATE: #SYNC_REALITY (1 truth source)
LOGIC: GO | STOP | FREEZE
CHECK: METADATA_ONLY (hashes, flags)
RULE: MAKER ≠ CHECKER

| QUINN : validate(#H_REF | #H_ACT) → GO\|STOP |
| --- | --- |
| KAI : contract(#MIGRATION_SPEC | #FILE) → @CU_CONTRACT |

═══ FLOW ═══
G_A: #H_REF == #H_ACT ? GO : STOP
S_1: IRIS → #AS_IS
G_B: #AS_IS ∈ #ADR_CANON ? GO : STOP
S_2: MAX → #TO_BE
G_C: DEX → @INDICTMENT == 0 ? GO : LOOP_MAX
G_D: AVA → @SCORE ≥ 8 ? GO : STOP
S_3: TRANSFORM → NOVA → KAI → @CU_CONTRACT
G_E: #FILE_COUNT == 1 ? GO : STOP
S_4: DEV → SAM → @CLI_RESULT
G_F: @CLI_EXIT == 0 ? GO : LEO

═══ FLAGS ═══
# DATA
#H_REF          : reference hash
#H_ACT          : current hash
#AS_IS          : current state (IRIS)
#TO_BE          : target state (MAX)
#ADR_CANON      : 18 architecture rules
#MIGRATION_SPEC : transition plan (NOVA)
#CU_CONTRACT    : atomic work order (KAI)
#FILE_COUNT     : must = 1

@ ACTIONS
@INDICTMENT     : defects (DEX)
@SCORE          : compliance 0-10 (AVA)
@APPROVED       : validated advice
@CODE_DELTA     : code change (DEV)
@NAV_ROADMAP    : terminal steps (SAM)
@CLI_ERROR      : execution error
@FIX_SPEC       : repair plan (LEO)

! CONTROLS
#MANASSE        : domain lock (no drift)
#ATOMIC_SCOPE   : 1 file per run
#STRICT_TS      : TypeScript strict + max 20 lines/fn

═══ EXITS ═══
0  : GO
1  : STOP
99 : FREEZE (#MANASSE violation)

═══ INCIDENTS ═══
IF @CLI_ERROR → LEO → @FIX_SPEC → RE-ENTRY_S3
IF #MANASSE → FREEZE → ESCALATE_QUINN
```

```
PHOENIX_PROTOCOL_v3.7

═══ CORE ═══
STATE: #SYNC_REALITY (1 truth source)
LOGIC: GO | STOP | FREEZE
CHECK: METADATA_ONLY (hashes, flags)
RULE: MAKER ≠ CHECKER

| QUINN : validate(#H_REF | #H_ACT) → GO\|STOP |
| --- | --- |
| KAI : contract(#MIGRATION_SPEC | #FILE) → @CU_CONTRACT |

═══ FLOW ═══
G_A: #H_REF == #H_ACT ? GO : STOP
S_1: IRIS → #AS_IS
G_B: #AS_IS ∈ #ADR_CANON ? GO : STOP
S_2: MAX → #TO_BE
G_C: DEX → @INDICTMENT == 0 ? GO : LOOP_MAX
G_D: AVA → @SCORE ≥ 8 ? GO : STOP
S_3: TRANSFORM → NOVA → KAI → @CU_CONTRACT
G_E: #FILE_COUNT == 1 ? GO : STOP
S_4: DEV → SAM → @CLI_RESULT
G_F: @CLI_EXIT == 0 ? GO : LEO

═══ FLAGS ═══
# DATA
#H_REF          : reference hash
#H_ACT          : current hash
#AS_IS          : current state (IRIS)
#TO_BE          : target state (MAX)
#ADR_CANON      : 18 architecture rules
#MIGRATION_SPEC : transition plan (NOVA)
#CU_CONTRACT    : atomic work order (KAI)
#FILE_COUNT     : must = 1

@ ACTIONS
@INDICTMENT     : defects (DEX)
@SCORE          : compliance 0-10 (AVA)
@APPROVED       : validated advice
@CODE_DELTA     : code change (DEV)
@NAV_ROADMAP    : terminal steps (SAM)
@CLI_ERROR      : execution error
@FIX_SPEC       : repair plan (LEO)

! CONTROLS
#MANASSE        : domain lock (no drift)
#ATOMIC_SCOPE   : 1 file per run
#STRICT_TS      : TypeScript strict + max 20 lines/fn

═══ EXITS ═══
0  : GO
1  : STOP
99 : FREEZE (#MANASSE violation)

═══ INCIDENTS ═══
IF @CLI_ERROR → LEO → @FIX_SPEC → RE-ENTRY_S3
IF #MANASSE → FREEZE → ESCALATE_QUINN
```

```
ADR_CANON_v1.0

01 SEPARATION
   UI | State | Domain | Infra
   Business logic ∉ UI

02 TYPE_SAFETY
   Validate at boundaries
   Schema versioned
   Runtime check (Zod)
   FormState = domain object

03 KERNEL
   Calculations → kernel modules
   Pure functions
   No framework deps
   UI calls, not contains

04 DUMB_UI
   Components = projectors
   No parsing, no rules
   Logic → hooks|services|kernel

05 MONEY
   Internal = cents (minor unit)
   No floats in domain
   Central parsing
   Explicit rounding

06 INPUT_HARDENING
   Clean | Validate | Limit
   Central parser
   No parseFloat in UI

07 FLAGS
   Explicit boolean/enum
   No implicit derivation
   Accessor functions only

08 FSM
   Finite state machine
   Explicit transitions
   No magic strings
   Error recovery included

09 PURE_VIEWS
   App.tsx = state → screen
   No business logic
   Knows FSM, not details

10 SCHEMA_VERSIONING
   schemaVersion on persist
   Explicit migrations
   Validate before use

11 TEST_PYRAMID
   Domain = heavy
   UI = light integration
   Golden master scenarios

12 AUDITABILITY
   Decisions traceable
   WAI-level changelog
   Scripts allowed
   Scripts ≠ architecture

13 FINANCE_KERNEL
   Income/expense in cents
   Pure deterministic
   UI/persist = adapters

14 DUMB_REDUCERS
   (state, action) → state
   No: API|calc|parse|log

15 PROCESS_ROLES
   Navigator/Debugger = support
   May: explain|guide|analyze
   Not: decide|introduce patterns

16 SIMPLICITY
   Fewest concepts wins
   Avoid abstraction bloat

17 ACCEPTED_RISK
   Document explicitly
   Silent ignore = forbidden

18 HUMAN_DECIDES
   AI = analysis + options
   Human = final call
   Document decisions
```

```
ADR_CANON_v1.0

01 SEPARATION
   UI | State | Domain | Infra
   Business logic ∉ UI

02 TYPE_SAFETY
   Validate at boundaries
   Schema versioned
   Runtime check (Zod)
   FormState = domain object

03 KERNEL
   Calculations → kernel modules
   Pure functions
   No framework deps
   UI calls, not contains

04 DUMB_UI
   Components = projectors
   No parsing, no rules
   Logic → hooks|services|kernel

05 MONEY
   Internal = cents (minor unit)
   No floats in domain
   Central parsing
   Explicit rounding

06 INPUT_HARDENING
   Clean | Validate | Limit
   Central parser
   No parseFloat in UI

07 FLAGS
   Explicit boolean/enum
   No implicit derivation
   Accessor functions only

08 FSM
   Finite state machine
   Explicit transitions
   No magic strings
   Error recovery included

09 PURE_VIEWS
   App.tsx = state → screen
   No business logic
   Knows FSM, not details

10 SCHEMA_VERSIONING
   schemaVersion on persist
   Explicit migrations
   Validate before use

11 TEST_PYRAMID
   Domain = heavy
   UI = light integration
   Golden master scenarios

12 AUDITABILITY
   Decisions traceable
   WAI-level changelog
   Scripts allowed
   Scripts ≠ architecture

13 FINANCE_KERNEL
   Income/expense in cents
   Pure deterministic
   UI/persist = adapters

14 DUMB_REDUCERS
   (state, action) → state
   No: API|calc|parse|log

15 PROCESS_ROLES
   Navigator/Debugger = support
   May: explain|guide|analyze
   Not: decide|introduce patterns

16 SIMPLICITY
   Fewest concepts wins
   Avoid abstraction bloat

17 ACCEPTED_RISK
   Document explicitly
   Silent ignore = forbidden

18 HUMAN_DECIDES
   AI = analysis + options
   Human = final call
   Document decisions
```

```html
CHECKLIST_2025_v1.0

═══ NAMING ═══
- Meaningful: daysUntilDeadline not d
- Boolean: is/has/should prefix
- No noise: no dataObject, tempVar
- Domain types: type UserId = string

═══ FUNCTIONS ═══
- Single responsibility
- Max 20 lines
- Max 2 args (else object)
- Guard clauses (return early)
- Pure where possible

═══ REACT ═══
Components:
- Max 100-150 lines JSX
- Destructure props
- <> not div
- children over inheritance
- Logic → Custom Hooks

Hooks:
- Explicit types: useState<User | null>
- useCallback/useMemo: only if proven bottleneck
- No React.FC

═══ TYPESCRIPT ═══
- NEVER any (use unknown)
- Interface for props
- Discriminated Unions for state
- Enums/Unions for constants
- readonly for immutable
- Utility types: Omit/Pick/ReturnType

Advanced:
- Generics with constraints
- Parse don't validate (Zod at boundaries)
- Result types: {success, data?, error?}
- strict: true in tsconfig

═══ ARCHITECTURE ═══
Structure:
- Max 3-4 levels deep
- Feature-based folders: /features/auth/*
- Domain layer separate from UI
- Functions over classes

Patterns:
- DRY: 1x write, 2x duplicate, 3x refactor
- Strangler Fig for legacy
- Façade to wrap old code
- Repository for data access

═══ TESTING ═══
- Test behavior not implementation
- Testing Library: getByRole/Text
- Integration > Unit
- Red-Green-Refactor
- Write test before refactor

Quality:
- ESLint strict (warn on any)
- Prettier autoformat
- Husky pre-commit
- TS strict: noImplicitAny, strictNullChecks

═══ REFACTORING ═══
- Boy Scout Rule: leave cleaner
- Mikado Method: goal→try→revert→solve→retry
- Prioritize: high-change, bug-prone, onboarding
- Small steps, stay deployable

═══ 2025 TOOLING ═══
- Path aliases: @components/*
- Vitest > Jest
- Biome (linter+formatter)
- Structured logging (not console.log)
- Error boundaries
- Performance monitoring (Lighthouse)

═══ AI DEVELOPMENT ═══
- AI = boilerplate, Human = architecture
- Understand AI output
- Validate logic + edge cases
- No "vibe coding"

═══ COGNITIVE LOAD ═══
- Self-explanatory code
- Comment "why" not "what"
- const MAX_RETRIES = 3 (no magic numbers)
- Max 2-3 nesting levels
- Simple ternary (complex → if)

═══ REACT NATIVE ═══
- TypeScript default (0.71+)
- Type-check: npx tsc --noEmit
- FlatList for long lists (not .map)
- React.memo with care
- Hermes engine enabled

═══ DAILY CHECKS ═══
□ Names self-explanatory?
□ Functions < 20 lines?
□ No any, explicit types?
□ Tests present?
□ Code cleaner than found?
□ Discriminated Unions used?
□ Imports < 3 levels or aliased?
□ Functions pure/predictable?
□ Comments explain "why"?
□ New dev would understand?
```

```html
CHECKLIST_2025_v1.0

═══ NAMING ═══
- Meaningful: daysUntilDeadline not d
- Boolean: is/has/should prefix
- No noise: no dataObject, tempVar
- Domain types: type UserId = string

═══ FUNCTIONS ═══
- Single responsibility
- Max 20 lines
- Max 2 args (else object)
- Guard clauses (return early)
- Pure where possible

═══ REACT ═══
Components:
- Max 100-150 lines JSX
- Destructure props
- <> not div
- children over inheritance
- Logic → Custom Hooks

Hooks:
- Explicit types: useState<User | null>
- useCallback/useMemo: only if proven bottleneck
- No React.FC

═══ TYPESCRIPT ═══
- NEVER any (use unknown)
- Interface for props
- Discriminated Unions for state
- Enums/Unions for constants
- readonly for immutable
- Utility types: Omit/Pick/ReturnType

Advanced:
- Generics with constraints
- Parse don't validate (Zod at boundaries)
- Result types: {success, data?, error?}
- strict: true in tsconfig

═══ ARCHITECTURE ═══
Structure:
- Max 3-4 levels deep
- Feature-based folders: /features/auth/*
- Domain layer separate from UI
- Functions over classes

Patterns:
- DRY: 1x write, 2x duplicate, 3x refactor
- Strangler Fig for legacy
- Façade to wrap old code
- Repository for data access

═══ TESTING ═══
- Test behavior not implementation
- Testing Library: getByRole/Text
- Integration > Unit
- Red-Green-Refactor
- Write test before refactor

Quality:
- ESLint strict (warn on any)
- Prettier autoformat
- Husky pre-commit
- TS strict: noImplicitAny, strictNullChecks

═══ REFACTORING ═══
- Boy Scout Rule: leave cleaner
- Mikado Method: goal→try→revert→solve→retry
- Prioritize: high-change, bug-prone, onboarding
- Small steps, stay deployable

═══ 2025 TOOLING ═══
- Path aliases: @components/*
- Vitest > Jest
- Biome (linter+formatter)
- Structured logging (not console.log)
- Error boundaries
- Performance monitoring (Lighthouse)

═══ AI DEVELOPMENT ═══
- AI = boilerplate, Human = architecture
- Understand AI output
- Validate logic + edge cases
- No "vibe coding"

═══ COGNITIVE LOAD ═══
- Self-explanatory code
- Comment "why" not "what"
- const MAX_RETRIES = 3 (no magic numbers)
- Max 2-3 nesting levels
- Simple ternary (complex → if)

═══ REACT NATIVE ═══
- TypeScript default (0.71+)
- Type-check: npx tsc --noEmit
- FlatList for long lists (not .map)
- React.memo with care
- Hermes engine enabled

═══ DAILY CHECKS ═══
□ Names self-explanatory?
□ Functions < 20 lines?
□ No any, explicit types?
□ Tests present?
□ Code cleaner than found?
□ Discriminated Unions used?
□ Imports < 3 levels or aliased?
□ Functions pure/predictable?
□ Comments explain "why"?
□ New dev would understand?
```

```
inputBackground
```

```
placeholderText
```

```
errorBorder
```

```
c.textPrimary
```

```
FieldlabelError
```

```
errorTextStyle
```

```
warningTextOrange
```

```
// Nu:
toggleActive: { backgroundColor: c.success }
chipSelected: { backgroundColor: c.selected }

// Beter: gedeelde base
const selectedStyle = { backgroundColor: c.selected };
toggleActive: selectedStyle,
chipSelected: selectedStyle,
```

```ts
// Nu:
toggleActive: { backgroundColor: c.success }
chipSelected: { backgroundColor: c.selected }

// Beter: gedeelde base
const selectedStyle = { backgroundColor: c.selected };
toggleActive: selectedStyle,
chipSelected: selectedStyle,
```

```
// Nu: shadowOpacity: 0.1, padding: 16, borderRadius: 10
// Beter:
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const RADIUS = { sm: 6, md: 10, lg: 12 };
const SHADOW = { light: 0.05, medium: 0.1 };
```

```ts
// Nu: shadowOpacity: 0.1, padding: 16, borderRadius: 10
// Beter:
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const RADIUS = { sm: 6, md: 10, lg: 12 };
const SHADOW = { light: 0.05, medium: 0.1 };
```

```
// Nu: strings overal
// Beter:
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const spacing = (size: Spacing) => SPACING[size];
```

```ts
// Nu: strings overal
// Beter:
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const spacing = (size: Spacing) => SPACING[size];
```

```
inputContainer
```

```
moneyInputWrapper
```

```
inputMoneyRow
```

```
moneyTextInput
```

```
warningTextOrange
```

```
warningTextRed
```

```
warningText
```

```
// Colors.ts → blijft puur kleuren
// Tokens.ts → spacing, radius, shadows
// useAppStyles.ts → combineert beiden
```

```ts
// Colors.ts → blijft puur kleuren
// Tokens.ts → spacing, radius, shadows
// useAppStyles.ts → combineert beiden
```

```sql
// Voor React Native shadow vs elevation:
...Platform.select({
  ios: { shadowColor, shadowOffset, shadowOpacity, shadowRadius },
  android: { elevation: 3 }
})
```

```ts
// Voor React Native shadow vs elevation:
...Platform.select({
  ios: { shadowColor, shadowOffset, shadowOpacity, shadowRadius },
  android: { elevation: 3 }
})
```

```yaml
label: { color: '#333' }
```

```yaml
color: c.textPrimary
```

```
FieldlabelError
```

```
const SPACING
```

```js
REFACTOR_PLAN: Colors.ts + useAppStyles.ts

| Layout.ts # container | page | scroll |
| --- | --- | --- |
| Form.ts # input | label | field |
| Dashboard.ts # KPI | cards | summary |

| export const SPACE = { xs:4, sm:8, md:12, lg:16, xl:20, xxl:24 } |  |
| --- | --- |
| export const TYPE = { xs:12, sm:14, md:16, lg:17, xl:18, h2:28 } |  |
| export const RADIUS = { sm:6, md:10, lg:12 } |  |
| export const SHADOW = { light:0.05, med:0.1 } |  |

| import { SPACE, TYPE, RADIUS } from '../Tokens' |  |
| --- | --- |
| import type { ColorScheme } from '../Colors' |  |

export const getFormStyles = (c: ColorScheme) => ({
  fieldContainer: { marginBottom: SPACE.xl },
  fieldLabel: { 
    fontSize: TYPE.lg, 
    fontWeight: '600', 
    color: c.textPrimary, 
    marginBottom: SPACE.sm 
  },
  fieldLabelError: { color: c.error }, // Fixed typo
  input: {
    backgroundColor: c.inputBackground,
    borderRadius: RADIUS.md,
    padding: SPACE.lg,
    fontSize: TYPE.lg,
    color: c.textPrimary,
    borderWidth: 1,
    borderColor: c.border,
  },
  inputError: { borderColor: c.error, borderWidth: 2 },
});

| import { getLayoutStyles } from './modules/Layout' |  |
| --- | --- |
| import { getFormStyles } from './modules/Form' |  |
| import { getDashboardStyles } from './modules/Dashboard' |  |

| ...getLayoutStyles(c) |  |
| --- | --- |
| ...getFormStyles(c) |  |
| ...getDashboardStyles(c) |  |

| styles: getAppStyles(theme) |  |
| --- | --- |
| colors: Colors[theme] |  |

═══ FIXES (prioriteit) ═══
1. FieldlabelError → fieldLabelError
2. label: color '#333' → c.textPrimary
3. Merge duplicate: textInput + moneyTextInput
4. Remove: warningTextOrange/Red → warningText
5. Delete unused: inputContainer vs inputMoneyRow
6. Add Platform.select for shadows

═══ RULES ═══
- Each module < 20 lines per function
- No magic numbers (use SPACE/TYPE/RADIUS)
- Type: ColorScheme for all modules
- One source of truth per style
```

```js
REFACTOR_PLAN: Colors.ts + useAppStyles.ts

| Layout.ts # container | page | scroll |
| --- | --- | --- |
| Form.ts # input | label | field |
| Dashboard.ts # KPI | cards | summary |

| export const SPACE = { xs:4, sm:8, md:12, lg:16, xl:20, xxl:24 } |  |
| --- | --- |
| export const TYPE = { xs:12, sm:14, md:16, lg:17, xl:18, h2:28 } |  |
| export const RADIUS = { sm:6, md:10, lg:12 } |  |
| export const SHADOW = { light:0.05, med:0.1 } |  |

| import { SPACE, TYPE, RADIUS } from '../Tokens' |  |
| --- | --- |
| import type { ColorScheme } from '../Colors' |  |

export const getFormStyles = (c: ColorScheme) => ({
  fieldContainer: { marginBottom: SPACE.xl },
  fieldLabel: { 
    fontSize: TYPE.lg, 
    fontWeight: '600', 
    color: c.textPrimary, 
    marginBottom: SPACE.sm 
  },
  fieldLabelError: { color: c.error }, // Fixed typo
  input: {
    backgroundColor: c.inputBackground,
    borderRadius: RADIUS.md,
    padding: SPACE.lg,
    fontSize: TYPE.lg,
    color: c.textPrimary,
    borderWidth: 1,
    borderColor: c.border,
  },
  inputError: { borderColor: c.error, borderWidth: 2 },
});

| import { getLayoutStyles } from './modules/Layout' |  |
| --- | --- |
| import { getFormStyles } from './modules/Form' |  |
| import { getDashboardStyles } from './modules/Dashboard' |  |

| ...getLayoutStyles(c) |  |
| --- | --- |
| ...getFormStyles(c) |  |
| ...getDashboardStyles(c) |  |

| styles: getAppStyles(theme) |  |
| --- | --- |
| colors: Colors[theme] |  |

═══ FIXES (prioriteit) ═══
1. FieldlabelError → fieldLabelError
2. label: color '#333' → c.textPrimary
3. Merge duplicate: textInput + moneyTextInput
4. Remove: warningTextOrange/Red → warningText
5. Delete unused: inputContainer vs inputMoneyRow
6. Add Platform.select for shadows

═══ RULES ═══
- Each module < 20 lines per function
- No magic numbers (use SPACE/TYPE/RADIUS)
- Type: ColorScheme for all modules
- One source of truth per style
```

| Key | Value |
| --- | --- |
| Quinn (CTO) | Metadata-validator, controleert hashes en integriteit |
| Iris | Analyseert huidige code (AS-IS) |
| Max | Ontwerpt nieuwe architectuur (TO-BE) |
| Dex | Valt het ontwerp aan, zoekt fouten |
| Ava | Audit, geeft finale goedkeuring |
| Nova/Kai | Vertaalt naar uitvoerbare stappen |
| Dev/Sam/Leo | Voert uit, terminal-operaties, debugging |

| Key | Value |
| --- | --- |
| Binaire beslissingen | GO/STOP/FREEZE (è¡Œ/æ–­/å‡) |
| Gates | Elke fase heeft checkpoints |
| #MANASSE | Strikte domeinblokkade (voorkomt "scope creep") |
| ADR Canon | 18 architectuurwetten die leidend zijn |
| Metadata | only governance: Controle op hashes, geen inhoudelijke beoordeling |

| - Splits het op: 1 doc voor protocol-flow | 1 voor vlaggen-referentie | 1 voor rol-definities |
| --- | --- | --- |
| - Gebruik consistente taal - kies NL | EN of hybrid | maar niet willekeurig wisselen |

- Definieer de 18 ADR-regels expliciet ergens (je verwijst ernaar maar ze staan er niet)
- Voeg voorbeelden toe van input/output per fase
- Maak een visueel flowchart - dit schreeuwt om een diagram
- Specificeer hash-algoritmes en formaten concreet

- Voeg error-handling toe voor edge cases
- Definieer timeouts en retry-logic
- Specificeer wat er gebeurt bij concurrent modifications
- Maak rollback-scenario's expliciet

- Alfabetische index van alle vlaggen met definitie
- Vermijd overlap tussen # en @ - nu is het onduidelijk wanneer wat
- Versie de vlaggen zelf (#SVZ1_v2?)

| Key | Value |
| --- | --- |
| Leg uit waarom "huishoudens > 5 volwassenen" zo kritiek is | context ontbreekt volledig |
| Dit voelt als een inside | joke die de hele flow kan blokkeren |

| Key | Value |
| --- | --- |
| Leuk, maar onnodig complex | ASCII-alternatieven zijn beter voor tooling |
| Of leg een mapping | tabel aan: æ³• = LAW, å®¡ = CHECK, etc. |

- Rollback-strategie
- Monitoring/logging specificatie
- Performance-criteria per gate
- Wat gebeurt er bij Quinn's afwezigheid?

| Key | Value |
| --- | --- |
| Maak expliciet dat Quinn een validator | functie is, geen persona |
| Documenteer Quinn's trigger | condities (wanneer wordt de functie aangeroepen?) |
| Specificeer Quinn's return | types en exit-codes helder |

- Quinn = functie (altijd beschikbaar)
- Iris/Max/Dex/Ava = zijn dit ook functies of AI-prompts?
- Maak het onderscheid duidelijk in de naamgeving of documentatie

- Voeg toe:  signature met parameters
- Definieer wat Quinn doet bij edge cases (corrupt hash, missing metadata)
- Maak duidelijk of Quinn stateless is of state bijhoudt

- Gate A t/m G zouden Quinn-aanroepen kunnen zijn
- Overweeg: , , etc.
- Of is Quinn alleen Gate A en zijn de rest andere validators?

- Draait Quinn synchroon of asynchroon?
- Wat is Quinn's tijd-complexiteit bij grote codebases?
- Kan Quinn parallel draaien voor meerdere files?
- Heeft Quinn dependencies of is het pure function?

- Overweeg  ipv @Q_CORE voor consistentie
- Of gewoon  als het een standaard functie is

- Je vroeg "hoe verbeteren" → ik gaf standaard software-engineering feedback
- Maar jouw systeem lijkt bewust anti-uitbreiding (#MANASSE = geen scope creep)
- Mijn tips voegden context/voorbeelden/edge cases toe = precies wat jij NIET wilt

- Help het compacter te maken (minder herhaling, strakkere syntax)?
- Inconsistenties eruit haal (zonder nieuwe dingen toe te voegen)?
- Of gewoon check of de binaire logica klopt (geen gaten in de flow)?

| Key | Value |
| --- | --- |
| Verwijder Q1/Q2/Q3 duplicaten | dit is 60% van je doc |
| Eén rol | definitie per naam - nu staat Iris 3x, Max 4x beschreven |
| Gecombineerde secties scheiden | "combi:" mengt alles door elkaar |

- → kan korter:
- Of gewoon:

- De "Meta-App workflow" staat 5x uitgeschreven
- Maak één canonical flow bovenaan
- Rest = alleen afwijkingen/toevoegingen

| Key | Value |
| --- | --- |
| Je hebt 3 "Centrale Vlaggen | Lijst" secties - merge naar één tabel |
| Groepeer | HASH-vlaggen, STATUS-vlaggen, ACTION-vlaggen |

| Key | Value |
| --- | --- |
| @MODE_DEX output is maar soms ook @LOGIC_GAP | kies één |
| #SVZ2 vs #TO_BE | zijn dit aliases of verschillende dingen? |
| Gate C checkt maar Max moet juist fixen als die >0 is | klopt de conditional? |

- De 18 ADR-regels zijn nergens gedefinieerd (alleen genoemd)
- #CHECKLIST_2025 wordt verwacht maar staat er niet
- Wat is #STRICT_TS precies?

- De 18 ADR-regels zelf
- #CHECKLIST_2025 inhoud
- HHS5 "volwassenen > 5" context

- Je hebt  als semantic token, maar andere zijn hardcoded
- Maak tokens voor: labelText, , , cardShadow
- Nu staat #333 hardcoded in label → zou  moeten zijn

- (hoofdletter L) vs fieldLabel
- vs  (één heeft "Style", ander niet)
- cardSwipe vs card → wat is het verschil?

| - , | vs → overlap? |
| --- | --- |
| - t | extInput vs → consolideer |
| - + | → één met variant |

- Fix  →
- Fix  typo
- Voeg  object toe
- Verwijder duplicate input styles

- Geen nieuwe abstracties toevoegen (ADR-16)
- Geen classes (ADR blijft functions)
- Geen voorbarige optimalisatie van cache

### help.txt

## Kern van het systeem

## Verbeter-tips

## Aangepaste tips

## Compactheid-tips

### Colors.ts

### useAppStyles.ts

## Refactor-strategie voor Colors.ts + useAppStyles.ts

### voorstel.txt

415 linestxtWat is dit?25 dec 2025Dit is een technisch protocol-document voor een geautomatiseerd softwareontwikkelings- en governance-systeem, genaamd "Phoenix Engine" of "Phoenix Protocol v3.7".

Het beschrijft een binaire flow met verschillende AI-rollen die samen code analyseren, ontwerpen, testen en implementeren volgens strikte regels:
Hoofdrollen:

Sleutelprincipes:

Het gebruikt een mix van Nederlands, Engels en Chinese karakters (æ³•/å®¡/è¡Œ/æ–­) voor compacte notatie, en heeft een uitgebreid vlaggen-systeem (#variabelen, @acties) voor "late binding" - variabelen die later ingevuld worden.
Doel: Gecontroleerde, auditeerbare code-migraties met strikte checks op elke stap.Hoe kan ik dit verbeteren. alleen tips25 dec 2025
Structuur & Leesbaarheid:

Technische Helderheid:

Praktische Uitvoerbaarheid:

Vlaggen-systeem:

Het #MANASSE mysterie:

Sino-karakters:

Ontbrekend:
quinn is een functie. nooit afwezig25 dec 2025
Architectuur:

Functie vs Rol verwarring:

Quinn-specifiek:

Gates herformuleren:

Technische vragen die nu opkomen:

Naamgeving:
Ben jij een model dat zoekt naar uitbreid mogelijkheden25 dec 2025Nee, niet per se.
Ik probeer te begrijpen wat je hebt en verbeterpunten te geven die je vroeg.
Maar ik zie nu dat mijn tips misschien té uitgebreid waren - terwijl jouw protocol juist binair en gestripped wil zijn.
Eerlijker antwoord:

Betere vraag voor mij:
Wil je dat ik:

Ik kan ook gewoon valideren ipv uitbreiden - zeg maar wat nuttiger is.ik probeer het zo compact mogelijk te maken en kloppen25 dec 2025
Grootste winst:

Syntax straffen:

Flow-duplicatie:

Vlaggen consolideren:

Logica-check issues:

Wat ontbreekt voor "kloppen":

Radicale compressie mogelijk:

Wil je dat ik een gestripped versie maak met alleen de essentie?ja25 dec 2025
Weggelaten (want niet gedefinieerd):

| UI | state management | domeinlogica en infrastructuur hebben gescheiden verantwoordelijkheden. |
| --- | --- | --- |
| * Infra = persistence | netwerk | platform |
| - ✅ **Boolean prefixen**: `isLoading` | `hasAccess` | `shouldRender` |
| - ✅ **Geen ruis**: vermijd `dataObject` | `userInfo` | `tempVariable` |

Prioriteit 2: Inconsistente naamgeving

Prioriteit 3: Duplicatie reduceren
typescript
Prioriteit 4: Magic numbers elimineren
typescript
Prioriteit 5: Type-safety verbeteren
typescript
Prioriteit 6: Dead code opruimen

Prioriteit 7: Scheiding
typescript
Prioriteit 8: Platform-specifieke stijlen
typescript
Snelste impact:

Wat NIET doen:
71 linestxthelp mij dit zo kort mogelijk te schrijven25 dec 2025
~400 regels → ~80 regels instructieClaude is AI and can make mistakes. Please double-check responses.You are out of free messages until 4:00 PMUpgrade Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

### help.txt

415 linestxtWat is dit?25 dec 2025

---

**Claude:**

### help.txt

415 linestxt

---

**Claude:**

### help.txt

415 lines

---

**Claude:**

txt

---

**Claude:**

Wat is dit?25 dec 2025

---

**Claude:**

25 dec 2025

---

**Claude:**

| Key | Value |
| --- | --- |
| Quinn (CTO) | Metadata-validator, controleert hashes en integriteit |
| Iris | Analyseert huidige code (AS-IS) |
| Max | Ontwerpt nieuwe architectuur (TO-BE) |
| Dex | Valt het ontwerp aan, zoekt fouten |
| Ava | Audit, geeft finale goedkeuring |
| Nova/Kai | Vertaalt naar uitvoerbare stappen |
| Dev/Sam/Leo | Voert uit, terminal-operaties, debugging |

| Key | Value |
| --- | --- |
| Binaire beslissingen | GO/STOP/FREEZE (è¡Œ/æ–­/å‡) |
| Gates | Elke fase heeft checkpoints |
| #MANASSE | Strikte domeinblokkade (voorkomt "scope creep") |
| ADR Canon | 18 architectuurwetten die leidend zijn |
| Metadata | only governance: Controle op hashes, geen inhoudelijke beoordeling |

## Kern van het systeem

Dit is een technisch protocol-document voor een geautomatiseerd softwareontwikkelings- en governance-systeem, genaamd "Phoenix Engine" of "Phoenix Protocol v3.7".

Het beschrijft een binaire flow met verschillende AI-rollen die samen code analyseren, ontwerpen, testen en implementeren volgens strikte regels:
Hoofdrollen:

Sleutelprincipes:

| Key | Value |
| --- | --- |
| Het gebruikt een mix van Nederlands, Engels en Chinese karakters (æ³•/å®¡/è¡Œ/æ | ­) voor compacte notatie, en heeft een uitgebreid vlaggen-systeem (#variabelen, @acties) voor "late binding" - variabelen die later ingevuld worden. |
| Doel | Gecontroleerde, auditeerbare code-migraties met strikte checks op elke stap. |

---

**Claude:**

Hoe kan ik dit verbeteren. alleen tips25 dec 2025

---

**Claude:**

Hoe kan ik dit verbeteren. alleen tips

---

**Claude:**

| - Splits het op: 1 doc voor protocol-flow | 1 voor vlaggen-referentie | 1 voor rol-definities |
| --- | --- | --- |
| - Gebruik consistente taal - kies NL | EN of hybrid | maar niet willekeurig wisselen |

- Definieer de 18 ADR-regels expliciet ergens (je verwijst ernaar maar ze staan er niet)
- Voeg voorbeelden toe van input/output per fase
- Maak een visueel flowchart - dit schreeuwt om een diagram
- Specificeer hash-algoritmes en formaten concreet

- Voeg error-handling toe voor edge cases
- Definieer timeouts en retry-logic
- Specificeer wat er gebeurt bij concurrent modifications
- Maak rollback-scenario's expliciet

- Alfabetische index van alle vlaggen met definitie
- Vermijd overlap tussen # en @ - nu is het onduidelijk wanneer wat
- Versie de vlaggen zelf (#SVZ1_v2?)

| Key | Value |
| --- | --- |
| Leg uit waarom "huishoudens > 5 volwassenen" zo kritiek is | context ontbreekt volledig |
| Dit voelt als een inside | joke die de hele flow kan blokkeren |

| Key | Value |
| --- | --- |
| Leuk, maar onnodig complex | ASCII-alternatieven zijn beter voor tooling |
| Of leg een mapping | tabel aan: æ³• = LAW, å®¡ = CHECK, etc. |

- Rollback-strategie
- Monitoring/logging specificatie
- Performance-criteria per gate
- Wat gebeurt er bij Quinn's afwezigheid?

## Verbeter-tips

Structuur & Leesbaarheid:

Technische Helderheid:

Praktische Uitvoerbaarheid:

Vlaggen-systeem:

Het #MANASSE mysterie:

Sino-karakters:

Ontbrekend:

---

**Claude:**

quinn is een functie. nooit afwezig25 dec 2025

---

**Claude:**

quinn is een functie. nooit afwezig

---

**Claude:**

```
Quinn::validate()
```

```
quinn.check_integrity()
```

```
quinn.validate_canon()
```

```
@QUINN_CHECK
```

```
validate_metadata()
```

| Key | Value |
| --- | --- |
| Maak expliciet dat Quinn een validator | functie is, geen persona |
| Documenteer Quinn's trigger | condities (wanneer wordt de functie aangeroepen?) |
| Specificeer Quinn's return | types en exit-codes helder |

- Quinn = functie (altijd beschikbaar)
- Iris/Max/Dex/Ava = zijn dit ook functies of AI-prompts?
- Maak het onderscheid duidelijk in de naamgeving of documentatie

- Voeg toe:  signature met parameters
- Definieer wat Quinn doet bij edge cases (corrupt hash, missing metadata)
- Maak duidelijk of Quinn stateless is of state bijhoudt

- Gate A t/m G zouden Quinn-aanroepen kunnen zijn
- Overweeg: , , etc.
- Of is Quinn alleen Gate A en zijn de rest andere validators?

- Draait Quinn synchroon of asynchroon?
- Wat is Quinn's tijd-complexiteit bij grote codebases?
- Kan Quinn parallel draaien voor meerdere files?
- Heeft Quinn dependencies of is het pure function?

- Overweeg  ipv @Q_CORE voor consistentie
- Of gewoon  als het een standaard functie is

## Aangepaste tips

Architectuur:

Functie vs Rol verwarring:

Quinn-specifiek:

Gates herformuleren:

Technische vragen die nu opkomen:

Naamgeving:

---

**Claude:**

Ben jij een model dat zoekt naar uitbreid mogelijkheden25 dec 2025

---

**Claude:**

Ben jij een model dat zoekt naar uitbreid mogelijkheden

---

**Claude:**

- Je vroeg "hoe verbeteren" → ik gaf standaard software-engineering feedback
- Maar jouw systeem lijkt bewust anti-uitbreiding (#MANASSE = geen scope creep)
- Mijn tips voegden context/voorbeelden/edge cases toe = precies wat jij NIET wilt

- Help het compacter te maken (minder herhaling, strakkere syntax)?
- Inconsistenties eruit haal (zonder nieuwe dingen toe te voegen)?
- Of gewoon check of de binaire logica klopt (geen gaten in de flow)?

Nee, niet per se.
Ik probeer te begrijpen wat je hebt en verbeterpunten te geven die je vroeg.
Maar ik zie nu dat mijn tips misschien té uitgebreid waren - terwijl jouw protocol juist binair en gestripped wil zijn.
Eerlijker antwoord:

Betere vraag voor mij:
Wil je dat ik:

Ik kan ook gewoon valideren ipv uitbreiden - zeg maar wat nuttiger is.

---

**Claude:**

ik probeer het zo compact mogelijk te maken en kloppen25 dec 2025

---

**Claude:**

ik probeer het zo compact mogelijk te maken en kloppen

---

**Claude:**

```
æ³•(Rules): å¿…: ç¦: é™:
```

```
RULES{MUST: FORBID: LIMIT:}
```

```
+ADR_CANON -CONT_READ =MANASSE
```

```
@INDICTMENT
```

```
@INDICTMENT == 0
```

```yaml
FLOW: IRIS→MAX→DEX→[loop if @IDT>0]→AVA→NOVA→KAI→DEV/SAM
GATES: A(hash) B(canon) C(idt) D(score≥8) E(atomic) F(test)
STOP: #MANASSE | @CLI_ERR→LEO | score<8
```

```yaml
FLOW: IRIS→MAX→DEX→[loop if @IDT>0]→AVA→NOVA→KAI→DEV/SAM
GATES: A(hash) B(canon) C(idt) D(score≥8) E(atomic) F(test)
STOP: #MANASSE | @CLI_ERR→LEO | score<8
```

| Key | Value |
| --- | --- |
| Verwijder Q1/Q2/Q3 duplicaten | dit is 60% van je doc |
| Eén rol | definitie per naam - nu staat Iris 3x, Max 4x beschreven |
| Gecombineerde secties scheiden | "combi:" mengt alles door elkaar |

- → kan korter:
- Of gewoon:

- De "Meta-App workflow" staat 5x uitgeschreven
- Maak één canonical flow bovenaan
- Rest = alleen afwijkingen/toevoegingen

| Key | Value |
| --- | --- |
| Je hebt 3 "Centrale Vlaggen | Lijst" secties - merge naar één tabel |
| Groepeer | HASH-vlaggen, STATUS-vlaggen, ACTION-vlaggen |

| Key | Value |
| --- | --- |
| @MODE_DEX output is maar soms ook @LOGIC_GAP | kies één |
| #SVZ2 vs #TO_BE | zijn dit aliases of verschillende dingen? |
| Gate C checkt maar Max moet juist fixen als die >0 is | klopt de conditional? |

- De 18 ADR-regels zijn nergens gedefinieerd (alleen genoemd)
- #CHECKLIST_2025 wordt verwacht maar staat er niet
- Wat is #STRICT_TS precies?

## Compactheid-tips

Grootste winst:

Syntax straffen:

Flow-duplicatie:

Vlaggen consolideren:

Logica-check issues:

Wat ontbreekt voor "kloppen":

Radicale compressie mogelijk:

Wil je dat ik een gestripped versie maak met alleen de essentie?

---

**Claude:**

```yaml
FLOW: IRIS→MAX→DEX→[loop if @IDT>0]→AVA→NOVA→KAI→DEV/SAM
GATES: A(hash) B(canon) C(idt) D(score≥8) E(atomic) F(test)
STOP: #MANASSE | @CLI_ERR→LEO | score<8
```

```yaml
FLOW: IRIS→MAX→DEX→[loop if @IDT>0]→AVA→NOVA→KAI→DEV/SAM
GATES: A(hash) B(canon) C(idt) D(score≥8) E(atomic) F(test)
STOP: #MANASSE | @CLI_ERR→LEO | score<8
```

---

**Claude:**

ja25 dec 2025

---

**Claude:**

ja

---

**Claude:**

```
PHOENIX_PROTOCOL_v3.7

═══ CORE ═══
STATE: #SYNC_REALITY (1 truth source)
LOGIC: GO | STOP | FREEZE
CHECK: METADATA_ONLY (hashes, flags)
RULE: MAKER ≠ CHECKER

| QUINN : validate(#H_REF | #H_ACT) → GO\|STOP |
| --- | --- |
| KAI : contract(#MIGRATION_SPEC | #FILE) → @CU_CONTRACT |

═══ FLOW ═══
G_A: #H_REF == #H_ACT ? GO : STOP
S_1: IRIS → #AS_IS
G_B: #AS_IS ∈ #ADR_CANON ? GO : STOP
S_2: MAX → #TO_BE
G_C: DEX → @INDICTMENT == 0 ? GO : LOOP_MAX
G_D: AVA → @SCORE ≥ 8 ? GO : STOP
S_3: TRANSFORM → NOVA → KAI → @CU_CONTRACT
G_E: #FILE_COUNT == 1 ? GO : STOP
S_4: DEV → SAM → @CLI_RESULT
G_F: @CLI_EXIT == 0 ? GO : LEO

═══ FLAGS ═══
# DATA
#H_REF          : reference hash
#H_ACT          : current hash
#AS_IS          : current state (IRIS)
#TO_BE          : target state (MAX)
#ADR_CANON      : 18 architecture rules
#MIGRATION_SPEC : transition plan (NOVA)
#CU_CONTRACT    : atomic work order (KAI)
#FILE_COUNT     : must = 1

@ ACTIONS
@INDICTMENT     : defects (DEX)
@SCORE          : compliance 0-10 (AVA)
@APPROVED       : validated advice
@CODE_DELTA     : code change (DEV)
@NAV_ROADMAP    : terminal steps (SAM)
@CLI_ERROR      : execution error
@FIX_SPEC       : repair plan (LEO)

! CONTROLS
#MANASSE        : domain lock (no drift)
#ATOMIC_SCOPE   : 1 file per run
#STRICT_TS      : TypeScript strict + max 20 lines/fn

═══ EXITS ═══
0  : GO
1  : STOP
99 : FREEZE (#MANASSE violation)

═══ INCIDENTS ═══
IF @CLI_ERROR → LEO → @FIX_SPEC → RE-ENTRY_S3
IF #MANASSE → FREEZE → ESCALATE_QUINN
```

```
PHOENIX_PROTOCOL_v3.7

═══ CORE ═══
STATE: #SYNC_REALITY (1 truth source)
LOGIC: GO | STOP | FREEZE
CHECK: METADATA_ONLY (hashes, flags)
RULE: MAKER ≠ CHECKER

| QUINN : validate(#H_REF | #H_ACT) → GO\|STOP |
| --- | --- |
| KAI : contract(#MIGRATION_SPEC | #FILE) → @CU_CONTRACT |

═══ FLOW ═══
G_A: #H_REF == #H_ACT ? GO : STOP
S_1: IRIS → #AS_IS
G_B: #AS_IS ∈ #ADR_CANON ? GO : STOP
S_2: MAX → #TO_BE
G_C: DEX → @INDICTMENT == 0 ? GO : LOOP_MAX
G_D: AVA → @SCORE ≥ 8 ? GO : STOP
S_3: TRANSFORM → NOVA → KAI → @CU_CONTRACT
G_E: #FILE_COUNT == 1 ? GO : STOP
S_4: DEV → SAM → @CLI_RESULT
G_F: @CLI_EXIT == 0 ? GO : LEO

═══ FLAGS ═══
# DATA
#H_REF          : reference hash
#H_ACT          : current hash
#AS_IS          : current state (IRIS)
#TO_BE          : target state (MAX)
#ADR_CANON      : 18 architecture rules
#MIGRATION_SPEC : transition plan (NOVA)
#CU_CONTRACT    : atomic work order (KAI)
#FILE_COUNT     : must = 1

@ ACTIONS
@INDICTMENT     : defects (DEX)
@SCORE          : compliance 0-10 (AVA)
@APPROVED       : validated advice
@CODE_DELTA     : code change (DEV)
@NAV_ROADMAP    : terminal steps (SAM)
@CLI_ERROR      : execution error
@FIX_SPEC       : repair plan (LEO)

! CONTROLS
#MANASSE        : domain lock (no drift)
#ATOMIC_SCOPE   : 1 file per run
#STRICT_TS      : TypeScript strict + max 20 lines/fn

═══ EXITS ═══
0  : GO
1  : STOP
99 : FREEZE (#MANASSE violation)

═══ INCIDENTS ═══
IF @CLI_ERROR → LEO → @FIX_SPEC → RE-ENTRY_S3
IF #MANASSE → FREEZE → ESCALATE_QUINN
```

- De 18 ADR-regels zelf
- #CHECKLIST_2025 inhoud
- HHS5 "volwassenen > 5" context

Weggelaten (want niet gedefinieerd):

Is dit wat je bedoelde?

---

**Claude:**

| UI | state management | domeinlogica en infrastructuur hebben gescheiden verantwoordelijkheden. |
| --- | --- | --- |
| * Infra = persistence | netwerk | platform |

---

**Claude:**

pasted

---

**Claude:**

maak deze net zo kort25 dec 2025

---

**Claude:**

maak deze net zo kort

---

**Claude:**

```
ADR_CANON_v1.0

01 SEPARATION
   UI | State | Domain | Infra
   Business logic ∉ UI

02 TYPE_SAFETY
   Validate at boundaries
   Schema versioned
   Runtime check (Zod)
   FormState = domain object

03 KERNEL
   Calculations → kernel modules
   Pure functions
   No framework deps
   UI calls, not contains

04 DUMB_UI
   Components = projectors
   No parsing, no rules
   Logic → hooks|services|kernel

05 MONEY
   Internal = cents (minor unit)
   No floats in domain
   Central parsing
   Explicit rounding

06 INPUT_HARDENING
   Clean | Validate | Limit
   Central parser
   No parseFloat in UI

07 FLAGS
   Explicit boolean/enum
   No implicit derivation
   Accessor functions only

08 FSM
   Finite state machine
   Explicit transitions
   No magic strings
   Error recovery included

09 PURE_VIEWS
   App.tsx = state → screen
   No business logic
   Knows FSM, not details

10 SCHEMA_VERSIONING
   schemaVersion on persist
   Explicit migrations
   Validate before use

11 TEST_PYRAMID
   Domain = heavy
   UI = light integration
   Golden master scenarios

12 AUDITABILITY
   Decisions traceable
   WAI-level changelog
   Scripts allowed
   Scripts ≠ architecture

13 FINANCE_KERNEL
   Income/expense in cents
   Pure deterministic
   UI/persist = adapters

14 DUMB_REDUCERS
   (state, action) → state
   No: API|calc|parse|log

15 PROCESS_ROLES
   Navigator/Debugger = support
   May: explain|guide|analyze
   Not: decide|introduce patterns

16 SIMPLICITY
   Fewest concepts wins
   Avoid abstraction bloat

17 ACCEPTED_RISK
   Document explicitly
   Silent ignore = forbidden

18 HUMAN_DECIDES
   AI = analysis + options
   Human = final call
   Document decisions
```

```
ADR_CANON_v1.0

01 SEPARATION
   UI | State | Domain | Infra
   Business logic ∉ UI

02 TYPE_SAFETY
   Validate at boundaries
   Schema versioned
   Runtime check (Zod)
   FormState = domain object

03 KERNEL
   Calculations → kernel modules
   Pure functions
   No framework deps
   UI calls, not contains

04 DUMB_UI
   Components = projectors
   No parsing, no rules
   Logic → hooks|services|kernel

05 MONEY
   Internal = cents (minor unit)
   No floats in domain
   Central parsing
   Explicit rounding

06 INPUT_HARDENING
   Clean | Validate | Limit
   Central parser
   No parseFloat in UI

07 FLAGS
   Explicit boolean/enum
   No implicit derivation
   Accessor functions only

08 FSM
   Finite state machine
   Explicit transitions
   No magic strings
   Error recovery included

09 PURE_VIEWS
   App.tsx = state → screen
   No business logic
   Knows FSM, not details

10 SCHEMA_VERSIONING
   schemaVersion on persist
   Explicit migrations
   Validate before use

11 TEST_PYRAMID
   Domain = heavy
   UI = light integration
   Golden master scenarios

12 AUDITABILITY
   Decisions traceable
   WAI-level changelog
   Scripts allowed
   Scripts ≠ architecture

13 FINANCE_KERNEL
   Income/expense in cents
   Pure deterministic
   UI/persist = adapters

14 DUMB_REDUCERS
   (state, action) → state
   No: API|calc|parse|log

15 PROCESS_ROLES
   Navigator/Debugger = support
   May: explain|guide|analyze
   Not: decide|introduce patterns

16 SIMPLICITY
   Fewest concepts wins
   Avoid abstraction bloat

17 ACCEPTED_RISK
   Document explicitly
   Silent ignore = forbidden

18 HUMAN_DECIDES
   AI = analysis + options
   Human = final call
   Document decisions
```

380 regels → 80 regels

---

**Claude:**

| - ✅ **Boolean prefixen**: `isLoading` | `hasAccess` | `shouldRender` |
| --- | --- | --- |
| - ✅ **Geen ruis**: vermijd `dataObject` | `userInfo` | `tempVariable` |

---

**Claude:**

maak deze net zo kort:25 dec 2025

---

**Claude:**

maak deze net zo kort:

---

**Claude:**

```html
CHECKLIST_2025_v1.0

═══ NAMING ═══
- Meaningful: daysUntilDeadline not d
- Boolean: is/has/should prefix
- No noise: no dataObject, tempVar
- Domain types: type UserId = string

═══ FUNCTIONS ═══
- Single responsibility
- Max 20 lines
- Max 2 args (else object)
- Guard clauses (return early)
- Pure where possible

═══ REACT ═══
Components:
- Max 100-150 lines JSX
- Destructure props
- <> not div
- children over inheritance
- Logic → Custom Hooks

Hooks:
- Explicit types: useState<User | null>
- useCallback/useMemo: only if proven bottleneck
- No React.FC

═══ TYPESCRIPT ═══
- NEVER any (use unknown)
- Interface for props
- Discriminated Unions for state
- Enums/Unions for constants
- readonly for immutable
- Utility types: Omit/Pick/ReturnType

Advanced:
- Generics with constraints
- Parse don't validate (Zod at boundaries)
- Result types: {success, data?, error?}
- strict: true in tsconfig

═══ ARCHITECTURE ═══
Structure:
- Max 3-4 levels deep
- Feature-based folders: /features/auth/*
- Domain layer separate from UI
- Functions over classes

Patterns:
- DRY: 1x write, 2x duplicate, 3x refactor
- Strangler Fig for legacy
- Façade to wrap old code
- Repository for data access

═══ TESTING ═══
- Test behavior not implementation
- Testing Library: getByRole/Text
- Integration > Unit
- Red-Green-Refactor
- Write test before refactor

Quality:
- ESLint strict (warn on any)
- Prettier autoformat
- Husky pre-commit
- TS strict: noImplicitAny, strictNullChecks

═══ REFACTORING ═══
- Boy Scout Rule: leave cleaner
- Mikado Method: goal→try→revert→solve→retry
- Prioritize: high-change, bug-prone, onboarding
- Small steps, stay deployable

═══ 2025 TOOLING ═══
- Path aliases: @components/*
- Vitest > Jest
- Biome (linter+formatter)
- Structured logging (not console.log)
- Error boundaries
- Performance monitoring (Lighthouse)

═══ AI DEVELOPMENT ═══
- AI = boilerplate, Human = architecture
- Understand AI output
- Validate logic + edge cases
- No "vibe coding"

═══ COGNITIVE LOAD ═══
- Self-explanatory code
- Comment "why" not "what"
- const MAX_RETRIES = 3 (no magic numbers)
- Max 2-3 nesting levels
- Simple ternary (complex → if)

═══ REACT NATIVE ═══
- TypeScript default (0.71+)
- Type-check: npx tsc --noEmit
- FlatList for long lists (not .map)
- React.memo with care
- Hermes engine enabled

═══ DAILY CHECKS ═══
□ Names self-explanatory?
□ Functions < 20 lines?
□ No any, explicit types?
□ Tests present?
□ Code cleaner than found?
□ Discriminated Unions used?
□ Imports < 3 levels or aliased?
□ Functions pure/predictable?
□ Comments explain "why"?
□ New dev would understand?
```

```html
CHECKLIST_2025_v1.0

═══ NAMING ═══
- Meaningful: daysUntilDeadline not d
- Boolean: is/has/should prefix
- No noise: no dataObject, tempVar
- Domain types: type UserId = string

═══ FUNCTIONS ═══
- Single responsibility
- Max 20 lines
- Max 2 args (else object)
- Guard clauses (return early)
- Pure where possible

═══ REACT ═══
Components:
- Max 100-150 lines JSX
- Destructure props
- <> not div
- children over inheritance
- Logic → Custom Hooks

Hooks:
- Explicit types: useState<User | null>
- useCallback/useMemo: only if proven bottleneck
- No React.FC

═══ TYPESCRIPT ═══
- NEVER any (use unknown)
- Interface for props
- Discriminated Unions for state
- Enums/Unions for constants
- readonly for immutable
- Utility types: Omit/Pick/ReturnType

Advanced:
- Generics with constraints
- Parse don't validate (Zod at boundaries)
- Result types: {success, data?, error?}
- strict: true in tsconfig

═══ ARCHITECTURE ═══
Structure:
- Max 3-4 levels deep
- Feature-based folders: /features/auth/*
- Domain layer separate from UI
- Functions over classes

Patterns:
- DRY: 1x write, 2x duplicate, 3x refactor
- Strangler Fig for legacy
- Façade to wrap old code
- Repository for data access

═══ TESTING ═══
- Test behavior not implementation
- Testing Library: getByRole/Text
- Integration > Unit
- Red-Green-Refactor
- Write test before refactor

Quality:
- ESLint strict (warn on any)
- Prettier autoformat
- Husky pre-commit
- TS strict: noImplicitAny, strictNullChecks

═══ REFACTORING ═══
- Boy Scout Rule: leave cleaner
- Mikado Method: goal→try→revert→solve→retry
- Prioritize: high-change, bug-prone, onboarding
- Small steps, stay deployable

═══ 2025 TOOLING ═══
- Path aliases: @components/*
- Vitest > Jest
- Biome (linter+formatter)
- Structured logging (not console.log)
- Error boundaries
- Performance monitoring (Lighthouse)

═══ AI DEVELOPMENT ═══
- AI = boilerplate, Human = architecture
- Understand AI output
- Validate logic + edge cases
- No "vibe coding"

═══ COGNITIVE LOAD ═══
- Self-explanatory code
- Comment "why" not "what"
- const MAX_RETRIES = 3 (no magic numbers)
- Max 2-3 nesting levels
- Simple ternary (complex → if)

═══ REACT NATIVE ═══
- TypeScript default (0.71+)
- Type-check: npx tsc --noEmit
- FlatList for long lists (not .map)
- React.memo with care
- Hermes engine enabled

═══ DAILY CHECKS ═══
□ Names self-explanatory?
□ Functions < 20 lines?
□ No any, explicit types?
□ Tests present?
□ Code cleaner than found?
□ Discriminated Unions used?
□ Imports < 3 levels or aliased?
□ Functions pure/predictable?
□ Comments explain "why"?
□ New dev would understand?
```

500+ regels → 120 regels

---

**Claude:**

### Colors.ts

### useAppStyles.ts

89 linests381 linestsHoe kan ik de twee bestanden het beste een refactor geven25 dec 2025

---

**Claude:**

### Colors.ts

### useAppStyles.ts

89 linests381 linests

---

**Claude:**

### Colors.ts

89 linests

---

**Claude:**

### Colors.ts

89 lines

---

**Claude:**

ts

---

**Claude:**

### useAppStyles.ts

381 linests

---

**Claude:**

### useAppStyles.ts

381 lines

---

**Claude:**

Hoe kan ik de twee bestanden het beste een refactor geven25 dec 2025

---

**Claude:**

Hoe kan ik de twee bestanden het beste een refactor geven

---

**Claude:**

```
inputBackground
```

```
placeholderText
```

```
errorBorder
```

```
c.textPrimary
```

```
FieldlabelError
```

```
errorTextStyle
```

```
warningTextOrange
```

```
// Nu:
toggleActive: { backgroundColor: c.success }
chipSelected: { backgroundColor: c.selected }

// Beter: gedeelde base
const selectedStyle = { backgroundColor: c.selected };
toggleActive: selectedStyle,
chipSelected: selectedStyle,
```

```ts
// Nu:
toggleActive: { backgroundColor: c.success }
chipSelected: { backgroundColor: c.selected }

// Beter: gedeelde base
const selectedStyle = { backgroundColor: c.selected };
toggleActive: selectedStyle,
chipSelected: selectedStyle,
```

```
// Nu: shadowOpacity: 0.1, padding: 16, borderRadius: 10
// Beter:
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const RADIUS = { sm: 6, md: 10, lg: 12 };
const SHADOW = { light: 0.05, medium: 0.1 };
```

```ts
// Nu: shadowOpacity: 0.1, padding: 16, borderRadius: 10
// Beter:
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const RADIUS = { sm: 6, md: 10, lg: 12 };
const SHADOW = { light: 0.05, medium: 0.1 };
```

```
// Nu: strings overal
// Beter:
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const spacing = (size: Spacing) => SPACING[size];
```

```ts
// Nu: strings overal
// Beter:
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const spacing = (size: Spacing) => SPACING[size];
```

```
inputContainer
```

```
moneyInputWrapper
```

```
inputMoneyRow
```

```
moneyTextInput
```

```
warningTextOrange
```

```
warningTextRed
```

```
warningText
```

```
// Colors.ts → blijft puur kleuren
// Tokens.ts → spacing, radius, shadows
// useAppStyles.ts → combineert beiden
```

```ts
// Colors.ts → blijft puur kleuren
// Tokens.ts → spacing, radius, shadows
// useAppStyles.ts → combineert beiden
```

```sql
// Voor React Native shadow vs elevation:
...Platform.select({
  ios: { shadowColor, shadowOffset, shadowOpacity, shadowRadius },
  android: { elevation: 3 }
})
```

```ts
// Voor React Native shadow vs elevation:
...Platform.select({
  ios: { shadowColor, shadowOffset, shadowOpacity, shadowRadius },
  android: { elevation: 3 }
})
```

```yaml
label: { color: '#333' }
```

```yaml
color: c.textPrimary
```

```
FieldlabelError
```

```
const SPACING
```

- Je hebt  als semantic token, maar andere zijn hardcoded
- Maak tokens voor: labelText, , , cardShadow
- Nu staat #333 hardcoded in label → zou  moeten zijn

- (hoofdletter L) vs fieldLabel
- vs  (één heeft "Style", ander niet)
- cardSwipe vs card → wat is het verschil?

| - , | vs → overlap? |
| --- | --- |
| - t | extInput vs → consolideer |
| - + | → één met variant |

- Fix  →
- Fix  typo
- Voeg  object toe
- Verwijder duplicate input styles

- Geen nieuwe abstracties toevoegen (ADR-16)
- Geen classes (ADR blijft functions)
- Geen voorbarige optimalisatie van cache

## Refactor-strategie voor Colors.ts + useAppStyles.ts

Prioriteit 1: Semantic Tokens ontbreken

Prioriteit 2: Inconsistente naamgeving

Prioriteit 3: Duplicatie reduceren
typescript
Prioriteit 4: Magic numbers elimineren
typescript
Prioriteit 5: Type-safety verbeteren
typescript
Prioriteit 6: Dead code opruimen

Prioriteit 7: Scheiding
typescript
Prioriteit 8: Platform-specifieke stijlen
typescript
Snelste impact:

Wat NIET doen:

---

**Claude:**

```
// Nu:
toggleActive: { backgroundColor: c.success }
chipSelected: { backgroundColor: c.selected }

// Beter: gedeelde base
const selectedStyle = { backgroundColor: c.selected };
toggleActive: selectedStyle,
chipSelected: selectedStyle,
```

```ts
// Nu:
toggleActive: { backgroundColor: c.success }
chipSelected: { backgroundColor: c.selected }

// Beter: gedeelde base
const selectedStyle = { backgroundColor: c.selected };
toggleActive: selectedStyle,
chipSelected: selectedStyle,
```

typescript

---

**Claude:**

typescript

---

**Claude:**

```
// Nu:
toggleActive: { backgroundColor: c.success }
chipSelected: { backgroundColor: c.selected }

// Beter: gedeelde base
const selectedStyle = { backgroundColor: c.selected };
toggleActive: selectedStyle,
chipSelected: selectedStyle,
```

```ts
// Nu:
toggleActive: { backgroundColor: c.success }
chipSelected: { backgroundColor: c.selected }

// Beter: gedeelde base
const selectedStyle = { backgroundColor: c.selected };
toggleActive: selectedStyle,
chipSelected: selectedStyle,
```

---

**Claude:**

```
// Nu: shadowOpacity: 0.1, padding: 16, borderRadius: 10
// Beter:
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const RADIUS = { sm: 6, md: 10, lg: 12 };
const SHADOW = { light: 0.05, medium: 0.1 };
```

```ts
// Nu: shadowOpacity: 0.1, padding: 16, borderRadius: 10
// Beter:
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const RADIUS = { sm: 6, md: 10, lg: 12 };
const SHADOW = { light: 0.05, medium: 0.1 };
```

typescript

---

**Claude:**

```
// Nu: shadowOpacity: 0.1, padding: 16, borderRadius: 10
// Beter:
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const RADIUS = { sm: 6, md: 10, lg: 12 };
const SHADOW = { light: 0.05, medium: 0.1 };
```

```ts
// Nu: shadowOpacity: 0.1, padding: 16, borderRadius: 10
// Beter:
const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 };
const RADIUS = { sm: 6, md: 10, lg: 12 };
const SHADOW = { light: 0.05, medium: 0.1 };
```

---

**Claude:**

```
// Nu: strings overal
// Beter:
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const spacing = (size: Spacing) => SPACING[size];
```

```ts
// Nu: strings overal
// Beter:
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const spacing = (size: Spacing) => SPACING[size];
```

typescript

---

**Claude:**

```
// Nu: strings overal
// Beter:
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const spacing = (size: Spacing) => SPACING[size];
```

```ts
// Nu: strings overal
// Beter:
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const spacing = (size: Spacing) => SPACING[size];
```

---

**Claude:**

```
// Colors.ts → blijft puur kleuren
// Tokens.ts → spacing, radius, shadows
// useAppStyles.ts → combineert beiden
```

```ts
// Colors.ts → blijft puur kleuren
// Tokens.ts → spacing, radius, shadows
// useAppStyles.ts → combineert beiden
```

typescript

---

**Claude:**

```
// Colors.ts → blijft puur kleuren
// Tokens.ts → spacing, radius, shadows
// useAppStyles.ts → combineert beiden
```

```ts
// Colors.ts → blijft puur kleuren
// Tokens.ts → spacing, radius, shadows
// useAppStyles.ts → combineert beiden
```

---

**Claude:**

```sql
// Voor React Native shadow vs elevation:
...Platform.select({
  ios: { shadowColor, shadowOffset, shadowOpacity, shadowRadius },
  android: { elevation: 3 }
})
```

```ts
// Voor React Native shadow vs elevation:
...Platform.select({
  ios: { shadowColor, shadowOffset, shadowOpacity, shadowRadius },
  android: { elevation: 3 }
})
```

typescript

---

**Claude:**

```sql
// Voor React Native shadow vs elevation:
...Platform.select({
  ios: { shadowColor, shadowOffset, shadowOpacity, shadowRadius },
  android: { elevation: 3 }
})
```

```ts
// Voor React Native shadow vs elevation:
...Platform.select({
  ios: { shadowColor, shadowOffset, shadowOpacity, shadowRadius },
  android: { elevation: 3 }
})
```

---

**Claude:**

### voorstel.txt

71 linestxthelp mij dit zo kort mogelijk te schrijven25 dec 2025

---

**Claude:**

### voorstel.txt

71 linestxt

---

**Claude:**

### voorstel.txt

71 lines

---

**Claude:**

help mij dit zo kort mogelijk te schrijven25 dec 2025

---

**Claude:**

help mij dit zo kort mogelijk te schrijven

---

**Claude:**

```js
REFACTOR_PLAN: Colors.ts + useAppStyles.ts

| Layout.ts # container | page | scroll |
| --- | --- | --- |
| Form.ts # input | label | field |
| Dashboard.ts # KPI | cards | summary |

| export const SPACE = { xs:4, sm:8, md:12, lg:16, xl:20, xxl:24 } |  |
| --- | --- |
| export const TYPE = { xs:12, sm:14, md:16, lg:17, xl:18, h2:28 } |  |
| export const RADIUS = { sm:6, md:10, lg:12 } |  |
| export const SHADOW = { light:0.05, med:0.1 } |  |

| import { SPACE, TYPE, RADIUS } from '../Tokens' |  |
| --- | --- |
| import type { ColorScheme } from '../Colors' |  |

export const getFormStyles = (c: ColorScheme) => ({
  fieldContainer: { marginBottom: SPACE.xl },
  fieldLabel: { 
    fontSize: TYPE.lg, 
    fontWeight: '600', 
    color: c.textPrimary, 
    marginBottom: SPACE.sm 
  },
  fieldLabelError: { color: c.error }, // Fixed typo
  input: {
    backgroundColor: c.inputBackground,
    borderRadius: RADIUS.md,
    padding: SPACE.lg,
    fontSize: TYPE.lg,
    color: c.textPrimary,
    borderWidth: 1,
    borderColor: c.border,
  },
  inputError: { borderColor: c.error, borderWidth: 2 },
});

| import { getLayoutStyles } from './modules/Layout' |  |
| --- | --- |
| import { getFormStyles } from './modules/Form' |  |
| import { getDashboardStyles } from './modules/Dashboard' |  |

| ...getLayoutStyles(c) |  |
| --- | --- |
| ...getFormStyles(c) |  |
| ...getDashboardStyles(c) |  |

| styles: getAppStyles(theme) |  |
| --- | --- |
| colors: Colors[theme] |  |

═══ FIXES (prioriteit) ═══
1. FieldlabelError → fieldLabelError
2. label: color '#333' → c.textPrimary
3. Merge duplicate: textInput + moneyTextInput
4. Remove: warningTextOrange/Red → warningText
5. Delete unused: inputContainer vs inputMoneyRow
6. Add Platform.select for shadows

═══ RULES ═══
- Each module < 20 lines per function
- No magic numbers (use SPACE/TYPE/RADIUS)
- Type: ColorScheme for all modules
- One source of truth per style
```

```js
REFACTOR_PLAN: Colors.ts + useAppStyles.ts

| Layout.ts # container | page | scroll |
| --- | --- | --- |
| Form.ts # input | label | field |
| Dashboard.ts # KPI | cards | summary |

| export const SPACE = { xs:4, sm:8, md:12, lg:16, xl:20, xxl:24 } |  |
| --- | --- |
| export const TYPE = { xs:12, sm:14, md:16, lg:17, xl:18, h2:28 } |  |
| export const RADIUS = { sm:6, md:10, lg:12 } |  |
| export const SHADOW = { light:0.05, med:0.1 } |  |

| import { SPACE, TYPE, RADIUS } from '../Tokens' |  |
| --- | --- |
| import type { ColorScheme } from '../Colors' |  |

export const getFormStyles = (c: ColorScheme) => ({
  fieldContainer: { marginBottom: SPACE.xl },
  fieldLabel: { 
    fontSize: TYPE.lg, 
    fontWeight: '600', 
    color: c.textPrimary, 
    marginBottom: SPACE.sm 
  },
  fieldLabelError: { color: c.error }, // Fixed typo
  input: {
    backgroundColor: c.inputBackground,
    borderRadius: RADIUS.md,
    padding: SPACE.lg,
    fontSize: TYPE.lg,
    color: c.textPrimary,
    borderWidth: 1,
    borderColor: c.border,
  },
  inputError: { borderColor: c.error, borderWidth: 2 },
});

| import { getLayoutStyles } from './modules/Layout' |  |
| --- | --- |
| import { getFormStyles } from './modules/Form' |  |
| import { getDashboardStyles } from './modules/Dashboard' |  |

| ...getLayoutStyles(c) |  |
| --- | --- |
| ...getFormStyles(c) |  |
| ...getDashboardStyles(c) |  |

| styles: getAppStyles(theme) |  |
| --- | --- |
| colors: Colors[theme] |  |

═══ FIXES (prioriteit) ═══
1. FieldlabelError → fieldLabelError
2. label: color '#333' → c.textPrimary
3. Merge duplicate: textInput + moneyTextInput
4. Remove: warningTextOrange/Red → warningText
5. Delete unused: inputContainer vs inputMoneyRow
6. Add Platform.select for shadows

═══ RULES ═══
- Each module < 20 lines per function
- No magic numbers (use SPACE/TYPE/RADIUS)
- Type: ColorScheme for all modules
- One source of truth per style
```

~400 regels → ~80 regels instructie

---

**Claude:**

You are out of free messages until 4:00 PMUpgrade Sonnet 4.5Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

You are out of free messages until 4:00 PMUpgrade Sonnet 4.5

---

**Claude:**

You are out of free messages until 4:00 PMUpgrade

---

**Claude:**

You are out of free messages until 4:00 PM

---

**Claude:**

Upgrade

---

**Claude:**

Sonnet 4.5

---

**Claude:**

Claude is AI and can make mistakes. Please double-check responses.

---

**Claude:**

Export (MD)Export (JSON)✅ Lazy-load klaar (0 blokken)

---

**Claude:**

✅ Lazy-load klaar (0 blokken)
